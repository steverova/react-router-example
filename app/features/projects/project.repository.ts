import { db } from "~/db"
import { projects } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

const sqlite = db as unknown as BetterSQLite3Database<Record<string, never>>

export function getAllProjects() {
  return sqlite.select().from(projects).all()
}

export function getProjectById(id: number) {
  return sqlite.select().from(projects).where(eq(projects.id, id)).get()
}

export function getProjectsByClient(clientEntityId: number) {
  return sqlite.select().from(projects).where(eq(projects.clientEntityId, clientEntityId)).all()
}

export function createProjectInDb(data: {
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
  return sqlite.insert(projects).values(data).run()
}

export function updateProjectInDb(
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
  return sqlite.update(projects).set(data).where(eq(projects.id, id)).run()
}

export function deleteProjectInDb(id: number) {
  return sqlite.delete(projects).where(eq(projects.id, id)).run()
}
