import { NavLink } from 'react-router-dom'
import { useAlerts } from '../../hooks/useAlerts.js'
import { X } from 'lucide-react' // Importamos la X de cierre
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/devices',   icon: '📡', label: 'Dispositivos' },
  { to: '/alerts',    icon: '🔔', label: 'Alertas' },
]

export default function Sidebar({ isOpen, toggleSidebar }) {
  const { unreadCount } = useAlerts()

  return (
    // Si isOpen es false, se añade la clase styles.closed
    <aside className={`${styles.sidebar} ${!isOpen ? styles.closed : ''}`}>
      <div className={styles.brand}>
        <div className={styles.brandMain}>
          <span className={styles.brandIcon}>📶</span>
          <span className={styles.brandName}>ElderSense</span>
        </div>
        
        {/* Botón de cerrar que solo se verá en el Sidebar */}
        <button className={styles.closeBtn} onClick={toggleSidebar}>
          <X size={20} />
        </button>
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