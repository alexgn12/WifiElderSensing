import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, AreaChart, Area
} from 'recharts';
import { Activity, Signal, AlertTriangle } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [devices, setDevices] = useState([]);

  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444'];

  useEffect(() => {
    const qAlerts = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(20));
    const unsubscribeAlerts = onSnapshot(qAlerts, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlerts(alertsData);
    });

    const unsubscribeDevices = onSnapshot(collection(db, 'devices'), (snapshot) => {
      const devicesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevices(devicesData);
    });

    return () => {
      unsubscribeAlerts();
      unsubscribeDevices();
    };
  }, []);

  // --- 1. NUEVA LÓGICA: Agrupar alertas por ubicación para la gráfica de líneas ---
  const activityData = alerts.reduce((acc, alert) => {
  // Convertimos el timestamp de Firebase a una fecha legible (ej: "22/4")
  const date = alert.timestamp?.toDate().toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit' 
  }) || 'S/D';

  const existing = acc.find(item => item.name === date);
  if (existing) {
    existing.cantidad += 1;
  } else {
    acc.push({ name: date, cantidad: 1 });
  }
  return acc;
}, []).sort((a, b) => a.name.localeCompare(b.name)); // Ordenar por fecha

  // Datos para la tarta (se mantiene igual)
  const alertStats = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.keys(alertStats).map(key => ({ name: key, value: alertStats[key] }));

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Panel de Control ElderSense</h1>
        <p className={styles.subtitle}>Estado actual de los dispositivos y alertas</p>
      </header>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconContainer} ${styles.blue}`}>
            <Activity size={24} />
          </div>
          <div className={styles.statInfo}>
            <span>Alertas Totales</span>
            <p>{alerts.length}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconContainer} ${styles.green}`}>
            <Signal size={24} />
          </div>
          <div className={styles.statInfo}>
            <span>Dispositivos Online</span>
            <p>{devices.length}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsWrapper}>
        
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <Activity size={20} />
            <h3>Histórico de Actividad por Zona</h3>
          </div>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="100%" height={300}>
              {/* --- 2. CAMBIO AQUÍ: Usamos activityData y cantidad --- */}
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} /> 
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cantidad" 
                  stroke="#3b82f6" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#3b82f6' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <AlertTriangle size={20} />
            <h3>Distribución de Alertas</h3>
          </div>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard} style={{ gridColumn: '1 / -1' }}>
          <div className={styles.chartHeader}>
            <Signal size={20} />
            <h3>Calidad de Conexión WiFi (%)</h3>
          </div>
          <div className={styles.chartContent}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={devices}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="signal" fill="#22c55e" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;