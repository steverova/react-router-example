import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export function meta() {
  return [{ title: "Activity Form" }]
}

export default function ActivityFormPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Activity</h1>
        <Link to="/activities">
          <Button variant="outline" size="sm">Back to Activities</Button>
        </Link>
      </div>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  )
}
