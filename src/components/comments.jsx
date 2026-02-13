import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Send, Upload, Edit3, Trash2, ThumbsUp, ThumbsDown, MessageCircle, User, Reply } from 'lucide-react';

const formatViewDate = (dateString) => {
  if(!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const CommentItem = ({ c, user, onVote, onDelete, onReply, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const hasLike = c.likes?.includes(user?.uid);
  const hasDislike = c.dislikes?.includes(user?.uid);

  return (
    <div className={`group relative text-left ${level > 0 ? 'ml-6 border-l border-stone-800/10 pl-4 mt-4' : 'border-b border-stone-800/5 pb-6'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-amber-900 font-serif italic">{c.userName}</span>
        <span className="text-[8px] text-stone-400 uppercase">{formatViewDate(c.date)}</span>
      </div>
      <p className="text-stone-800 text-sm font-serif italic leading-relaxed">{c.text}</p>
      
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-3">
         <button 
  onClick={() => {
    console.log("Clic en LIKE de comentario ID:", c.id);
    onVote(c.id, true); // Asegúrate de que en RightPage se pase como 'onVote'
  }} 
  className={`flex items-center gap-1 text-[9px] transition-all ${hasLike ? 'text-blue-600 scale-110 font-bold' : 'text-stone-400 hover:text-blue-400'}`}
>
  <ThumbsUp size={10} className={hasLike ? "fill-blue-600/20" : ""} /> 
  {c.likes?.length || 0}
</button>

{/* BOTÓN DISLIKE DEL COMENTARIO */}
<button 
  onClick={() => {
    console.log("Clic en DISLIKE de comentario ID:", c.id);
    onVote(c.id, false);
  }} 
  className={`flex items-center gap-1 text-[9px] transition-all ${hasDislike ? 'text-red-600 scale-110 font-bold' : 'text-stone-400 hover:text-red-400'}`}
>
  <ThumbsDown size={10} className={hasDislike ? "fill-red-600/20" : ""} /> 
  {c.dislikes?.length || 0}
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
          <input value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 bg-white/50 border border-stone-800/10 px-2 py-1 text-xs font-serif italic outline-none" placeholder="Escribe..." />
          <button onClick={() => { onReply(c.id, replyText); setReplyText(""); setIsReplying(false); }} className="bg-stone-900 text-white px-3 py-1 text-[8px] uppercase font-bold">Enviar</button>
        </div>
      )}

      {c.replies?.map(reply => (
        <CommentItem key={reply.id} c={reply} user={user} onVote={onVote} onDelete={onDelete} onReply={onReply} level={level + 1} />
      ))}
    </div>
  );
};

export function LeftPage({ view, user, currentPost, currentPage, setCurrentPage, setView, commentForm, setCommentForm, onSaveComment, onVotePost }) {
  // Lógica para detectar si el usuario ya votó el post principal
  const hasLike = currentPost?.likes?.includes(user?.uid);
  const hasDislike = currentPost?.dislikes?.includes(user?.uid);

  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-l-xl bg-[#f2e8cf] border-l-[24px] border-[#0c0a09] shadow-[inset_15px_0_20px_rgba(0,0,0,0.2)] relative">
      <div className="flex-1 flex flex-col">
        {view === 'reading' ? (
          <div className="animate-in fade-in flex flex-col flex-1 text-left">
            <h3 className="text-4xl font-bold text-stone-900 mb-6 italic font-serif underline decoration-stone-800/10">{currentPost?.title || "Sin título"}</h3>
            <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-sm shadow-md bg-stone-900/5">
              {currentPost?.image && <img src={currentPost.image} className="w-full h-full object-cover grayscale-[0.1]" alt="" />}
            </div>
            
            <div className="flex gap-6 mb-8">
              <div className="flex items-center gap-2">
                {/* BOTÓN LIKE PRINCIPAL */}
                <button 
                  onClick={() => {
                    console.log("Voto Like en relato");
                    onVotePost(currentPost?.id, true);
                  }}
                  className={`flex items-center gap-2 transition-all ${hasLike ? 'text-blue-600 scale-105' : 'text-stone-400 hover:text-blue-500'}`}
                >
                  <ThumbsUp size={16} className={hasLike ? "fill-blue-600/20" : ""} />
                  <span className={`text-xs font-bold ${hasLike ? 'text-blue-600' : 'text-stone-700'}`}>{currentPost?.likes?.length || 0}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {/* BOTÓN DISLIKE PRINCIPAL */}
                <button 
                  onClick={() => {
                    console.log("Voto Dislike en relato");
                    onVotePost(currentPost?.id, false);
                  }}
                  className={`flex items-center gap-2 transition-all ${hasDislike ? 'text-red-600 scale-105' : 'text-stone-400 hover:text-red-500'}`}
                >
                  <ThumbsDown size={16} className={hasDislike ? "fill-red-600/20" : ""} />
                  <span className={`text-xs font-bold ${hasDislike ? 'text-red-600' : 'text-stone-700'}`}>{currentPost?.dislikes?.length || 0}</span>
                </button>
              </div>
            </div>
            
            <button onClick={() => setView('comments')} className="mt-auto flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold text-[10px] uppercase italic tracking-widest">
              <MessageCircle size={14} /> Ver comentarios
            </button>
          </div>
        ) : view === 'comments' ? (
          <div className="animate-in slide-in-from-right-4 flex flex-col h-full text-left">
            <h3 className="text-2xl font-bold text-stone-900 mb-8 italic font-serif border-b border-stone-800/10 pb-4">Comentarios</h3>
            <div className="bg-white/40 p-6 rounded-sm border border-stone-800/10">
              <textarea value={commentForm} onChange={(e) => setCommentForm(e.target.value)} placeholder="¿Qué piensas?" className="w-full bg-transparent border-none outline-none font-serif italic text-sm h-32" />
              <button onClick={onSaveComment} className="mt-4 w-full bg-[#0c0a09] text-[#f2e8cf] py-3 text-[9px] uppercase font-bold tracking-widest">Publicar</button>
            </div>
            <button onClick={() => setView('reading')} className="mt-auto text-stone-500 text-[9px] uppercase font-bold italic flex items-center gap-2">
              <ChevronLeft size={12}/> Volver
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function RightPage({ view, user, currentPost, newPost, handleNewPostChange, handleFileChange, fileInputRef, handleSavePost, setView, setCurrentPage, postsLength, setShowQuiz, onDeleteComment, onVoteComment, onReplyComment }) {
  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-r-xl relative bg-[#f2e8cf] border-r-[24px] border-[#0c0a09] shadow-[inset_-15px_0_20px_rgba(0,0,0,0.2)]">
      <div className="flex-1">
        {view === 'comments' ? (
          <div className="animate-in fade-in h-full flex flex-col text-left">
             <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#78350f] mb-8 border-b border-[#78350f]/10 pb-2">HILO DE DISCUSIÓN</h3>
             <div className="paper-scroll overflow-y-auto pr-4 max-h-[500px] space-y-8">
                {currentPost?.comments?.length > 0 ? [...currentPost.comments].reverse().map((c) => (
                  <CommentItem key={c.id} c={c} user={user} onVote={onVoteComment} onDelete={onDeleteComment} onReply={onReplyComment} />
                )) : <p className="text-stone-400 italic text-sm text-center mt-20">No hay hilos aún.</p>}
             </div>
          </div>
        ) : view === 'reading' ? (
          <div className="h-full flex flex-col text-left animate-in fade-in">
            <div className="w-full text-center mb-6">
              <span className="text-[10px] text-[#78350f] font-black uppercase tracking-[0.4em] border-b border-[#78350f]/10 pb-1">
                {currentPost?.date || "FECHA"}
              </span>
            </div>
            <div className="paper-scroll overflow-y-auto pr-4 max-h-[520px]">
              <p className="text-stone-900/90 text-justify font-serif italic leading-[1.7] text-[1.2rem]">{currentPost?.content || "..."}</p>
              {currentPost && <button onClick={() => setShowQuiz(true)} className="mt-8 bg-stone-900 text-[#f2e8cf] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] w-full italic">¿Terminado?</button>}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSavePost} className="space-y-5 animate-in fade-in">
            <input type="text" name="title" value={newPost.title} onChange={handleNewPostChange} placeholder="Título..." className="w-full bg-transparent border-b border-stone-800/20 py-1 text-xl font-serif italic outline-none" required />
            <button type="button" onClick={() => fileInputRef?.current?.click()} className="w-full border border-stone-800/10 py-2 text-[9px] uppercase tracking-[0.2em] font-serif italic">Subir Foto</button>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
            <textarea name="content" value={newPost.content} onChange={handleNewPostChange} placeholder="Contenido..." rows={8} className="w-full bg-stone-900/5 border border-stone-800/10 p-4 text-sm font-serif italic outline-none resize-none" required />
            <button type="submit" className="w-full bg-[#0c0a09] text-[#f2e8cf] py-3 text-[9px] uppercase font-bold tracking-widest">Publicar Historia</button>
          </form>
        )}
      </div>
    </div>
  );
}