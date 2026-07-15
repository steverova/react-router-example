import { requireAuth } from "~/session.server"
import { removeClient } from "../client.service"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const formData = await request.formData()

  const id = Number(formData.get("id"))
  await removeClient(id)
  return { success: true }
}
