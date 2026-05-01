import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Button } from "../components/Button"
import { Card, GuildCard } from "../components/Card"
import { Form, Option, Select } from "../components/Form"
import { OffCanvas } from "../components/OffCanvas"
import { Breadcrumb } from "../components/Breadcrum"
import { Divider } from "../components/Divider"
import { MemoryRouter } from "react-router-dom"
import type { GuildResponse } from "../types/api"
import { Dropdown } from "../components/Dropdown"

window.HTMLElement.prototype.scrollIntoView = vi.fn()

vi.mock("../hooks/useLanguage", () => ({
  default: () => ({
    t: (key: string) => `translated:${key}`,
  }),
}))

vi.mock("@radix-ui/react-dropdown-menu", () => ({
  Root: ({ children }: any) => <div>{children}</div>,
  Trigger: ({ children }: any) => <div>{children}</div>,
  Portal: ({ children }: any) => <div>{children}</div>,
  Content: ({ children }: any) => <div role="menu">{children}</div>,
  Item: ({ children, onSelect }: any) => (
    <div role="menuitem" onClick={() => onSelect?.() }>{children}</div>
  ),
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
    it("uses default value and emits selected option", async () => {
      const handleChange = vi.fn()

      const { container } = render(
        <form>
          <Select name="lang" defaultValue="es" onChange={handleChange}>
            <Option value="es">Espanol</Option>
            <Option value="en">English</Option>
          </Select>
        </form>
      )
    
      const trigger = screen.getByRole("combobox")
      expect(trigger.textContent).toContain("Espanol")
    
      fireEvent.click(trigger)
    
      const optionEn = await screen.findByRole("option", { name: "English" })
      fireEvent.click(optionEn)
    
      expect(handleChange).toHaveBeenCalledWith("en")
    
      const formElement = container.querySelector('[name="lang"]') as HTMLSelectElement | HTMLInputElement

      expect(formElement.value).toBe("en")
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

  describe("OffCanvas", () => {
    it("toggles body overflow and closes on overlay click", () => {
      const onClose = vi.fn()

      const { rerender } = render(
        <OffCanvas isOpen={false} onClose={onClose} title="Panel">
          <div>Contenido</div>
        </OffCanvas>
      )

      expect(document.body.style.overflow).toBe("unset")

      rerender(
        <OffCanvas isOpen={true} onClose={onClose} title="Panel">
          <div>Contenido</div>
        </OffCanvas>
      )

      expect(document.body.style.overflow).toBe("hidden")
      expect(screen.getByText("Panel")).toBeTruthy()

      const overlay = Array.from(document.querySelectorAll("div")).find((el) =>
        (el.className || "").includes("bg-black")
      )

      expect(overlay).toBeTruthy()
      if (overlay) fireEvent.click(overlay)

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it("resets body overflow on unmount and closes with close button", () => {
      const onClose = vi.fn()

      const { rerender, unmount } = render(
        <OffCanvas isOpen={false} onClose={onClose} title="Panel">
          <div>Contenido</div>
        </OffCanvas>
      )

      // open it
      rerender(
        <OffCanvas isOpen={true} onClose={onClose} title="Panel">
          <div>Contenido</div>
        </OffCanvas>
      )

      expect(document.body.style.overflow).toBe("hidden")

      // close using close button inside aside
      const aside = document.querySelector("aside")
      const closeButton = aside?.querySelector("button") as HTMLButtonElement | null
      expect(closeButton).toBeTruthy()
      if (closeButton) fireEvent.click(closeButton)

      expect(onClose).toHaveBeenCalledTimes(1)

      // unmount should reset overflow
      unmount()
      expect(document.body.style.overflow).toBe("unset")
    })
  })

  describe("Breadcrumb", () => {
    it("renders items and separator icon", () => {
      const items = [
        { label: "Home", to: "/" },
        { label: "Guilds", to: "/guilds" },
      ]

      render(
        <MemoryRouter>
          <Breadcrumb items={items} />
        </MemoryRouter>
      )

      expect(screen.getByText("Home")).toBeTruthy()
      expect(screen.getByText("Guilds")).toBeTruthy()
      expect(document.querySelector("svg")).toBeTruthy()
    })

    it("single item does not render separator", () => {
      const items = [{ label: "Solo", to: "/" }]

      render(
        <MemoryRouter>
          <Breadcrumb items={items} />
        </MemoryRouter>
      )

      expect(screen.getByText("Solo")).toBeTruthy()
      // no separator svg when only one item
      const svgs = document.querySelectorAll("svg")
      expect(svgs.length).toBe(0)
    })
  })

  describe("Divider", () => {
    it("renders a full line when no text and shows text when provided", () => {
      const { rerender } = render(<Divider />)
      expect(document.querySelector(".bg-border")).toBeTruthy()

      rerender(<Divider text={<span>Separa</span>} />)
      expect(screen.getByText("Separa")).toBeTruthy()

      const borders = Array.from(document.querySelectorAll("div")).filter((d) =>
        (d.className || "").includes("bg-border")
      )
      expect(borders.length).toBeGreaterThanOrEqual(2)
    })

    it("handles null/undefined text and complex nodes", () => {
      const { rerender } = render(<Divider text={null as unknown as string} />)
      // should render a single border element when text is null
      let borders = Array.from(document.querySelectorAll("div")).filter((d) =>
        (d.className || "").includes("bg-border")
      )
      expect(borders.length).toBeGreaterThanOrEqual(1)

      // complex node
      rerender(
        <Divider text={<><span>Part1</span><strong>Part2</strong></>} />
      )

      expect(screen.getByText("Part1")).toBeTruthy()
      expect(screen.getByText("Part2")).toBeTruthy()
      borders = Array.from(document.querySelectorAll("div")).filter((d) =>
        (d.className || "").includes("bg-border")
      )
      expect(borders.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe("Dropdown", () => {
    it("renders trigger label fallback and calls onChange when option selected", async () => {
      const handle = vi.fn()
      const options = [
        { label: "One", value: "one" },
        { label: "Two", value: "two", triggerLabel: "Dos" },
      ] as const

      render(
        <Dropdown value={"one"} options={options as any} onChange={handle} />
      )

      // trigger button exists
      const trigger = screen.getByRole("button")
      expect(trigger).toBeTruthy()

      // open menu
      fireEvent.click(trigger)

      // wait for option to appear and click it
      const optionEl = await screen.findByText("Two")
      fireEvent.click(optionEl)

      expect(handle).toHaveBeenCalledWith("two")
    })

    it("handles empty options array without throwing", () => {
      const handle = vi.fn()
      render(<Dropdown value={"" as any} options={[] as any} onChange={handle} />)

      const trigger = screen.getByRole("button")
      expect(trigger).toBeTruthy()
      fireEvent.click(trigger)

      // nothing to select, but should not throw; ensure trigger still present
      expect(screen.getByRole("button")).toBeTruthy()
    })
  })
})
