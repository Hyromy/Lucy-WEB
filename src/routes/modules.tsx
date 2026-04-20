import { InfoIcon, Settings } from "lucide-react"
import Config from "../pages/ManageGuild/Config"
import Info from "../pages/ManageGuild/Info"
import type { AppRouteModule } from "../types/appRoute"
import { ROUTES, type GUILD_MODULE_KEY } from "./paths"

export const GUILD_MODULES: AppRouteModule[] = [
  {
    path: ROUTES.GUILD.MODULES.CONFIG,
    element: <Config />,
    label: "config" as GUILD_MODULE_KEY,
    icon: <Settings />,
  },
  {
    path: ROUTES.GUILD.MODULES.INFO,
    element: <Info />,
    label: "info" as GUILD_MODULE_KEY,
    icon: <InfoIcon />,
  },
]
