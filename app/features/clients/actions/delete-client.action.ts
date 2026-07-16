import { requireAuth } from "~/session.server"
import { removeClient } from "../client.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const db = getDb(env.DB)
  const formData = await request.formData()

  const id = Number(formData.get("id"))
  await removeClient(db, id)
  return { success: true }
}
