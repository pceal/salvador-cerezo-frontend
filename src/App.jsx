import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.js'; 
import BookCover from './components/BookCover'; 
import BookmarkMenu from './components/Bookmark.jsx';
import PostManager from './components/Posts.jsx';
import WelcomeView from './components/WelcomeView'; 
import SearchFilter from './components/SearchFilter';

export default function App() {
  const { user, isAuthenticated, registerAndLogin, logout, loading } = useAuth();
  
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [view, setView] = useState('welcome'); 
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Almacén central de publicaciones sincronizado con Firebase
  const [posts, setPosts] = useState([]); 

  // --- Lógica para conectar Menú Lateral con PostManager ---
  const [postToEdit, setPostToEdit] = useState(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif uppercase text-[10px] tracking-widest">Cargando...</div>;

  const showOpenedBook = isAuthenticated || isBookOpen;

  const handleAuthAction = async (e, type) => {
    e.preventDefault();
    const isLogin = type === 'login';
    const result = await registerAndLogin(formData.email, formData.password, isLogin ? null : formData.name);

    if (result.success) {
      setView(isLogin ? 'reading' : 'welcome');
      setIsMinimized(true);
    }
  };

  // Función para manejar los cambios en el formulario (VITAL PARA PODER ESCRIBIR)
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#e5e1d8] flex items-center justify-center p-8 overflow-hidden font-serif text-[#333]">
      <style>{`
        .bookmark-shape { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 92%, 0% 100%); }
        .tab-shape { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
      `}</style>

      <div className="relative" style={{ perspective: '2000px' }}>
        {!showOpenedBook ? (
          <BookCover 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubmit={(e) => handleAuthAction(e, formData.name ? 'register' : 'login')} 
            setIsBookOpen={setIsBookOpen} 
          />
        ) : (
          <div className="flex w-[1100px] h-[720px] shadow-2xl bg-[#fdfcf8] rounded-md relative animate-in zoom-in-95 duration-700">
            
            {/* VISTAS DEL LIBRO */}
            {view === 'welcome' ? (
              <WelcomeView onNavigate={() => setView('reading')} />
            ) : view === 'search-posts' ? (
              <SearchFilter 
                setView={setView} 
                allPosts={posts} 
                setCurrentPage={setCurrentPage}
              /> 
            ) : (
              <PostManager 
                view={view} 
                setView={setView} 
                user={user} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage}
                setGlobalPosts={setPosts}
                // Pasamos el post a editar si viene desde el menú
                externalPostToEdit={postToEdit}
                setExternalPostToEdit={setPostToEdit}
              />
            )}

            {/* MENÚ MARCAPÁGINAS */}
            <BookmarkMenu 
              isMinimized={isMinimized} 
              setIsMinimized={setIsMinimized}
              isAuthenticated={isAuthenticated} 
              user={user} 
              activeMenu={activeMenu} 
              setActiveMenu={setActiveMenu} 
              handleLogin={(e) => handleAuthAction(e, 'login')}
              formData={formData}
              handleInputChange={handleInputChange} // <--- ESTO ES LO QUE TE PERMITE ESCRIBIR
              handleLogoutAction={() => { logout(); setView('welcome'); setIsBookOpen(false); }}
              setView={setView}
              
              // Props para Editar y Borrar desde el menú
              currentPost={posts[currentPage]} 
              onEdit={(post) => {
                setPostToEdit(post);
                setView('create-post');
              }}
              onDelete={async (id) => {
                // Lógica de borrado vinculada a PostManager
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}