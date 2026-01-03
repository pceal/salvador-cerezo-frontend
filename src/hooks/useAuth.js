import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
// Importamos la instancia de auth. 
// Nota: Asegúrate de que la ruta coincida con tu archivo de configuración de Firebase.
import { auth } from '../api/firebaseConfig'; 

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * CONFIGURACIÓN DEL ADMINISTRADOR
   * El sistema detectará automáticamente si el usuario es admin basándose en este correo.
   */
  const ADMIN_EMAIL = "salvador@admin.com"; 

  useEffect(() => {
    // Escucha en tiempo real los cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Intentamos recuperar datos adicionales si existen en el almacenamiento local
        const savedData = JSON.parse(localStorage.getItem('user_session'));
        
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || savedData?.name || "Autor",
          // Verificación de rol: Si el email coincide, asignamos 'admin'
          role: firebaseUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
          token: firebaseUser.accessToken
        };

        setUser(userData);
        setIsAuthenticated(true);
        // Persistimos la sesión localmente para rapidez de carga en UI
        localStorage.setItem('user_session', JSON.stringify(userData));
      } else {
        // Limpieza total al cerrar sesión
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user_session');
      }
      setLoading(false);
    });

    // Limpiamos el observador al desmontar el hook
    return () => unsubscribe();
  }, []);

  /**
   * Registra un nuevo usuario y actualiza su perfil.
   * Si el email ya existe, intenta iniciar sesión directamente.
   */
  const registerAndLogin = async (email, password, name) => {
    try {
      // 1. Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Actualizar el nombre mostrado (displayName) inmediatamente
      await updateProfile(userCredential.user, {
        displayName: name
      });

      return { success: true };
    } catch (error) {
      // Manejo de error: Si el usuario ya existe, procedemos al login
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

  /**
   * Cierra la sesión del usuario actual.
   */
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { user, isAuthenticated, registerAndLogin, logout, loading };
};