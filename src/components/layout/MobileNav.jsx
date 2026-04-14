import { NavLink } from 'react-router-dom'
import { useAlerts } from '../../hooks/useAlerts.js'
import styles from './MobileNav.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/devices',   icon: '📡', label: 'Sensores' },
  { to: '/alerts',    icon: '🔔', label: 'Alertas' },
]

export default function MobileNav() {
  const { unreadCount } = useAlerts()

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>
            {icon}
            {label === 'Alertas' && unreadCount > 0 && (
              <span className={styles.dot}>{unreadCount}</span>
            )}
          </span>
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
