import React, { useState, useEffect } from 'react';
import { User, Trash2, ShieldAlert, Search, ShieldCheck } from 'lucide-react';
import { db } from '../api/firebaseConfig'; 
import { collection, onSnapshot, doc, deleteDoc, setDoc, query } from 'firebase/firestore';

const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
        // Fallback para el nombre si es null
        displayName: doc.data().name || doc.data().email?.split('@')[0] || "Lector"
      }));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error cargando usuarios:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // FUNCIÓN CRÍTICA: Bloqueo y Eliminación Permanente
  const onBlockAndExpel = async (user) => {
    const confirmacion = window.confirm(
      `¿Deseas banear permanentemente a ${user.displayName}?\n\nSu cuenta será eliminada y su email (${user.email}) quedará en la lista negra.`
    );

    if (confirmacion) {
      try {
        // 1. Añadir a la lista negra (Blacklist) usando el email como ID
        await setDoc(doc(db, "blacklist", user.email.toLowerCase()), {
          email: user.email.toLowerCase(),
          blockedAt: new Date().toISOString(),
          originalUid: user.uid,
          reason: "Baneo administrativo"
        });

        // 2. Eliminar de la colección de usuarios activos
        await deleteDoc(doc(db, "users", user.uid));

        alert("Usuario expulsado y bloqueado con éxito.");
      } catch (error) {
        console.error("Error en el proceso de baneo:", error);
        alert("Hubo un error al procesar el baneo.");
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const name = (u.displayName || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center font-serif italic text-stone-500">
        <ShieldCheck size={48} className="mb-4 opacity-20" />
        Acceso restringido
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-left p-6">
      <div className="mb-8 border-b border-stone-800/10 pb-4">
        <h2 className="text-3xl font-bold text-stone-900 font-serif italic mb-4">Gestión de Usuarios</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-900/5 border border-stone-800/10 rounded-sm py-2 pl-10 pr-4 text-sm font-serif italic outline-none focus:border-stone-800/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] text-stone-400 border-b border-stone-800/5">
              <th className="text-left pb-4 font-black">Lector / Email</th>
              <th className="text-right pb-4 font-black">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/5">
            {filteredUsers.map((user) => (
              <tr key={user.uid} className="group hover:bg-stone-50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-stone-100 shrink-0">
                      <User size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-serif italic text-base font-bold text-stone-800 leading-tight capitalize">
                        {user.displayName}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono tracking-tighter">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onBlockAndExpel(user)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase bg-red-50 text-red-700 hover:bg-red-700 hover:text-white rounded-sm transition-all"
                      title="Banear y Eliminar"
                    >
                      <ShieldAlert size={14} />
                      Baneado
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;