import type { ReactNode } from "react"
import { Button } from "./Button"
import useLanguage from "../hooks/useLanguage"

type StateContainerProps = {
  title: string
  message?: string
  action?: ReactNode
}
function StateContainer({
  title,
  message,
  action
}: StateContainerProps) {
  return (
    <div className="flex flex-1 h-full flex-col justify-center items-center text-center">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {message && <p className="mt-2 text-muted">{message}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}

type LoadingStateProps = {
  title?: string
  message?: string
}
export function LoadingState({
  title,
  message,
}: LoadingStateProps) {
  const { t } = useLanguage()

  return (
    <StateContainer
      title={title || t("state.loading.title")}
      message={message || t("state.loading.message")}
      action={
        <span
          aria-label="loading"
          className="h-8 w-8 animate-spin rounded-full border-4 border-transparent border-t-primary"
        />
      }
    />
  )
}

type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
}
export function ErrorState({
  title = "Something went wrong",
  message = "Could not load data.",
  onRetry,
  retryLabel = "Retry"
}: ErrorStateProps) {
  return (
    <StateContainer
      title={title}
      message={message}
      action={onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
    />
  )
}

type EmptyStateProps = {
  title?: string
  message?: string
  action?: ReactNode
}
export function EmptyState({
  title,
  message,
  action
}: EmptyStateProps) {
  const { t } = useLanguage()

  return (
    <StateContainer
      title={title || t("state.empty.title")}
      message={message || t("state.empty.message")}
      action={action}
    />
  )
}

export type StateGateProps = {
  loading: boolean
  error: Error | null
  data: unknown | null
  children?: ReactNode
  isEmpty?: boolean
  onRetry?: () => void

  loadingProps?: LoadingStateProps
  errorProps?: ErrorStateProps
  emptyProps?: EmptyStateProps
}
export function StateGate({
  loading,
  error,
  data,
  children,
  isEmpty = false,
  onRetry,
  loadingProps,
  errorProps,
  emptyProps
}: StateGateProps) {
  if (loading) {
    return (
      <LoadingState {...loadingProps} />
    )
  }

  if (error) {
    return (
      <ErrorState
        message={error.message}
        onRetry={onRetry}
        {...errorProps}
      />
    )
  }

  if (data && isEmpty) {
    return (
      <EmptyState {...emptyProps} />
    )
  }

  if (!data) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}
