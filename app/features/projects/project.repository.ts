import { db } from "~/db"
import { projects } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"

export async function getAllProjects() {
  return db.select().from(projects)
}

export async function getProjectById(id: number) {
  const result = await db.select().from(projects).where(eq(projects.id, id))
  return result[0] ?? null
}

export async function getProjectsByClient(clientEntityId: number) {
  return db.select().from(projects).where(eq(projects.clientEntityId, clientEntityId))
}

export async function createProjectInDb(data: {
  projectCode: string
  clientEntityId: number
  name: string
  description?: string
  projectManagerId?: number | null
  ownerId?: number | null
  status?: string
  startDate?: string
  targetEndDate?: string
  hoursBudget?: number | null
  documentationUrl?: string
  repositoryUrl?: string
  contractReference?: string
}) {
  return db.insert(projects).values(data)
}

export async function updateProjectInDb(
  id: number,
  data: {
    clientEntityId?: number
    name?: string
    description?: string
    projectManagerId?: number | null
    ownerId?: number | null
    status?: string
    startDate?: string
    targetEndDate?: string
    hoursBudget?: number | null
    documentationUrl?: string
    repositoryUrl?: string
    contractReference?: string
  }
) {
  return db.update(projects).set(data).where(eq(projects.id, id))
}

export async function deleteProjectInDb(id: number) {
  return db.delete(projects).where(eq(projects.id, id))
}
