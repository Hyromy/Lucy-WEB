import { useOutletContext } from "react-router-dom"
import type { GuildResponse } from "../../types/api"

export default function Info() {
  const { data, loading, error } = useOutletContext<{
    data: GuildResponse | null
    loading: boolean
    error: any
  }>()

  if (loading) return <p>Loading</p>
  if (error) return <p>Something went wrong</p>

  return (
    <pre>
      {JSON.stringify(data, null, 4)}
    </pre>
  )
}
