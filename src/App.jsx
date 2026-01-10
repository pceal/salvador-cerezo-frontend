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

  // --- ALMACÉN CENTRAL DE PUBLICACIONES ---
  const [posts, setPosts] = useState([]); 

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
            handleInputChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})} 
            handleSubmit={(e) => handleAuthAction(e, formData.name ? 'register' : 'login')} 
            setIsBookOpen={setIsBookOpen} 
          />
        ) : (
          <div className="flex w-[1100px] h-[720px] shadow-2xl bg-[#fdfcf8] rounded-md relative animate-in zoom-in-95 duration-700">
            
            {/* RENDERIZADO DE VISTAS */}
            {view === 'welcome' ? (
              <WelcomeView onNavigate={() => setView('reading')} />
            ) : view === 'search-posts' ? (
              <SearchFilter 
                setView={setView} 
                allPosts={posts} // 🔍 El buscador lee del almacén central
                setCurrentPage={setCurrentPage}
              /> 
            ) : (
              <PostManager 
                view={view} 
                setView={setView} 
                user={user} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage}
                setGlobalPosts={setPosts} // 💾 Función para que el hijo guarde los datos aquí
              />
            )}

            <BookmarkMenu 
              isMinimized={isMinimized} setIsMinimized={setIsMinimized}
              isAuthenticated={isAuthenticated} user={user} 
              activeMenu={activeMenu} setActiveMenu={setActiveMenu} 
              handleLogoutAction={() => { logout(); setView('welcome'); setIsBookOpen(false); }}
              setView={setView}
            />
          </div>
        )}
      </div>
    </div>
  );
}