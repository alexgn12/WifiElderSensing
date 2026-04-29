import styles from './DeviceRow.module.css'
import Badge from './Badge.jsx'

function formatLastSeen(lastActivation) {
  // --- FIX PARA FIREBASE ---
  // Si es un Timestamp de Firebase, lo convertimos a fecha de JS con .toDate()
  // Si no existe o falla, devolvemos un texto neutro
  if (!lastActivation) return 'Sin datos';
  
  const date = lastActivation.toDate ? lastActivation.toDate() : new Date(lastActivation);
  const diff = Date.now() - date.getTime();
  
  if (isNaN(diff)) return 'Fecha inválida'; // Seguridad extra contra el NaNh

  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Ahora mismo'
  if (mins < 60) return `hace ${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

function SignalBar({ value }) {
  // Si el valor no viene en Firebase, ponemos 0 para que no rompa el SVG
  const val = value || 0;
  const color = val >= 70 ? 'var(--color-primary)' : val >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'
  
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-gray-600)' }}>
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
        <rect x="0"  y="10" width="3" height="4" rx="1" fill={val >= 20 ? color : 'var(--color-gray-200)'} />
        <rect x="5"  y="7"  width="3" height="7" rx="1" fill={val >= 40 ? color : 'var(--color-gray-200)'} />
        <rect x="10" y="4"  width="3" height="10" rx="1" fill={val >= 60 ? color : 'var(--color-gray-200)'} />
        <rect x="15" y="0"  width="3" height="14" rx="1" fill={val >= 80 ? color : 'var(--color-gray-200)'} />
      </svg>
      {val}%
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
        <p className={styles.name}>{device.name || 'Sensor'}</p>
        {/* En tu Firebase usas 'deviceId' o puedes usar 'room' si lo añades */}
        <p className={styles.room}>{device.room || device.deviceId}</p>
      </div>
      <div className={styles.stats}>
        {/* Cambiamos device.signal por device.signal || 0 (o el campo que uses) */}
        <SignalBar value={device.signal} />
        {/* IMPORTANTE: Usamos lastActivation que es como se llama en tu Firebase */}
        <span className={styles.lastSeen}>{formatLastSeen(device.lastActivation)}</span>
      </div>
      <Badge 
        label={device.status === 'online' ? 'Online' : 'Offline'} 
        variant={device.status === 'online' ? 'success' : 'danger'} 
      />
      <span className={styles.arrow}>›</span>
    </div>
  )
}