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

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // 1. Intentamos sacar el nombre de varias fuentes
        const savedData = JSON.parse(localStorage.getItem('user_session'));
        
        // Prioridad: 1. Firebase directo | 2. Lo que guardamos en el registro | 3. El email (antes del @)
        const finalName = firebaseUser.displayName || savedData?.name || firebaseUser.email.split('@')[0];

        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: finalName, // <--- Aquí ya no dirá "Autor" por defecto
          role: firebaseUser.email.toLowerCase() === ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user',
          token: firebaseUser.accessToken
        };

        setUser(userData);
        setIsAuthenticated(true);
        // Guardamos la sesión actualizada con el nombre real
        localStorage.setItem('user_session', JSON.stringify(userData));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user_session');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ADMIN_EMAIL]);

  const registerAndLogin = async (email, password, name) => {
    try {
      // 1. Crear el usuario
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Actualizar el perfil en Firebase con el NOMBRE del registro
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // 3. Importante: Guardamos en localStorage inmediatamente para que el useEffect lo pesque
      const tempUserData = {
        uid: userCredential.user.uid,
        email: email,
        name: name,
        role: email.toLowerCase() === ADMIN_EMAIL?.toLowerCase() ? 'admin' : 'user'
      };
      localStorage.setItem('user_session', JSON.stringify(tempUserData));

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
      localStorage.removeItem('user_session'); // Limpiamos al salir
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { user, isAuthenticated, registerAndLogin, logout, loading };
};