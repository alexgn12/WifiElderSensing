import { db } from '../config/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

/**
 * Escucha los cambios en la colección 'devices' en tiempo real.
 * @param {Function} callback - Función que se ejecuta cada vez que hay cambios.
 * @returns {Function} - Función para cancelar la suscripción.
 */
export function subscribeToDevices(callback) {
  // Apuntamos a la colección que ya tienes creada en Firebase
  const q = query(collection(db, "devices"));
  
  // onSnapshot se queda "escuchando"
  return onSnapshot(q, (snapshot) => {
    const devices = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log("Dispositivos actualizados desde Firebase:", devices);
    callback(devices);
  }, (error) => {
    console.error("Error al suscribirse a dispositivos:", error);
  });
}

// Mantenemos esta por si acaso la usas en algún detalle, 
// pero de momento la dejamos así:
export function getDeviceById(id) {
  // Nota: Lo ideal sería pedirlo a Firestore, 
  // pero para el listado usaremos subscribeToDevices
  return Promise.resolve(null); 
}