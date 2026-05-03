import React, { useState, useContext } from 'react';
import { auth, db } from '../../config/firebase'; 
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; 
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar si el usuario quiere entrar como Cliente o como Staff
  const [tipoLogin, setTipoLogin] = useState('usuario'); 
  
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Intentamos el login en Firebase Authentication
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // 2. Comprobación de seguridad según el tipo de acceso elegido
      if (tipoLogin === 'staff') {
        // Buscamos el documento con TU UID en la colección 'staff'
        const staffRef = doc(db, "staff", uid);
        const staffSnap = await getDoc(staffRef);

        if (staffSnap.exists()) {
          // ¡ÉXITO! Es un trabajador registrado.
          console.log("Acceso de Staff verificado para:", staffSnap.data().nombre);
          navigate('/admin-dashboard'); 
        } else {
          // FALLO: Tiene cuenta pero NO es trabajador. 
          // Lo deslogueamos inmediatamente por seguridad.
          await signOut(auth);
          setError("Acceso denegado: Este email no tiene permisos de administrador.");
        }
      } else {
        // Acceso normal para Cuidadores / Familiares
        navigate('/dashboard');
      }

    } catch (err) {
      console.error("Error en login:", err.code);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError("Email o contraseña incorrectos.");
      } else {
        setError("Error al conectar con el servidor.");
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
          <p className="brand-subtitle">Panel de Acceso</p>
        </div>

        {/* SELECTOR DE PESTAÑAS INTUITIVO */}
        <div className="login-tabs">
          <button 
            type="button"
            className={tipoLogin === 'usuario' ? 'tab-active' : 'tab-inactive'}
            onClick={() => { setTipoLogin('usuario'); setError(null); }}
          >
            Familiar / Usuario
          </button>
          <button 
            type="button"
            className={tipoLogin === 'staff' ? 'tab-active' : 'tab-inactive'}
            onClick={() => { setTipoLogin('staff'); setError(null); }}
          >
            Trabajador (Staff)
          </button>
        </div>
        
        <form onSubmit={submitHandler}>
          {error && <div className="error-box">{error}</div>}

          <div className="form-group">
            <label className="form-label">
              {tipoLogin === 'usuario' ? 'Email de Familiar' : 'Email de Trabajador'}
            </label>
            <input 
              type="email" 
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@eldersense.com"
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'VERIFICANDO...' : `ENTRAR COMO ${tipoLogin.toUpperCase()}`}
          </button>
        </form>

        <div className="login-footer">
          {tipoLogin === 'usuario' ? (
            <>
              <span>¿Eres nuevo cuidador? </span>
              <Link to="/registro">Regístrate aquí</Link>
            </>
          ) : (
            <span className="staff-info">Acceso restringido a personal técnico</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;