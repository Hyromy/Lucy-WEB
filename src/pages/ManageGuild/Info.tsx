import { useOutletContext } from "react-router-dom"
import type { GuildResponse } from "../../types/api"

export default function Info() {
  const { data, loading, error } = useOutletContext<{
    data: GuildResponse | null
    loading: boolean
    error: any
  }>()

  if (loading) return <p>Cargando info de la guild...</p>
  if (error) return <p>Error al cargar la guild</p>

  return (
    <>
      <h1>Info de {data?.name}</h1>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </>
  )
}
