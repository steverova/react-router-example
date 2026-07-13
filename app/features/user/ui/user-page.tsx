import { useEffect } from "react"
import { useLoaderData, useFetcher, useNavigate, Link } from "react-router"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { LoaderCircle, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { toast } from "sonner"
import { useAlertDialog } from "~/components/providers/alert-dialog-provider"
import { userLoader as loader } from "./user.loader"
import { userAction as action } from "./user.action"
import { DataTable } from "~/components/shared/data-table"

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

function UserActions({ row }: { row: Row<User> }) {
  const fetcher = useFetcher<typeof action>()
  const { confirm } = useAlertDialog()

  const user = row.original
  const isDeleting =
    fetcher.formData?.get("intent") === "delete" &&
    Number(fetcher.formData.get("id")) === user.id

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete user",
      description: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    })
    if (ok) {
      fetcher.submit(
        { intent: "delete", id: String(user.id) },
        { method: "post" }
      )
    }
  }

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success("User deleted successfully")
      } else if (fetcher.data.errors) {
        toast.error("Error deleting user")
      }
    }
  }, [fetcher.state, fetcher.data])

  return (
    <div className="flex items-center gap-2">
      <Link to={`/users/${user.id}/edit-record`}>
        <Button variant="outline" size="icon">
          <PencilIcon className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="destructive"
        size="icon"
        onClick={onDelete}
        disabled={isDeleting}
      >
        {isDeleting ? <LoaderCircle className="animate-spin"/> : <TrashIcon className="h-4 w-4" />  }


      </Button>
    </div>
  )
}

export default function UserPage() {
  const navigate = useNavigate()
  const { users } = useLoaderData<typeof loader>()

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
  ]

  return (
    <DataTable
      title="Users"
      data={users}
      columns={columns}
      rowActions={UserActions}
      onAdd={() => navigate("/users/new-record")}
    />
  )
}
