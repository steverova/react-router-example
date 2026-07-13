import { type RouteConfig, index, route, layout } from "@react-router/dev/routes"

export default [
  // silencia la petición automática de Chrome DevTools
  route(".well-known/appspecific/com.chrome.devtools.json", "./routes/devtools.ts"),

  route("about", "./pages/about/index.tsx"),
  route("login", "./features/login/ui/login-page.tsx"),
  route("logout", "./routes/logout.tsx"),
  layout("./components/blocks/layout/index.tsx", [
    index("routes/home.tsx"),
    route("table-example", "./features/table-example.tsx"),
    route("users", "./features/user/ui/user-page.tsx"),
    route("users/new-record", "./features/user/ui/user-form.tsx", { id: "users-new" }),
    route("users/:id/edit-record", "./features/user/ui/user-form.tsx", { id: "users-edit" }),
    route("dashboard", "./features/dashboard/ui/dashboard-page.tsx", {}),
  ]),
] satisfies RouteConfig
