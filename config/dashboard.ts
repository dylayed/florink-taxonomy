import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
  ],
  sidebarNav: [
    {
      title: "Accounts",
      href: "/dashboard",
      icon: "accounts",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
