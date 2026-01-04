import React, { useState } from 'react';
import { 
  Feather, 
  AlertCircle, 
  Loader2, 
  Mail, 
  Lock, 
  User as UserIcon,
  LogOut,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

/**
 * Vista de la Cubierta del Libro para Login/Registro
 */
const BookCover = ({ 
  formData, 
  handleInputChange, 
  error, 
  handleSubmit, 
  loading,
  isLoginMode,
  setIsLoginMode
}) => (
  <div className="w-[480px] h-[720px] bg-[#1a1a1a] rounded-r-3xl shadow-[30px_30px_60px_rgba(0,0,0,0.5)] border-l-[20px] border-black flex flex-col items-center justify-center p-12 text-center relative overflow-hidden transition-all duration-1000">
    {/* Textura de cuero oscura */}
    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
    
    <div className="z-10 border-2 border-[#c5a059]/20 p-8 rounded-sm w-full h-full flex flex-col justify-between">
      <div className="mt-8">
        <h1 className="text-[#c5a059] text-4xl font-bold mb-3 tracking-[0.15em] uppercase italic">
          Salvador Cerezo
        </h1>
        <p className="text-[#d4cfc3]/40 text-[10px] uppercase tracking-[0.5em] font-medium">
          Memorias & Diseño
        </p>
      </div>

      <div className="bg-black/40 p-8 rounded-lg shadow-2xl backdrop-blur-md border border-white/5 my-6 relative">
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <h2 className="text-[#d4cfc3] mb-6 text-xs text-center uppercase tracking-[0.3em] font-bold">
            {isLoginMode ? "Acceso de Autor" : "Registro de Autor"}
          </h2>

          {error && (
            <div className="text-rose-400 text-[10px] bg-rose-950/40 p-3 rounded border border-rose-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={14}/>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {!isLoginMode && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-[#c5a059]/50" size={14} />
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Nombre completo" 
                  onChange={handleInputChange} 
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-sm p-3 pl-10 text-white text-xs outline-none focus:border-[#c5a059] transition-all"
                  required 
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-[#c5a059]/50" size={14} />
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                placeholder="Correo electrónico" 
                onChange={handleInputChange} 
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-sm p-3 pl-10 text-white text-xs outline-none focus:border-[#c5a059] transition-all"
                required 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-[#c5a059]/50" size={14} />
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                placeholder="Contraseña" 
                onChange={handleInputChange} 
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-sm p-3 pl-10 text-white text-xs outline-none focus:border-[#c5a059] transition-all"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#c5a059] hover:bg-[#d9b573] text-black font-black py-4 rounded-sm text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={14} /> : (isLoginMode ? "Entrar" : "Registrar")}
          </button>

          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)} 
            className="w-full text-stone-500 text-[9px] uppercase tracking-[0.2em] mt-4 hover:text-[#c5a059] transition-colors"
          >
            {isLoginMode ? "¿No tienes cuenta? Regístrate" : "¿Ya eres autor? Inicia sesión"}
          </button>
        </form>
      </div>

      <div className="mb-4">
        <Feather className="text-[#c5a059]/30 mx-auto mb-4" size={28} strokeWidth={1} />
        <p className="text-[#d4cfc3]/20 text-[8px] uppercase tracking-[0.4em]">
          Est. 2024 — Edición Limitada
        </p>
      </div>
    </div>
  </div>
);

/**
 * COMPONENTE AUTH PRINCIPAL
 * Este componente gestiona la interfaz de acceso delegando la lógica al hook useAuth.
 */
const Auth = () => {
  const { user, isAuthenticated, registerAndLogin, logout, loading: authLoading } = useAuth();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");

    // Se utiliza la función del hook que maneja tanto registro como inicio de sesión
    const result = await registerAndLogin(
      formData.email, 
      formData.password, 
      isLoginMode ? null : formData.name
    );

    if (!result.success) {
      setError(result.error);
    }
    setLocalLoading(false);
  };

  // Si ya está autenticado, mostramos el estado de bienvenida
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-[#e5e1d8] flex flex-col items-center justify-center font-serif p-6">
        <div className="bg-white p-12 rounded shadow-xl text-center max-w-md w-full border border-stone-200">
          <BookOpen className="mx-auto text-[#c5a059] mb-6" size={40} />
          <h2 className="text-2xl font-bold text-stone-900 mb-2 uppercase tracking-tighter">Bienvenido, {user.name}</h2>
          <p className="text-stone-500 text-sm mb-8 tracking-widest italic">{user.role === 'admin' ? 'Administrador del Diario' : 'Autor Invitado'}</p>
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full border border-stone-200 py-3 text-[10px] uppercase tracking-[0.3em] hover:bg-stone-50 transition-all text-stone-600"
          >
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e5e1d8] flex items-center justify-center p-6 font-serif overflow-hidden">
      <div className="relative perspective-1000 animate-in fade-in zoom-in duration-1000">
        <BookCover 
          formData={formData}
          handleInputChange={handleInputChange}
          error={error}
          handleSubmit={handleSubmit}
          loading={localLoading || authLoading}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default Auth;