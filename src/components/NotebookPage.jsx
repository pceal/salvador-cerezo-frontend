import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, X, Send, Upload, Edit3, Trash2, ThumbsUp, MessageCircle, User, Check, X as CloseIcon } from 'lucide-react';

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

export function LeftPage({ view, user, currentPost, newPostImage, currentPage, setCurrentPage, setView, setPostForm, onEdit, onDelete, commentForm, setCommentForm, onSaveComment }) {
  const isAdmin = user?.role === 'admin';
  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-l-xl overflow-hidden bg-[#f2e8cf] border-l-[24px] border-[#0c0a09] shadow-[inset_15px_0_20px_rgba(0,0,0,0.2)] relative">
      <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
      <div className="flex-1 flex flex-col">
        {view === 'reading' ? (
          <div className="animate-in fade-in duration-500 flex flex-col flex-1 text-left">
            <h3 className="text-4xl font-bold text-stone-900 mb-6 italic break-words leading-tight font-serif decoration-stone-800/10 underline underline-offset-8">{currentPost?.title || "Sin título"}</h3>
            <div className="w-full aspect-[4/3] mb-2 overflow-hidden rounded-sm shadow-md bg-stone-900/5 relative group">
              {currentPost?.image ? <img src={currentPost.image} className="w-full h-full object-cover grayscale-[0.1]" alt="" /> : <div className="w-full h-full flex items-center justify-center bg-stone-300/20"><ImageIcon className="text-stone-400/40" size={32} /></div>}
            </div>
            {currentPost && (
              <div className="px-1 pt-2 flex items-center gap-2.5 mb-1">
                <ThumbsUp size={18} className="text-blue-600 fill-blue-600/10" />
                <div className="flex gap-1.5 text-[12px] font-serif italic tracking-tight">
                  <span className="font-black text-blue-700">{currentPost.likes?.length || 0}</span>
                  <span className="text-stone-500 font-medium">{currentPost.likes?.length === 1 ? 'persona le ha gustado' : 'personas les ha gustado'}</span>
                </div>
              </div>
            )}
            <div className="mt-auto mb-6">
               <button onClick={() => setView('comments')} className="flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-all group text-left">
                  <MessageCircle size={14} className="group-hover:scale-110 transition-transform text-stone-400 group-hover:text-stone-800" />
                  <span className="text-[10px] font-serif italic font-bold border-b border-stone-400/30 group-hover:border-stone-800 uppercase tracking-wider">Ir a los comentarios</span>
                </button>
            </div>
            {currentPost && isAdmin && (
              <div className="flex gap-6 border-t border-stone-800/10 pt-4 mb-4">
                <button onClick={() => onEdit(currentPost)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-800 hover:text-amber-600 font-bold italic"><Edit3 size={14} /> Editar</button>
                <button onClick={() => onDelete(currentPost)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-800 hover:text-red-600 font-bold italic"><Trash2 size={14} /> Borrar</button>
              </div>
            )}
          </div>
        ) : view === 'comments' ? (
          <div className="animate-in slide-in-from-right-4 duration-500 flex flex-col h-full text-left">
            <h3 className="text-2xl font-bold text-stone-900 mb-1 italic font-serif leading-tight">Comentarios sobre:</h3>
            <p className="text-lg text-amber-900/80 mb-8 font-serif italic border-b border-stone-800/10 pb-4">"{currentPost?.title}"</p>
            <div className="bg-white/40 p-6 rounded-sm border border-stone-800/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-stone-600"><User size={14} /><span className="text-[10px] uppercase tracking-widest font-bold">{user?.name || "Lector"}</span></div>
              <textarea value={commentForm} onChange={(e) => setCommentForm(e.target.value)} placeholder="Escribe tu pensamiento..." className="w-full bg-transparent border-none outline-none resize-none font-serif italic text-stone-800 text-sm h-32" />
              <button onClick={onSaveComment} className="mt-4 w-full bg-[#0c0a09] text-[#f2e8cf] py-3 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-all">Publicar Comentario</button>
            </div>
            <button onClick={() => setView('reading')} className="mt-auto flex items-center gap-2 text-stone-500 hover:text-stone-900 text-[9px] uppercase tracking-widest font-bold italic"><ChevronLeft size={12}/> Volver al relato</button>
          </div>
        ) : null}
      </div>
      <div className="absolute bottom-6 left-12 opacity-30 font-serif text-[9px] uppercase tracking-[0.3em] font-bold text-stone-600">Pág. {currentPage * 2 + 1}</div>
    </div>
  );
}

export function RightPage({ view, user, currentPost, newPost, handleNewPostChange, handleFileChange, fileInputRef, handleSavePost, setView, setCurrentPage, postsLength, setShowQuiz, onDeleteComment, onUpdateComment }) {
  
  // ESTADO PARA GESTIONAR LA EDICIÓN LOCAL DE UN COMENTARIO
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-r-xl relative bg-[#f2e8cf] border-r-[24px] border-[#0c0a09] shadow-[inset_-15px_0_20px_rgba(0,0,0,0.2)]">
      <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
      <div className="flex-1">
        {view === 'comments' ? (
          <div className="animate-in fade-in duration-500 h-full flex flex-col text-left">
             <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#78350f] mb-8 border-b border-[#78350f]/10 pb-2">HILO DE DISCUSIÓN ({currentPost?.comments?.length || 0})</h3>
             <div className="paper-scroll overflow-y-auto pr-4 max-h-[500px] space-y-6">
                {currentPost?.comments?.length > 0 ? [...currentPost.comments].reverse().map((c, i) => (
                  <div key={i} className="group border-b border-stone-800/5 pb-4 relative text-left">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-amber-900 font-serif italic">{c.userName || "Lector"}</span>
                      <span className="text-[8px] text-stone-400 uppercase">{formatViewDate(c.date)}</span>
                    </div>

                    {/* VISTA DE EDICIÓN O VISTA NORMAL */}
                    {editingId === c.date ? (
                      <div className="mt-2 animate-in fade-in">
                        <textarea 
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full bg-white/60 border border-stone-800/10 p-2 text-sm font-serif italic text-stone-800 rounded-sm focus:outline-none"
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => { onUpdateComment(c, editValue); setEditingId(null); }} className="text-[8px] bg-stone-900 text-white px-2 py-1 uppercase font-bold flex items-center gap-1"><Check size={10}/> Guardar</button>
                          <button onClick={() => setEditingId(null)} className="text-[8px] border border-stone-800/20 px-2 py-1 uppercase font-bold flex items-center gap-1"><CloseIcon size={10}/> Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-stone-800 text-sm font-serif italic leading-relaxed">{c.text}</p>
                        {user?.uid === c.userId && (
                          <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingId(c.date); setEditValue(c.text); }} className="text-[8px] uppercase font-bold text-stone-400 hover:text-amber-800 italic">Editar</button>
                            <button onClick={() => onDeleteComment(c)} className="text-[8px] uppercase font-bold text-stone-400 hover:text-red-800 italic">Borrar</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )) : <p className="text-stone-400 font-serif italic text-sm text-center mt-20">Esta hoja aún está en blanco...</p>}
             </div>
          </div>
        ) : view === 'reading' ? (
          <div className="h-full flex flex-col animate-in fade-in duration-500 text-left">
            <div className="w-full text-center mb-6"><span className="text-[10px] text-[#78350f] font-black uppercase tracking-[0.4em] border-b border-[#78350f]/10 pb-1 inline-block">{currentPost?.date ? formatViewDate(currentPost.date) : "FECHA"}</span></div>
            <div className="paper-scroll overflow-y-auto pr-4 max-h-[520px]">
              <p className="text-stone-900/90 text-justify break-words font-serif italic leading-[1.7]" style={getDynamicFontSize(currentPost?.content)}>{currentPost?.content || "..."}</p>
              {currentPost && <div className="mt-8 pt-6 border-t border-stone-800/10 flex justify-center"><button onClick={() => setShowQuiz(true)} className="bg-stone-900 text-[#f2e8cf] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all shadow-md font-serif italic">¿Has terminado de leer?</button></div>}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700 h-full flex flex-col justify-center">
            <form onSubmit={handleSavePost} className="space-y-5">
              <input type="text" name="title" value={newPost.title} onChange={handleNewPostChange} placeholder="Título..." className="w-full bg-transparent border-b border-stone-800/20 py-1 text-xl italic outline-none text-stone-900 font-serif" required />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
              <button type="button" onClick={() => fileInputRef?.current?.click()} className="w-full flex items-center justify-center gap-2 border border-stone-800/10 py-2 rounded text-[9px] uppercase tracking-[0.2em] text-stone-600 font-serif italic"><Upload size={14} /> Foto</button>
              <textarea name="content" value={newPost.content} onChange={handleNewPostChange} placeholder="Tu historia..." rows={8} className="w-full bg-stone-900/5 border border-stone-800/10 p-4 text-sm leading-relaxed outline-none rounded-sm resize-none text-stone-900 font-serif italic" required />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-[#0c0a09] text-[#f2e8cf] text-[9px] uppercase tracking-[0.3em] py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"><Send size={12}/> {newPost.id ? "Actualizar" : "Registrar"}</button>
                <button type="button" onClick={() => setView('reading')} className="px-4 border border-stone-800/10 text-stone-500 text-[8px] uppercase font-serif italic">Cerrar</button>
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="absolute bottom-6 right-12">
        {view === 'reading' && (
          <button onClick={() => setCurrentPage(p => Math.min(postsLength - 1, p + 1))} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-900 transition-colors text-[9px] uppercase tracking-widest font-bold italic">Siguiente <ChevronRight size={12}/></button>
        )}
      </div>
    </div>
  );
}