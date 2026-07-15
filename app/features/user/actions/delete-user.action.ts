import { requireAuth } from "~/session.server"
import { removeUser } from "../user.service"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const formData = await request.formData()

  const id = Number(formData.get("id"))
  await removeUser(id)
  return { success: true }
}
