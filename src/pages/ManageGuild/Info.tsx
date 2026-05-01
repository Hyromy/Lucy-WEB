import { useOutletContext } from "react-router-dom"
import type { GuildResponse } from "../../types/api"
import { StateGate } from "../../components/State"

export default function Info() {
  const { data, loading, error } = useOutletContext<{
    data: GuildResponse | null
    loading: boolean
    error: Error | null
  }>()

  return (
    <StateGate
      data={data}
      error={error}
      loading={loading}
    >
      <pre>
        {JSON.stringify(data, null, 4)}
      </pre>
    </StateGate>
  )
}
