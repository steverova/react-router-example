import { and, desc, eq, gte, sql, count, sum } from 'drizzle-orm'
import type { AppDb } from '~/db'
import { links, linkClicks, type LinkInsert } from './db'

// ---------- Links ----------

export async function getAllLinks(db: AppDb) {
	return db.select().from(links).orderBy(desc(links.createdAt))
}

export async function getLinksByUser(db: AppDb, userId: number) {
	return db
		.select()
		.from(links)
		.where(eq(links.userId, userId))
		.orderBy(desc(links.createdAt))
}

export async function getLinkById(db: AppDb, id: number) {
	const rows = await db.select().from(links).where(eq(links.id, id)).limit(1)
	return rows[0] ?? null
}

export async function getLinkBySlug(db: AppDb, slug: string) {
	const rows = await db.select().from(links).where(eq(links.slug, slug)).limit(1)
	return rows[0] ?? null
}

export async function insertLink(db: AppDb, data: LinkInsert) {
	const result = await db.insert(links).values(data).returning()
	return result[0]
}

export async function updateLinkRow(
	db: AppDb,
	id: number,
	userId: number,
	data: Partial<Omit<LinkInsert, 'id' | 'userId' | 'slug' | 'createdAt'>>
) {
	const result = await db
		.update(links)
		.set(data)
		.where(and(eq(links.id, id), eq(links.userId, userId)))
		.returning()
	return result[0] ?? null
}

export async function deleteLinkRow(db: AppDb, id: number, userId: number) {
	const result = await db
		.delete(links)
		.where(and(eq(links.id, id), eq(links.userId, userId)))
		.returning()
	return result[0] ?? null
}

export async function incrementClickCounter(db: AppDb, linkId: number) {
	await db
		.update(links)
		.set({
			totalClicks: sql`${links.totalClicks} + 1`,
			lastClickedAt: new Date(),
		})
		.where(eq(links.id, linkId))
}

// ---------- Clicks ----------

export interface InsertClickInput {
	linkId: number
	referrer?: string | null
	userAgent?: string | null
	country?: string | null
	city?: string | null
	deviceType?: 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown'
	deviceOs?: string | null
	browser?: string | null
	ipHash?: string | null
}

export async function insertClick(db: AppDb, data: InsertClickInput) {
	return db.insert(linkClicks).values(data)
}

// ---------- Analytics ----------

export interface TimeseriesPoint {
	date: string
	desktop: number
	mobile: number
	tablet: number
	bot: number
	total: number
}

export async function getClicksTimeseries(
	db: AppDb,
	linkId: number,
	since: Date
): Promise<TimeseriesPoint[]> {
	const result = await db
		.select({
			date: sql<string>`strftime('%Y-%m-%d', ${linkClicks.clickedAt}, 'unixepoch')`,
			deviceType: linkClicks.deviceType,
			count: count(),
		})
		.from(linkClicks)
		.where(
			and(eq(linkClicks.linkId, linkId), gte(linkClicks.clickedAt, since))
		)
		.groupBy(
			sql`strftime('%Y-%m-%d', ${linkClicks.clickedAt}, 'unixepoch')`,
			linkClicks.deviceType
		)

	const map = new Map<string, TimeseriesPoint>()
	for (const row of result) {
		const existing = map.get(row.date) ?? {
			date: row.date,
			desktop: 0,
			mobile: 0,
			tablet: 0,
			bot: 0,
			total: 0,
		}
		const c = row.count
		existing.total += c
		if (row.deviceType === 'desktop') existing.desktop += c
		else if (row.deviceType === 'mobile') existing.mobile += c
		else if (row.deviceType === 'tablet') existing.tablet += c
		else if (row.deviceType === 'bot') existing.bot += c
		map.set(row.date, existing)
	}

	return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

export interface BreakdownRow {
	label: string
	count: number
}

export async function getTopCountries(
	db: AppDb,
	linkId: number,
	since: Date,
	limit = 10
): Promise<BreakdownRow[]> {
	const rows = await db
		.select({
			country: linkClicks.country,
			count: count(),
		})
		.from(linkClicks)
		.where(
			and(eq(linkClicks.linkId, linkId), gte(linkClicks.clickedAt, since))
		)
		.groupBy(linkClicks.country)
		.orderBy(desc(count()))
		.limit(limit)

	return rows.map((r: { country: string | null; count: number }) => ({
		label: r.country ?? 'Unknown',
		count: r.count,
	}))
}

export async function getTopReferrers(
	db: AppDb,
	linkId: number,
	since: Date,
	limit = 10
): Promise<BreakdownRow[]> {
	const rows = await db
		.select({
			referrer: linkClicks.referrer,
			count: count(),
		})
		.from(linkClicks)
		.where(
			and(eq(linkClicks.linkId, linkId), gte(linkClicks.clickedAt, since))
		)
		.groupBy(linkClicks.referrer)
		.orderBy(desc(count()))
		.limit(limit)

	return rows.map((r: { referrer: string | null; count: number }) => ({
		label: r.referrer ?? 'Direct / None',
		count: r.count,
	}))
}

export interface DeviceBreakdown {
	desktop: number
	mobile: number
	tablet: number
	bot: number
	unknown: number
	total: number
}

export async function getDeviceBreakdown(
	db: AppDb,
	linkId: number,
	since: Date
): Promise<DeviceBreakdown> {
	const rows = await db
		.select({
			deviceType: linkClicks.deviceType,
			count: count(),
		})
		.from(linkClicks)
		.where(
			and(eq(linkClicks.linkId, linkId), gte(linkClicks.clickedAt, since))
		)
		.groupBy(linkClicks.deviceType)

	const breakdown: DeviceBreakdown = {
		desktop: 0,
		mobile: 0,
		tablet: 0,
		bot: 0,
		unknown: 0,
		total: 0,
	}

	for (const row of rows) {
		const c = row.count
		breakdown.total += c
		if (row.deviceType === 'desktop') breakdown.desktop = c
		else if (row.deviceType === 'mobile') breakdown.mobile = c
		else if (row.deviceType === 'tablet') breakdown.tablet = c
		else if (row.deviceType === 'bot') breakdown.bot = c
		else breakdown.unknown = c
	}

	return breakdown
}

export async function getRecentClicks(db: AppDb, linkId: number, limit = 20) {
	return db
		.select({
			id: linkClicks.id,
			clickedAt: linkClicks.clickedAt,
			country: linkClicks.country,
			city: linkClicks.city,
			deviceType: linkClicks.deviceType,
			deviceOs: linkClicks.deviceOs,
			browser: linkClicks.browser,
			referrer: linkClicks.referrer,
		})
		.from(linkClicks)
		.where(eq(linkClicks.linkId, linkId))
		.orderBy(desc(linkClicks.clickedAt))
		.limit(limit)
}

export async function getClicksSince(
	db: AppDb,
	linkId: number,
	since: Date
): Promise<number> {
	const result = await db
		.select({ value: count() })
		.from(linkClicks)
		.where(
			and(eq(linkClicks.linkId, linkId), gte(linkClicks.clickedAt, since))
		)
	return result[0]?.value ?? 0
}

export async function getClicksRange(db: AppDb, linkId: number) {
	const result = await db
		.select({
			first: sql<number | null>`MIN(${linkClicks.clickedAt})`,
			last: sql<number | null>`MAX(${linkClicks.clickedAt})`,
		})
		.from(linkClicks)
		.where(eq(linkClicks.linkId, linkId))
	return result[0] ?? { first: null, last: null }
}

export async function getUniqueCountriesCount(
	db: AppDb,
	linkId: number
): Promise<number> {
	const result = await db
		.select({
			value: sql<number>`COUNT(DISTINCT ${linkClicks.country})`,
		})
		.from(linkClicks)
		.where(eq(linkClicks.linkId, linkId))
	return Number(result[0]?.value ?? 0)
}

// re-export sum for callers that may want aggregate helpers
export { sum }
