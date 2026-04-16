import { Navigate } from "react-router-dom"

import type { AppRoute } from "../types/appRoute"

import Index from "../pages/Index"
import Dashboard from "../pages/Dashboard"
import NotFound from "../pages/NotFound"
import AuthCallback from "../pages/AuthCallback"
import ManageGuild from "../pages/ManageGuild/ManageGuild"
import { ROUTES } from "./paths"
import { GUILD_MODULES } from "./modules"

export const routes: AppRoute[] = [
  {
    path: ROUTES.WELCOME,
    element: <Index />,
    isPublic: true,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: ROUTES.AUTH_CALLBACK,
    element: <AuthCallback />,
    isPublic: true,
  },
  {
    path: ROUTES.GUILD.ROOT,
    element: <ManageGuild />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.GUILD.MODULES.CONFIG} replace />,
      },
      ...GUILD_MODULES,
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  }
]
