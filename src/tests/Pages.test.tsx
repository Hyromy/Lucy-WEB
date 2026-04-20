import type { ReactNode } from "react"
import { render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ROUTES } from "../routes/paths"
import AuthCallback from "../pages/AuthCallback"

const { navigateMock, refreshMeMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  refreshMeMock: vi.fn(),
}))

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom")

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock("../hooks/useAuth", () => ({
  default: () => ({
    refreshMe: refreshMeMock,
  }),
}))

vi.mock("../layouts/Main", () => ({
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

describe("Pages", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("AuthCallback", () => {
    it("renders authentication message", () => {
      refreshMeMock.mockResolvedValue(undefined)

      render(<AuthCallback />)

      expect(screen.getByText("Authenticating...")).toBeTruthy()
    })

    it("navigates to dashboard when refresh succeeds", async () => {
      refreshMeMock.mockResolvedValue(undefined)

      render(<AuthCallback />)

      await waitFor(() => {
        expect(refreshMeMock).toHaveBeenCalledTimes(1)
      })

      expect(navigateMock).toHaveBeenCalledWith(ROUTES.DASHBOARD, { replace: true })
    })

    it("navigates to welcome when refresh fails", async () => {
      refreshMeMock.mockRejectedValue(new Error("fail"))

      render(<AuthCallback />)

      await waitFor(() => {
        expect(refreshMeMock).toHaveBeenCalledTimes(1)
      })

      expect(navigateMock).toHaveBeenCalledWith(ROUTES.WELCOME, { replace: true })
    })

    it("does not navigate after unmount while refresh is pending", async () => {
      const deferred: { resolve: (() => void) | null } = { resolve: null }

      refreshMeMock.mockImplementation(
        () => new Promise<void>((resolve) => {
          deferred.resolve = resolve
        })
      )

      const { unmount } = render(<AuthCallback />)
      unmount()

      deferred.resolve?.()
      await Promise.resolve()

      expect(navigateMock).not.toHaveBeenCalled()
    })
  })
})