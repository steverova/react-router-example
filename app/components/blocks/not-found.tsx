import { Link } from "react-router"

import { Button } from "~/components/ui/button"
import { img404 } from "../../../assets/ilustrations"

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-8 p-8 md:gap-12 md:p-16">
      <img
        src={img404}
        alt="page not found placeholder"
        className="h-auto max-h-[60vh] w-full object-contain dark:brightness-[0.95] dark:invert"
      />
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold">Page Not Found</h1>
        <p>Oops! The page you're trying to access doesn't exist.</p>
        <div className="mt-6 flex items-center justify-center gap-4 md:mt-8">
          <Link to="/">
            <Button variant="default" className="h-9 cursor-pointer px-4 py-2">
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
