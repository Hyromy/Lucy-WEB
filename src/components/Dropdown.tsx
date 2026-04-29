import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { type ReactNode } from "react"
import { ChevronDown } from "lucide-react"

export type DropdownOption<T extends string> = {
  label: ReactNode
  triggerLabel?: ReactNode
  value: T
}

export type DropdownProps<T extends string> = {
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  prefix?: ReactNode
  className?: string
}

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  prefix,
  className = "",
}: DropdownProps<T>) {
  const currentOption = options.find((option) => option.value == value)
  const displayLabel = currentOption?.triggerLabel ?? currentOption?.label

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={`
            inline-flex items-center gap-2 rounded-lg border border-border
            px-3 py-2 text-sm font-medium ${className}
          `}
        >
          <span className="flex items-center gap-2">
            {prefix} {displayLabel}
          </span>

          <ChevronDown size={12} className="text-muted transition-transform" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          className="z-50 min-w-44 rounded-xl border border-border bg-card p-1 shadow-lg"
        >
          {options.map((option) => {
            const selected = option.value == value

            return (
              <DropdownMenu.Item
                key={option.value}
                onSelect={() => onChange(option.value)}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm outline-none transition ${
                  selected
                    ? "bg-primary text-primary-fg"
                    : "hover:bg-bg"
                }`}
              >
                {option.label}
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
