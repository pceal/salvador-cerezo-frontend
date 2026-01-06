import React, { useState } from 'react';
import { Feather, AlertCircle, Loader2, Mail, Lock, User as UserIcon } from 'lucide-react';

const Auth = ({ onAuthSubmit, loading, error }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthSubmit(formData, isLoginMode);
  };

  return (
    <div className="min-h-screen bg-[#e5e1d8] flex items-center justify-center p-6 font-serif overflow-hidden">
      <div className="w-[480px] h-[720px] bg-[#1a1a1a] rounded-r-3xl shadow-[30px_30px_60px_rgba(0,0,0,0.5)] border-l-[20px] border-black flex flex-col items-center justify-center p-12 text-center relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]"></div>
        
        <div className="z-10 border-2 border-[#c5a059]/20 p-8 rounded-sm w-full h-full flex flex-col justify-between">
          <div>
            <h1 className="text-[#c5a059] text-4xl font-bold mb-3 tracking-[0.15em] uppercase italic">Salvador Cerezo</h1>
            <p className="text-[#d4cfc3]/40 text-[10px] uppercase tracking-[0.5em]">Memorias & Diseño</p>
          </div>

          <div className="bg-black/40 p-8 rounded-lg shadow-2xl backdrop-blur-md border border-white/5 my-6">
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <h2 className="text-[#d4cfc3] mb-6 text-xs text-center uppercase tracking-[0.3em] font-bold">
                {isLoginMode ? "Acceso de Autor" : "Registro de Autor"}
              </h2>

              {error && (
                <div className="text-rose-400 text-[10px] bg-rose-950/40 p-3 rounded border border-rose-500/20 flex items-center gap-2">
                  <AlertCircle size={14}/>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {!isLoginMode && (
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 text-[#c5a059]/50" size={14} />
                    <input type="text" name="name" placeholder="Nombre completo" onChange={handleChange} className="w-full bg-zinc-900/80 border border-zinc-800 rounded-sm p-3 pl-10 text-white text-xs outline-none focus:border-[#c5a059]" required />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-[#c5a059]/50" size={14} />
                  <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} className="w-full bg-zinc-900/80 border border-zinc-800 rounded-sm p-3 pl-10 text-white text-xs outline-none focus:border-[#c5a059]" required />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-[#c5a059]/50" size={14} />
                  <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} className="w-full bg-zinc-900/80 border border-zinc-800 rounded-sm p-3 pl-10 text-white text-xs outline-none focus:border-[#c5a059]" required />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#c5a059] hover:bg-[#d9b573] text-black font-black py-4 rounded-sm text-[10px] uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={14} /> : (isLoginMode ? "Entrar" : "Registrar")}
              </button>

              <button type="button" onClick={() => setIsLoginMode(!isLoginMode)} className="w-full text-stone-500 text-[9px] uppercase tracking-[0.2em] mt-4 hover:text-[#c5a059]">
                {isLoginMode ? "¿No tienes cuenta? Regístrate" : "¿Ya eres autor? Inicia sesión"}
              </button>
            </form>
          </div>

          <div className="mb-4">
            <Feather className="text-[#c5a059]/30 mx-auto mb-4" size={28} strokeWidth={1} />
            <p className="text-[#d4cfc3]/20 text-[8px] uppercase tracking-[0.4em]">Est. 2024 — Edición Limitada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;