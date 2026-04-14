import { useState } from 'react'
import TopBar from '../../components/layout/TopBar.jsx'
import AlertRow from '../../components/ui/AlertRow.jsx'
import { useAlerts } from '../../hooks/useAlerts.js'
import styles from './AlertInbox.module.css'

const TABS = [
  { key: 'all',      label: 'Todas' },
  { key: 'unread',   label: 'Sin leer' },
  { key: 'fall',     label: 'Caídas' },
]

export default function AlertInbox() {
  const { alerts, markRead, unreadCount } = useAlerts()
  const [activeTab, setActiveTab] = useState('all')

  const filtered = [...alerts]
    .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
    .filter((a) => {
      if (activeTab === 'unread') return !a.read
      if (activeTab === 'fall')   return a.type === 'fall'
      return true
    })

  function handleAlertClick(id) {
    markRead(id)
  }

  return (
    <div className={styles.page}>
      <TopBar title="Bandeja de alertas" />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <p className={styles.summary}>
            {unreadCount > 0
              ? `${unreadCount} alerta${unreadCount > 1 ? 's' : ''} sin leer`
              : 'Todas las alertas leídas'}
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(({ key, label }) => {
            const count = key === 'unread'
              ? alerts.filter((a) => !a.read).length
              : key === 'fall'
              ? alerts.filter((a) => a.type === 'fall').length
              : alerts.length

            return (
              <button
                key={key}
                className={`${styles.tab} ${activeTab === key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
                {count > 0 && (
                  <span className={styles.tabCount}>{count}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Alert list */}
        <div className={styles.listStack}>
          {filtered.length === 0 && (
            <div className={styles.empty}>
              <span>🎉</span>
              <p>No hay alertas en esta sección</p>
            </div>
          )}
          {filtered.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              onClick={handleAlertClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
