export const variants = {
  primary: "bg-primary text-primary-fg hover:brightness-110",
  secondary: "bg-card text-foreground border border-border hover:bg-bg",
  outline: "border border-primary text-primary hover:bg-primary/10",
  ghost: "text-muted hover:text-foreground hover:bg-bg",
} as const

export const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base"
} as const
