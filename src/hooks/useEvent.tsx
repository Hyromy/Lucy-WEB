import { useEffect } from "react"

import { API_URL } from "../constants/config"

import type { RedisPayload } from "../types/api"

export default function useEvent<T = unknown>(callback: (data: RedisPayload & T) => void) {
  useEffect(() => {
    const eventSource = new EventSource(`${API_URL}api/events/`)
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.status == "connected" || data.source == "web") {
          return
        }

        callback(data)
      } catch (err) {
        console.error("Error parsing event data:", err)
      }
    }

    eventSource.onerror = (err) => {
      console.error("EventSource error:", err)
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [callback])
}
