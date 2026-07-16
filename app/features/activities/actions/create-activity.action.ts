import { requireAuth } from "~/session.server"
import { createActivitySchema } from "../activity.schema"
import { registerActivity } from "../activity.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const db = getDb(env.DB)
  const formData = await request.formData()

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

  await registerActivity(db, result.data)
  return { success: true }
}
