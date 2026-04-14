import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar.jsx'
import DeviceRow from '../../components/ui/DeviceRow.jsx'
import { getDevices } from '../../services/devicesService.js'
import styles from './DeviceList.module.css'

export default function DeviceList() {
  const navigate = useNavigate()
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDevices().then((data) => {
      setDevices(data)
      setLoading(false)
    })
  }, [])

  const onlineCount = devices.filter((d) => d.status === 'online').length

  return (
    <div className={styles.page}>
      <TopBar title="Dispositivos" />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.summary}>
              {onlineCount} de {devices.length} sensores conectados
            </p>
          </div>
          <button className={styles.addBtn} onClick={() => alert('Próximamente: añadir dispositivo')}>
            + Añadir dispositivo
          </button>
        </div>

        {loading ? (
          <p className={styles.loading}>Cargando dispositivos…</p>
        ) : (
          <div className={styles.listStack}>
            {devices.map((device) => (
              <DeviceRow
                key={device.id}
                device={device}
                onClick={(id) => navigate(`/devices/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
