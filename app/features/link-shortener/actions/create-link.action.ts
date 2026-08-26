import { requireAuth } from '~/session.server'
import { getDb } from '~/db'
import { env } from 'cloudflare:workers'
import { createLinkSchema } from '../link.schema'
import {
	LinkServiceError,
	type LinkServiceErrorCode,
	registerLink,
} from '../link.service'

export async function action({ request }: { request: Request }) {
	const userId = await requireAuth(request)
	const db = getDb(env.DB)
	const formData = await request.formData()

	const rawMaxClicks = formData.get('maxClicks')
	const maxClicksRaw =
		rawMaxClicks === null || rawMaxClicks === undefined
			? ''
			: String(rawMaxClicks).trim().toLowerCase()
	const maxClicksForSchema =
		maxClicksRaw === '' || maxClicksRaw === 'null' || maxClicksRaw === 'undefined'
			? null
			: rawMaxClicks

	const rawData = {
		originalUrl: ((formData.get('originalUrl') as string) ?? '').trim(),
		customSlug: ((formData.get('customSlug') as string) ?? '').trim(),
		title: ((formData.get('title') as string) ?? '').trim(),
		description: ((formData.get('description') as string) ?? '').trim(),
		expiresAt: ((formData.get('expiresAt') as string) ?? '').trim(),
		maxClicks: maxClicksForSchema,
		password: ((formData.get('password') as string) ?? '').trim(),
	}

	const result = createLinkSchema.safeParse(rawData)
	if (!result.success) {
		return { errors: result.error.flatten().fieldErrors }
	}

	try {
		const created = await registerLink(db, Number(userId), {
			...result.data,
			fetchOg: true,
		})
		return { success: true, slug: created.slug, id: created.id }
	} catch (err) {
		if (err instanceof LinkServiceError) {
			const field = mapErrorCodeToField(err.code)
			if (field === '_form') {
				return {
					errors: { _form: [err.message] },
					code: err.code,
				}
			}
			return {
				errors: { [field]: [err.message], _form: [err.message] },
				code: err.code,
			}
		}
		throw err
	}
}

function mapErrorCodeToField(
	code: LinkServiceErrorCode
): 'customSlug' | '_form' {
	switch (code) {
		case 'SLUG_TAKEN':
		case 'SLUG_INVALID':
			return 'customSlug'
		default:
			return '_form'
	}
}
