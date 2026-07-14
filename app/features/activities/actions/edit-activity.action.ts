import { requireAuth } from "~/session.server"
import { createActivitySchema } from "../activity.schema"
import { updateActivity } from "../activity.service"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const formData = await request.formData()

  const id = Number(formData.get("id"))
  const data = {
    projectId: Number(formData.get("projectId")),
    parentActivityId: formData.get("parentActivityId") ? Number(formData.get("parentActivityId")) : null,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || undefined,
    priority: (formData.get("priority") as "low" | "medium" | "high" | "critical") || "medium",
    status: (formData.get("status") as "pending" | "in_progress" | "blocked" | "completed" | "cancelled") || "pending",
    estimatedHours: formData.get("estimatedHours") ? Number(formData.get("estimatedHours")) : null,
    startDate: (formData.get("startDate") as string) || undefined,
    dueDate: (formData.get("dueDate") as string) || undefined,
  }

  const result = createActivitySchema.safeParse(data)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  updateActivity(id, result.data)
  return { success: true }
}
