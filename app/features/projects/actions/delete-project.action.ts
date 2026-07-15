import { requireAuth } from "~/session.server"
import { removeProject } from "../project.service"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const formData = await request.formData()

  const id = Number(formData.get("id"))
  await removeProject(id)
  return { success: true }
}
