import { redirect } from "react-router"
import { loginSchema } from "../login.schema"
import { authenticateUser } from "../login.service"
import { getSession, commitSession } from "~/session.server"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function loginAction({ request }: { request: Request }) {
  const db = getDb(env.DB)

  const formData = await request.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = loginSchema.safeParse({ email, password })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const auth = await authenticateUser(db, result.data.email, result.data.password)
  if (!auth.success || !auth.user) {
    return { error: "Invalid email or password" }
  }

  const session = await getSession(request.headers.get("Cookie"))
  session.set("userId", String(auth.user.id))
  session.set("createdAt", Math.floor(Date.now() / 1000))

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}
