import { useEffect } from "react"
import { useLoaderData, useFetcher, useNavigate, Link } from "react-router"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { LoaderCircle, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { toast } from "sonner"
import { useAlertDialog } from "~/components/providers/alert-dialog-provider"
import { DataTable } from "~/components/shared/data-table"

interface Activity {
  id: number
  title: string
  projectName: string
  priority: string
  status: string | null
}

export function meta() {
  return [{ title: "Activities" }]
}

export default function ActivityPage() {
  const navigate = useNavigate()

  const columns: ColumnDef<Activity>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "projectName", header: "Project" },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string
        const variant =
          priority === "critical"
            ? "destructive"
            : priority === "high"
              ? "destructive"
              : priority === "medium"
                ? "default"
                : "secondary"
        return <Badge variant={variant}>{priority}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "completed" ? "default" : "secondary"}>
            {status ?? "pending"}
          </Badge>
        )
      },
    },
  ]

  return (
    <DataTable
      title="Activities / Tasks"
      data={[]}
      columns={columns}
      onAdd={() => navigate("/activities/new-record")}
    />
  )
}
