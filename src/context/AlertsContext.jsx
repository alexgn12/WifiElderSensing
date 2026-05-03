import { createContext, useState, useEffect } from 'react'
// 1. Importamos las herramientas de Firebase
import { db } from '../config/firebase' 
import { collection, onSnapshot, query } from 'firebase/firestore'

export const AlertsContext = createContext(null)

export function AlertsProvider({ children }) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 2. Escuchador en tiempo real de la colección 'alerts'
    const q = query(collection(db, "alerts"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setAlerts(data);
      setLoading(false);
    }, (error) => {
      console.error("Error en AlertsContext:", error);
      setLoading(false);
    });

    // Limpiamos la conexión al desmontar
    return () => unsubscribe();
  }, [])

  // 3. El contador ahora se basa en los datos reales de Firebase
  // Si en Firebase no tienes el campo 'read', contará todos los documentos.
  // Si quieres que el círculo naranja solo cuente las 'nuevas', usa:
  // const unreadCount = alerts.filter((a) => a.status === 'nueva').length;
  const unreadCount = alerts.length;

  // Mantenemos la función por si la necesitas, aunque para borrar usamos deleteDoc
  function markRead(id) {
    console.log("Marcar como leído aún no está conectado a Firebase, pero la alerta sigue ahí.");
  }

  return (
    <AlertsContext.Provider value={{ alerts, loading, markRead, unreadCount }}>
      {children}
    </AlertsContext.Provider>
  )
}