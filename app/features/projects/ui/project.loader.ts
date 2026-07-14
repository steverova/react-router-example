import { listProjects, findProject } from "../project.service"

export async function projectLoader({ params }: { params: { id?: string } }) {
  if (params.id) {
    const project = findProject(Number(params.id))
    return { projects: project ? [project] : [], project }
  }

  const projects = listProjects()
  return { projects, project: null }
}
