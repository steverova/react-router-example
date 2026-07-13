import { requireAuth } from "~/session.server"
import { createUserSchema } from "../user.schema"
import { updateUser } from "../user.service"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const formData = await request.formData()

  const id = Number(formData.get("id"))
  const name = formData.get("name") as string
  const email = formData.get("email") as string

  const result = createUserSchema.safeParse({ name, email })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  updateUser(id, result.data.name, result.data.email)
  return { success: true }
}
