import { useOutletContext } from "react-router-dom"
import type { GuildResponse } from "../../types/api"

export default function Info() {
  const { data, loading, error } = useOutletContext<{
    data: GuildResponse | null
    loading: boolean
    error: Error | null
  }>()

  if (loading) return <p>Loading</p>
  if (error) return <p>{error.message}</p>
  if (!data) return <p>No data</p>

  return (
    <pre>
      {JSON.stringify(data, null, 4)}
    </pre>
  )
}
