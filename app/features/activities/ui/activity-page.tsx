import { useEffect } from "react"
import { useLoaderData, useFetcher, useNavigate, Link } from "react-router"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { LoaderCircle, PencilIcon, TrashIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "~/components/ui/tooltip"
import { toast } from "sonner"
import { useAlertDialog } from "~/components/providers/alert-dialog-provider"
import type { action } from "../actions/delete-activity.action"
import { activityLoader as loader } from "./activity.loader"
import { DataTable } from "~/components/shared/data-table"

export { loader }

interface Activity {
  id: number
  projectId: number
  title: string
  description: string | null
  priority: string
  status: string | null
  estimatedHours: number | null
  startDate: string | null
  dueDate: string | null
}

export function meta() {
  return [{ title: "Activities" }]
}

function ActivityActions({ row }: { row: Row<Activity> }) {
  const fetcher = useFetcher<typeof action>()
  const { confirm } = useAlertDialog()

  const activity = row.original
  const isDeleting =
    fetcher.formData?.get("intent") === "delete" &&
    Number(fetcher.formData.get("id")) === activity.id

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete activity",
      description: `Are you sure you want to delete "${activity.title}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    })
    if (ok) {
      fetcher.submit(
        { id: String(activity.id) },
        { method: "post", action: "/activities/actions/delete" }
      )
    }
  }

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success("Activity deleted successfully")
      }
    }
  }, [fetcher.state, fetcher.data])

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger render={<Link to={`/activities/${activity.id}/edit-record`} />}>
            <Button variant="outline" size="icon">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit activity</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="destructive"
                size="icon"
                onClick={onDelete}
                disabled={isDeleting}
              />
            }
          >
            {isDeleting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </TooltipTrigger>
          <TooltipContent>Delete activity</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export default function ActivityPage() {
  const navigate = useNavigate()
  const { activities } = useLoaderData<typeof loader>()

  const columns: ColumnDef<Activity>[] = [
    { accessorKey: "title", header: "Title" },
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
    {
      accessorKey: "estimatedHours",
      header: "Est. Hours",
      cell: ({ row }) => {
        const hours = row.getValue("estimatedHours") as number | null
        return hours ? `${hours}h` : "-"
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.getValue("dueDate") as string | null
        return dueDate ? new Date(dueDate).toLocaleDateString() : "-"
      },
    },
  ]

  return (
    <DataTable
      title="Activities / Tasks"
      data={activities}
      columns={columns}
      rowActions={ActivityActions}
      onAdd={() => navigate("/activities/new-record")}
    />
  )
}
