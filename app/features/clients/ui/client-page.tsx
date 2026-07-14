import { useEffect } from "react"
import { useLoaderData, useFetcher, useNavigate, Link } from "react-router"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { LoaderCircle, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { toast } from "sonner"
import { useAlertDialog } from "~/components/providers/alert-dialog-provider"
import type { action } from "../actions/delete-client.action"
import { clientLoader as loader } from "./client.loader"
import { DataTable } from "~/components/shared/data-table"

export { loader }

interface Client {
  id: number
  entityType: string
  legalName: string
  tradeName: string | null
  taxId: string | null
  country: string | null
  email: string
  phone: string | null
  status: string | null
}

export function meta() {
  return [{ title: "Clients" }]
}

function ClientActions({ row }: { row: Row<Client> }) {
  const fetcher = useFetcher<typeof action>()
  const { confirm } = useAlertDialog()

  const client = row.original
  const isDeleting =
    fetcher.formData?.get("intent") === "delete" &&
    Number(fetcher.formData.get("id")) === client.id

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete client",
      description: `Are you sure you want to delete ${client.legalName}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    })
    if (ok) {
      fetcher.submit(
        { id: String(client.id) },
        { method: "post", action: "/clients/actions/delete" }
      )
    }
  }

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success("Client deleted successfully")
      }
    }
  }, [fetcher.state, fetcher.data])

  return (
    <div className="flex items-center gap-2">
      <Link to={`/clients/${client.id}/edit-record`}>
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
        {isDeleting ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <TrashIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}

export default function ClientPage() {
  const navigate = useNavigate()
  const { clients } = useLoaderData<typeof loader>()

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "legalName",
      header: "Name",
      cell: ({ row }) => {
        const client = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium">{client.legalName}</span>
            {client.tradeName && (
              <span className="text-xs text-muted-foreground">
                {client.tradeName}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "entityType",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("entityType") as string
        return (
          <Badge variant={type === "legal_entity" ? "default" : "secondary"}>
            {type === "legal_entity" ? "Company" : "Person"}
          </Badge>
        )
      },
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "country", header: "Country" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : "destructive"}>
            {status}
          </Badge>
        )
      },
    },
  ]

  return (
    <DataTable
      title="Clients"
      data={clients}
      columns={columns}
      rowActions={ClientActions}
      onAdd={() => navigate("/clients/new-record")}
    />
  )
}
