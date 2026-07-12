export function meta() {
  return [{ title: "About" }]
}

export function loader() {
  return {}
}

export default function AboutPage() {
  return (
    <div className="text-red-500">
      about page
    </div>
  )
}