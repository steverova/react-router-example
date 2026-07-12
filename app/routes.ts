import { type RouteConfig, index, route, layout } from "@react-router/dev/routes"

export default [
  
  route("about", "./pages/about/index.tsx"),
  route("login", "./features/login/ui/login-page.tsx"),
  route("logout", "./routes/logout.tsx"),
  layout("./features/layout/ui/protected-layout.tsx", [
    index("routes/home.tsx"),
    route("users", "./features/user/ui/user-page.tsx"),
    route("dashboard", "./features/dashboard/ui/dashboard-page.tsx"),
  ]),
] satisfies RouteConfig
