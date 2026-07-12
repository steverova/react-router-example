import { useLoaderData, useFetcher } from "react-router"
import { loginAction as action } from "./login.action"
import { loginLoader as loader } from "./login.loader"
import { LoginForm } from "./login-form"

export { loader, action }

export function meta() {
  return [{ title: "Login" }]
}

export default function LoginPage() {
  const { error } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof action>()

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        <LoginForm fetcher={fetcher} />
      </div>
    </div>
  )
}
