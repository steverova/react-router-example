import { listActivities, findActivity, listActivitiesByProject } from "../activity.service"
import { listProjects } from "~/features/projects/project.service"

export async function activityLoader({ params }: { params: { id?: string } }) {
  const projects = listProjects()

  if (params.id) {
    const activity = findActivity(Number(params.id))
    return { activities: activity ? [activity] : [], activity, projects }
  }

  const activities = listActivities()
  return { activities, activity: null, projects }
}
