export const ROUTES = {
  WELCOME: "/",
  AUTH_CALLBACK: "/auth/callback",
  DASHBOARD: "/dashboard",
  
  GUILD: {
    ROOT: "/guild/:id",
  },
} as const

export const GUILD_MODULES = {
  CONFIG: "config",
  INFO: "info",
} as const 

export type GUILD_MODULE_KEY =
  typeof GUILD_MODULES[keyof typeof GUILD_MODULES]
