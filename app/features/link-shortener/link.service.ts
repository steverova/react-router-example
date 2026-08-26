import type { AppDb } from '~/db'
import type { LinkRow } from './db'
import {
	getLinksByUser,
	getLinkById,
	getLinkBySlug,
	insertLink,
	updateLinkRow,
	deleteLinkRow,
	incrementClickCounter,
	insertClick,
	getClicksTimeseries,
	getTopCountries,
	getTopReferrers,
	getDeviceBreakdown,
	getRecentClicks,
	getClicksSince,
	getUniqueCountriesCount,
	getAllLinks,
} from './link.repository'
import {
	generateUniqueSlug,
	isValidSlugFormat,
	isSlugAvailable,
} from './lib/slug'
import { fetchOgImage } from './lib/og-preview'
import { parseUserAgent, sha256Hex } from './lib/device'
import {
	extractGeoFromHeaders,
	extractIpFromHeaders,
	extractReferrerFromHeaders,
	isValidCountryCode,
} from './lib/geo'

// ---------- Public API ----------

export type LinkStatus = 'active' | 'expired' | 'exhausted' | 'disabled'

export interface LinkWithStatus extends LinkRow {
	status: LinkStatus
}

export function computeLinkStatus(link: Pick<
	LinkRow,
	'expiresAt' | 'maxClicks' | 'isActive' | 'totalClicks'
>): LinkStatus {
	if (!link.isActive) return 'disabled'
	if (link.expiresAt && link.expiresAt.getTime() <= Date.now()) return 'expired'
	if (link.maxClicks !== null && link.totalClicks >= link.maxClicks)
		return 'exhausted'
	return 'active'
}

export async function listLinksForUser(db: AppDb, userId: number) {
	const rows = await getLinksByUser(db, userId)
	return rows.map(decorateStatus)
}

export async function listAllLinks(db: AppDb) {
	const rows = await getAllLinks(db)
	return rows.map(decorateStatus)
}

function decorateStatus(link: LinkRow): LinkWithStatus {
	return { ...link, status: computeLinkStatus(link) }
}

export async function findLinkForUser(db: AppDb, id: number, userId: number) {
	const link = await getLinkById(db, id)
	if (!link || link.userId !== userId) return null
	return decorateStatus(link)
}

// ---------- Create ----------

export interface CreateLinkPayload {
	originalUrl: string
	customSlug?: string
	title?: string
	description?: string
	expiresAt?: string
	maxClicks?: number | null
	password?: string
	fetchOg?: boolean
}

export type LinkServiceErrorCode =
	| 'SLUG_TAKEN'
	| 'SLUG_INVALID'
	| 'NOT_FOUND'
	| 'FORBIDDEN'

export class LinkServiceError extends Error {
	constructor(
		message: string,
		public code: LinkServiceErrorCode
	) {
		super(message)
		this.name = 'LinkServiceError'
	}
}

/**
 * Best-effort parse of an optional expiration date string.
 * Returns `null` for empty/missing/invalid input — never throws.
 * Optional fields shouldn't block the user from saving.
 */
function parseExpiresAt(input: string | null | undefined): Date | null {
	if (!input) return null
	const trimmed = input.trim()
	if (!trimmed) return null
	const date = new Date(trimmed)
	return Number.isNaN(date.getTime()) ? null : date
}

export async function registerLink(
	db: AppDb,
	userId: number,
	payload: CreateLinkPayload
) {
	const {
		originalUrl,
		customSlug,
		title,
		description,
		expiresAt,
		maxClicks,
		password,
		fetchOg = true,
	} = payload

	let slug: string
	if (customSlug && customSlug.trim().length > 0) {
		if (!isValidSlugFormat(customSlug)) {
			throw new LinkServiceError('Invalid slug format', 'SLUG_INVALID')
		}
		if (!(await isSlugAvailable(db, customSlug))) {
			throw new LinkServiceError('Slug is already taken', 'SLUG_TAKEN')
		}
		slug = customSlug
	} else {
		slug = await generateUniqueSlug(db)
	}

	const ogImage = fetchOg ? await fetchOgImage(originalUrl) : null
	const passwordHash =
		password && password.length > 0 ? await sha256Hex(password) : null

	const expiresAtDate = parseExpiresAt(expiresAt)

	const created = await insertLink(db, {
		slug,
		originalUrl,
		userId,
		title: title?.trim() || null,
		description: description?.trim() || null,
		ogImage,
		passwordHash,
		expiresAt: expiresAtDate,
		maxClicks: maxClicks ?? null,
		isActive: true,
	})

	return created
}

// ---------- Edit ----------

export interface UpdateLinkPayload {
	title?: string
	description?: string
	expiresAt?: string | null
	maxClicks?: number | null
	password?: string | null
	isActive?: boolean
}

export async function updateLink(
	db: AppDb,
	id: number,
	userId: number,
	payload: UpdateLinkPayload
) {
	const existing = await getLinkById(db, id)
	if (!existing) throw new LinkServiceError('Link not found', 'NOT_FOUND')
	if (existing.userId !== userId)
		throw new LinkServiceError('Not owner', 'FORBIDDEN')

	const data: Partial<LinkRow> = {}

	if (payload.title !== undefined) data.title = payload.title?.trim() || null
	if (payload.description !== undefined)
		data.description = payload.description?.trim() || null
	if (payload.isActive !== undefined) data.isActive = payload.isActive

	if (payload.expiresAt !== undefined) {
		if (payload.expiresAt === null || payload.expiresAt === '') {
			data.expiresAt = null
		} else {
			data.expiresAt = parseExpiresAt(payload.expiresAt)
		}
	}

	if (payload.maxClicks !== undefined) {
		data.maxClicks = payload.maxClicks === null ? null : payload.maxClicks
	}

	if (payload.password !== undefined) {
		if (payload.password === null || payload.password === '') {
			data.passwordHash = null
		} else {
			data.passwordHash = await sha256Hex(payload.password)
		}
	}

	const updated = await updateLinkRow(db, id, userId, data)
	if (!updated) throw new LinkServiceError('Link not found', 'NOT_FOUND')
	return decorateStatus(updated)
}

export async function removeLink(db: AppDb, id: number, userId: number) {
	const deleted = await deleteLinkRow(db, id, userId)
	if (!deleted) throw new LinkServiceError('Link not found', 'NOT_FOUND')
	return deleted
}

// ---------- Redirect ----------

export interface ResolveResult {
	link: LinkRow
	status: LinkStatus
}

export async function resolveLinkForRedirect(
	db: AppDb,
	slug: string
): Promise<ResolveResult | null> {
	const link = await getLinkBySlug(db, slug)
	if (!link) return null
	return { link, status: computeLinkStatus(link) }
}

export async function validateLinkPassword(
	db: AppDb,
	slug: string,
	password: string
): Promise<boolean> {
	const link = await getLinkBySlug(db, slug)
	if (!link || !link.passwordHash) return false
	const hash = await sha256Hex(password)
	return hash === link.passwordHash
}

export async function recordClick(db: AppDb, linkId: number, request: Request) {
	const ua = parseUserAgent(request.headers.get('user-agent'))
	const geo = extractGeoFromHeaders(request)
	const referrer = extractReferrerFromHeaders(request)
	const ip = extractIpFromHeaders(request)
	const ipHash = ip ? await sha256Hex(ip) : null

	const country =
		geo.country && isValidCountryCode(geo.country) ? geo.country : null

	await insertClick(db, {
		linkId,
		referrer,
		userAgent: request.headers.get('user-agent'),
		country,
		city: geo.city,
		deviceType: ua.type,
		deviceOs: ua.os,
		browser: ua.browser,
		ipHash,
	})

	await incrementClickCounter(db, linkId)
}

// ---------- Analytics aggregator ----------

export interface AnalyticsData {
	summary: {
		totalClicks: number
		clicksToday: number
		clicksThisWeek: number
		uniqueCountries: number
		status: LinkStatus
		range: '7d' | '30d' | '90d'
	}
	timeseries: Awaited<ReturnType<typeof getClicksTimeseries>>
	topCountries: Awaited<ReturnType<typeof getTopCountries>>
	topReferrers: Awaited<ReturnType<typeof getTopReferrers>>
	deviceBreakdown: Awaited<ReturnType<typeof getDeviceBreakdown>>
	recentClicks: Awaited<ReturnType<typeof getRecentClicks>>
}

export async function getAnalytics(
	db: AppDb,
	linkId: number,
	range: '7d' | '30d' | '90d' = '30d'
): Promise<AnalyticsData> {
	const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
	const since = new Date(Date.now() - days * 86_400_000)
	const oneDayAgo = new Date(Date.now() - 86_400_000)
	const oneWeekAgo = new Date(Date.now() - 7 * 86_400_000)

	const link = await getLinkById(db, linkId)
	const status = link ? computeLinkStatus(link) : 'disabled'

	const [
		timeseries,
		topCountries,
		topReferrers,
		deviceBreakdown,
		recentClicks,
		clicksToday,
		clicksThisWeek,
		uniqueCountries,
	] = await Promise.all([
		getClicksTimeseries(db, linkId, since),
		getTopCountries(db, linkId, since),
		getTopReferrers(db, linkId, since),
		getDeviceBreakdown(db, linkId, since),
		getRecentClicks(db, linkId, 20),
		getClicksSince(db, linkId, oneDayAgo),
		getClicksSince(db, linkId, oneWeekAgo),
		getUniqueCountriesCount(db, linkId),
	])

	return {
		summary: {
			totalClicks: link?.totalClicks ?? 0,
			clicksToday,
			clicksThisWeek,
			uniqueCountries,
			status,
			range,
		},
		timeseries,
		topCountries,
		topReferrers,
		deviceBreakdown,
		recentClicks,
	}
}
