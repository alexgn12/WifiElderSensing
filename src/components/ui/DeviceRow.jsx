import styles from './DeviceRow.module.css'
import Badge from './Badge.jsx'

function formatLastSeen(date) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora mismo'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  return `hace ${hours}h`
}

function SignalBar({ value }) {
  const color = value >= 70 ? 'var(--color-primary)' : value >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-gray-600)' }}>
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
        <rect x="0"  y="10" width="3" height="4" rx="1" fill={value >= 20 ? color : 'var(--color-gray-200)'} />
        <rect x="5"  y="7"  width="3" height="7" rx="1" fill={value >= 40 ? color : 'var(--color-gray-200)'} />
        <rect x="10" y="4"  width="3" height="10" rx="1" fill={value >= 60 ? color : 'var(--color-gray-200)'} />
        <rect x="15" y="0"  width="3" height="14" rx="1" fill={value >= 80 ? color : 'var(--color-gray-200)'} />
      </svg>
      {value}%
    </span>
  )
}

export default function DeviceRow({ device, onClick }) {
  return (
    <div
      className={styles.row}
      onClick={() => onClick?.(device.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(device.id)}
    >
      <span className={styles.roomIcon}>📡</span>
      <div className={styles.info}>
        <p className={styles.name}>{device.name}</p>
        <p className={styles.room}>{device.room}</p>
      </div>
      <div className={styles.stats}>
        <SignalBar value={device.signal} />
        <span className={styles.lastSeen}>{formatLastSeen(device.lastSeen)}</span>
      </div>
      <Badge label={device.status === 'online' ? 'Online' : 'Offline'} variant={device.status === 'online' ? 'success' : 'danger'} />
      <span className={styles.arrow}>›</span>
    </div>
  )
}
