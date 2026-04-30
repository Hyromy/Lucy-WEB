import { InfoIcon, Settings } from "lucide-react"
import Config from "../pages/ManageGuild/Config"
import Info from "../pages/ManageGuild/Info"
import type { AppRouteModule } from "../types/appRoute"
import { type GUILD_MODULE_KEY, GUILD_MODULES } from "./paths"

export const GUILD_MODULES_CONFIG: AppRouteModule[] = [
  {
    path: GUILD_MODULES.CONFIG,
    element: <Config />,
    label: "config" as GUILD_MODULE_KEY,
    icon: <Settings />,
  },
  {
    path: GUILD_MODULES.INFO,
    element: <Info />,
    label: "info" as GUILD_MODULE_KEY,
    icon: <InfoIcon />,
  },
]
