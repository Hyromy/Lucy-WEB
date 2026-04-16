import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Button } from "../components/Button"
import { Card, GuildCard } from "../components/Card"
import { Form, Option, Select } from "../components/Form"
import type { GuildResponse } from "../types/api"

vi.mock("../hooks/useLanguage", () => ({
  default: () => ({
    t: (key: string) => `translated:${key}`,
  }),
}))

describe("Components", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Button", () => {
    it("renders the label", () => {
      render(<Button>Guardar</Button>)

      expect(screen.getByRole("button", { name: "Guardar" })).toBeTruthy()
    })

    it("calls onClick when pressed", () => {
      const handleClick = vi.fn()

      render(<Button onClick={handleClick}>Accion</Button>)
      fireEvent.click(screen.getByRole("button", { name: "Accion" }))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("disables the button when loading and hides icons", () => {
      const { container } = render(
        <Button
          isLoading
          leftIcon={<span data-testid="left-icon">L</span>}
          rightIcon={<span data-testid="right-icon">R</span>}
        >
          Cargando
        </Button>
      )

      const button = screen.getByRole("button", { name: "Cargando" })

      expect((button as HTMLButtonElement).disabled).toBe(true)
      expect(screen.queryByTestId("left-icon")).toBeNull()
      expect(screen.queryByTestId("right-icon")).toBeNull()
      expect(container.querySelector(".animate-spin")).toBeTruthy()
    })

    it("respects explicit disabled prop", () => {
      render(<Button disabled>Disabled</Button>)

      const button = screen.getByRole("button", { name: "Disabled" })
      expect((button as HTMLButtonElement).disabled).toBe(true)
    })
  })

  describe("Form", () => {
    it("collects form data and sends it to onSubmit", () => {
      const handleSubmit = vi.fn()

      render(
        <Form<{ username: string }> onSubmit={handleSubmit}>
          <input name="username" defaultValue="lucy" />
          <button type="submit">Enviar</button>
        </Form>
      )

      fireEvent.click(screen.getByRole("button", { name: "Enviar" }))

      expect(handleSubmit).toHaveBeenCalledWith({ username: "lucy" })
    })
  })

  describe("Select", () => {
    it("uses default value and emits selected option", () => {
      const handleChange = vi.fn()

      render(
        <Select name="lang" defaultValue="es" onChange={handleChange}>
          <Option value="es">Espanol</Option>
          <Option value="en">English</Option>
        </Select>
      )

      const select = screen.getByRole("combobox") as HTMLSelectElement

      expect(select.value).toBe("es")

      fireEvent.change(select, { target: { value: "en" } })

      expect(handleChange).toHaveBeenCalledWith("en")
    })

    it("respects disabled state", () => {
      render(
        <Select name="lang" disabled defaultValue="es">
          <Option value="es">Espanol</Option>
          <Option value="en">English</Option>
        </Select>
      )

      const select = screen.getByRole("combobox") as HTMLSelectElement
      expect(select.disabled).toBe(true)
    })
  })

  describe("Card", () => {
    it("executes onClick and keeps custom class", () => {
      const handleClick = vi.fn()

      render(
        <Card onClick={handleClick} className="custom-card">
          Contenido
        </Card>
      )

      const content = screen.getByText("Contenido")
      fireEvent.click(content)

      expect(handleClick).toHaveBeenCalledTimes(1)
      expect(content.closest("div")?.className.includes("custom-card")).toBe(true)
    })

    it("does not include hover classes when hoverable is false", () => {
      render(
        <Card hoverable={false}>
          Sin hover
        </Card>
      )

      const content = screen.getByText("Sin hover")
      const className = content.closest("div")?.className ?? ""

      expect(className.includes("hover:border-")).toBe(false)
      expect(className.includes("hover:shadow-")).toBe(false)
    })
  })

  describe("GuildCard", () => {
    it("renders guild icon URL and owner label", () => {
      const guild: GuildResponse = {
        id: "1",
        name: "Lucy Guild",
        icon: "abc123",
        owner: true,
        permissions: "0",
        features: [],
      }

      render(<GuildCard guild={guild} />)

      const image = screen.getByRole("img", { name: "Lucy Guild" }) as HTMLImageElement
      expect(image.src).toContain("https://cdn.discordapp.com/icons/1/abc123.png")
      expect(screen.getByText("translated:dashboard.guild.owner")).toBeTruthy()
    })

    it("uses fallback avatar URL when icon is empty", () => {
      const guild: GuildResponse = {
        id: "2",
        name: "No Icon Guild",
        icon: "",
        owner: false,
        permissions: "0",
        features: [],
      }

      render(<GuildCard guild={guild} />)

      const image = screen.getByRole("img", { name: "No Icon Guild" }) as HTMLImageElement
      expect(image.src).toContain("https://cdn.discordapp.com/embed/avatars/0.png")
      expect(screen.getByText("translated:dashboard.guild.admin")).toBeTruthy()
    })

    it("triggers onClick when card is pressed", () => {
      const handleClick = vi.fn()
      const guild: GuildResponse = {
        id: "3",
        name: "Clickable Guild",
        icon: "",
        owner: false,
        permissions: "0",
        features: [],
      }

      render(<GuildCard guild={guild} onClick={handleClick} />)
      fireEvent.click(screen.getByText("Clickable Guild"))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })
})