import { type ReactNode } from "react"

type DividerProps = {
  text?: ReactNode
}
export function Divider({
  text
}: DividerProps) {
  const content = text
    ? (
      <>
        <div className="h-px flex-1 bg-border" />
        {text}
        <div className="h-px flex-1 bg-border" />
      </>
    )
    : <div className="h-px w-full bg-border" />

  return (
    <div className="flex items-center gap-4">
      {content}
    </div>
  )
}
