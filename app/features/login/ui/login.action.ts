import { redirect } from "react-router"
import { loginSchema } from "../login.schema"
import { authenticateUser } from "../login.service"
import { getSession, commitSession } from "~/session.server"

export async function loginAction({ request }: { request: Request }) {
  const session = await getSession(request.headers.get("Cookie"))

  const formData = await request.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = loginSchema.safeParse({ email, password })
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const auth = authenticateUser(result.data.email, result.data.password)
  if (!auth.success || !auth.user) {
    session.flash("error", "Invalid email or password")
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    })
  }

  session.set("userId", String(auth.user.id))
  session.set("createdAt", Math.floor(Date.now() / 1000))
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}
