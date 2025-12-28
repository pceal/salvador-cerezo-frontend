import React, { useState } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
  PlusCircle, 
  LogOut,
  Heart,
  Feather,
  Mail,
  Lock,
  User,
  AlertCircle
} from 'lucide-react';

/* eslint-disable react/prop-types */

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Estado del formulario de registro
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [posts] = useState([
    { id: 1, author: "Elena M.", content: "Hoy descubrí que el diseño emocional es la clave de todo. No se trata solo de cómo se ve, sino de cómo hace sentir al usuario al interactuar con cada elemento.", date: "28 Dic", likes: 12 },
    { id: 2, author: "Marco Polo", content: "Viajar no es solo moverse de un punto a otro, es cambiar de perspectiva. Cada destino es un espejo que nos devuelve una imagen nueva de nosotros mismos.", date: "27 Dic", likes: 45 },
    { id: 3, author: "Sofía Dev", content: "React y Tailwind son la pareja perfecta para prototipos rápidos. La velocidad de desarrollo aumenta exponencialmente cuando no tienes que salir de tu archivo JSX.", date: "26 Dic", likes: 89 },
    { id: 4, author: "Gabi Art", content: "El minimalismo no es la falta de algo, es la cantidad perfecta de todo. Encontrar ese equilibrio es el verdadero reto de cualquier artista moderno.", date: "25 Dic", likes: 33 },
  ]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Limpiar error al escribir
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setUser({ name: formData.name });
    setIsAuthenticated(true);
    setTimeout(() => setIsBookOpen(true), 500);
  };

  const handleLogout = () => {
    setIsBookOpen(false);
    setTimeout(() => {
      setIsAuthenticated(false);
      setUser(null);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    }, 600);
  };

  const nextPage = () => {
    if (currentPage < posts.length - 1) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-[#e5e1d8] flex items-center justify-center p-8 overflow-hidden font-serif">
      
      <style>{`
        .perspective-2000 { perspective: 2000px; }
        .book-shadow { box-shadow: 25px 25px 70px rgba(0,0,0,0.45); }
        .inner-page-shadow { box-shadow: inset -25px 0 40px -20px rgba(0,0,0,0.1); }
        /* Custom scrollbar for the form if needed */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #c5a059; border-radius: 10px; }
      `}</style>

      {/* Navegación lateral tipo marcador */}
      {isAuthenticated && isBookOpen && (
        <div className="fixed top-0 right-12 flex flex-col items-center gap-6 z-50 animate-in slide-in-from-top duration-700">
          <div 
            className="w-14 h-40 bg-[#b91c1c] rounded-b-xl shadow-xl flex flex-col items-center justify-end pb-6 text-white hover:h-48 transition-all cursor-pointer group" 
            onClick={() => setIsBookOpen(false)}
          >
            <Bookmark size={28} />
            <span className="text-[11px] mt-2 opacity-0 group-hover:opacity-100 uppercase tracking-widest font-sans font-bold">Cerrar</span>
          </div>
          
          <div className="w-12 h-28 bg-[#92400e] rounded-b-md shadow-md flex flex-col items-center justify-center text-white cursor-pointer hover:bg-[#78350f] transition-all hover:shadow-lg">
            <PlusCircle size={24} />
          </div>

          <div 
            className="w-12 h-28 bg-[#1e293b] rounded-b-md shadow-md flex flex-col items-center justify-center text-white cursor-pointer hover:bg-black transition-all hover:shadow-lg" 
            onClick={handleLogout}
          >
            <LogOut size={24} />
          </div>
        </div>
      )}

      {/* LIBRO */}
      <div className={`relative transition-all duration-1000 transform-gpu perspective-2000 ${isBookOpen ? 'scale-100' : 'scale-100 hover:scale-[1.02]'}`}>
        
        {!isBookOpen ? (
          /* PORTADA GRANDE */
          <div className="w-[480px] h-[720px] bg-[#1a1a1a] rounded-r-3xl shadow-[30px_30px_60px_rgba(0,0,0,0.5)] border-l-[20px] border-black flex flex-col items-center justify-center p-12 text-center relative overflow-hidden ring-1 ring-white/10">
            <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
            
            <div className="z-10 border-2 border-[#c5a059]/20 p-8 rounded-sm w-full h-full flex flex-col justify-between relative overflow-y-auto custom-scroll">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-12 h-[1px] bg-[#c5a059] mx-auto mb-6 opacity-60"></div>
                <h6 className="text-[#c5a059] text-3xl font-bold mb-3 tracking-[0.1em] uppercase whitespace-nowrap overflow-visible">
                  Publicaciones
                </h6>
                <p className="text-[#d4cfc3]/40 text-[10px] uppercase tracking-[0.4em] font-sans">Crónicas Personales</p>
              </div>
              
              <div className="bg-black/40 p-6 rounded-lg shadow-2xl backdrop-blur-sm border border-white/5 my-6">
                {!isAuthenticated ? (
                  <form onSubmit={handleRegister} className="space-y-4 text-left">
                    <h2 className="text-[#d4cfc3] mb-4 text-xs text-center uppercase tracking-[0.2em] font-sans opacity-80 underline underline-offset-8 decoration-[#c5a059]/40">Crear Cuenta</h2>
                    
                    {error && (
                      <div className="flex items-center gap-2 text-rose-400 text-[11px] bg-rose-950/30 p-2 rounded border border-rose-900/50 mb-2">
                        <AlertCircle size={14} /> {error}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Nombre completo" 
                          className="w-full bg-zinc-900/80 border border-zinc-800 rounded p-3 pl-10 text-white text-xs focus:outline-none focus:border-[#c5a059] transition-all"
                          required
                        />
                      </div>

                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Correo electrónico" 
                          className="w-full bg-zinc-900/80 border border-zinc-800 rounded p-3 pl-10 text-white text-xs focus:outline-none focus:border-[#c5a059] transition-all"
                          required
                        />
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                        <input 
                          type="password" 
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Contraseña" 
                          className="w-full bg-zinc-900/80 border border-zinc-800 rounded p-3 pl-10 text-white text-xs focus:outline-none focus:border-[#c5a059] transition-all"
                          required
                        />
                      </div>

                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#c5a059] transition-colors" size={16} />
                        <input 
                          type="password" 
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Repetir contraseña" 
                          className="w-full bg-zinc-900/80 border border-zinc-800 rounded p-3 pl-10 text-white text-xs focus:outline-none focus:border-[#c5a059] transition-all"
                          required
                        />
                      </div>
                    </div>

                    <button className="w-full bg-[#c5a059] hover:bg-[#b08d4a] text-black font-extrabold py-3.5 rounded shadow-lg text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 mt-4">
                      Finalizar Registro
                    </button>
                  </form>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-[#d4cfc3] text-sm mb-6 italic">Bienvenido de nuevo, {user?.name}</p>
                    <button 
                      onClick={() => setIsBookOpen(true)}
                      className="w-full bg-[#c5a059] hover:bg-[#b08d4a] text-black font-extrabold py-4 rounded transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em]"
                    >
                      <BookOpen size={18} /> Abrir Diario
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-3 shrink-0">
                <Feather className="text-[#c5a059]/40" size={30} strokeWidth={1} />
                <p className="text-[#c5a059]/20 text-[9px] uppercase tracking-[0.5em]">Salvador Cerezo</p>
              </div>
            </div>
            {/* Sombra del lomo */}
            <div className="absolute left-0 top-0 bottom-0 w-[15px] bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
          </div>
        ) : (
          
          /* LIBRO ABIERTO GRANDE */
          <div className="flex w-[1100px] h-[720px] shadow-[40px_40px_80px_rgba(0,0,0,0.35)] animate-in zoom-in-95 duration-700">
            {/* Página Izquierda */}
            <div className="w-1/2 bg-[#fdfcf8] rounded-l-md border-r border-stone-200 p-16 flex flex-col justify-between relative inner-page-shadow">
               <div>
                  <div className="flex items-center gap-3 text-stone-400 mb-16 border-b border-stone-100 pb-5 text-xs uppercase tracking-[0.2em] font-sans font-semibold">
                    <BookOpen size={18} /> 
                    <span>Memorias de {user?.name}</span>
                  </div>
                  <h3 className="text-5xl font-bold text-stone-900 mb-8 italic leading-tight">Reflexiones del Día</h3>
                  <p className="text-stone-500 text-2xl leading-relaxed italic opacity-80 font-light">
                    "Las palabras son el único rastro que dejamos de nuestros pensamientos más profundos."
                  </p>
               </div>
               
               <div className="flex justify-between items-center text-stone-400 text-xs font-sans uppercase tracking-[0.2em] font-bold">
                 <button 
                   onClick={prevPage}
                   disabled={currentPage === 0}
                   className={`flex items-center gap-2 p-4 rounded-lg border border-stone-100 transition-all ${currentPage === 0 ? 'opacity-10 cursor-not-allowed' : 'hover:bg-stone-100 text-stone-800 shadow-sm'}`}
                 >
                   <ChevronLeft size={24} /> Anterior
                 </button>
                 <span>Pág. {currentPage * 2 + 1}</span>
               </div>
            </div>

            {/* Página Derecha */}
            <div 
              className="w-1/2 bg-[#fdfcf8] rounded-r-md p-16 flex flex-col justify-center relative cursor-pointer hover:bg-[#faf9f5] transition-colors group"
              onClick={nextPage}
            >
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-stone-200/50 via-stone-100/10 to-transparent"></div>
              
              <div className="space-y-10 relative z-10 px-4">
                <span className="text-xs text-[#c5a059] font-black uppercase tracking-[0.5em] font-sans">{posts[currentPage].date}</span>
                <p className="text-3xl text-stone-800 leading-[1.7] text-justify first-letter:text-8xl first-letter:font-bold first-letter:mr-4 first-letter:float-left first-letter:text-stone-900 first-letter:leading-none">
                  {posts[currentPage].content}
                </p>
                
                <div className="pt-12 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest mb-1">Escrito por</span>
                    <span className="text-xl font-bold text-stone-700 underline decoration-[#c5a059] decoration-4 underline-offset-8">@{posts[currentPage].author.replace(' ', '').toLowerCase()}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-rose-600">
                    <Heart size={28} fill="currentColor" />
                    <span className="text-lg font-sans font-black">{posts[currentPage].likes} Me gusta</span>
                  </div>
                </div>
              </div>

              {currentPage < posts.length - 1 ? (
                <div className="absolute bottom-16 right-16 flex items-center gap-2 text-stone-300 group-hover:text-stone-800 group-hover:translate-x-2 transition-all font-bold uppercase tracking-widest text-xs">
                  Siguiente <ChevronRight size={32} />
                </div>
              ) : (
                <div className="absolute bottom-16 right-16 text-stone-200 font-bold uppercase tracking-widest text-[10px]">Fin del diario</div>
              )}

              <div className="absolute bottom-16 right-16 text-stone-400 text-xs font-sans uppercase tracking-[0.2em] font-bold pr-16">
                 <span>Pág. {currentPage * 2 + 2}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 w-full h-24 bg-gradient-to-t from-black/5 to-transparent -z-20"></div>
    </div>
  );
}