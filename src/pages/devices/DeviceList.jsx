import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar.jsx'
import DeviceRow from '../../components/ui/DeviceRow.jsx'
// Cambiamos el import para usar la suscripción en tiempo real
import { subscribeToDevices } from '../../services/devicesService.js'
import styles from './DeviceList.module.css'

export default function DeviceList() {
  const navigate = useNavigate()
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Nos suscribimos a la base de datos
    // La función 'subscribeToDevices' nos devuelve una función para "desconectarnos" (unsubscribe)
    const unsubscribe = subscribeToDevices((data) => {
      setDevices(data)
      setLoading(false)
    })

    // Limpieza: Cuando el usuario se va de esta página, cerramos la conexión con Firebase
    return () => unsubscribe()
  }, [])

  // Cálculo dinámico basado en los datos reales de Firebase
  const onlineCount = devices.filter((d) => d.status === 'online').length

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Dispositivos</h1>
          <p className={styles.summary}>
            {loading 
              ? 'Cargando sensores...' 
              : `${onlineCount} de ${devices.length} sensores conectados`
            }
          </p>
        </div>
        <button className={styles.addBtn} onClick={() => alert('Próximamente: Registro de nuevos sensores')}>
          + Añadir dispositivo
        </button>
      </div>

      <div className={styles.listStack}>
        {loading ? (
          <div className={styles.loadingState}>Conectando con ElderSense...</div>
        ) : devices.length > 0 ? (
          devices.map((device) => (
            <DeviceRow key={device.id} device={device} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No tienes ningún dispositivo vinculado todavía.</p>
          </div>
        )}
      </div>
    </div>
  )
}