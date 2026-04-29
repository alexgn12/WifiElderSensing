import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import styles from './AppLayout.module.css';

export default function AppLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar /> 
      <div className={styles.mainWrapper}>
        <TopBar />
        <main className={styles.contentArea}>
          <Outlet /> {/* Aquí es donde el margen y el centrado harán su magia */}
        </main>
      </div>
    </div>
  );
}