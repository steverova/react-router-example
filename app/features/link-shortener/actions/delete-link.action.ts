import { requireAuth } from '~/session.server'
import { getDb } from '~/db'
import { env } from 'cloudflare:workers'
import { deleteLinkSchema } from '../link.schema'
import { LinkServiceError, removeLink } from '../link.service'

export async function action({ request }: { request: Request }) {
	const userId = await requireAuth(request)
	const db = getDb(env.DB)
	const formData = await request.formData()

	const result = deleteLinkSchema.safeParse({
		id: formData.get('id'),
	})

	if (!result.success) {
		return { errors: result.error.flatten().fieldErrors }
	}

	try {
		await removeLink(db, result.data.id, Number(userId))
		return { success: true }
	} catch (err) {
		if (err instanceof LinkServiceError) {
			return { errors: { _form: [err.message] }, code: err.code }
		}
		throw err
	}
}
