import React, { useState, useRef, useEffect } from 'react';
import { LeftPage, RightPage } from './NotebookPage';
import { db } from '../api/firebaseConfig'; 
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function PostManager({ view, setView, user, currentPage, setCurrentPage, setGlobalPosts }) {
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ id: null, title: "", image: null, content: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(docs);
      if (setGlobalPosts) setGlobalPosts(docs);
    });
    return () => unsubscribe();
  }, [setGlobalPosts]);

  const handleDeletePost = async (post) => {
    if (!post?.id) return;
    if (window.confirm(`¿Estás seguro de que quieres borrar la publicación: "${post.title}"?`)) {
      try {
        await deleteDoc(doc(db, "posts", post.id));
        if (currentPage > 0 && currentPage === posts.length - 1) {
          setCurrentPage(prev => prev - 1);
        }
      } catch (error) {
        console.error("Error al borrar:", error);
      }
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
      if (postForm.id) {
        await updateDoc(doc(db, "posts", postForm.id), data);
      } else {
        await addDoc(collection(db, "posts"), { ...data, createdAt: new Date(), date: new Date().toISOString().split('T')[0] });
      }
      setPostForm({ id: null, title: "", image: null, content: "" });
      setView('reading');
    } catch (error) { console.error(error); }
  };

  return (
    <>
      <LeftPage view={view} user={user} currentPost={posts[currentPage]} newPostImage={postForm.image} currentPage={currentPage} setCurrentPage={setCurrentPage} setView={setView} setPostForm={setPostForm} onEdit={handleEditInit} onDelete={handleDeletePost} />
      <RightPage view={view} currentPost={posts[currentPage]} newPost={postForm} handleNewPostChange={(e) => setPostForm({ ...postForm, [e.target.name]: e.target.value })} handleFileChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => setPostForm({ ...postForm, image: ev.target.result });
          reader.readAsDataURL(file);
        }
      }} handleSavePost={handleSavePost} fileInputRef={fileInputRef} setView={setView} setCurrentPage={setCurrentPage} postsLength={posts.length} />
    </>
  );
}