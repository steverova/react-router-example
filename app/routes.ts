import { type RouteConfig, index, route, layout } from "@react-router/dev/routes"

export default [
  // silencia la petición automática de Chrome DevTools
  route(".well-known/appspecific/com.chrome.devtools.json", "./routes/devtools.ts"),

  route("about", "./pages/about/index.tsx"),
  route("login", "./features/login/ui/login-page.tsx"),
  route("logout", "./routes/logout.tsx"),

  // actions de usuarios (solo POST, sin UI)
  route("users/actions/create", "./features/user/actions/create-user.action.ts"),
  route("users/actions/edit", "./features/user/actions/edit-user.action.ts"),
  route("users/actions/delete", "./features/user/actions/delete-user.action.ts"),

  // actions de clientes (solo POST, sin UI)
  route("clients/actions/create", "./features/clients/actions/create-client.action.ts"),
  route("clients/actions/edit", "./features/clients/actions/edit-client.action.ts"),
  route("clients/actions/delete", "./features/clients/actions/delete-client.action.ts"),

  layout("./components/blocks/layout/index.tsx", [
    index("routes/home.tsx"),
    route("table-example", "./features/table-example.tsx"),
    route("users", "./features/user/ui/user-page.tsx"),
    route("users/new-record", "./features/user/ui/user-form.tsx", { id: "users-new" }),
    route("users/:id/edit-record", "./features/user/ui/user-form.tsx", { id: "users-edit" }),
    route("clients", "./features/clients/ui/client-page.tsx"),
    route("clients/new-record", "./features/clients/ui/client-form.tsx", { id: "clients-new" }),
    route("clients/:id/edit-record", "./features/clients/ui/client-form.tsx", { id: "clients-edit" }),
    route("projects", "./features/projects/ui/project-page.tsx"),
    route("projects/new-record", "./features/projects/ui/project-form.tsx", { id: "projects-new" }),
    route("projects/:id/edit-record", "./features/projects/ui/project-form.tsx", { id: "projects-edit" }),
    route("activities", "./features/activities/ui/activity-page.tsx"),
    route("activities/new-record", "./features/activities/ui/activity-form.tsx", { id: "activities-new" }),
    route("activities/:id/edit-record", "./features/activities/ui/activity-form.tsx", { id: "activities-edit" }),
    route("dashboard", "./features/dashboard/ui/dashboard-page.tsx", {}),
  ]),
] satisfies RouteConfig
