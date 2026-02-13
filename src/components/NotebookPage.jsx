import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Image as ImageIcon, Send, Upload, 
  Edit3, Trash2, ThumbsUp, ThumbsDown, MessageCircle, User, 
  Reply, Lock, Unlock, Search, ShieldCheck, 
} from 'lucide-react';

// IMPORTANTE: Importamos la base de datos aquí para que el componente sea autónomo
import { db } from '../api/firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc, updateDoc, query } from 'firebase/firestore';

// --- COMPONENTES AUXILIARES ---

const formatViewDate = (dateString) => {
  if(!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

/**
 * COMPONENTE USERMANAGEMENT (Lógica interna e independiente)
 */
const UserManagement = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Lógica de Firebase interna
  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error cargando usuarios:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const onToggleBlock = async (uid, isBlocked) => {
    try {
      await updateDoc(doc(db, "users", uid), { isBlocked });
    } catch (error) { console.error(error); }
  };

  const onDeleteUser = async (uid) => {
    if (window.confirm("¿Eliminar este lector permanentemente?")) {
      try {
        await deleteDoc(doc(db, "users", uid));
      } catch (error) { console.error(error); }
    }
  };

  const filteredUsers = users
    .filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center">
        <ShieldCheck size={48} className="text-red-800 mb-4 opacity-20" />
        <p className="font-serif italic text-stone-500">Acceso restringido.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 text-left">
      <div className="mb-8 border-b border-stone-800/10 pb-4">
        <h2 className="text-3xl font-bold text-stone-900 font-serif italic mb-4">Gestión de Usuarios</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input 
            type="text" 
            placeholder="Buscar lector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-stone-900/5 border border-stone-800/10 rounded-sm py-2 pl-10 pr-4 text-sm font-serif italic outline-none focus:border-stone-800/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 paper-scroll">
        {loading ? (
          <p className="text-center font-serif italic text-stone-400">Abriendo registros...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-stone-400 border-b border-stone-800/5">
                <th className="text-left pb-4 font-black">Usuario</th>
                <th className="text-right pb-4 font-black">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/5">
              {filteredUsers.map((user) => (
                <tr key={user.uid} className={`group hover:bg-stone-800/5 transition-colors ${user.isBlocked ? 'opacity-50' : ''}`}>
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-serif italic text-sm font-bold text-stone-800">{user.name}</span>
                      <span className="text-[10px] text-stone-500 font-mono">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onToggleBlock(user.uid, !user.isBlocked)} className="p-2 text-amber-700">
                        {user.isBlocked ? <Unlock size={14} /> : <Lock size={14} />}
                      </button>
                      <button onClick={() => onDeleteUser(user.uid)} className="p-2 text-red-700">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const CommentItem = ({ c, user, onVote, onDelete, onReply, onEdit, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(c.text);

  const hasLike = c.likes?.includes(user?.uid);
  const hasDislike = c.dislikes?.includes(user?.uid);

  return (
    <div className={`group relative text-left ${level > 0 ? 'ml-6 border-l border-stone-800/10 pl-4 mt-4' : 'border-b border-stone-800/5 pb-6'}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-bold text-amber-900 font-serif italic">{c.userName}</span>
        <span className="text-[8px] text-stone-400 uppercase">{formatViewDate(c.date)}</span>
      </div>

      {isEditing ? (
        <div className="mt-2">
          <textarea 
            value={editText} 
            onChange={(e) => setEditText(e.target.value)}
            className="w-full bg-white/50 border border-stone-800/10 p-2 text-sm font-serif italic outline-none resize-none"
          />
          <div className="flex gap-2 mt-1">
            <button onClick={() => { onEdit(c.id, editText); setIsEditing(false); }} className="text-[8px] bg-stone-900 text-white px-2 py-1 uppercase font-bold">Guardar</button>
            <button onClick={() => setIsEditing(false)} className="text-[8px] text-stone-400 uppercase font-bold">Cancelar</button>
          </div>
        </div>
      ) : (
        <p className="text-stone-800 text-sm font-serif italic leading-relaxed">{c.text}</p>
      )}
      
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-3">
          <button onClick={() => onVote(c.id, true)} className={`flex items-center gap-1 text-[9px] transition-all ${hasLike ? 'text-blue-600 scale-110 font-bold' : 'text-stone-400 hover:text-blue-400'}`}>
            <ThumbsUp size={10} className={hasLike ? "fill-blue-600/20" : ""} /> {c.likes?.length || 0}
          </button>
          <button onClick={() => onVote(c.id, false)} className={`flex items-center gap-1 text-[9px] transition-all ${hasDislike ? 'text-red-600 scale-110 font-bold' : 'text-stone-400 hover:text-red-400'}`}>
            <ThumbsDown size={10} className={hasDislike ? "fill-red-600/20" : ""} /> {c.dislikes?.length || 0}
          </button>
        </div>
        
        <button onClick={() => setIsReplying(!isReplying)} className="text-[8px] uppercase font-bold text-stone-400 hover:text-stone-800 flex items-center gap-1">
          <Reply size={10}/> Responder
        </button>
        
        {user?.uid === c.userId && (
          <div className="flex gap-3">
            <button onClick={() => setIsEditing(!isEditing)} className="text-[8px] uppercase font-bold text-stone-300 hover:text-amber-800">Editar</button>
            <button onClick={() => onDelete(c.id)} className="text-[8px] uppercase font-bold text-stone-300 hover:text-red-800">Borrar</button>
          </div>
        )}
      </div>

      {isReplying && (
        <div className="mt-3 flex gap-2">
          <input value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 bg-white/50 border border-stone-800/10 px-2 py-1 text-xs font-serif italic outline-none" placeholder="Escribe..." />
          <button onClick={() => { onReply(c.id, replyText); setReplyText(""); setIsReplying(false); }} className="bg-stone-900 text-white px-3 py-1 text-[8px] uppercase font-bold">Enviar</button>
        </div>
      )}

      {c.replies?.map(reply => (
        <CommentItem key={reply.id} c={reply} user={user} onVote={onVote} onDelete={onDelete} onReply={onReply} onEdit={onEdit} level={level + 1} />
      ))}
    </div>
  );
};

// --- COMPONENTES PRINCIPALES ---

export function LeftPage({ view, user, currentPost, currentPage, setCurrentPage, setView, commentForm, setCommentForm, onSaveComment, onEditPost, onDeletePost, onVotePost }) {
  const isAdmin = user?.role === 'admin';
  const hasLike = currentPost?.likes?.includes(user?.uid)
const hasDislike = currentPost?.dislikes?.includes(user?.uid)

  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-l-xl bg-[#f2e8cf] border-l-[24px] border-[#0c0a09] shadow-[inset_15px_0_20px_rgba(0,0,0,0.2)] relative">
      <div className="flex-1 flex flex-col">
        {view === 'reading' ? (
          <div className="animate-in fade-in flex flex-col flex-1 text-left">
            <h3 className="text-4xl font-bold text-stone-900 mb-6 italic font-serif underline decoration-stone-800/10">{currentPost?.title || "Sin título"}</h3>
            <div className="w-full aspect-[4/3] mb-4 overflow-hidden rounded-sm shadow-md bg-stone-900/5">
              {currentPost?.image && <img src={currentPost.image} className="w-full h-full object-cover grayscale-[0.1]" alt="" />}
            </div>

            {currentPost && isAdmin && (
              <div className="flex gap-6 mb-6 border-t border-stone-800/10 pt-4">
                <button onClick={() => onEditPost(currentPost)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-amber-800 hover:text-amber-600 transition-colors font-bold italic">
                  <Edit3 size={14} /> EDITAR RELATO
                </button>
                <button onClick={() => onDeletePost(currentPost)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-red-800 hover:text-red-600 transition-colors font-bold italic">
                  <Trash2 size={14} /> BORRAR
                </button>
              </div>
            )}

         <div className="flex gap-6 mb-8">
  {/* BOTÓN LIKE */}
  <button 
    onClick={() => {
      console.log("Clic en Like del Post");
      onVotePost(currentPost?.id, true);
    }}
    className={`flex items-center gap-2 transition-transform active:scale-90 ${hasLike ? 'text-blue-600' : 'text-stone-400 hover:text-blue-500'}`}
  >
    <ThumbsUp size={18} className={hasLike ? "fill-blue-600/20" : ""} />
    <span className="text-xs font-bold">{currentPost?.likes?.length || 0}</span>
  </button>

  {/* BOTÓN DISLIKE */}
  <button 
    onClick={() => {
      console.log("Clic en Dislike del Post");
      onVotePost(currentPost?.id, false);
    }}
    className={`flex items-center gap-2 transition-transform active:scale-90 ${hasDislike ? 'text-red-600' : 'text-stone-400 hover:text-red-500'}`}
  >
    <ThumbsDown size={18} className={hasDislike ? "fill-red-600/20" : ""} />
    <span className="text-xs font-bold">{currentPost?.dislikes?.length || 0}</span>
  </button>
</div>
            
            <button onClick={() => setView('comments')} className="mt-auto mb-20 flex items-center gap-2 text-stone-500 hover:text-stone-800 font-bold text-[10px] uppercase italic tracking-widest">
              <MessageCircle size={14} /> Ver comentarios
            </button>
          </div>
        ) : view === 'comments' ? (
          <div className="animate-in slide-in-from-right-4 flex flex-col h-full text-left">
            <h3 className="text-2xl font-bold text-stone-900 mb-1 italic font-serif">Comentarios:</h3>
            <p className="text-lg text-amber-900/80 mb-8 font-serif italic border-b border-stone-800/10 pb-4 uppercase tracking-tight">"{currentPost?.title}"</p>
            
            <div className="bg-white/40 p-8 rounded-sm border border-stone-800/10 shadow-sm relative mb-6">
              <div className="flex items-center gap-2 mb-4 text-stone-600">
                <User size={14} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-black">{user?.name || user?.displayName || "Lector"}</span>
              </div>
              <textarea 
                value={commentForm} 
                onChange={(e) => setCommentForm(e.target.value)} 
                placeholder="¿Qué piensas?" 
                className="w-full bg-transparent border-none outline-none font-serif italic text-stone-800 text-sm h-32 resize-none" 
              />
              <button 
                onClick={onSaveComment} 
                className="mt-6 w-full bg-[#0c0a09] text-[#f2e8cf] py-3.5 text-[9px] uppercase tracking-[0.2em] font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send size={12} className="rotate-[-20deg]" /> PUBLICAR COMENTARIO
              </button>
            </div>

            <button onClick={() => setView('reading')} className="mt-auto mb-20 text-stone-500 hover:text-stone-900 text-[9px] uppercase font-bold italic flex items-center gap-2 tracking-widest">
              <ChevronLeft size={12}/> VOLVER AL RELATO
            </button>
          </div>
        ) : null}
      </div>
      
      <div className="absolute bottom-6 left-12 flex flex-col items-start gap-1 z-10">
        {view === 'reading' && currentPage > 0 && (
          <button 
            type="button"
            onClick={() => setCurrentPage(currentPage - 1)} 
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors text-[10px] uppercase tracking-widest font-black italic bg-white/20 px-2 py-1 rounded-sm"
          >
            <ChevronLeft size={12}/> Anterior
          </button>
        )}
        <div className="opacity-40 font-serif text-[9px] uppercase tracking-[0.3em] font-bold text-stone-600 ml-1">
          Pág. {currentPage * 2 + 1}
        </div>
      </div>
    </div>
  );
}

export function RightPage({ 
  view, user, currentPost, newPost, handleNewPostChange, handleFileChange, 
  fileInputRef, handleSavePost, setView, setCurrentPage, currentPage, 
  postsLength, setShowQuiz, onDeleteComment, onVoteComment, onReplyComment, 
  onEditComment
}) {
  return (
    <div className="w-1/2 pt-14 pb-16 px-12 flex flex-col rounded-r-xl relative bg-[#f2e8cf] border-r-[24px] border-[#0c0a09] shadow-[inset_-15px_0_20px_rgba(0,0,0,0.2)]">
      <div className="flex-1">
        {/* Aquí insertamos el componente autónomo */}
        {view === 'user-management' ? (
          <UserManagement currentUser={user} />
        ) : view === 'comments' ? (
          <div className="animate-in fade-in h-full flex flex-col text-left">
             <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-[#78350f] mb-8 border-b border-[#78350f]/10 pb-2">HILO DE DISCUSIÓN</h3>
             <div className="paper-scroll overflow-y-auto pr-4 max-h-[500px] space-y-8">
                {currentPost?.comments?.length > 0 ? [...currentPost.comments].reverse().map((c) => (
                  <CommentItem key={c.id} c={c} user={user} onVote={onVoteComment} onDelete={onDeleteComment} onReply={onReplyComment} onEdit={onEditComment} />
                )) : <p className="text-stone-400 italic text-sm text-center mt-20 font-serif">No hay hilos aún.</p>}
             </div>
          </div>
        ) : view === 'reading' ? (
          <div className="h-full flex flex-col text-left animate-in fade-in">
            <div className="w-full text-center mb-6">
              <span className="text-[10px] text-[#78350f] font-black uppercase tracking-[0.4em] border-b border-[#78350f]/10 pb-1">
                {currentPost?.date ? formatViewDate(currentPost.date) : "FECHA"}
              </span>
            </div>
            <div className="paper-scroll overflow-y-auto pr-4 max-h-[520px]">
              <p className="text-stone-900/90 text-justify font-serif italic leading-[1.7] text-[1.2rem]">{currentPost?.content || "..."}</p>
              {currentPost && <div className="mt-8 pt-6 border-t border-stone-800/10 flex justify-center"><button onClick={() => setShowQuiz(true)} className="bg-stone-900 text-[#f2e8cf] px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] w-full italic">¿Has terminado?</button></div>}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSavePost} className="space-y-5 animate-in fade-in">
            <input type="text" name="title" value={newPost.title} onChange={handleNewPostChange} placeholder="Título..." className="w-full bg-transparent border-b border-stone-800/20 py-1 text-xl font-serif italic outline-none" required />
            <button type="button" onClick={() => fileInputRef?.current?.click()} className="w-full border border-stone-800/10 py-2 text-[9px] uppercase tracking-[0.2em] font-serif italic flex items-center justify-center gap-2"><Upload size={14}/> Foto</button>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
            <textarea name="content" value={newPost.content} onChange={handleNewPostChange} placeholder="Contenido..." rows={8} className="w-full bg-stone-900/5 border border-stone-800/10 p-4 text-sm font-serif italic outline-none resize-none" required />
            <button type="submit" className="w-full bg-[#0c0a09] text-[#f2e8cf] py-3 text-[9px] uppercase font-bold tracking-widest flex items-center justify-center gap-2"><Send size={12}/> Publicar</button>
          </form>
        )}
      </div>
      <div className="absolute bottom-6 right-12 z-10">
        {view === 'reading' && (
          <button 
            type="button"
            onClick={() => setCurrentPage(p => Math.min(postsLength - 1, p + 1))} 
            className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 transition-colors text-[10px] uppercase tracking-widest font-black italic bg-white/20 px-2 py-1 rounded-sm"
          >
            Siguiente <ChevronRight size={12}/>
          </button>
        )}
      </div>
    </div>
  );
}