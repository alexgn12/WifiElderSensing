// Stub — returns a mock authenticated user
// Replace with real Firebase Auth listener when ready
// export function useAuth() {
//   return {
//     user: {
//       uid: 'user1',
//       displayName: 'María García',
//       email: 'maria@example.com',
//     },
//     loading: false,
//   }
// }
// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' o 'user'

  const loginAction = (token, uid, nombre, userRole) => {
    // Guardamos en localStorage para que no se borre al refrescar
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    setUser({ uid, nombre });
    setRole(userRole);
  };

  const logoutAction = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
  };

  return { user, role, loginAction, logoutAction };
};
