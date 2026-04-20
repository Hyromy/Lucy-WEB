import { beforeEach, describe, expect, it, vi } from "vitest"

import { api } from "../services/api"
import {
  authService,
  discordService,
  guildService,
  healthService,
  langService,
} from "../services/lucy"
import type { LangResponse, LucyGuildResponse } from "../types/api"

vi.mock("../services/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

describe("Services", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("lucy", () => {
    it("healthService.check calls GET with health endpoint", () => {
      healthService.check()

      expect(api.get).toHaveBeenCalledWith(healthService.endpoint)
    })

    it("authService.logout calls POST with logout endpoint", () => {
      authService.logout()

      expect(api.post).toHaveBeenCalledWith(authService.endpoint + "logout/")
    })

    it("discordService.me calls GET with me endpoint", () => {
      discordService.me()

      expect(api.get).toHaveBeenCalledWith(`${discordService.endpoint}me/`)
    })

    it("discordService.guilds without id uses base endpoint", () => {
      discordService.guilds()

      expect(api.get).toHaveBeenCalledWith(`${discordService.endpoint}guilds/`)
    })

    it("discordService.guilds appends numeric id and trailing slash", () => {
      discordService.guilds("123")

      expect(api.get).toHaveBeenCalledWith(`${discordService.endpoint}guilds/123/`)
    })

    it("discordService.guilds ignores non numeric id", () => {
      discordService.guilds("abc")

      expect(api.get).toHaveBeenCalledWith(`${discordService.endpoint}guilds/`)
    })

    it("discordService.guilds treats zero as invalid id", () => {
      discordService.guilds("0")

      expect(api.get).toHaveBeenCalledWith(`${discordService.endpoint}guilds/`)
    })

    it("guildService.get without id uses base endpoint", () => {
      guildService.get()

      expect(api.get).toHaveBeenCalledWith(guildService.endpoint)
    })

    it("guildService.get with numeric id appends trailing slash", () => {
      guildService.get("7")

      expect(api.get).toHaveBeenCalledWith(`${guildService.endpoint}7/`)
    })

    it("guildService.get with invalid id falls back to base endpoint", () => {
      guildService.get("invalid")

      expect(api.get).toHaveBeenCalledWith(guildService.endpoint)
    })

    it("guildService.update calls PATCH with payload", () => {
      const data: Partial<LucyGuildResponse> = { lang: { code: "en", name: "English" } as LangResponse }

      guildService.update("88", data)

      expect(api.patch).toHaveBeenCalledWith(`${guildService.endpoint}88/`, data)
    })

    it("guildService.update with invalid id falls back to base endpoint", () => {
      const data: Partial<LucyGuildResponse> = { version: 2 }

      guildService.update("oops", data)

      expect(api.patch).toHaveBeenCalledWith(guildService.endpoint, data)
    })

    it("langService.get calls GET with langs endpoint", () => {
      langService.get()

      expect(api.get).toHaveBeenCalledWith(langService.endpoint)
    })
  })
})