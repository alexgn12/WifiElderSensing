import React, { useContext } from 'react';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';
import styles from './TopBar.module.css';

const TopBar = () => {
  const navigate = useNavigate();
  // Asegúrate de usar 'userName' o el campo que tengas en tu context
  const { userName, logoutAction } = useContext(AuthContext); 

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
        {/* Aquí puedes poner un saludo dinámico */}
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