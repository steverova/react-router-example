import type { AppDb } from "~/db"
import {
  getAllActivities,
  getActivityById,
  getActivitiesByProject,
  createActivityInDb,
  updateActivityInDb,
  deleteActivityInDb,
} from "./activity.repository"

export async function listActivities(db: AppDb) {
  return getAllActivities(db)
}

export async function findActivity(db: AppDb, id: number) {
  return getActivityById(db, id)
}

export async function listActivitiesByProject(db: AppDb, projectId: number) {
  return getActivitiesByProject(db, projectId)
}

export async function registerActivity(db: AppDb, data: {
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
  return createActivityInDb(db, data)
}

export async function updateActivity(
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
  return updateActivityInDb(db, id, data)
}

export async function removeActivity(db: AppDb, id: number) {
  return deleteActivityInDb(db, id)
}
