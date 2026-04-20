import { type ReactNode } from "react"

export type AppRoute = {
  path?: string
  index?: boolean
  element: ReactNode
  isPublic?: boolean
  requiresAuth?: boolean
  allowedRoles?: string[]
  children?: AppRoute[]
}

export type AppRouteModule = AppRoute & {
  label: string
  icon?: ReactNode
}
