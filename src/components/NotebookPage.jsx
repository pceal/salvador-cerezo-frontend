import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Send, Upload, Edit3, Trash2, ThumbsUp, ThumbsDown, MessageCircle, User, Reply } from 'lucide-react';

const formatViewDate = (dateString) => {
  if(!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

// COMPONENTE RECURSIVO DE COMENTARIO
const CommentItem = ({ c, user, onVote, onDelete, onReply, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div className={`group relative text-left ${level > 0 ? 'ml-6 border-l border-stone-800/10 pl-4 mt-4' : 'border-b border-stone-800/5 pb-6'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-amber-900 font-serif italic">{c.userName}</span>
        <span className="text-[8px] text-stone-400 uppercase">{formatViewDate(c.date)}</span>
      </div>
      <p className="text-stone-800 text-sm font-serif italic leading-relaxed">{c.text}</p>
      
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-3">
          <button onClick={() => onVote(c.id, true)} className={`flex items-center gap-1 text-[9px] ${c.likes?.includes(user?.uid) ? 'text-blue-600' : 'text-stone-400'}`}>
            <ThumbsUp size={10} /> {c.likes?.length || 0}
          </button>
          <button onClick={() => onVote(c.id, false)} className={`flex items-center gap-1 text-[9px] ${c.dislikes?.includes(user?.uid) ? 'text-red-600' : 'text-stone-400'}`}>
            <ThumbsDown size={10} /> {c.dislikes?.length || 0}
          </button>
        </div>
        <button onClick={() => setIsReplying(!isReplying)} className="text-[8px] uppercase font-bold text-stone-400 hover:text-stone-800 flex items-center gap-1">
          <Reply size={10}/> Responder
        </button>
        {user?.uid === c.userId && (
          <button onClick={() => onDelete(c.id)} className="text-[8px] uppercase font-bold text-stone-300 hover:text-red-800">Borrar</button>
        )}
      </div>

      {isReplying && (
        <div className="mt-3 flex gap-2">
          <input 
            value={replyText} onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-white/50 border border-stone-800/10 px-2 py-1 text-xs font-serif italic outline-none"
            placeholder="Escribe respuesta..."
          />
          <button onClick={() => { onReply(c.id, replyText); setReplyText(""); setIsReplying(false); }} className="bg-stone-900 text-white px-3 py-1 text-[8px] uppercase font-bold">Enviar</button>
        </div>
      )}

      {c.replies?.map(reply => (
        <CommentItem key={reply.id} c={reply} user={user} onVote={onVote} onDelete={onDelete} onReply={onReply} level={level + 1} />
      ))}
    </div>
  );
};

export function LeftPage({ view, user, currentPost, currentPage, setCurrentPage, setView, commentForm, setCommentForm, onSaveComment }) {
  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-l-xl overflow-hidden bg-[#f2e8cf] border-l-[24px] border-[#0c0a09] shadow-[inset_15px_0_20px_rgba(0,0,0,0.2)] relative">
      <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
      <div className="flex-1 flex flex-col">
        {view === 'reading' ? (
          <div className="animate-in fade-in duration-500 flex flex-col flex-1 text-left">
            <h3 className="text-4xl font-bold text-stone-900 mb-6 italic break-words leading-tight font-serif underline decoration-stone-800/10 underline-offset-8">{currentPost?.title || "Sin título"}</h3>
            <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-sm shadow-md bg-stone-900/5">
              {currentPost?.image && <img src={currentPost.image} className="w-full h-full object-cover grayscale-[0.1]" alt="" />}
            </div>
            
            {/* LIKES Y DISLIKES DEL POST */}
            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-2">
                <ThumbsUp size={16} className="text-blue-600 fill-blue-600/10" />
                <span className="text-xs font-serif font-bold text-stone-700">{currentPost?.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown size={16} className="text-red-600 fill-red-600/10" />
                <span className="text-xs font-serif font-bold text-stone-700">{currentPost?.dislikes?.length || 0}</span>
              </div>
            </div>

            <button onClick={() => setView('comments')} className="mt-auto flex items-center gap-2 text-stone-500 hover:text-stone-800 transition-all group">
              <MessageCircle size={14} />
              <span className="text-[10px] font-serif font-bold uppercase tracking-wider border-b border-stone-400/30 group-hover:border-stone-800">Ver comentarios ({currentPost?.comments?.length || 0})</span>
            </button>
          </div>
        ) : view === 'comments' ? (
          <div className="animate-in slide-in-from-right-4 duration-500 flex flex-col h-full text-left">
            <h3 className="text-2xl font-bold text-stone-900 mb-1 italic font-serif leading-tight">Comentarios:</h3>
            <p className="text-lg text-amber-900/80 mb-8 font-serif italic border-b border-stone-800/10 pb-4">"{currentPost?.title}"</p>
            <div className="bg-white/40 p-6 rounded-sm border border-stone-800/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-stone-600"><User size={14} /><span className="text-[10px] uppercase tracking-widest font-bold">{user?.name}</span></div>
              <textarea value={commentForm} onChange={(e) => setCommentForm(e.target.value)} placeholder="¿Qué piensas?" className="w-full bg-transparent border-none outline-none resize-none font-serif italic text-stone-800 text-sm h-32" />
              <button onClick={onSaveComment} className="mt-4 w-full bg-[#0c0a09] text-[#f2e8cf] py-3 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-all">Publicar</button>
            </div>
            <button onClick={() => setView('reading')} className="mt-auto flex items-center gap-2 text-stone-500 hover:text-stone-900 text-[9px] uppercase tracking-widest font-bold italic"><ChevronLeft size={12}/> Volver</button>
          </div>
        ) : null}
      </div>
      <div className="absolute bottom-6 left-12 opacity-30 font-serif text-[9px] uppercase tracking-[0.3em] font-bold text-stone-600">Pág. {currentPage * 2 + 1}</div>
    </div>
  );
}

export function RightPage({ view, user, currentPost, newPost, handleNewPostChange, handleFileChange, fileInputRef, handleSavePost, setView, setCurrentPage, postsLength, setShowQuiz, onDeleteComment, onVoteComment, onReplyComment }) {
  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-r-xl relative bg-[#f2e8cf] border-r-[24px] border-[#0c0a09] shadow-[inset_-15px_0_20px_rgba(0,0,0,0.2)]">
      <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
      <div className="flex-1">
        {view === 'comments' ? (
          <div className="animate-in fade-in duration-500 h-full flex flex-col text-left">
             <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#78350f] mb-8 border-b border-[#78350f]/10 pb-2">HILO DE DISCUSIÓN</h3>
             <div className="paper-scroll overflow-y-auto pr-4 max-h-[500px] space-y-8">
                {currentPost?.comments?.length > 0 ? [...currentPost.comments].reverse().map((c) => (
                  <CommentItem key={c.id} c={c} user={user} onVote={onVoteComment} onDelete={onDeleteComment} onReply={onReplyComment} />
                )) : <p className="text-stone-400 font-serif italic text-sm text-center mt-20">No hay hilos aún.</p>}
             </div>
          </div>
        ) : view === 'reading' ? (
          <div className="h-full flex flex-col animate-in fade-in duration-500 text-left">
            <div className="w-full text-center mb-6"><span className="text-[10px] text-[#78350f] font-black uppercase tracking-[0.4em] border-b border-[#78350f]/10 pb-1">{currentPost?.date ? formatViewDate(currentPost.date) : "FECHA"}</span></div>
            <div className="paper-scroll overflow-y-auto pr-4 max-h-[520px]">
              <p className="text-stone-900/90 text-justify font-serif italic leading-[1.7] text-[1.2rem]">{currentPost?.content || "..."}</p>
              {currentPost && <div className="mt-8 pt-6 border-t border-stone-800/10 flex justify-center"><button onClick={() => setShowQuiz(true)} className="bg-stone-900 text-[#f2e8cf] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all">¿Has terminado?</button></div>}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-700 h-full flex flex-col justify-center">
            <form onSubmit={handleSavePost} className="space-y-5">
              <input type="text" name="title" value={newPost.title} onChange={handleNewPostChange} placeholder="Título..." className="w-full bg-transparent border-b border-stone-800/20 py-1 text-xl italic outline-none text-stone-900 font-serif" required />
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
              <button type="button" onClick={() => fileInputRef?.current?.click()} className="w-full flex items-center justify-center gap-2 border border-stone-800/10 py-2 rounded text-[9px] uppercase tracking-[0.2em] text-stone-600 font-serif italic"><Upload size={14} /> Foto</button>
              <textarea name="content" value={newPost.content} onChange={handleNewPostChange} placeholder="Contenido..." rows={8} className="w-full bg-stone-900/5 border border-stone-800/10 p-4 text-sm font-serif italic outline-none resize-none" required />
              <button type="submit" className="w-full bg-[#0c0a09] text-[#f2e8cf] text-[9px] uppercase tracking-[0.3em] py-3 rounded-sm font-bold flex items-center justify-center gap-2"><Send size={12}/> Publicar</button>
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