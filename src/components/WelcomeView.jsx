import React from 'react';
import salvadorFoto from '../assets/salvador.png';

export default function WelcomeView() {
  return (
    /* Contenedor principal: Se mantienen los bordes negros laterales */
    <div className="w-full h-full relative bg-[#f2e8cf] border-x-[24px] border-[#0c0a09] shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] rounded-xl animate-in fade-in duration-1000 flex flex-col overflow-hidden">
      
      {/* LINEA DIVISORIA CENTRAL (Lomo del libro) */}
      {/* Esta es la parte que copié de la lógica de tu otro componente para que se vea la raya en medio */}
   <div className="absolute left-0 top-0 h-full w-full pointer-events-none flex justify-center z-10">
  {/* Sombra lado izquierdo (procedente de LeftPage) */}
  <div className="h-full w-10 bg-gradient-to-l from-black/10 to-transparent" />
  {/* La Raya Divisoria (el centro exacto) */}
  <div className="h-full w-[1px] bg-black/5" />
  {/* Sombra lado derecho (procedente de RightPage) */}
  <div className="h-full w-10 bg-gradient-to-r from-black/10 to-transparent" />
</div>
      
      {/* SOMBRAS DEL LOMO (Izquierda y Derecha del centro) */}
      <div className="absolute left-1/2 top-0 h-full w-20 -translate-x-full bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-10" />
      <div className="absolute left-1/2 top-0 h-full w-20 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-10" />

      {/* CONTENEDOR DE CONTENIDO (Se mantiene exactamente igual) */}
      <div className="flex-1 pt-20 px-16 flex flex-col items-start">
        
        {/* Foto de Salvador */}
        <div className="relative group ml-4">
          <div className="absolute inset-0 bg-stone-300 transform -rotate-2 translate-x-2 translate-y-2 opacity-40 shadow-md"></div>
          
          <div className="relative w-64 h-80 shadow-2xl rounded-sm overflow-hidden border border-stone-800/10 transform rotate-1 transition-transform group-hover:rotate-0 duration-500">
            <img 
              src={salvadorFoto} 
              alt="Salvador Cerezo"
              className="w-full h-full object-cover grayscale-[0.1] sepia-[0.2]"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent"></div>
          </div>
        </div>

        {/* Frase */}
        <div className="mt-16 w-full max-w-sm ml-4">
          <p className="text-2xl font-serif italic text-stone-900 leading-snug text-left">
            "Escribir es un acto de responsabilidad, cuando el poder prefiere el silencio."
          </p>
          
          <div className="mt-6 h-0.5 w-24 bg-[#c5a059]/40"></div>
        </div>
      </div>

      {/* Pie de página sutil */}
      <div className="absolute bottom-10 right-16 opacity-20 font-serif text-[10px] tracking-[0.4em] uppercase">
        Salvador Cerezo
      </div>
    </div>
  );
}