import { useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/"

export default function useEvent(callback: (data: any) => void) {
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
