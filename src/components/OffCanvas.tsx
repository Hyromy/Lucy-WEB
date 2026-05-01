import { type ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"

type OffCanvasProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  position?: "l" | "r"
}
export function OffCanvas({
  isOpen,
  onClose,
  title,
  children,
  position = "l"
}: OffCanvasProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => { document.body.style.overflow = "unset" }
  }, [isOpen])

  const positions = {
    l: isOpen ? "translate-x-0" : "-translate-x-full",
    r: isOpen ? "translate-x-0" : "translate-x-full",
  }
  const sideClass = position == "l" ? "left-0" : "right-0"

  return createPortal(
    <>
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-60 transition-opacity duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={onClose}
      />
      <aside
        className={`
          fixed top-0 ${sideClass} h-full w-full max-w-xs bg-bg shadow-2xl z-70 transform transition-transform
          duration-300 ease-in-out ${positions[position]}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
            onClick={onClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </aside>
    </>,
    document.body
  )
}
