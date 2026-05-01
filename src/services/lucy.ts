import { api } from "./api"
import type { AxiosRequestConfig } from "axios"

import type {
  MeResponse,
  GuildResponse,
  LucyGuildResponse,
  LangResponse,
} from "../types/api"

import { API_URL } from "../constants/config"

const param = (id: string = "") => {
	return (Number(id) > 0)
    ? `${id}/`
    : ""
}

export const healthService = {
  endpoint: API_URL + "api/health/",

  check: (config?: AxiosRequestConfig) => config
    ? api.get(healthService.endpoint, config)
    : api.get(healthService.endpoint),
}

export const discordOAuthService = {
  endpoint: API_URL + "auth/discord/",

  redirectToLogin: () => {
    window.location.href = discordOAuthService.endpoint + "login/"
  },
}

export const authService = {
  endpoint: API_URL + "auth/",

  logout: (config?: AxiosRequestConfig) => config
    ? api.post(authService.endpoint + "logout/", undefined, config)
    : api.post(authService.endpoint + "logout/"),
}

export const discordService = {
  endpoint: API_URL + "discord/",

  me: (config?: AxiosRequestConfig) =>
    config
      ? api.get<MeResponse>(discordService.endpoint + "me/", config)
      : api.get<MeResponse>(discordService.endpoint + "me/"),
  
  guilds: (id: string = "", config?: AxiosRequestConfig) => 
    config
      ? api.get<GuildResponse | GuildResponse[]>(`${discordService.endpoint}guilds/${param(id)}`, config)
      : api.get<GuildResponse | GuildResponse[]>(`${discordService.endpoint}guilds/${param(id)}`),
}

export const guildService = {
  endpoint: API_URL + "api/guilds/",

  get: (id: string = "", config?: AxiosRequestConfig) =>
    config
      ? api.get<LucyGuildResponse | LucyGuildResponse[]>(`${guildService.endpoint}${param(id)}`, config)
      : api.get<LucyGuildResponse | LucyGuildResponse[]>(`${guildService.endpoint}${param(id)}`),

  update: (id: string, data: Partial<LucyGuildResponse>, config?: AxiosRequestConfig) =>
    config
      ? api.patch<LucyGuildResponse>(`${guildService.endpoint}${param(id)}`, data, config)
      : api.patch<LucyGuildResponse>(`${guildService.endpoint}${param(id)}`, data),
}

export const langService = {
  endpoint: API_URL + "api/langs/",

  get: (config?: AxiosRequestConfig) =>
    config
      ? api.get<LangResponse[]>(langService.endpoint, config)
      : api.get<LangResponse[]>(langService.endpoint),
}
