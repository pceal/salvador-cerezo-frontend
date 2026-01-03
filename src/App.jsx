import React, { useState, useEffect } from 'react';
import { 
  BookOpen, ChevronLeft, Bookmark, 
  LogOut, Feather, AlertCircle, FileText, Book, Calendar, Users, 
  Eye, Plus, Ban, ChevronDown, Minimize2, Maximize2, Edit3, Trash2
} from 'lucide-react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyBaO9MCnLbQZ6A8Hcqr0ZTgcL3FIy4PMcc",
  authDomain: "salvadorcerezo-bb28e.firebaseapp.com",
  projectId: "salvadorcerezo-bb28e",
  storageBucket: "salvadorcerezo-bb28e.firebasestorage.app",
  messagingSenderId: "2186144672",
  appId: "1:2186144672:web:65adfeaab3ba1a2b1092c5"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "salvador@admin.com",
    password: "123456",
    confirmPassword: ""
  });

  const ADMIN_EMAIL = "salvador@admin.com";

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).then(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || "Salvador",
            role: firebaseUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
          };
          setUser(userData);
          setIsAuthenticated(true);
          setIsBookOpen(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsBookOpen(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    });
  }, []);

  const [posts] = useState([
    { id: 1, author: "Salvador", content: "El diseño es el embajador silencioso de tu marca.", date: "02 Ene" },
    { id: 2, author: "Salvador", content: "Escribir es una forma de terapia personal.", date: "03 Ene" },
  ]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, { displayName: formData.name });
    } catch (err) {
      setError("Error al registrar: " + err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } catch (err) {
      setError("Credenciales incorrectas.");
    }
  };

  const handleLogoutAction = async () => {
    setActiveMenu(null);
    setIsMinimized(false);
    await signOut(auth);
    setIsBookOpen(false);
  };

  const AdminSubmenu = ({ type }) => {
    const config = {
      publicaciones: { 
        items: [
          { label: 'Ver Todas', icon: <Eye size={10}/> }, 
          { label: 'Crear Nueva', icon: <Plus size={10}/> },
          { label: 'Editar', icon: <Edit3 size={10}/> },
          { label: 'Eliminar', icon: <Trash2 size={10}/> }
        ] 
      },
      libros: { 
        items: [
          { label: 'Ver Biblioteca', icon: <Eye size={10}/> }, 
          { label: 'Añadir Libro', icon: <Plus size={10}/> },
          { label: 'Editar Libro', icon: <Edit3 size={10}/> },
          { label: 'Borrar Libro', icon: <Trash2 size={10}/> }
        ] 
      },
      eventos: { 
        items: [
          { label: 'Crear Evento', icon: <Plus size={10}/> },
          { label: 'Editar Evento', icon: <Edit3 size={10}/> },
          { label: 'Borrar Evento', icon: <Trash2 size={10}/> }
        ] 
      },
      usuarios: { 
        items: [
          { label: 'Listado', icon: <Users size={10}/> }, 
          { label: 'Borrar Usuarios', icon: <Trash2 size={10}/> },
          { label: 'Bloquear', icon: <Ban size={10}/> }
        ] 
      }
    };

    const current = config[type];

    return (
      <div className="w-full mt-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200 pl-2">
        {current.items.map((item, idx) => (
          <button key={idx} className="w-full text-left px-3 py-1 text-[7px] hover:bg-white/10 rounded flex items-center gap-2 transition-colors opacity-70 hover:opacity-100 uppercase tracking-widest group">
            <span className="group-hover:text-[#c5a059] transition-colors">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#e5e1d8] flex items-center justify-center font-serif text-stone-500 uppercase tracking-widest text-xs animate-pulse">
      Cargando...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e5e1d8] flex items-center justify-center p-8 overflow-hidden font-serif text-stone-900">
      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .bookmark-shape { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 97%, 0% 100%); }
        .tab-shape { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 90%, 0% 100%); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .vertical-text { writing-mode: vertical-rl; text-orientation: mixed; }
      `}</style>

      <div className="relative transition-all duration-1000 transform-gpu perspective-2000">
        {!isBookOpen ? (
          /* PORTADA CON REGISTRO */
          <div className="w-[480px] h-[720px] bg-[#1a1a1a] rounded-r-3xl shadow-[30px_30px_60px_rgba(0,0,0,0.5)] border-l-[20px] border-black flex flex-col items-center justify-center p-12 text-center relative overflow-hidden animate-in fade-in zoom-in-95">
            <div className="z-10 border-2 border-[#c5a059]/20 p-8 rounded-sm w-full h-full flex flex-col justify-between">
              <div>
                <h6 className="text-[#c5a059] text-3xl font-bold mb-3 tracking-[0.1em] uppercase">Salvador Cerezo</h6>
                <p className="text-[#d4cfc3]/40 text-[10px] uppercase tracking-[0.4em]">Crear Nueva Cuenta</p>
              </div>
              <div className="bg-black/40 p-6 rounded-lg shadow-2xl backdrop-blur-sm border border-white/5 my-6">
                <form onSubmit={handleRegister} className="space-y-4 text-left">
                  <h2 className="text-[#d4cfc3] mb-4 text-xs text-center uppercase tracking-[0.2em]">Registro</h2>
                  {error && <div className="text-rose-400 text-[10px] bg-rose-950/30 p-2 rounded flex items-center gap-2"><AlertCircle size={12}/>{error}</div>}
                  <input type="text" name="name" placeholder="Nombre" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-white text-xs outline-none focus:border-[#c5a059]" required />
                  <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-white text-xs outline-none focus:border-[#c5a059]" required />
                  <input type="password" name="password" value={formData.password} placeholder="Clave" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-white text-xs outline-none focus:border-[#c5a059]" required />
                  <input type="password" name="confirmPassword" placeholder="Confirmar" onChange={handleInputChange} className="w-full bg-zinc-900 border border-zinc-800 rounded p-2.5 text-white text-xs outline-none focus:border-[#c5a059]" required />
                  <button className="w-full bg-[#c5a059] hover:bg-[#b08d4a] text-black font-extrabold py-3 rounded text-[9px] uppercase tracking-[0.2em]">Registrar</button>
                  <button type="button" onClick={() => setIsBookOpen(true)} className="w-full text-stone-500 text-[9px] uppercase tracking-widest mt-2 hover:text-[#c5a059]">Ya tengo cuenta (Acceso)</button>
                </form>
              </div>
              <Feather className="text-[#c5a059]/40 mx-auto" size={24} strokeWidth={1} />
            </div>
          </div>
        ) : (
          /* LIBRO ABIERTO */
          <div className="flex w-[1100px] h-[720px] shadow-[40px_40px_80px_rgba(0,0,0,0.35)] animate-in zoom-in-95 duration-700 bg-[#fdfcf8] rounded-md relative">
            <div className="w-1/2 border-r border-stone-200 p-16 flex flex-col justify-between rounded-l-md">
              <div>
                <div className="flex items-center gap-3 text-stone-400 mb-16 border-b border-stone-100 pb-5 text-xs uppercase tracking-[0.2em]">
                  <BookOpen size={16}/><span className="text-[10px]">Memorias de {user?.name || "Autor"}</span>
                </div>
                <h3 className="text-4xl font-bold text-stone-900 mb-6 italic">{activeMenu ? activeMenu.toUpperCase() : 'Diario'}</h3>
                <p className="text-xl text-stone-500 leading-relaxed italic opacity-80">
                  {user?.role === 'admin' ? "Panel administrativo listo." : "Tu rincón personal de escritura."}
                </p>
              </div>
              <div className="flex justify-between items-center text-stone-400 text-[8px] uppercase tracking-widest font-bold">
                <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} className="flex items-center gap-1.5 p-1.5 border border-stone-100 rounded hover:bg-stone-50 transition-colors"><ChevronLeft size={12}/> Ant.</button>
                <span className="opacity-40">Pág. {currentPage * 2 + 1}</span>
              </div>
            </div>

            <div className="w-1/2 p-16 flex flex-col justify-center relative bg-[#fdfcf8] rounded-r-md">
              <div className="space-y-10 animate-in fade-in duration-500">
                <span className="text-[9px] text-[#c5a059] font-black uppercase tracking-[0.5em]">{posts[currentPage]?.date}</span>
                <p className="text-2xl text-stone-800 leading-[1.6] text-justify">{posts[currentPage]?.content || "Escribe algo hoy..."}</p>
              </div>
              <div className="absolute bottom-16 right-16 text-stone-400 text-[8px] uppercase tracking-[0.2em] font-bold opacity-40"><span>Pág. {currentPage * 2 + 2}</span></div>
            </div>

            {/* MARCAPÁGINAS CON MINIMIZADO A ÍNDICE */}
            <div 
              className={`absolute left-1/2 transition-all duration-700 z-50 shadow-[5px_5px_20px_rgba(0,0,0,0.4)] flex flex-col items-center text-white overflow-hidden
              ${isMinimized ? '-top-[350px] w-12 h-[410px] tab-shape bg-[#78350f] cursor-pointer' : '-top-40 w-44 h-[520px] bookmark-shape bg-[#78350f]'}`}
              onClick={() => isMinimized && setIsMinimized(false)}
            >
              {isMinimized ? (
                <div className="w-full h-full flex flex-col items-center justify-end pb-8 animate-in fade-in duration-500">
                  <div className="flex flex-col items-center gap-2">
                    <span className="vertical-text text-[10px] font-black uppercase tracking-[0.6em] text-orange-200/80">MENÚ</span>
                    <Maximize2 size={12} className="opacity-40 mt-2"/>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full pt-44 flex flex-col no-scrollbar overflow-y-auto relative animate-in zoom-in-95">
                  {isAuthenticated && (
                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} className="absolute top-44 right-2 opacity-30 hover:opacity-100 transition-opacity p-2 z-10">
                      <Minimize2 size={14}/>
                    </button>
                  )}

                  {!isAuthenticated ? (
                    /* LOGIN */
                    <div className="px-4 flex-1 flex flex-col">
                      <Bookmark className="mb-4 self-center text-orange-200" size={16}/>
                      <h3 className="text-center text-[8px] font-bold uppercase tracking-[0.3em] mb-8 opacity-60">Iniciar Sesión</h3>
                      <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1">
                          <label className="text-[6px] uppercase tracking-widest opacity-40 ml-1">Email</label>
                          <input type="email" name="email" value={formData.email} required onChange={handleInputChange} className="w-full bg-white/5 border-b border-white/10 p-2 text-[9px] focus:outline-none focus:border-[#c5a059] transition-colors" placeholder="tu@email.com"/>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[6px] uppercase tracking-widest opacity-40 ml-1">Clave</label>
                          <input type="password" name="password" value={formData.password} required onChange={handleInputChange} className="w-full bg-white/5 border-b border-white/10 p-2 text-[9px] focus:outline-none focus:border-[#c5a059] transition-colors" placeholder="••••••••"/>
                        </div>
                        <button className="w-full bg-[#c5a059] text-black py-2.5 mt-4 font-black uppercase text-[8px] tracking-[0.2em] shadow-xl hover:bg-[#d4af37] transition-colors">Acceder</button>
                      </form>
                    </div>
                  ) : (
                    /* PANEL ADMIN */
                    <div className="flex flex-col flex-1 px-3">
                      <div className="flex flex-col items-center mb-6 opacity-60">
                        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] mb-2 italic bg-white/5">{user?.name?.charAt(0)}</div>
                        <span className="text-[7px] uppercase tracking-[0.3em] font-bold">{user?.role}</span>
                      </div>

                      <div className="space-y-2">
                        {[
                          { id: 'publicaciones', label: 'Publicaciones', icon: <FileText size={12}/> },
                          { id: 'libros', label: 'Libros', icon: <Book size={12}/> },
                          { id: 'eventos', label: 'Eventos', icon: <Calendar size={12}/> },
                          { id: 'usuarios', label: 'Usuarios', icon: <Users size={12}/> }
                        ].map(menu => (
                          <div key={menu.id} className="space-y-1">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === menu.id ? null : menu.id); }}
                              className={`w-full flex items-center justify-between p-2.5 rounded transition-all ${activeMenu === menu.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                            >
                              <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest">{menu.icon}{menu.label}</div>
                              <ChevronDown size={10} className={`transition-transform duration-300 ${activeMenu === menu.id ? 'rotate-180' : ''}`}/>
                            </button>
                            {activeMenu === menu.id && <AdminSubmenu type={menu.id}/>}
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pb-8 flex flex-col items-center gap-4">
                        <button onClick={(e) => { e.stopPropagation(); handleLogoutAction(); }} className="text-[8px] uppercase tracking-widest opacity-30 hover:opacity-100 flex items-center gap-2 transition-all">
                          <LogOut size={10}/> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}