import { listActivities, findActivity, listActivitiesByProject } from "../activity.service"
import { listProjects } from "~/features/projects/project.service"
import { getDb } from "~/db"
import { env } from "cloudflare:workers"

export async function activityLoader({ params }: { params: { id?: string } }) {
  const db = getDb(env.DB)
  const projects = await listProjects(db)

  if (params.id) {
    const activity = await findActivity(db, Number(params.id))
    return { activities: activity ? [activity] : [], activity, projects }
  }

  const activities = await listActivities(db)
  return { activities, activity: null, projects }
}
