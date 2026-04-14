import { api } from "./api"

import type {
  MeResponse,
  GuildResponse,
  LucyGuildResponse,
  LangResponse,
} from "../types/api"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/"

const param = (id: string = "") => {
	return (Number(id) > 0)
    ? `${id}/`
    : ""
}

export const healthService = {
  endpoint: API_URL + "api/health/",

  check: () => api.get(healthService.endpoint),
}

export const discordOAuthService = {
  endpoint: API_URL + "auth/discord/",

  redirectToLogin: () => {
    window.location.href = discordOAuthService.endpoint + "login/"
  },
}

export const authService = {
  endpoint: API_URL + "auth/",

  logout: () => api.post(authService.endpoint + "logout/"),
}

export const discordService = {
  endpoint: API_URL + "discord/",

  me: () =>
    api.get<MeResponse>
      (discordService.endpoint + "me/"),
  
  guilds: (id: string = "") => 
    api.get<GuildResponse | GuildResponse[]>
      (`${discordService.endpoint}guilds/${param(id)}`),
}

export const guildService = {
  endpoint: API_URL + "api/guilds/",

  get: (id: string = "") =>
    api.get<LucyGuildResponse | LucyGuildResponse[]>
      (`${guildService.endpoint}${param(id)}`),
}

export const langService = {
  endpoint: API_URL + "api/langs/",

  get: () =>
    api.get<LangResponse[]>
      (langService.endpoint),
}
