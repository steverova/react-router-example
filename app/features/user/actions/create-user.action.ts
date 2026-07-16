import { requireAuth } from "~/session.server"
import { createUserSchema } from "../user.schema"
import { registerUser } from "../user.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const db = getDb(env.DB)
  const formData = await request.formData()

  const name = formData.get("name") as string
  const email = formData.get("email") as string

  const result = createUserSchema.safeParse({ name, email })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  await registerUser(db, result.data.name, result.data.email)
  return { success: true }
}
