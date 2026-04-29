import { useContext } from 'react'
import { AlertsContext } from '../context/AlertsContext.jsx'

export function useAlerts() {
  return useContext(AlertsContext)
}