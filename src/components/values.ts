export const variants = {
  primary: "bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] hover:brightness-110",
  secondary: "bg-[rgb(var(--card))] text-[rgb(var(--fg))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--bg))]",
  outline: "border border-[rgb(var(--primary))] text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/10",
  ghost: "text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--bg))]"
} as const

export const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base"
} as const
