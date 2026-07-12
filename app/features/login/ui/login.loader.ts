import { redirect } from "react-router"
import { getSession } from "~/session.server"

export async function loginLoader({ request }: { request: Request }) {
  const session = await getSession(request.headers.get("Cookie"))

  if (session.has("userId")) {
    return redirect("/")
  }

  return { error: session.get("error") }
}
