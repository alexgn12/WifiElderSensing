import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar.jsx'
import MetricCard from '../../components/ui/MetricCard.jsx'
import ActivityBar from '../../components/charts/ActivityBar.jsx'
import DeviceRow from '../../components/ui/DeviceRow.jsx'
import AlertRow from '../../components/ui/AlertRow.jsx'
import { useEvents } from '../../hooks/useEvents.js'
import { useAlerts } from '../../hooks/useAlerts.js'
import { getDevices } from '../../services/devicesService.js'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { hourlyActivity, loading: eventsLoading } = useEvents()
  const { alerts, markRead } = useAlerts()
  const [devices, setDevices] = useState([])

  useEffect(() => {
    getDevices().then(setDevices)
  }, [])

  const onlineDevices = devices.filter((d) => d.status === 'online').length
  const todayAlerts = alerts.filter((a) => {
    const d = new Date(a.sentAt)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  }).length
  const unreadAlerts = alerts.filter((a) => !a.read).length
  const recentAlerts = [...alerts].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)).slice(0, 2)

  // Last motion: look for highest hour with activity before current hour
  const currentHour = new Date().getHours()
  const lastMotionHour = [...hourlyActivity]
    .reverse()
    .find((h) => h.hour <= currentHour && h.count > 0)
  const lastMotionLabel = lastMotionHour ? `${lastMotionHour.hour}:00 h` : 'Sin datos'

  return (
    <div className={styles.page}>
      <TopBar />

      <div className={styles.content}>
        {/* Metric cards */}
        <section className={styles.metricsGrid}>
          <MetricCard
            icon="🟢"
            label="Estado actual"
            value="Normal"
            sub="Actividad detectada"
            accent="success"
          />
          <MetricCard
            icon="🔔"
            label="Alertas hoy"
            value={todayAlerts}
            sub={unreadAlerts > 0 ? `${unreadAlerts} sin leer` : 'Todas leídas'}
            accent={unreadAlerts > 0 ? 'warning' : 'success'}
          />
          <MetricCard
            icon="🕐"
            label="Último movimiento"
            value={lastMotionLabel}
            sub="Hoy"
            accent="info"
          />
          <MetricCard
            icon="📡"
            label="Dispositivos online"
            value={`${onlineDevices}/${devices.length}`}
            sub="Conectados"
            accent={onlineDevices === devices.length ? 'success' : 'warning'}
          />
        </section>

        {/* Activity chart */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Actividad hoy</h2>
            <span className={styles.sectionSub}>Movimientos detectados por hora</span>
          </div>
          {eventsLoading ? (
            <div className={styles.placeholder}>Cargando gráfica…</div>
          ) : (
            <div className={styles.card}>
              <ActivityBar data={hourlyActivity} />
            </div>
          )}
        </section>

        <div className={styles.twoCol}>
          {/* Devices */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Dispositivos</h2>
              <button
                className={styles.linkBtn}
                onClick={() => navigate('/devices')}
              >
                Ver todos →
              </button>
            </div>
            <div className={styles.listStack}>
              {devices.map((device) => (
                <DeviceRow
                  key={device.id}
                  device={device}
                  onClick={(id) => navigate(`/devices/${id}`)}
                />
              ))}
            </div>
          </section>

          {/* Recent alerts */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Últimas alertas</h2>
              <button
                className={styles.linkBtn}
                onClick={() => navigate('/alerts')}
              >
                Ver todas →
              </button>
            </div>
            <div className={styles.listStack}>
              {recentAlerts.length === 0 && (
                <p className={styles.empty}>Sin alertas recientes</p>
              )}
              {recentAlerts.map((alert) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  onClick={markRead}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
