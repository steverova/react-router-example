import {
  AudioLinesIcon,
  GalleryVerticalEndIcon,
  TerminalIcon,
} from "lucide-react"
import type * as React from "react"
import ThemeSwitcher from "~/components/shared/theme-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar"
import { TeamSwitcher } from "./theme-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <AudioLinesIcon />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
        <ThemeSwitcher/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
