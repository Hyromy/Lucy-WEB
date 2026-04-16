import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import useApi from "../hooks/useApi"
import useAuth from "../hooks/useAuth"
import useEvent from "../hooks/useEvent"
import useLanguage from "../hooks/useLanguage"
import useTheme from "../hooks/useTheme"

class MockEventSource {
  static instances: MockEventSource[] = []

  readonly url: string
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  close = vi.fn()

  constructor(url: string) {
    this.url = url
    MockEventSource.instances.push(this)
  }

  emitMessage(payload: unknown) {
    this.onmessage?.({ data: JSON.stringify(payload) } as MessageEvent)
  }

  emitInvalidMessage(payload: string) {
    this.onmessage?.({ data: payload } as MessageEvent)
  }

  emitError() {
    this.onerror?.(new Event("error"))
  }
}

describe("Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    MockEventSource.instances = []

    Object.defineProperty(globalThis, "EventSource", {
      writable: true,
      value: MockEventSource as unknown as typeof EventSource,
    })
  })

  describe("useApi", () => {
    it("starts with default state", () => {
      const { result } = renderHook(() => useApi())

      expect(result.current.data).toBeNull()
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it("handles a single request and stores its response", async () => {
      const { result } = renderHook(() => useApi<number>())

      let response: number | null = null
      await act(async () => {
        response = await result.current.request(Promise.resolve(42))
      })

      expect(response).toBe(42)
      expect(result.current.data).toBe(42)
      expect(result.current.error).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it("handles multiple requests and stores tuple responses", async () => {
      const { result } = renderHook(() => useApi<[string, number]>())

      let response: [string, number] | null = null
      await act(async () => {
        response = await result.current.request(Promise.resolve("ok"), Promise.resolve(7))
      })

      expect(response).toEqual(["ok", 7])
      expect(result.current.data).toEqual(["ok", 7])
      expect(result.current.loading).toBe(false)
    })

    it("returns null when called without api calls", async () => {
      const { result } = renderHook(() => useApi<string>())

      let response: unknown = "not-null"
      await act(async () => {
        response = await result.current.request()
      })

      expect(response).toBeNull()
      expect(result.current.data).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it("maps unknown thrown values to a generic error", async () => {
      const { result } = renderHook(() => useApi())

      await act(async () => {
        await result.current.request(Promise.reject("boom") as Promise<never>)
      })

      expect(result.current.data).toBeNull()
      expect(result.current.error?.message).toBe("Unknown error occurred")
      expect(result.current.loading).toBe(false)
    })

    it("preserves Error instances when request fails", async () => {
      const { result } = renderHook(() => useApi())
      const expected = new Error("request failed")

      await act(async () => {
        await result.current.request(Promise.reject(expected) as Promise<never>)
      })

      expect(result.current.error).toBe(expected)
      expect(result.current.loading).toBe(false)
    })
  })

  describe("useEvent", () => {
    it("creates an EventSource with expected endpoint", () => {
      const callback = vi.fn()
      renderHook(() => useEvent(callback))

      const source = MockEventSource.instances[0]
      expect(source.url).toContain("/api/events/")
    })

    it("forwards external events to callback", () => {
      const callback = vi.fn()
      renderHook(() => useEvent(callback))

      const source = MockEventSource.instances[0]
      source.emitMessage({ event: "guild.updated", source: "bot" })

      expect(callback).toHaveBeenCalledWith({ event: "guild.updated", source: "bot" })
    })

    it("ignores connected status and web-origin events", () => {
      const callback = vi.fn()
      renderHook(() => useEvent(callback))

      const source = MockEventSource.instances[0]
      source.emitMessage({ status: "connected", source: "bot" })
      source.emitMessage({ event: "x", source: "web" })

      expect(callback).not.toHaveBeenCalled()
    })

    it("logs parse errors for malformed payloads", () => {
      const callback = vi.fn()
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined)

      renderHook(() => useEvent(callback))

      const source = MockEventSource.instances[0]
      source.emitInvalidMessage("not-json")

      expect(callback).not.toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()
    })

    it("closes EventSource on error and unmount", () => {
      const callback = vi.fn()
      const { unmount } = renderHook(() => useEvent(callback))

      const source = MockEventSource.instances[0]
      source.emitError()
      expect(source.close).toHaveBeenCalledTimes(1)

      unmount()
      expect(source.close).toHaveBeenCalledTimes(2)
    })
  })

  describe("context guards", () => {
    it("throws when useTheme is used outside provider", () => {
      expect(() => renderHook(() => useTheme())).toThrowError(
        "useTheme must be used within a ThemeProvider"
      )
    })

    it("throws when useLanguage is used outside provider", () => {
      expect(() => renderHook(() => useLanguage())).toThrowError(
        "useLanguage must be used within a LanguageProvider"
      )
    })

    it("throws when useAuth is used outside provider", () => {
      expect(() => renderHook(() => useAuth())).toThrowError(
        "useAuth must be used within an AuthProvider"
      )
    })
  })
})
