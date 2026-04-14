import styles from './AlertRow.module.css'
import Badge from './Badge.jsx'

function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  const mins = Math.floor(diff / 60000)
  if (days > 0) return `hace ${days}d`
  if (hours > 0) return `hace ${hours}h`
  return `hace ${mins}m`
}

const TYPE_ICONS = {
  fall: '⚠️',
  inactivity: '🔕',
  offline: '📵',
}

export default function AlertRow({ alert, onClick }) {
  const icon = TYPE_ICONS[alert.type] ?? '🔔'
  const severityClass = styles[alert.severity] ?? ''

  return (
    <div
      className={`${styles.row} ${!alert.read ? styles.unread : ''}`}
      onClick={() => onClick?.(alert.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(alert.id)}
    >
      <span className={`${styles.icon} ${severityClass}`}>{icon}</span>
      <div className={styles.content}>
        <p className={styles.message}>{alert.message}</p>
        <p className={styles.device}>{alert.device}</p>
      </div>
      <div className={styles.meta}>
        <span className={styles.time}>{timeAgo(alert.sentAt)}</span>
        {!alert.read && <Badge label="Nueva" variant="warning" />}
      </div>
    </div>
  )
}
