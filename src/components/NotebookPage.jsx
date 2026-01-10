import React from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, X, Send, Upload, Edit3, Trash2 } from 'lucide-react';

const formatViewDate = (dateString) => {
  if(!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const getDynamicFontSize = (text) => {
  if (!text) return { fontSize: '1.1rem', lineHeight: '1.6rem' };
  const length = text.length;
  if (length < 150) return { fontSize: '1.6rem', lineHeight: '2.1rem' };
  if (length < 350) return { fontSize: '1.3rem', lineHeight: '1.8rem' };
  return { fontSize: '1.05rem', lineHeight: '1.6rem' };
};

export function LeftPage({ view, user, currentPost, newPostImage, currentPage, setCurrentPage, setView, setPostForm, onEdit, onDelete }) {
  // Solo el admin puede ver los botones de edición y borrado
  const isAdmin = user?.role === 'admin';

  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-l-xl overflow-hidden bg-[#f2e8cf] border-l-[24px] border-[#0c0a09] shadow-[inset_15px_0_20px_rgba(0,0,0,0.2)] relative">
      <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
      
      <div className="flex-1">
         {view === 'reading' ? (
          <div className="animate-in fade-in duration-500">
            <h3 className="text-4xl font-bold text-stone-900 mb-6 italic break-words leading-tight font-serif decoration-stone-800/10 underline underline-offset-8">
              {currentPost?.title || "Sin título"}
            </h3>
            
            <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-sm shadow-md bg-stone-900/5 relative group">
              <div className="w-full h-full overflow-hidden rounded-sm grayscale-[0.1] sepia-[0.2]">
                {currentPost?.image ? (
                  <img src={currentPost.image} alt="Post" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-300/20">
                     <ImageIcon className="text-stone-400/40" size={32} />
                  </div>
                )}
              </div>
            </div>

            {/* ACCIONES DE ADMIN (BAJO LA FOTO) */}
            {currentPost && isAdmin && (
              <div className="flex gap-6 mt-4 border-t border-stone-800/10 pt-4">
                <button 
                  onClick={() => onEdit(currentPost)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-800 hover:text-amber-600 transition-colors font-bold italic"
                >
                  <Edit3 size={14} /> Editar Relato
                </button>
                <button 
                  onClick={() => onDelete(currentPost)}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-800 hover:text-red-600 transition-colors font-bold italic"
                >
                  <Trash2 size={14} /> Borrar
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in slide-in-from-left-4 duration-500">
            <h3 className="text-3xl font-bold text-stone-900 mb-6 italic font-serif">
              {setPostForm.id ? "Editando Relato" : "Nuevo Relato"}
            </h3>
            <div className="w-full aspect-video bg-stone-900/5 rounded-md flex items-center justify-center overflow-hidden relative">
              {newPostImage ? (
                <>
                  <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                  <button onClick={() => setPostForm(prev => ({...prev, image: null}))} className="absolute top-2 right-2 p-1 bg-stone-900/80 text-white rounded-full"><X size={12}/></button>
                </>
              ) : (
                <div className="text-center p-4 text-stone-500/40 font-serif italic">
                  <ImageIcon className="mx-auto mb-1 opacity-30" size={32} />
                  <p className="text-[8px] uppercase tracking-[0.2em]">Imagen</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-12 right-0 flex justify-between items-center pr-10">
        <button 
          onClick={() => { setView('reading'); setCurrentPage(p => Math.max(0, p - 1)); }} 
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors text-[9px] uppercase tracking-widest font-bold italic"
        >
          <ChevronLeft size={12}/> Anterior
        </button>
        <span className="opacity-30 font-serif text-[9px] uppercase tracking-[0.3em] font-bold text-stone-600">Pág. {currentPage * 2 + 1}</span>
      </div>
    </div>
  );
}

export function RightPage({ view, currentPost, newPost, handleNewPostChange, handleFileChange, fileInputRef, handleSavePost, setView, setCurrentPage, postsLength }) {
  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-r-xl relative bg-[#f2e8cf] border-r-[24px] border-[#0c0a09] shadow-[inset_-15px_0_20px_rgba(0,0,0,0.2)]">
      <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />

      <div className="flex-1">
        {view === 'reading' ? (
          <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="w-full text-center mb-6">
              <span className="text-[10px] text-[#78350f] font-black uppercase tracking-[0.4em] border-b border-[#78350f]/10 pb-1 inline-block">
                {currentPost?.date ? formatViewDate(currentPost.date) : "FECHA"}
              </span>
            </div>
            <div className="paper-scroll overflow-y-auto pr-4 max-h-[520px]">
              <p className="text-stone-900/90 text-justify break-words font-serif italic leading-[1.7]" style={getDynamicFontSize(currentPost?.content)}>
                {currentPost?.content || "..."}
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700 h-full flex flex-col justify-center">
            <form onSubmit={handleSavePost} className="space-y-5">
              <input type="text" name="title" value={newPost.title} onChange={handleNewPostChange} placeholder="Título..." className="w-full bg-transparent border-b border-stone-800/20 py-1 text-xl italic outline-none focus:border-stone-800 text-stone-900 font-serif" required />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
              <button type="button" onClick={() => fileInputRef?.current?.click()} className="w-full flex items-center justify-center gap-2 border border-stone-800/10 py-2 rounded text-[9px] uppercase tracking-[0.2em] text-stone-600 hover:bg-stone-900/5 font-serif italic">
                <Upload size={14} /> Foto
              </button>
              <textarea name="content" value={newPost.content} onChange={handleNewPostChange} placeholder="Tu historia..." rows={8} className="w-full bg-stone-900/5 border border-stone-800/10 p-4 text-sm leading-relaxed outline-none focus:border-stone-800 rounded-sm resize-none text-stone-900 font-serif italic" required />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#0c0a09] text-[#f2e8cf] text-[9px] uppercase tracking-[0.3em] py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-black transition-all font-bold">
                  <Send size={12}/> {newPost.id ? "Actualizar" : "Registrar"}
                </button>
                <button type="button" onClick={() => setView('reading')} className="px-4 border border-stone-800/10 text-stone-500 text-[8px] uppercase font-serif italic">Cerrar</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 right-12">
        <button 
          onClick={() => { setView('reading'); setCurrentPage(p => Math.min(postsLength - 1, p + 1)); }} 
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors text-[9px] uppercase tracking-widest font-bold italic"
        >
          Siguiente <ChevronRight size={12}/>
        </button>
      </div>
    </div>
  );
}