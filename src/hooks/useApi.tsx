import { useEffect, useRef, useState, useCallback } from "react"

const SHOULD_ABORT_ON_UNMOUNT = import.meta.env.PROD
const SHOULD_ABORT_PREVIOUS_REQUEST = import.meta.env.PROD

type ApiData = Record<string, unknown> | unknown[] | string | number | boolean | null

type RequestResult<TResults extends unknown[]> =
  TResults extends [Promise<infer TSingle>]
    ? TSingle
    : TResults extends [infer TSingle]
      ? TSingle
      : { [K in keyof TResults]: TResults[K] extends Promise<infer U> ? U : TResults[K] }

type RequestSource<T> = Promise<T> | ((signal: AbortSignal) => Promise<T>)

export default function useApi<T = ApiData>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const activeRequestId = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      if (SHOULD_ABORT_ON_UNMOUNT) {
        controllerRef.current?.abort()
      }
    }
  }, [])

  const parseError = (err: unknown): Error => {
    if (err instanceof Error) return err
    return new Error("Unknown error occurred")
  }

  const request = useCallback(async <TResults extends unknown[]>(
    ...apiCalls: { [K in keyof TResults]: RequestSource<TResults[K]> }
  ): Promise<RequestResult<TResults> | null> => {
    const requestId = activeRequestId.current + 1
    activeRequestId.current = requestId

    if (SHOULD_ABORT_PREVIOUS_REQUEST) {
      controllerRef.current?.abort()
    }
    const controller = new AbortController()
    controllerRef.current = controller

    if (!isMountedRef.current) {
      return null
    }

    setLoading(true)
    setError(null)

    try {
      if (apiCalls.length == 0) {
        if (isMountedRef.current && activeRequestId.current == requestId) {
          setData(null)
        }
        return null
      }

      const results = await Promise.all(
        apiCalls.map((apiCall) => (
          typeof apiCall == "function"
            ? apiCall(controller.signal)
            : apiCall
        ))
      )
      const response = (
        results.length == 1
          ? results[0]
          : results
      ) as unknown as T

      if (isMountedRef.current && activeRequestId.current == requestId) {
        setData(response)
      }
      return response as unknown as RequestResult<TResults>
    
    } catch (err) {
      if (controller.signal.aborted) {
        return null
      }

      if (isMountedRef.current && activeRequestId.current == requestId) {
        setData(null)
        setError(parseError(err))
      }
      return null
    
    } finally {
      if (isMountedRef.current && activeRequestId.current == requestId) {
        setLoading(false)
      }
    }
  }, [])

  return {
    data,
    error,
    loading,
    request,
    setData,
  }
}
