import {
  getAllActivities,
  getActivityById,
  getActivitiesByProject,
  createActivityInDb,
  updateActivityInDb,
  deleteActivityInDb,
} from "./activity.repository"

export async function listActivities() {
  return getAllActivities()
}

export async function findActivity(id: number) {
  return getActivityById(id)
}

export async function listActivitiesByProject(projectId: number) {
  return getActivitiesByProject(projectId)
}

export async function registerActivity(data: {
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
  return createActivityInDb(data)
}

export async function updateActivity(
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
  return updateActivityInDb(id, data)
}

export async function removeActivity(id: number) {
  return deleteActivityInDb(id)
}
