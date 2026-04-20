import { type ButtonHTMLAttributes, type ReactNode } from "react"
import type { sizes, variants as typesVariants } from "../types/components"
import { sizes as valueSizes, variants as valuesVariants } from "./values"

type ButtonTypes = "button" | "submit" | "reset"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: typesVariants
  size?: sizes
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  isLoading?: boolean
  type?: ButtonTypes
}
export function Button({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all " +
    "active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"

  return (
    <button
      className={`${baseStyles} ${valuesVariants[variant]} ${valueSizes[size]} ${className}`}
      disabled={isLoading || disabled}
      type={type}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        leftIcon
      )}
      
      {children}
      
      {!isLoading && rightIcon}
    </button>
  )
}
