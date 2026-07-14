import {
  getAllActivities,
  getActivityById,
  getActivitiesByProject,
  createActivityInDb,
  updateActivityInDb,
  deleteActivityInDb,
} from "./activity.repository"

export function listActivities() {
  return getAllActivities()
}

export function findActivity(id: number) {
  return getActivityById(id)
}

export function listActivitiesByProject(projectId: number) {
  return getActivitiesByProject(projectId)
}

export function registerActivity(data: {
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

export function updateActivity(
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

export function removeActivity(id: number) {
  return deleteActivityInDb(id)
}
