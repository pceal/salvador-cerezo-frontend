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

  const handleSaveComment = async () => {
    if (!commentForm.trim() || !user) return;
    const currentPost = posts[currentPage];
    const postRef = doc(db, "posts", currentPost.id);
    const newComment = {
      text: commentForm,
      userId: user.uid,
      userName: user.name || user.displayName || "Lector",
      date: new Date().toISOString(),
    };
    try {
      await updateDoc(postRef, { comments: arrayUnion(newComment) });
      setCommentForm("");
    } catch (error) { console.error(error); }
  };

  const handleDeleteComment = async (commentObj) => {
    if (!window.confirm("¿Borrar este comentario?")) return;
    const currentPost = posts[currentPage];
    const postRef = doc(db, "posts", currentPost.id);
    try {
      await updateDoc(postRef, { comments: arrayRemove(commentObj) });
    } catch (error) { console.error(error); }
  };

  // NUEVA FUNCIÓN PARA ACTUALIZAR EL COMENTARIO
  const handleUpdateComment = async (oldComment, newText) => {
    const currentPost = posts[currentPage];
    const postRef = doc(db, "posts", currentPost.id);
    const updatedComment = { ...oldComment, text: newText };
    try {
      // En Firebase para editar en un array: borramos el viejo y añadimos el nuevo
      await updateDoc(postRef, { comments: arrayRemove(oldComment) });
      await updateDoc(postRef, { comments: arrayUnion(updatedComment) });
    } catch (error) { console.error(error); }
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

  const handleDeletePost = async (post) => {
    if (!post?.id) return;
    if (window.confirm(`¿Borrar: "${post.title}"?`)) {
      try { await deleteDoc(doc(db, "posts", post.id)); } catch (error) { console.error(error); }
    }
  };

  const handleEditInit = (post) => {
    setPostForm({ id: post.id, title: post.title, content: post.content, image: post.image });
    setView('create-post');
  };

  const handleSavePost = async (e) => {
    if (e) e.preventDefault();
    const data = { title: postForm.title, content: postForm.content, image: postForm.image || "", author: user?.name || "Salvador" };
    try {
      if (postForm.id) { await updateDoc(doc(db, "posts", postForm.id), data); }
      else { await addDoc(collection(db, "posts"), { ...data, createdAt: new Date(), date: new Date().toISOString().split('T')[0], comments: [] }); }
      setPostForm({ id: null, title: "", image: null, content: "" });
      setView('reading');
    } catch (error) { console.error(error); }
  };

  return (
    <>
      <LeftPage 
        view={view} user={user} currentPost={posts[currentPage]} newPostImage={postForm.image} 
        currentPage={currentPage} setCurrentPage={setCurrentPage} setView={setView} 
        setPostForm={setPostForm} onEdit={handleEditInit} onDelete={handleDeletePost}
        commentForm={commentForm} setCommentForm={setCommentForm} onSaveComment={handleSaveComment}
      />
      <RightPage 
        view={view} user={user} currentPost={posts[currentPage]} newPost={postForm} 
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
        onUpdateComment={handleUpdateComment} // PASAMOS LA FUNCIÓN
      />

      {showQuiz && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm text-center">
          <div className="bg-[#1a1a1a] border border-[#c5a059]/30 p-8 max-w-sm w-full shadow-2xl mx-4">
            {quizStep === 'like' ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <p className="text-white uppercase text-[11px] tracking-widest mb-6">¿Te ha gustado la publicación?</p>
                <div className="flex gap-4">
                  <button onClick={() => handleLikeAction(true)} className="flex-1 bg-white/5 border border-white/10 py-2 text-[10px] uppercase hover:bg-white hover:text-black transition-all text-white">Sí</button>
                  <button onClick={() => handleLikeAction(false)} className="flex-1 bg-white/5 border border-white/10 py-2 text-[10px] uppercase hover:bg-red-900/20 hover:text-red-400 transition-all text-white">No</button>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-4 duration-300">
                <p className="text-white uppercase text-[11px] tracking-widest mb-6">¿Quieres dejar tu comentario?</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setView('comments'); setShowQuiz(false); setQuizStep('like'); }} className="w-full bg-[#c5a059] text-black py-2.5 text-[9px] font-bold uppercase tracking-widest">Sí, ir a comentarios</button>
                  <button onClick={() => { setShowQuiz(false); setQuizStep('like'); }} className="text-[8px] uppercase opacity-40 hover:opacity-100 mt-2 text-white">Ahora no</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}