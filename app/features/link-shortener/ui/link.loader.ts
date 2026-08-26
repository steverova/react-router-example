import { requireAuth } from '~/session.server'
import { getDb } from '~/db'
import { env } from 'cloudflare:workers'
import { listLinksForUser } from '../link.service'

export async function linkLoader({ request }: { request: Request }) {
	const userId = await requireAuth(request)
	const db = getDb(env.DB)
	const links = await listLinksForUser(db, Number(userId))
	return { links }
}
