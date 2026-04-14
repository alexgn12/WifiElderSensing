import styles from './Badge.module.css'

const variantMap = {
  online: 'success',
  offline: 'danger',
  warning: 'warning',
  danger: 'danger',
  info: 'info',
  ok: 'success',
  read: 'neutral',
  unread: 'warning',
}

export default function Badge({ label, variant }) {
  const resolved = variant ?? variantMap[label?.toLowerCase()] ?? 'neutral'
  return (
    <span className={`${styles.badge} ${styles[resolved]}`}>
      {label}
    </span>
  )
}
