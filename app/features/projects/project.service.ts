import type { AppDb } from "~/db"
import {
  getAllProjects,
  getProjectById,
  getProjectsByClient,
  createProjectInDb,
  updateProjectInDb,
  deleteProjectInDb,
} from "./project.repository"

export async function listProjects(db: AppDb) {
  return getAllProjects(db)
}

export async function findProject(db: AppDb, id: number) {
  return getProjectById(db, id)
}

export async function listProjectsByClient(db: AppDb, clientEntityId: number) {
  return getProjectsByClient(db, clientEntityId)
}

export async function registerProject(db: AppDb, data: {
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
  return createProjectInDb(db, data)
}

export async function updateProject(
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
  return updateProjectInDb(db, id, data)
}

export async function removeProject(db: AppDb, id: number) {
  return deleteProjectInDb(db, id)
}
