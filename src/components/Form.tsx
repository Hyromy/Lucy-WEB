import { type ReactNode, type FormEvent, type ReactElement } from "react"

type FormProps = {
  children: ReactNode
  onSubmit: (data: any) => void
}

export function Form({ children, onSubmit }: FormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      data[key] = value
    })
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
