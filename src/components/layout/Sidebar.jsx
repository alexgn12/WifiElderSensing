import { NavLink } from 'react-router-dom'
import { useAlerts } from '../../hooks/useAlerts.js'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/devices',   icon: '📡', label: 'Dispositivos' },
  { to: '/alerts',    icon: '🔔', label: 'Alertas' },
]

export default function Sidebar() {
  const { unreadCount } = useAlerts()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>📶</span>
        <span className={styles.brandName}>ElderSense</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.linkIcon}>{icon}</span>
            <span className={styles.linkLabel}>{label}</span>
            {label === 'Alertas' && unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className={styles.footer}>
        <span className={styles.version}>v0.1.0 — Mock</span>
      </div>
    </aside>
  )
}
