import { listActivities, findActivity, listActivitiesByProject } from "../activity.service"
import { listProjects } from "~/features/projects/project.service"

export async function activityLoader({ params }: { params: { id?: string } }) {
  const projects = await listProjects()

  if (params.id) {
    const activity = await findActivity(Number(params.id))
    return { activities: activity ? [activity] : [], activity, projects }
  }

  const activities = await listActivities()
  return { activities, activity: null, projects }
}
