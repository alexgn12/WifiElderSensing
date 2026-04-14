import { createContext, useState, useEffect } from 'react'
import { getAlerts } from '../services/alertsService.js'

export const AlertsContext = createContext(null)

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAlerts().then((data) => {
      setAlerts(data)
      setLoading(false)
    })
  }, [])

  function markRead(id) {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    )
  }

  const unreadCount = alerts.filter((a) => !a.read).length

  return (
    <AlertsContext.Provider value={{ alerts, loading, markRead, unreadCount }}>
      {children}
    </AlertsContext.Provider>
  )
}
