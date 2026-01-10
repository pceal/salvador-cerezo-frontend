import React, { useState, useRef, useEffect } from 'react';
import { LeftPage, RightPage } from './NotebookPage';
import { db } from '../api/firebaseConfig'; 
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

// AÑADIMOS setGlobalPosts a las props
export default function PostManager({ view, setView, user, currentPage, setCurrentPage, setGlobalPosts }) {
  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ id: null, title: "", image: null, content: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // 1. Actualizamos el estado local (para el libro)
      setPosts(docs);
      
      // 2. IMPORTANTE: Actualizamos el estado global (para el buscador)
      if (setGlobalPosts) {
        setGlobalPosts(docs);
      }
    });
    return () => unsubscribe();
  }, [setGlobalPosts]); // Añadimos la dependencia

  const handleFormChange = (e) => {
    setPostForm({ ...postForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600; 
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressed = canvas.toDataURL('image/jpeg', 0.5);
          setPostForm({ ...postForm, image: compressed });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePost = async (e) => {
    console.log("Intentando guardar publicación...");
    
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!postForm.title || !postForm.content) {
      alert("Por favor, rellena el título y el relato.");
      return;
    }

    try {
      const nuevoPost = {
        title: postForm.title,
        content: postForm.content,
        image: postForm.image || "",
        author: user?.name || "Salvador",
        createdAt: new Date(),
        // GUARDAMOS LA FECHA COMPLETA PARA EL BUSCADOR
        date: new Date().toISOString().split('T')[0] 
      };

      const docRef = await addDoc(collection(db, "posts"), nuevoPost);
      console.log("Documento guardado con ID:", docRef.id);

      setPostForm({ id: null, title: "", image: null, content: "" });
      setView('reading');
      setCurrentPage(0);
      
    } catch (error) {
      console.error("Error detallado en Firebase:", error);
      alert("Error de Firebase: " + error.message);
    }
  };

  return (
    <>
      <LeftPage 
        view={view} user={user} currentPost={posts[currentPage]} 
        newPostImage={postForm.image} currentPage={currentPage} 
        setCurrentPage={setCurrentPage} setView={setView} setPostForm={setPostForm} 
      />
      <RightPage 
        view={view} currentPost={posts[currentPage]} newPost={postForm} 
        handleNewPostChange={handleFormChange} handleFileChange={handleFileChange} 
        handleSavePost={handleSavePost} fileInputRef={fileInputRef}
        setView={setView} setCurrentPage={setCurrentPage} postsLength={posts.length}
      />
    </>
  );
}