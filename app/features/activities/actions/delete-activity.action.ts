import { requireAuth } from "~/session.server"
import { removeActivity } from "../activity.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const db = getDb(env.DB)
  const formData = await request.formData()

  const id = Number(formData.get("id"))
  await removeActivity(db, id)
  return { success: true }
}
