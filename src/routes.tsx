import { Navigate } from "react-router-dom"

import type {
  AppRoute,
  AppRouteModule,
} from "./types/appRoute"

import Index from "./pages/Index"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import AuthCallback from "./pages/AuthCallback"

import ManageGuild from "./pages/ManageGuild/ManageGuild"
import Config from "./pages/ManageGuild/Config"
import Info from "./pages/ManageGuild/Info"

import {
  Settings,
  Info as InfoIcon,
} from "lucide-react"

export const ROUTES = {
  WELCOME: "/",
  AUTH_CALLBACK: "/auth/callback",
  DASHBOARD: "/dashboard",
  GUILD: {
    ROOT: "/guild/:id",
    MODULES: {
      CONFIG: "config",
      INFO: "info",
    },
  },
} as const

export const GUILD_MODULES: AppRouteModule[] = [
  {
    path: ROUTES.GUILD.MODULES.CONFIG,
    element: <Config />,
    label: "config",
    icon: <Settings />,
  },
  {
    path: ROUTES.GUILD.MODULES.INFO,
    element: <Info />,
    label: "info",
    icon: <InfoIcon />,
  },
]

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
