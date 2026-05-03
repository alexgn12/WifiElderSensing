import React, { useState, useEffect } from 'react';
import styles from './AlertInbox.module.css';
// Añadimos Trash2 a la lista de iconos
import { Bell, ShieldAlert, History, Trash2 } from 'lucide-react'; 
import { db } from '../../config/firebase'; 
// Añadimos doc y deleteDoc para poder borrar
import { collection, onSnapshot, query, doc, deleteDoc } from 'firebase/firestore';

export default function AlertInbox() {
  const [activeTab, setActiveTab] = useState('caidas');
  const [alerts, setAlerts] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- FUNCIÓN PARA BORRAR LA ALERTA ---
  const handleDeleteAlert = async (alertId) => {
    // Confirmación rápida
    if (window.confirm("¿Deseas eliminar esta alerta? El familiar ya habrá verificado el estado.")) {
      try {
        const alertRef = doc(db, "alerts", alertId);
        await deleteDoc(alertRef);
        console.log("Alerta borrada de Firebase");
      } catch (error) {
        console.error("Error al borrar:", error);
      }
    }
  };

  useEffect(() => {
    console.log("Conectando con la colección 'alerts'...");
    const q = query(collection(db, "alerts")); 

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log("Datos recibidos de Firebase:", data);
      setAlerts(data);
      setLoading(false);
    }, (error) => {
      console.error("Error en Firebase:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Centro de Alertas</h1>
        <p className={styles.subtitle}>Historial de incidencias detectadas por el sistema.</p>
      </header>

      <div className={styles.tabsGrid}>
        <button 
          className={`${styles.tabCard} ${activeTab === 'caidas' ? styles.active : ''}`}
          onClick={() => setActiveTab('caidas')}
        >
          <ShieldAlert size={20} />
          <span>Caídas</span>
          <span className={styles.countBadge}>{alerts.length}</span>
        </button>
        
        <button 
          className={`${styles.tabCard} ${activeTab === 'desconexiones' ? styles.active : ''}`}
          onClick={() => setActiveTab('desconexiones')}
        >
          <History size={20} />
          <span>Desconexiones</span>
        </button>
      </div>

      <div className={styles.listSection}>
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <Bell size={20} />
            <h3>Alertas Recientes</h3>
          </div>
          
          <div className={styles.listStack}>
            {loading ? (
              <p>Cargando datos de Firebase...</p>
            ) : alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className={styles.alertItem}>
                  <div className={styles.alertIndicator} />
                  <div className={styles.alertContent}>
                    <p className={styles.alertText}>
                      {alert.type === 'caida' ? 'Posible caída detectada' : 'Aviso del sistema'} en <strong>{alert.location || 'Zona desconocida'}</strong>
                    </p>
                    <span className={styles.alertTime}>Estado: {alert.status}</span>
                  </div>
                  
                  {/* BOTÓN DE ELIMINAR */}
                  <div className={styles.alertActions}>
                    {alert.status === 'nueva' && <span className={styles.newBadge}>Nueva</span>}
                    <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay alertas en la base de datos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}