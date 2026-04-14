import { useParams, useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar.jsx'
import styles from './DeviceDetail.module.css'

export default function DeviceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <TopBar title="Detalle del sensor" />
      <div className={styles.content}>
        <button className={styles.back} onClick={() => navigate('/devices')}>
          ← Volver a dispositivos
        </button>
        <div className={styles.coming}>
          <span className={styles.icon}>🚧</span>
          <h2>Próximamente</h2>
          <p>El detalle del sensor <strong>{id}</strong> estará disponible en la próxima versión.</p>
        </div>
      </div>
    </div>
  )
}
