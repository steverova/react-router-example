import { useEffect } from "react"
import { useLoaderData, useFetcher, useParams, Link } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema, type CreateUserInput } from "../user.schema"
import type { action as createAction } from "../actions/create-user.action"
import type { action as editAction } from "../actions/edit-user.action"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { toast } from "sonner"
import { userLoader as loader } from "./user.loader"

export { loader }

export function meta() {
  return [{ title: "User Form" }]
}

export default function UserFormPage() {
  // loader ya retorna `user` directamente cuando hay params.id
  const { user } = useLoaderData<typeof loader>()
  const params = useParams()
  const fetcher = useFetcher<typeof createAction | typeof editAction>()

  const isEditMode = Boolean(params.id)
  const userId = params.id ? Number(params.id) : null

  // Los defaultValues vienen del servidor — mismo valor en SSR y cliente
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  })

  const isSubmitting =
    fetcher.state === "submitting"

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.errors) {
        toast.error("Error saving user")
      } else if (fetcher.data.success) {
        toast.success(
          isEditMode ? "User updated successfully" : "User created successfully"
        )
        if (!isEditMode) {
          // limpiar el formulario después de crear
          window.history.replaceState({}, "", window.location.href)
        }
      }
    }
  }, [fetcher.state, fetcher.data, isEditMode])

  const onSubmit = (data: CreateUserInput) => {
    if (isEditMode && userId) {
      fetcher.submit(
        { ...data, id: String(userId) },
        { method: "post", action: "/users/actions/edit" }
      )
    } else {
      fetcher.submit(
        { ...data },
        { method: "post", action: "/users/actions/create" }
      )
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex w-full max-w-lg min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-lg">
            {isEditMode ? "Edit User" : "Create New User"}
          </h1>
          <Link to="/users">
            <Button variant="outline" size="sm">
              Back to Users
            </Button>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-2 flex flex-col gap-4 border p-4 rounded-lg"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter name"
              className="w-full"
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update User"
              : "Create User"}
          </Button>
        </form>
      </div>
    </div>
  )
}
