import React, { useState, useRef, useEffect } from 'react';
import { LeftPage, RightPage } from './NotebookPage';
import { db } from '../api/firebaseConfig'; 
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export default function PostManager({ view, setView, user, currentPage, setCurrentPage, setGlobalPosts }) {
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ id: null, title: "", image: null, content: "" });
  const [commentForm, setCommentForm] = useState("");
  const fileInputRef = useRef(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState('like');

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(docs);
      if (setGlobalPosts) setGlobalPosts(docs);
    });
    return () => unsubscribe();
  }, [setGlobalPosts]);

  // --- LÓGICA DE ADMINISTRACIÓN DE POSTS ---
  const handleEditPost = (post) => {
    setPostForm({ id: post.id, title: post.title, content: post.content, image: post.image });
    setView('create-post');
  };

  const handleDeletePost = async (post) => {
    if (!post?.id) return;
    if (window.confirm(`¿Estás seguro de que quieres borrar el relato: "${post.title}"?`)) {
      try {
        await deleteDoc(doc(db, "posts", post.id));
        if (currentPage > 0 && currentPage === posts.length - 1) {
          setCurrentPage(prev => prev - 1);
        }
      } catch (error) {
        console.error("Error al borrar el post:", error);
      }
    }
  };

  // FUNCIÓN DE BÚSQUEDA RECURSIVA PARA COMENTARIOS ANIDADOS
  const updateSpecificComment = (list, targetId, updateFn) => {
    return list.map(c => {
      if (c.id === targetId) return updateFn(c);
      if (c.replies && c.replies.length > 0) {
        return { ...c, replies: updateSpecificComment(c.replies, targetId, updateFn) };
      }
      return c;
    });
  };

  const handleSaveComment = async (parentId = null, textValue = commentForm) => {
    if (!textValue.trim() || !user) return;
    const currentPost = posts[currentPage];
    const postRef = doc(db, "posts", currentPost.id);

    const newComment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text: textValue,
      userId: user.uid,
      userName: user.name || user.displayName || "Lector",
      date: new Date().toISOString(),
      likes: [],
      dislikes: [],
      replies: []
    };

    try {
      if (!parentId) {
        await updateDoc(postRef, { comments: arrayUnion(newComment) });
        setCommentForm("");
      } else {
        const updatedComments = updateSpecificComment(currentPost.comments, parentId, (c) => ({
          ...c, replies: [...(c.replies || []), newComment]
        }));
        await updateDoc(postRef, { comments: updatedComments });
      }
    } catch (error) { console.error(error); }
  };

  const handleEditComment = async (commentId, newText) => {
    if (!newText.trim() || !user) return;
    const currentPost = posts[currentPage];
    const postRef = doc(db, "posts", currentPost.id);
    const newTree = updateSpecificComment(currentPost.comments, commentId, (c) => ({ ...c, text: newText }));
    try { await updateDoc(postRef, { comments: newTree }); } catch (error) { console.error(error); }
  };

  const handleVoteComment = async (commentId, isLike) => {
    if (!user || !commentId) return;
    const currentPost = posts[currentPage];
    const postRef = doc(db, "posts", currentPost.id);
    const newTree = updateSpecificComment(currentPost.comments, commentId, (c) => {
      let currentLikes = Array.isArray(c.likes) ? [...c.likes] : [];
      let currentDislikes = Array.isArray(c.dislikes) ? [...c.dislikes] : [];
      if (isLike) {
        if (currentLikes.includes(user.uid)) { currentLikes = currentLikes.filter(id => id !== user.uid); }
        else { currentLikes.push(user.uid); currentDislikes = currentDislikes.filter(id => id !== user.uid); }
      } else {
        if (currentDislikes.includes(user.uid)) { currentDislikes = currentDislikes.filter(id => id !== user.uid); }
        else { currentDislikes.push(user.uid); currentLikes = currentLikes.filter(id => id !== user.uid); }
      }
      return { ...c, likes: currentLikes, dislikes: currentDislikes };
    });
    try { await updateDoc(postRef, { comments: newTree }); } catch (error) { console.error(error); }
  };

  const handleLikeAction = async (isLike) => {
    const currentPost = posts[currentPage];
    if (!currentPost || !user) return;
    const postRef = doc(db, "posts", currentPost.id);
    try {
      if (isLike) { await updateDoc(postRef, { likes: arrayUnion(user.uid), dislikes: arrayRemove(user.uid) }); }
      else { await updateDoc(postRef, { dislikes: arrayUnion(user.uid), likes: arrayRemove(user.uid) }); }
      setQuizStep('comment'); 
    } catch (error) { console.error(error); }
  };

  const handleSavePost = async (e) => {
    if (e) e.preventDefault();
    const data = { title: postForm.title, content: postForm.content, image: postForm.image || "", author: user?.name || "Salvador" };
    try {
      if (postForm.id) { 
        await updateDoc(doc(db, "posts", postForm.id), data); 
      }
      else { 
        await addDoc(collection(db, "posts"), { 
          ...data, 
          createdAt: new Date(), 
          date: new Date().toISOString().split('T')[0], 
          comments: [], 
          likes: [], 
          dislikes: [] 
        }); 
      }
      setPostForm({ id: null, title: "", image: null, content: "" });
      setView('reading');
    } catch (error) { console.error(error); }
  };

  const handleDeleteComment = async (id) => {
    if (!window.confirm("¿Borrar?")) return;
    const postRef = doc(db, "posts", posts[currentPage].id);
    const filterRec = (list) => list.filter(c => c.id !== id).map(c => ({...c, replies: filterRec(c.replies || [])}));
    await updateDoc(postRef, { comments: filterRec(posts[currentPage].comments) });
  };

  const currentPost = posts[currentPage];

  return (
    <>
      <LeftPage 
        view={view} user={user} currentPost={currentPost} 
        currentPage={currentPage} setCurrentPage={setCurrentPage} setView={setView} 
        commentForm={commentForm} setCommentForm={setCommentForm} onSaveComment={() => handleSaveComment()}
        onEditPost={handleEditPost} onDeletePost={handleDeletePost}
        setPostForm={setPostForm}
      />
      <RightPage 
        view={view} user={user} currentPost={currentPost} newPost={postForm} 
        handleNewPostChange={(e) => setPostForm({ ...postForm, [e.target.name]: e.target.value })} 
        handleFileChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPostForm({ ...postForm, image: ev.target.result });
            reader.readAsDataURL(file);
          }
        }} 
        handleSavePost={handleSavePost} fileInputRef={fileInputRef} setView={setView} 
        setCurrentPage={setCurrentPage} postsLength={posts.length} setShowQuiz={setShowQuiz}
        onDeleteComment={handleDeleteComment} 
        onVoteComment={handleVoteComment} 
        onReplyComment={handleSaveComment}
        onEditComment={handleEditComment} 
      />
      {showQuiz && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="bg-[#111] border border-stone-800 p-10 max-w-sm w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] mx-4 text-center">
            {quizStep === 'like' ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <p className="font-serif italic text-stone-400 text-sm mb-2">Lectura finalizada</p>
                <p className="uppercase text-[12px] font-black tracking-[0.3em] mb-10 text-white">¿Te ha gustado el relato?</p>
                <div className="flex gap-4">
                  <button onClick={() => handleLikeAction(true)} className="flex-1 bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-200 transition-all">Sí</button>
                  <button onClick={() => handleLikeAction(false)} className="flex-1 border border-stone-700 text-stone-400 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-red-900 hover:text-red-500 transition-all">No</button>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <p className="font-serif italic text-stone-400 text-sm mb-2">Gracias por tu voto</p>
                <p className="uppercase text-[12px] font-black tracking-[0.2em] mb-10 text-white leading-relaxed">
                  {currentPost?.comments?.length > 0 
                    ? "Otros lectores han opinado, ¿quieres dejar tu huella?" 
                    : "¿Quieres ser el primero en comentar este relato?"}
                </p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setView('comments'); setShowQuiz(false); setQuizStep('like'); }} className="w-full bg-[#f2e8cf] text-black py-4 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">Escribir ahora</button>
                  <button onClick={() => { setShowQuiz(false); setQuizStep('like'); }} className="w-full py-3 text-stone-500 text-[9px] uppercase font-bold tracking-widest hover:text-stone-300">Quizás luego</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  ); 
}