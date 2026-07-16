import { listProjects, findProject } from "../project.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function projectLoader({ params }: { params: { id?: string } }) {
  const db = getDb(env.DB)

  if (params.id) {
    const project = await findProject(db, Number(params.id))
    return { projects: project ? [project] : [], project }
  }

  const projects = await listProjects(db)
  return { projects, project: null }
}
