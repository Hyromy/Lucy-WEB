export type MeResponse = {
  authenticated: boolean
  avatar?: string
  global_name?: string
  id?: string
  username?: string
}

export type GuildResponse = {
  banner?: string
  features: string[]
  icon: string
  id: string
  name: string
  owner: boolean
  permissions: string
}

export type LucyGuildResponse = {
  id: string
  lang: LangResponse,
  joined_at: string,
  updated_at: string,
  version: number
}

export type LangResponse = {
  code: string
  name: string
}
