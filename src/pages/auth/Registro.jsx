import React, { useState } from 'react';
import { auth, db } from '../../config/firebase'; // Asegúrate de importar 'db'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'; // ¡ESTO TE FALTABA!
import { useNavigate, Link } from 'react-router-dom';

import './Login.css'; 

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registroHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. VALIDAR SENSOR: Miramos si existe y no tiene dueño
      const q = query(
        collection(db, "devices"), 
        where("deviceId", "==", deviceId), 
        where("ownerId", "==", "")
      );
      
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("❌ El ID del sensor no es válido o ya tiene dueño.");
        setLoading(false);
        return;
      }

      // 2. CREAR USUARIO EN AUTH
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const newUserId = userCred.user.uid;

      // 3. GUARDAR NOMBRE EN PERFIL
      await updateProfile(userCred.user, { displayName: nombre });

      // 4. VINCULAR SENSOR EN FIRESTORE
      const docRef = doc(db, "devices", snap.docs[0].id);
      await updateDoc(docRef, {
        ownerId: newUserId,
        status: 'online',
        lastActivation: new Date()
      });

      console.log("Registro y vinculación exitosa");
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Este email ya está registrado.");
      } else {
        setError("Error en el registro. Revisa los datos y la conexión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-glass-card">
        <div className="brand-section">
          <h1 className="brand-title">ElderSense</h1>
          <p className="brand-subtitle">Configuración inicial del sistema</p>
        </div>

        <form onSubmit={registroHandler}>
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label className="form-label">Nombre del cuidador</label>
            <input 
              className="form-control"
              type="text"
              placeholder="Tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              className="form-control"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              className="form-control"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <div className="form-group" style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
            <label className="form-label" style={{ color: '#2d6a4f', fontWeight: 'bold' }}>ID del Sensor ElderSense</label>
            <input 
              className="form-control"
              style={{ borderColor: '#2d6a4f' }}
              placeholder="Ej: ESP32-SALA-01"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'PROCESANDO...' : 'ACTIVAR CUENTA Y SENSOR'}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/login">¿Ya tienes cuenta? Entra aquí</Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;