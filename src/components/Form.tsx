import { type ReactNode, type FormEvent, type ReactElement } from "react"

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
  children: ReactElement<OptionProps> | ReactElement<OptionProps>[]
  id?: string
  disabled?: boolean
  defaultValue?: string
  onChange?: (value: string) => void
}

export function Select({
  name,
  id,
  disabled,
  children,
  defaultValue,
  onChange,
}: SelectProps) {
  return (
    <select
      name={name}
      id={id}
      disabled={disabled}
      defaultValue={defaultValue}
      onChange={(e) => onChange && onChange(e.target.value)}
    >
      {children}
    </select>
  )
}

export type OptionProps = {
  value: string
  children: ReactNode
  selected?: boolean
  disabled?: boolean
}

export function Option({
  value,
  children,
  disabled,
}: OptionProps) {
  return (
    <option
      value={value}
      disabled={disabled}
    >
      {children}
    </option>
  )
}
