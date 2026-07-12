import { Outlet, useLoaderData } from "react-router"
import { requireAuth } from "~/session.server"

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request)
  return { userId }
}

export default function ProtectedLayout() {
  const { userId } = useLoaderData<typeof loader>()
  return (
    <div>
      <header className="flex items-center justify-between border-b p-4">
        <span className="text-sm text-muted-foreground">User: {userId}</span>
        <form method="post" action="/logout">
          <button type="submit" className="text-sm text-muted-foreground hover:underline">
            Logout
          </button>
        </form>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
