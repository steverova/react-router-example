import { useEffect } from "react"
import { useLoaderData, useFetcher, useNavigate, Link } from "react-router"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { LoaderCircle, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { toast } from "sonner"
import { useAlertDialog } from "~/components/providers/alert-dialog-provider"
import { DataTable } from "~/components/shared/data-table"

interface Project {
  id: number
  name: string
  clientName: string
  status: string | null
}

export function meta() {
  return [{ title: "Projects" }]
}

export default function ProjectPage() {
  const navigate = useNavigate()

  const columns: ColumnDef<Project>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "clientName", header: "Client" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status ?? "draft"}
          </Badge>
        )
      },
    },
  ]

  return (
    <DataTable
      title="Projects"
      data={[]}
      columns={columns}
      onAdd={() => navigate("/projects/new-record")}
    />
  )
}
