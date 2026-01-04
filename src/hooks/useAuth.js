import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { auth } from '../api/firebaseConfig'; 

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * CONFIGURACIÓN DEL ADMINISTRADOR
   * Ahora tomamos el email directamente desde las variables de entorno (.env)
   */
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const savedData = JSON.parse(localStorage.getItem('user_session'));
        
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || savedData?.name || "Autor",
          // Verificación dinámica: comparamos con la variable de entorno
          role: firebaseUser.email.toLowerCase() === ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user',
          token: firebaseUser.accessToken
        };

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user_session', JSON.stringify(userData));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user_session');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ADMIN_EMAIL]); // Añadimos ADMIN_EMAIL como dependencia por seguridad

  const registerAndLogin = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      return { success: true };
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          return { success: true };
        } catch (loginError) {
          return { success: false, error: "Credenciales inválidas para este usuario." };
        }
      }
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { user, isAuthenticated, registerAndLogin, logout, loading };
};