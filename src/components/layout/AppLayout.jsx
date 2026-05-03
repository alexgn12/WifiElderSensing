import { useState } from 'react'; // Paso 1: Importar el estado
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  // Paso 2: Crear el estado. Por defecto true para que en PC se vea al entrar.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.layout}>
      {/* Paso 3: Pasar props al Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> 
      
      {/* Paso 4: Clase condicional según el estado */}
      <div className={`${styles.mainWrapper} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        {/* Pasamos toggle al TopBar para que el botón de hamburguesa funcione */}
        <TopBar onMenuClick={toggleSidebar} />
        
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}