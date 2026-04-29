import React from "react";

// Definimos lo que va a guardar el contexto de ElderSense
// Añadimos 'userRole' para saber si es Admin o Cliente
const AuthContext = React.createContext({
    isLoggedIn: false,
    idToken: '',
    userId: '',
    userName: '',
    userRole: '', // 'admin' (nosotros) o 'user' (familiar)
    language: 'es-ES',
    loginAction: (token, uid, name, role) => {},
    logoutAction: () => {}
});

// Este es el componente que envolverá a toda la App (Provider)
export const AuthContextProvider = (props) => {
    // Aquí podrías usar useState para manejar el estado real, 
    // pero de momento definimos la estructura para que no te dé error el import.

    const contextValue = {
        isLoggedIn: false,
        idToken: '',
        userId: '',
        userName: '',
        userRole: '', 
        language: 'es-ES',
        loginAction: () => {},
        logoutAction: () => {}
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;