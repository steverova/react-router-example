import { listProjects, findProject } from "../project.service"

export async function projectLoader({ params }: { params: { id?: string } }) {
  if (params.id) {
    const project = await findProject(Number(params.id))
    return { projects: project ? [project] : [], project }
  }

  const projects = await listProjects()
  return { projects, project: null }
}
