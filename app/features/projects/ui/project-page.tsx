import { useEffect } from "react"
import { useLoaderData, useFetcher, useNavigate, Link } from "react-router"
import type { ColumnDef, Row } from "@tanstack/react-table"
import { LoaderCircle, PencilIcon, TrashIcon, FolderOpen } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "~/components/ui/tooltip"
import { toast } from "sonner"
import { useAlertDialog } from "~/components/providers/alert-dialog-provider"
import type { action } from "../actions/delete-project.action"
import { projectLoader as loader } from "./project.loader"
import { DataTable } from "~/components/shared/data-table"

export { loader }

interface Project {
  id: number
  projectCode: string
  clientEntityId: number
  name: string
  description: string | null
  status: string | null
  startDate: string | null
  targetEndDate: string | null
  hoursBudget: number | null
}

export function meta() {
  return [{ title: "Projects" }]
}

function ProjectActions({ row }: { row: Row<Project> }) {
  const fetcher = useFetcher<typeof action>()
  const { confirm } = useAlertDialog()

  const project = row.original
  const isDeleting =
    fetcher.formData?.get("intent") === "delete" &&
    Number(fetcher.formData.get("id")) === project.id

  const onDelete = async () => {
    const ok = await confirm({
      title: "Delete project",
      description: `Are you sure you want to delete ${project.name}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
    })
    if (ok) {
      fetcher.submit(
        { id: String(project.id) },
        { method: "post", action: "/projects/actions/delete" }
      )
    }
  }

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        toast.success("Project deleted successfully")
      }
    }
  }, [fetcher.state, fetcher.data])

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger render={<Link to={`/projects/${project.id}/edit-record`} />}>
            <Button variant="outline" size="icon">
              <PencilIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit project</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Link to={`/activities?project=${project.id}`} />}>
            <Button variant="outline" size="icon">
              <FolderOpen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View activities</TooltipContent>
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
          <TooltipContent>Delete project</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

export default function ProjectPage() {
  const navigate = useNavigate()
  const { projects } = useLoaderData<typeof loader>()

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "projectCode",
      header: "Code",
      cell: ({ row }) => {
        return (
          <span className="font-mono text-xs">{row.getValue("projectCode")}</span>
        )
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const project = row.original
        return (
          <div className="flex flex-col">
            <span className="font-medium">{project.name}</span>
            {project.description && (
              <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                {project.description}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const variant =
          status === "active"
            ? "default"
            : status === "completed"
              ? "default"
              : status === "cancelled"
                ? "destructive"
                : "secondary"
        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = row.getValue("startDate") as string | null
        return date ? new Date(date).toLocaleDateString() : "-"
      },
    },
    {
      accessorKey: "targetEndDate",
      header: "End Date",
      cell: ({ row }) => {
        const date = row.getValue("targetEndDate") as string | null
        return date ? new Date(date).toLocaleDateString() : "-"
      },
    },
    {
      accessorKey: "hoursBudget",
      header: "Budget (h)",
      cell: ({ row }) => {
        const budget = row.getValue("hoursBudget") as number | null
        return budget ? `${budget}h` : "-"
      },
    },
  ]

  return (
    <DataTable
      title="Projects"
      data={projects}
      columns={columns}
      rowActions={ProjectActions}
      onAdd={() => navigate("/projects/new-record")}
    />
  )
}
