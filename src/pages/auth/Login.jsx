import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>📶</span>
          <h1 className={styles.brandName}>ElderSense</h1>
        </div>
        <p className={styles.tagline}>Monitorización inteligente para tu familiar</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              className={styles.input}
              defaultValue="maria@example.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={styles.input}
              defaultValue="password"
              required
            />
          </div>
          <button type="submit" className={styles.btn}>
            Entrar
          </button>
        </form>

        <p className={styles.hint}>
          Demo: usa cualquier credencial para acceder al panel mock
        </p>
      </div>
    </div>
  )
}
