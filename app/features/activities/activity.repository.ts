import { db } from "~/db"
import { activities } from "~/db/schema/sqlite"
import { eq } from "drizzle-orm"
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3"

const sqlite = db as unknown as BetterSQLite3Database<Record<string, never>>

export function getAllActivities() {
  return sqlite.select().from(activities).all()
}

export function getActivityById(id: number) {
  return sqlite.select().from(activities).where(eq(activities.id, id)).get()
}

export function getActivitiesByProject(projectId: number) {
  return sqlite.select().from(activities).where(eq(activities.projectId, projectId)).all()
}

export function createActivityInDb(data: {
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
  return sqlite.insert(activities).values(data).run()
}

export function updateActivityInDb(
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
  return sqlite.update(activities).set(data).where(eq(activities.id, id)).run()
}

export function deleteActivityInDb(id: number) {
  return sqlite.delete(activities).where(eq(activities.id, id)).run()
}
