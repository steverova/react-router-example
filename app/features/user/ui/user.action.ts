import { createUserSchema } from "../user.schema"
import { registerUser, removeUser } from "../user.service"

export async function userAction({ request }: { request: Request }) {
  const formData = await request.formData()
  const intent = formData.get("intent") as string

  if (intent === "create") {
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    const result = createUserSchema.safeParse({ name, email })
    if (!result.success) {
      return { errors: result.error.flatten().fieldErrors }
    }

    registerUser(result.data.name, result.data.email)
    return { success: true }
  }

  if (intent === "delete") {
    const id = Number(formData.get("id"))
    removeUser(id)
    return { success: true }
  }

  return { error: "Invalid intent" }
}