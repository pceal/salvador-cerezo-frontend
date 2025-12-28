import React, { createContext, useState, useEffect } from 'react';

// 1. Creamos el contexto (Asegúrate de que tenga el 'export' para que useAuth lo encuentre)
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulación de verificación de sesión al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// NOTA: Aquí es donde antes estaba el "export const useAuth = ...". 
// Al borrarlo de aquí, obligamos a la aplicación a usar el archivo centralizado 
// en /hooks/useAuth.js, lo cual es mucho más escalable.