import { requireAuth } from "~/session.server"
import { createProjectSchema } from "../project.schema"
import { registerProject } from "../project.service"
import { generateProjectCode } from "~/lib/code"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function action({ request }: { request: Request }) {
  await requireAuth(request)
  const db = getDb(env.DB)
  const formData = await request.formData()

  const rawData = {
    clientEntityId: Number(formData.get("clientEntityId")),
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || undefined,
    projectManagerId: formData.get("projectManagerId") ? Number(formData.get("projectManagerId")) : null,
    ownerId: formData.get("ownerId") ? Number(formData.get("ownerId")) : null,
    status: (formData.get("status") as string) || "draft",
    startDate: (formData.get("startDate") as string) || undefined,
    targetEndDate: (formData.get("targetEndDate") as string) || undefined,
    hoursBudget: formData.get("hoursBudget") ? Number(formData.get("hoursBudget")) : null,
    documentationUrl: (formData.get("documentationUrl") as string) || undefined,
    repositoryUrl: (formData.get("repositoryUrl") as string) || undefined,
    contractReference: (formData.get("contractReference") as string) || undefined,
  }

  const result = createProjectSchema.safeParse(rawData)
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const projectCode = await generateProjectCode(db)
  await registerProject(db, { ...result.data, projectCode })
  return { success: true }
}
