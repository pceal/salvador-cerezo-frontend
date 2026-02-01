import { useState, useEffect } from 'react';
import { db, auth } from '../api/firebaseConfig';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore'; 
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase().trim();

  const findUserInFirestore = async (email) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) return querySnapshot.docs[0].data();
      return null;
    } catch (error) {
      return null;
    }
  };

  const registerAndLogin = async (email, password, isRegistering = false, name = "") => {
    setLoading(true);
    const cleanEmail = email.trim().toLowerCase();
    
    try {
      let userCredential;

      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const userRole = cleanEmail === ADMIN_EMAIL ? 'admin' : 'user';

        const newUserProfile = {
          uid: userCredential.user.uid,
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          role: userRole,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", userCredential.user.uid), newUserProfile);
        
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: newUserProfile.name,
          role: userRole,
        });

      } else {
        userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
        const data = await findUserInFirestore(cleanEmail);
        const finalRole = cleanEmail === ADMIN_EMAIL ? 'admin' : (data?.role || 'user');

        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: data?.name || cleanEmail.split('@')[0],
          role: finalRole,
        });
      }

      setIsAuthenticated(true);
      return { success: true };

    } catch (error) {
      console.error("Error detectado:", error.code);
      
      // Mapeo del error de Firebase a un mensaje amigable
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        return { 
          success: false, 
          error: "No estás registrado o la clave es incorrecta.",
          needsRegistration: true 
        };
      }

      return { success: false, error: "Hubo un problema: " + error.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const data = await findUserInFirestore(fbUser.email);
        const isAdmin = fbUser.email.toLowerCase().trim() === ADMIN_EMAIL;
        
        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          name: data?.name || fbUser.email.split('@')[0],
          role: isAdmin ? 'admin' : (data?.role || 'user'),
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [ADMIN_EMAIL]);

  const logout = () => signOut(auth);

  return { user, isAuthenticated, registerAndLogin, logout, loading };
};