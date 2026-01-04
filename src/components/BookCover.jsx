import React from 'react';
import { AlertCircle, Feather } from 'lucide-react';

export default function BookCover({ formData, handleInputChange, handleRegister, error, setIsBookOpen }) {
  return (
    <div className="w-[480px] h-[720px] bg-[#1a1a1a] rounded-r-3xl shadow-[30px_30px_60px_rgba(0,0,0,0.5)] border-l-[20px] border-black flex flex-col items-center justify-center p-12 text-center relative overflow-hidden transition-all">
      
      {/* Brillo de la portada */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

      {/* Marco Dorado */}
      <div className="z-10 border-2 border-[#c5a059]/20 p-8 rounded-sm w-full h-full flex flex-col justify-between relative">
        
        <div>
          <h1 className="text-[#c5a059] text-3xl font-bold mb-3 tracking-[0.1em] uppercase font-serif">
            Salvador Cerezo
          </h1>
          <div className="h-[1px] w-24 bg-[#c5a059]/30 mx-auto mb-3" />
          <p className="text-[#d4cfc3]/40 text-[10px] uppercase tracking-[0.4em]">
            Panel de Control Editorial
          </p>
        </div>

        {/* Formulario de Registro */}
        <div className="bg-black/60 p-6 rounded-lg shadow-2xl backdrop-blur-md border border-white/5 my-6">
          <form onSubmit={handleRegister} className="space-y-4 text-left">
            <h2 className="text-[#d4cfc3] mb-4 text-[10px] text-center uppercase tracking-[0.3em] font-bold opacity-70">
              Registro de Autor
            </h2>

            {error && (
              <div className="text-rose-400 text-[9px] bg-rose-950/30 p-3 rounded border border-rose-500/20 flex items-center gap-2">
                <AlertCircle size={12}/>
                {error}
              </div>
            )}

            <div className="space-y-3">
              <input 
                type="text" 
                name="name" 
                placeholder="NOMBRE" 
                value={formData.name}
                onChange={handleInputChange} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white text-[10px] outline-none focus:border-[#c5a059] placeholder:text-zinc-600" 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="EMAIL" 
                value={formData.email}
                onChange={handleInputChange} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white text-[10px] outline-none focus:border-[#c5a059] placeholder:text-zinc-600" 
                required 
              />
              <input 
                type="password" 
                name="password" 
                placeholder="CLAVE" 
                value={formData.password}
                onChange={handleInputChange} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white text-[10px] outline-none focus:border-[#c5a059] placeholder:text-zinc-600" 
                required 
              />
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="CONFIRMAR CLAVE" 
                value={formData.confirmPassword}
                onChange={handleInputChange} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 text-white text-[10px] outline-none focus:border-[#c5a059] placeholder:text-zinc-600" 
                required 
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#c5a059] hover:bg-[#b08d4a] text-black font-black py-4 rounded text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg mt-2"
            >
              Registrar
            </button>

            <button 
              type="button" 
              onClick={() => setIsBookOpen(true)} 
              className="w-full text-stone-500 text-[8px] uppercase tracking-[0.2em] mt-4 hover:text-[#c5a059] text-center"
            >
              ¿Ya tienes cuenta? Acceder
            </button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Feather className="text-[#c5a059]/40" size={24} strokeWidth={1} />
        </div>
      </div>

      {/* Textura de cuero */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')]" />
    </div>
  );
}