export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000")
  .replace(/\/+$/, "") + "/"

export const DISCORD_BOT_CLIENT_ID = import.meta.env.VITE_DISCORD_BOT_CLIENT_ID

export const DISCORD_BOT_PERMISSIONS = import.meta.env.VITE_DISCORD_BOT_PERMISSIONS || "8"

export const DISCORD_BOT_SCOPES = (import.meta.env.VITE_DISCORD_BOT_SCOPES || "bot, applications.commands")
  .split(",")
  .map((s: string) => s.trim())
  .join("%20")
