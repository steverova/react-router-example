import {
  getAllProjects,
  getProjectById,
  getProjectsByClient,
  createProjectInDb,
  updateProjectInDb,
  deleteProjectInDb,
} from "./project.repository"

export function listProjects() {
  return getAllProjects()
}

export function findProject(id: number) {
  return getProjectById(id)
}

export function listProjectsByClient(clientEntityId: number) {
  return getProjectsByClient(clientEntityId)
}

export function registerProject(data: {
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
  return createProjectInDb(data)
}

export function updateProject(
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
  return updateProjectInDb(id, data)
}

export function removeProject(id: number) {
  return deleteProjectInDb(id)
}
