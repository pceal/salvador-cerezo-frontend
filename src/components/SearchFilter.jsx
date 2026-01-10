import React, { useState } from 'react';
import { Search, Calendar, ArrowLeft } from 'lucide-react';

export default function SearchFilter({ setView, allPosts = [], setCurrentPage }) { // <--- RECÍBELA AQUÍ
  const [searchTerm, setSearchTerm] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    console.log("🔍 Botón Buscar presionado");
    console.log("📦 Datos recibidos en allPosts:", allPosts);
    
    if (!allPosts || !Array.isArray(allPosts) || allPosts.length === 0) {
      console.warn("⚠️ Advertencia: allPosts está vacío.");
      setResults([]);
      return;
    }

    const filtered = allPosts.filter(post => {
      if (!post) return false;
      const title = (post.title || "").toLowerCase().trim();
      const content = (post.content || "").toLowerCase().trim();
      const term = searchTerm.toLowerCase().trim();

      const matchesText = term === "" || title.includes(term) || content.includes(term);
      const matchesDate = !searchDate || post.date === searchDate;
      
      return matchesText && matchesDate;
    });

    console.log("✅ Resultados encontrados:", filtered.length);
    setResults(filtered);
  };

  // NUEVA FUNCIÓN: Nos lleva al post seleccionado
  const handleSelect = (post) => {
    // 1. Buscamos en qué posición está este post en la lista original (Firebase)
    const postIndex = allPosts.findIndex(p => p.id === post.id);
    
    if (postIndex !== -1) {
      // 2. Cambiamos la vista a lectura
      setView('reading');
      // 3. Saltamos a la página del índice encontrado
      setCurrentPage(postIndex); 
    }
  };

  return (
    <div className="w-full h-full relative bg-[#f2e8cf] border-x-[24px] border-[#0c0a09] shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] rounded-xl overflow-hidden flex flex-col">
      {/* Raya divisoria central */}
      <div className="absolute inset-0 pointer-events-none flex justify-center z-10">
        <div className="h-full w-10 bg-gradient-to-l from-black/10 to-transparent" />
        <div className="h-full w-[1px] bg-black/10" />
        <div className="h-full w-10 bg-gradient-to-r from-black/10 to-transparent" />
      </div>

      <div className="flex-1 flex relative z-20 font-serif">
        {/* LADO IZQUIERDO: Panel de Control */}
        <div className="w-1/2 p-16 flex flex-col">
          <button 
            onClick={() => setView('welcome')}
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900 mb-10 transition-colors font-bold italic"
          >
            <ArrowLeft size={12} /> Regresar
          </button>

          <h2 className="text-4xl italic text-stone-900 mb-8 decoration-stone-800/10 underline underline-offset-8">Archivo</h2>
          
          <div className="space-y-8">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-2 italic">Palabra clave</label>
              <div className="relative border-b border-stone-800/20 py-2">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent pl-7 text-sm font-serif italic outline-none text-stone-900"
                  placeholder="Título o contenido..."
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-2 italic">Filtrar por fecha</label>
              <div className="relative border-b border-stone-800/20 py-2">
                <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                <input 
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full bg-transparent pl-7 text-sm font-serif outline-none text-stone-800"
                />
              </div>
            </div>

            <button 
              onClick={handleSearch}
              className="mt-4 bg-[#0c0a09] text-[#f2e8cf] px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-black transition-all shadow-xl active:scale-95"
            >
              Consultar Memorias
            </button>
          </div>
        </div>

        {/* LADO DERECHO: Resultados */}
        <div className="w-1/2 p-16 flex flex-col bg-black/[0.01]">
          <h3 className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-8 font-bold text-center">Coincidencias ({results.length})</h3>
          
          <div className="space-y-6 overflow-y-auto pr-4 flex-1 custom-scrollbar">
            {results.length > 0 ? (
              results.map((post, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelect(post)} // <--- CLIC PARA IR AL POST
                  className="border-b border-stone-800/10 pb-4 group cursor-pointer hover:bg-stone-800/5 transition-colors p-2"
                >
                  <h4 className="font-serif italic text-lg text-stone-800 group-hover:text-amber-900">
                    {post.title || "Relato sin título"}
                  </h4>
                  <p className="text-[9px] text-stone-400 uppercase tracking-widest mt-1 font-bold">
                    {post.date}
                  </p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center opacity-40 italic text-sm text-stone-500 text-center py-20">
                {searchTerm || searchDate ? "No se encontraron relatos." : "Escriba algo para buscar en el archivo."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}