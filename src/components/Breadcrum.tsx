import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import clsx from "clsx"

export type BreadcrumbItem = {
  label: string
  to: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}
export function Breadcrumb({
  items,
  className,
}: BreadcrumbProps) {
  return (
    <nav className={clsx("flex items-center space-x-2 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => {
        const isLast = index == items.length - 1

        return (
          <span key={index} className="flex items-center m-0">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 shrink-0" />
            )}
            <Link
              to={item.to}
              className={
                clsx(
                  "flex items-center gap-1 hover:text-fg hover:saturate-200",
                  !isLast ? "text-muted" : "text-fg",
                )
              }
            >
              <span>{item.label}</span>
            </Link>
          </span>
        )
      })}
    </nav>
  )
}
