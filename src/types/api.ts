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
