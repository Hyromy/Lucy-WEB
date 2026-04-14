import { useState, useCallback } from "react"
import { ApiError } from "../services/api"

type ApiData = any

type RequestResult<TResults extends unknown[]> =
  TResults extends [Promise<infer TSingle>]
    ? TSingle
    : TResults extends [infer TSingle]
      ? TSingle
      : { [K in keyof TResults]: TResults[K] extends Promise<infer U> ? U : TResults[K] }

export default function useApi<T = ApiData>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseErrorMessage = (err: unknown) => {
    if (err instanceof ApiError) return `API error: ${err.message}`
    if (err instanceof Error) return `useApi error: ${err.message}`
    return "useApi error: Unknown error occurred"
  }

  const request = useCallback(async <TResults extends unknown[]>(
    ...apiCalls: { [K in keyof TResults]: Promise<TResults[K]> }
  ): Promise<RequestResult<TResults> | null> => {
    setLoading(true)
    setError(null)

    try {
      if (apiCalls.length == 0) {
        setData(null)
        return null
      }

      const results = await Promise.all(apiCalls)
      const response = (
        results.length == 1
          ? results[0]
          : results
      ) as unknown as T

      setData(response)
      return response as unknown as RequestResult<TResults>
    
    } catch (err) {
      setData(null)
      setError(parseErrorMessage(err))
      return null
    
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    data,
    error,
    loading,
    request,
  }
}
