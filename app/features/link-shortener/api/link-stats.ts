import { requireAuth } from '~/session.server'
import { getDb } from '~/db'
import { env } from 'cloudflare:workers'
import { analyticsRangeSchema } from '../link.schema'
import { findLinkForUser, getAnalytics } from '../link.service'

export async function loader({
	request,
	params,
}: {
	request: Request
	params: { id?: string }
}) {
	const userId = await requireAuth(request)
	const db = getDb(env.DB)

	const id = Number(params.id)
	if (!Number.isFinite(id) || id <= 0) {
		throw new Response('Invalid link id', { status: 400 })
	}

	const url = new URL(request.url)
	const rangeParse = analyticsRangeSchema.safeParse({
		range: url.searchParams.get('range') ?? '30d',
	})
	const range = rangeParse.success ? rangeParse.data.range : '30d'

	const link = await findLinkForUser(db, id, Number(userId))
	if (!link) {
		throw new Response('Not found', { status: 404 })
	}

	const analytics = await getAnalytics(db, id, range)

	return Response.json({
		link: {
			id: link.id,
			slug: link.slug,
			originalUrl: link.originalUrl,
			isActive: link.isActive,
			status: link.status,
		},
		...analytics,
	})
}
