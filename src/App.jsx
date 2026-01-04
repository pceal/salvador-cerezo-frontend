import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.js'; 
import BookCover from './components/BookCover';
import BookmarkMenu from './components/Bookmark.jsx';
import PostManager from './components/Posts.jsx';

export default function App() {
  const { user, isAuthenticated, registerAndLogin, logout, loading } = useAuth();
  
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [view, setView] = useState('reading'); 
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  if (loading) return <div className="min-h-screen bg-[#e5e1d8] flex items-center justify-center font-serif uppercase text-[10px] tracking-widest">Cargando...</div>;

  const showOpenedBook = isAuthenticated || isBookOpen;

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
            handleRegister={(e) => { e.preventDefault(); registerAndLogin(formData.email, formData.password, formData.name); }} 
            setIsBookOpen={setIsBookOpen} 
          />
        ) : (
          <div className="flex w-[1100px] h-[720px] shadow-2xl bg-[#fdfcf8] rounded-md relative animate-in zoom-in-95 duration-700">
            
            <PostManager 
              view={view} 
              setView={setView} 
              user={user} 
              currentPage={currentPage} 
              setCurrentPage={setCurrentPage} 
            />

            <BookmarkMenu 
              isMinimized={isMinimized} setIsMinimized={setIsMinimized}
              isAuthenticated={isAuthenticated} user={user} 
              activeMenu={activeMenu} setActiveMenu={setActiveMenu} 
              handleLogin={(e) => { e.preventDefault(); registerAndLogin(formData.email, formData.password); }}
              formData={formData} handleInputChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              handleLogoutAction={logout} setView={setView}
            />
          </div>
        )}
      </div>
    </div>
  );
}