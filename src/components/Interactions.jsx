import React from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Reply } from 'lucide-react';

export default function Interactions({ 
  item,          // La publicación o comentario
  user,          // Usuario actual de useAuth
  onLike,        // Función para actualizar en DB
  onDislike,     // Función para actualizar en DB
  onReply,       // Función para abrir el cuadro de texto
  isComment = false 
}) {
  
  const hasLiked = item.likes?.includes(user?.uid);
  const hasDisliked = item.dislikes?.includes(user?.uid);

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex items-center gap-4 text-white/60">
        {/* Botón Like */}
        <button 
          onClick={() => onLike(item.id)}
          className={`flex items-center gap-1 hover:text-orange-200 transition-colors ${hasLiked ? 'text-orange-400' : ''}`}
        >
          <ThumbsUp size={14} fill={hasLiked ? "currentColor" : "none"} />
          <span className="text-[10px]">{item.likes?.length || 0}</span>
        </button>

        {/* Botón Dislike */}
        <button 
          onClick={() => onDislike(item.id)}
          className={`flex items-center gap-1 hover:text-red-400 transition-colors ${hasDisliked ? 'text-red-500' : ''}`}
        >
          <ThumbsDown size={14} fill={hasDisliked ? "currentColor" : "none"} />
          <span className="text-[10px]">{item.dislikes?.length || 0}</span>
        </button>

        {/* Botón Comentar/Responder */}
        <button 
          onClick={() => onReply(item.id)}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          {isComment ? <Reply size={14} /> : <MessageSquare size={14} />}
          <span className="text-[10px]">{isComment ? 'Responder' : 'Comentar'}</span>
        </button>
      </div>
    </div>
  );
}