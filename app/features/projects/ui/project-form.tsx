import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export function meta() {
  return [{ title: "Project Form" }]
}

export default function ProjectFormPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Project</h1>
        <Link to="/projects">
          <Button variant="outline" size="sm">Back to Projects</Button>
        </Link>
      </div>
      <p className="text-muted-foreground">Coming soon...</p>
    </div>
  )
}
