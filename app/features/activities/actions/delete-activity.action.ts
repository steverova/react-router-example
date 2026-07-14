import { requireAuth } from "~/session.server"
import { removeActivity } from "../activity.service"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const formData = await request.formData()

  const id = Number(formData.get("id"))
  removeActivity(id)
  return { success: true }
}
