import { useOutletContext } from "react-router-dom"
import type { GuildResponse } from "../../types/api"
import useApi from "../../hooks/useApi"
import { useEffect, useMemo } from "react"
import { guildService, langService } from "../../services/lucy"

export default function Config() {
  const { 
    data: dataContext,
    loading: loadingContext,
    error: errorContext
  } = useOutletContext<{
    data: GuildResponse | null
    loading: boolean
    error: any
  }>()
  const {
    data: dataApi,
    error: errorApi,
    loading: loadingApi,
    request
  } = useApi()

  useEffect(() => {
    request(
      guildService.get(dataContext?.id),
      langService.get(),
    )
  }, [])

  useEffect(() => {
    if (errorApi) {
      console.error("Error API:", errorApi)
    }
  }, [errorApi])

  const mergedData = useMemo(() => {
    if (dataContext && dataApi) {
      return {
        ...dataApi[0][0],
        ...dataContext,
      }
    }
  }, [dataContext, dataApi])

  return (
    <>
      <h1>Config</h1>
      <pre>{JSON.stringify(mergedData, null, 4)}</pre>
    </>
  )
}
