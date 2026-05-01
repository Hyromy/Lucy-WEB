import { type ReactNode, type FormEvent } from "react"
import * as RadixSelect from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"

type FormProps<T> = {
  children: ReactNode
  onSubmit: (data: T) => void
}

export function Form<T extends Record<string, unknown>>({ children, onSubmit }: FormProps<T>) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as unknown as T
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export type SelectProps = {
  name: string
  children: ReactNode
  defaultValue?: string
  onChange?: (value: string) => void
  disabled?: boolean
}
export function Select({
  name,
  children,
  defaultValue,
  onChange,
  disabled
}: SelectProps) {
  return (
    <RadixSelect.Root
      name={name}
      defaultValue={defaultValue}
      onValueChange={onChange}
      disabled={disabled}
    >
      <RadixSelect.Trigger
        disabled={disabled}
        className="
          flex h-10 w-full items-center justify-between rounded-md border border-border
          bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1
          focus:ring-primary disabled:opacity-50 transition-colors
        "
      >
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content 
          className="
            z-100 relative min-w-(--radix-select-trigger-width) overflow-hidden rounded-md border border-border
            bg-card shadow-xl animate-in fade-in-0 zoom-in-95
          "
        >
          <RadixSelect.Viewport className="p-1">
            {children}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

type OptionProps = {
  value: string
  children: ReactNode
  disabled?: boolean
}
export function Option({
  value,
  children,
  disabled
}: OptionProps) {
  return (
    <RadixSelect.Item
      value={value}
      disabled={disabled}
      className="
        relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm
        text-foreground outline-none focus:bg-primary focus:text-primary-fg
        data-disabled:pointer-events-none data-disabled:opacity-50 transition-colors
      "
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <RadixSelect.ItemIndicator>
          <Check className="h-4 w-4" />
        </RadixSelect.ItemIndicator>
      </span>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  )
}
