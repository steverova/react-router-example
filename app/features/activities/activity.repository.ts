import type { AppDb } from "~/db"
import { activities } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"

export async function getAllActivities(db: AppDb) {
  return db.select().from(activities)
}

export async function getActivityById(db: AppDb, id: number) {
  const result = await db.select().from(activities).where(eq(activities.id, id))
  return result[0] ?? null
}

export async function getActivitiesByProject(db: AppDb, projectId: number) {
  return db.select().from(activities).where(eq(activities.projectId, projectId))
}

export async function createActivityInDb(db: AppDb, data: {
  projectId: number
  parentActivityId?: number | null
  title: string
  description?: string
  priority?: "low" | "medium" | "high" | "critical"
  status?: "pending" | "in_progress" | "blocked" | "completed" | "cancelled"
  estimatedHours?: number | null
  startDate?: string
  dueDate?: string
  createdBy?: number | null
}) {
  return db.insert(activities).values(data)
}

export async function updateActivityInDb(
  db: AppDb,
  id: number,
  data: {
    projectId?: number
    parentActivityId?: number | null
    title?: string
    description?: string
    priority?: "low" | "medium" | "high" | "critical"
    status?: "pending" | "in_progress" | "blocked" | "completed" | "cancelled"
    estimatedHours?: number | null
    startDate?: string
    dueDate?: string
  }
) {
  return db.update(activities).set(data).where(eq(activities.id, id))
}

export async function deleteActivityInDb(db: AppDb, id: number) {
  return db.delete(activities).where(eq(activities.id, id))
}
