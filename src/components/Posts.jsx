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

  // FUNCIÓN DE BÚSQUEDA QUIRÚRGICA
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
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // ID ÚNICO GARANTIZADO
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

  const handleVoteComment = async (commentId, isLike) => {
    if (!user || !commentId) return;
    const currentPost = posts[currentPage];
    const postRef = doc(db, "posts", currentPost.id);

    const newTree = updateSpecificComment(currentPost.comments, commentId, (c) => {
      let currentLikes = Array.isArray(c.likes) ? [...c.likes] : [];
      let currentDislikes = Array.isArray(c.dislikes) ? [...c.dislikes] : [];

      if (isLike) {
        if (currentLikes.includes(user.uid)) {
          // ESTA LÍNEA QUITA EL LIKE SI YA EXISTE
          currentLikes = currentLikes.filter(id => id !== user.uid);
        } else {
          currentLikes.push(user.uid);
          currentDislikes = currentDislikes.filter(id => id !== user.uid);
        }
      } else {
        if (currentDislikes.includes(user.uid)) {
          // ESTA LÍNEA QUITA EL DISLIKE SI YA EXISTE
          currentDislikes = currentDislikes.filter(id => id !== user.uid);
        } else {
          currentDislikes.push(user.uid);
          currentLikes = currentLikes.filter(id => id !== user.uid);
        }
      }
      return { ...c, likes: currentLikes, dislikes: currentDislikes };
    });

    try {
      await updateDoc(postRef, { comments: newTree });
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

  const handleSavePost = async (e) => {
    if (e) e.preventDefault();
    const data = { title: postForm.title, content: postForm.content, image: postForm.image || "", author: user?.name || "Salvador" };
    try {
      if (postForm.id) { await updateDoc(doc(db, "posts", postForm.id), data); }
      else { await addDoc(collection(db, "posts"), { ...data, createdAt: new Date(), date: new Date().toISOString().split('T')[0], comments: [], likes: [], dislikes: [] }); }
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

  return (
    <>
      <LeftPage 
        view={view} user={user} currentPost={posts[currentPage]} 
        currentPage={currentPage} setCurrentPage={setCurrentPage} setView={setView} 
        commentForm={commentForm} setCommentForm={setCommentForm} onSaveComment={() => handleSaveComment()}
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
        onDeleteComment={handleDeleteComment} onVoteComment={handleVoteComment} onReplyComment={handleSaveComment}
      />
      {showQuiz && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-[#c5a059]/30 p-8 max-w-sm w-full shadow-2xl mx-4 text-center text-white">
            {quizStep === 'like' ? (
              <div>
                <p className="uppercase text-[11px] tracking-widest mb-6">¿Te gusta?</p>
                <div className="flex gap-4">
                  <button onClick={() => handleLikeAction(true)} className="flex-1 border border-white/10 py-2 text-[10px] uppercase hover:bg-white hover:text-black">Sí</button>
                  <button onClick={() => handleLikeAction(false)} className="flex-1 border border-white/10 py-2 text-[10px] uppercase hover:bg-red-900/40">No</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="uppercase text-[11px] tracking-widest mb-6">¿Comentar?</p>
                <button onClick={() => { setView('comments'); setShowQuiz(false); setQuizStep('like'); }} className="w-full bg-[#c5a059] text-black py-2.5 text-[9px] font-bold uppercase">Ir a comentarios</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}