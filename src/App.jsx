import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// --- IMPORTANTE: Conexión con Firebase ---
import { auth } from './config/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

// Estilos, Layout y Contextos (Lo dejas igual)
import './App.css';
import AppLayout from './components/layout/AppLayout.jsx';
import AuthContext from './store/AuthContext';
import { AlertsProvider } from './context/AlertsContext.jsx';

// Páginas (Lo dejas igual)
import Dashboard from './pages/dashboard/Dashboard.jsx';
import DeviceList from './pages/devices/DeviceList.jsx';
import AlertInbox from './pages/alerts/AlertInbox.jsx';
import Login from './pages/auth/Login.jsx';
import Registro from './pages/auth/Registro.jsx';
import DeviceDetail from './pages/devices/DeviceDetail.jsx';

function App() {
  const [estaLogueado, setEstaLogueado] = useState(false);
  const [uId, setUId] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [cargando, setCargando] = useState(true); // <-- NUEVO: Para esperar a Firebase

  // --- ESCUCHADOR DE FIREBASE (Sustituye a tu antiguo useEffect) ---
  useEffect(() => {
    // Esta función se ejecuta sola cuando detecta un cambio en el usuario
    const desubscribir = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        // Si hay usuario, Firebase nos da su UID automáticamente
        setEstaLogueado(true);
        setUId(usuario.uid);
        setUserName(usuario.displayName || "Usuario ElderSense");
        setUserRole("user"); // Aquí podrías luego traer el rol desde Firestore
      } else {
        // Si no hay usuario, limpiamos todo
        setEstaLogueado(false);
        setUId("");
        setUserName("");
      }
      setCargando(false); // Ya sabemos si hay alguien o no
    });

    return () => desubscribir(); // Limpieza al desmontar
  }, []);

  // --- FUNCIÓN DE LOGOUT (Simplificada) ---
  const logoutHandler = async () => {
    try {
      await auth.signOut(); // Firebase se encarga de limpiar la sesión
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  // --- MIENTRAS CARGA ---
  // Evita que la app te mande al login antes de que Firebase termine de comprobar la sesión
  if (cargando) return <div className="p-5">Cargando ElderSense...</div>;

  return (
    <AuthContext.Provider value={{
      login: estaLogueado,
      userID: uId,
      userName: userName,
      userRole: userRole,
      logoutAction: logoutHandler,
      // No necesitamos pasar loginAction aquí necesariamente porque 
      // onAuthStateChanged se encarga de detectar el login automáticamente
    }}>
      <AlertsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            <Route element={estaLogueado ? <AppLayout /> : <Navigate to="/login" replace />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/devices" element={<DeviceList />} />
              <Route path="/devices/:id" element={<DeviceDetail />} />
              <Route path="/alerts" element={<AlertInbox />} />
              <Route path="/admin-dashboard" element={<div className="p-4"><h1>Panel de Control ElderSense</h1></div>} />
            </Route>

            <Route path="*" element={<Navigate to={estaLogueado ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </BrowserRouter>
      </AlertsProvider>
    </AuthContext.Provider>
  );
}

export default App;