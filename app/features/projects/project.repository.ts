import type { AppDb } from "~/db"
import { projects } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"

export async function getAllProjects(db: AppDb) {
  return db.select().from(projects)
}

export async function getProjectById(db: AppDb, id: number) {
  const result = await db.select().from(projects).where(eq(projects.id, id))
  return result[0] ?? null
}

export async function getProjectsByClient(db: AppDb, clientEntityId: number) {
  return db.select().from(projects).where(eq(projects.clientEntityId, clientEntityId))
}

export async function createProjectInDb(db: AppDb, data: {
  projectCode: string
  clientEntityId: number
  name: string
  description?: string
  projectManagerId?: number | null
  ownerId?: number | null
  status?: "draft" | "active" | "on_hold" | "completed" | "cancelled" | "archived"
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
  db: AppDb,
  id: number,
  data: {
    clientEntityId?: number
    name?: string
    description?: string
    projectManagerId?: number | null
    ownerId?: number | null
    status?: "draft" | "active" | "on_hold" | "completed" | "cancelled" | "archived"
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

export async function deleteProjectInDb(db: AppDb, id: number) {
  return db.delete(projects).where(eq(projects.id, id))
}
