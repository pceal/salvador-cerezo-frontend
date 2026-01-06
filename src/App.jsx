import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.js'; 
import BookCover from './components/BookCover'; // Tu componente de la piel del libro
import BookmarkMenu from './components/Bookmark.jsx';
import PostManager from './components/Posts.jsx';
import WelcomeView from './components/WelcomeView'; // El componente de la foto y frase

export default function App() {
  const { user, isAuthenticated, registerAndLogin, logout, loading } = useAuth();
  
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [view, setView] = useState('welcome'); 
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif uppercase text-[10px] tracking-widest">Cargando...</div>;

  const showOpenedBook = isAuthenticated || isBookOpen;

  const handleAuthAction = async (e, type) => {
    e.preventDefault();
    const isLogin = type === 'login';
    const result = await registerAndLogin(
      formData.email, 
      formData.password, 
      isLogin ? null : formData.name
    );

    if (result.success) {
      if (isLogin) {
        setView('reading');
      } else {
        setView('welcome');
      }
      setIsMinimized(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5e1d8] flex items-center justify-center p-8 overflow-hidden font-serif text-[#333]">
      <style>{`
        .bookmark-shape { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 92%, 0% 100%); }
        .tab-shape { clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%); }
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
            
            {view === 'welcome' ? (
              <WelcomeView onNavigate={() => setView('reading')} />
            ) : (
              <PostManager 
                view={view} 
                setView={setView} 
                user={user} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
              />
            )}

            <BookmarkMenu 
              isMinimized={isMinimized} setIsMinimized={setIsMinimized}
              isAuthenticated={isAuthenticated} user={user} 
              activeMenu={activeMenu} setActiveMenu={setActiveMenu} 
              handleLogin={(e) => handleAuthAction(e, 'login')}
              formData={formData} handleInputChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              
              /* MODIFICACIÓN AQUÍ: Cerramos el libro al salir */
              handleLogoutAction={() => { 
                logout(); 
                setView('welcome'); 
                setIsBookOpen(false); // <--- Esto cierra el libro físicamente
              }}
              
              setView={setView}
            />
          </div>
        )}
      </div>
    </div>
  );
}