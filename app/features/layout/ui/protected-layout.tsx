import * as React from "react"
import { Outlet, useLoaderData, useFetcher } from "react-router"
import { requireAuth } from "~/session.server"
import { getUserById } from "~/features/user/user.repository"
import { useAuthStore } from "~/stores/auth-store"

export async function loader({ request }: { request: Request }) {
  const userId = await requireAuth(request)
  const user = getUserById(Number(userId))
  return { user }
}

export default function ProtectedLayout() {
  const { user } = useLoaderData<typeof loader>()

  const setUser = useAuthStore((s) => s.setUser)
  const authUser = useAuthStore((s) => s.user)

  React.useEffect(() => {
    if (user && JSON.stringify(user) !== JSON.stringify(authUser)) {
      setUser(user)
    }
  }, [user])

  return (
    <div>
      <header className="flex items-center justify-between border-b p-4">
        <span className="text-sm text-muted-foreground">
          {user?.name} ({user?.email})
        </span>
        <LogoutButton />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

function LogoutButton() {
  const logout = useAuthStore((s) => s.logout)
  const fetcher = useFetcher()

  return (
    <fetcher.Form method="post" action="/logout">
      <button
        type="submit"
        onClick={() => logout()}
        className="text-sm text-muted-foreground hover:underline"
      >
        Logout
      </button>
    </fetcher.Form>
  )
}
