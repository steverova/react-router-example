import { useEffect } from "react"
import { useLoaderData, useFetcher } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema, type CreateUserInput } from "../user.schema"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { toast } from "sonner"
import { useAlertDialog } from "~/components/providers/alert-dialog-provider"
import { userLoader as loader } from "./user.loader"
import { userAction as action } from "./user.action"

export { loader, action }

interface User {
  id: number
  publicId: string
  name: string
  email: string
  role: string
  status: string | null
}

export function meta() {
  return [{ title: "Users" }]
}

export default function UserPage() {
  const { users } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof action>()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  })

  const { confirm  } = useAlertDialog()

  const isCreating = fetcher.formData?.get("intent") === "create"

  const deletingId = fetcher.formData?.get("intent") === "delete"
    ? Number(fetcher.formData.get("id"))
    : null

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.errors) {
        toast.error("Error creating user")
      } else if (fetcher.data.success) {
        toast.success("User created successfully")
      }
    }
  }, [fetcher.state, fetcher.data])

  const onSubmit = (data: CreateUserInput) => {
    fetcher.submit({ ...data, intent: "create" }, { method: "post" })
    reset()
  }

  const onDelete = async (id: number, name: string) => {
    const ok = await confirm({
      title: "Delete user",
      description: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    })

    if (ok) {
      fetcher.submit(
        { intent: "delete", id: String(id) },
        { method: "post" }
      )
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex w-full max-w-lg min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Users</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Enter name"
                className="w-full"
                disabled={isCreating}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Enter email"
                className="w-full"
                disabled={isCreating}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? "Adding..." : "Add User"}
            </Button>
          </form>
        </div>
        <div>
          <h2 className="font-medium">User List</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul className="mt-2 list-disc pl-4">
              {users.map((user: User) => (
                <li key={user.id} className="flex items-center justify-between">
                  <span>{user.name} - {user.email}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === user.id}
                    onClick={() => onDelete(user.id, user.name)}
                  >
                    {deletingId === user.id ? "Deleting..." : "Delete"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
