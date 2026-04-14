import { useState, useEffect } from 'react'
import { subscribeHourlyActivity } from '../services/eventsService.js'

// Simulates onSnapshot with mock data
export function useEvents() {
  const [hourlyActivity, setHourlyActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeHourlyActivity((data) => {
      setHourlyActivity(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { hourlyActivity, loading }
}
