export const ROUTES = {
  WELCOME: "/",
  AUTH_CALLBACK: "/auth/callback",
  DASHBOARD: "/dashboard",
  GUILD: {
    ROOT: "/guild/:id",
    MODULES: {
      CONFIG: "config",
      INFO: "info",
    } as { [Key in string]: GUILD_MODULE_KEY },
  },
} as const

export type GUILD_MODULE_KEY =
"config" |
"info"
