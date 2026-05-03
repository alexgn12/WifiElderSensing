import React, { useContext } from 'react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';
import { Menu } from 'lucide-react'; // Paso 1: Importar icono
import styles from './TopBar.module.css';

// Paso 2: Recibir onMenuClick como prop
const TopBar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { userName } = useContext(AuthContext); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logout:", error);
    }
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.sectionLeft}>
        {/* Paso 3: Botón de hamburguesa */}
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <span className={styles.welcome}>Panel de Control</span>
      </div>

      <div className={styles.sectionRight}>
        <span className={styles.userEmail}>{userName}</span>
        <button onClick={handleLogout} className={styles.btnLogout}>
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default TopBar;