import React from 'react';
import styles from './Dashboard.module.css';
import { Activity, ShieldCheck, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resumen General</h1>
        <p className={styles.subtitle}>Estado actual del sistema ElderSense.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconContainer} ${styles.blue}`}>
            <Activity size={24} />
          </div>
          <div className={styles.statInfo}>
            <span>Estado</span>
            <p>Sistema Activo</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={`${styles.iconContainer} ${styles.green}`}>
            <ShieldCheck size={24} />
          </div>
          <div className={styles.statInfo}>
            <span>Seguridad</span>
            <p>Protección ON</p>
          </div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <TrendingUp size={20} />
            <h3>Actividad de las últimas 24h</h3>
          </div>
          <div className={styles.mockChart}>
            {/* Aquí es donde iría tu componente de Recharts */}
            <p>Gráfica de movimiento aquí</p>
          </div>
        </div>
      </div>
    </div>
  );
}