import { useAuth } from '../../hooks/useAuth.js'
import Badge from '../ui/Badge.jsx'
import styles from './TopBar.module.css'

export default function TopBar({ title }) {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(' ')[0] ?? 'Usuario'

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {!title && <p className={styles.greeting}>Hola, <strong>{firstName}</strong> 👋</p>}
      </div>
      <div className={styles.right}>
        <Badge label="Sistema activo" variant="success" />
        <div className={styles.avatar} title={user?.displayName}>
          {firstName[0]}
        </div>
      </div>
    </header>
  )
}
