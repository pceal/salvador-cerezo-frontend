import React from 'react';
// Añadido Search a las importaciones
import { Bookmark, Maximize2, Minimize2, FileText, Book, Calendar, Users, ChevronDown, LogOut, Eye, Plus, Edit3, Trash2, Search } from 'lucide-react';

export default function BookmarkMenu({ isMinimized, setIsMinimized, isAuthenticated, user, activeMenu, setActiveMenu, handleLogin, formData, handleInputChange, handleLogoutAction, setView }) {
  
  const AdminSubmenu = ({ type }) => {
    const config = {
      publicaciones: { 
        items: [
          { label: 'Ver Todas', icon: <Eye size={10}/>, action: () => { setView('reading'); setActiveMenu(null); } }, 
          // NUEVA OPCIÓN: Buscar
          { label: 'Buscar', icon: <Search size={10}/>, action: () => { setView('search-posts'); setActiveMenu(null); } },
          { label: 'Crear Nueva', icon: <Plus size={10}/>, action: () => { setView('create-post'); setActiveMenu(null); } },
        
        ] 
      },
      libros: { items: [{ label: 'Ver Biblioteca', icon: <Eye size={10}/> }, { label: 'Añadir Libro', icon: <Plus size={10}/> }] },
      eventos: { items: [{ label: 'Crear Evento', icon: <Plus size={10}/> }] },
      usuarios: { items: [{ label: 'Listado', icon: <Users size={10}/> }] }
    };

    return (
      <div className="w-full mt-1 space-y-0.5 animate-in slide-in-from-top-1 pl-2">
        {config[type].items.map((item, idx) => (
          <button 
            key={idx} 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (item.action) item.action(); 
            }} 
            className="w-full text-left px-3 py-1 text-[7px] hover:bg-white/10 rounded flex items-center gap-2 transition-colors opacity-70 hover:opacity-100 uppercase tracking-widest"
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    );
  };

  // ... (Resto del componente BookmarkMenu se mantiene igual)
  return (
    <div 
      className={`absolute left-1/2 transition-all duration-700 z-50 shadow-[5px_5px_20px_rgba(0,0,0,0.4)] flex flex-col items-center text-white overflow-hidden
      ${isMinimized 
        ? '-top-[330px] w-12 h-[410px] tab-shape bg-[#78350f] cursor-pointer' 
        : '-top-10 w-44 h-[550px] bookmark-shape bg-[#78350f]' 
      }`}
      onClick={() => isMinimized && setIsMinimized(false)}
    >
      {/* ... el resto del JSX que ya tienes ... */}
      {isMinimized ? (
        <div className="w-full h-full relative"> 
          <div className="absolute top-[323px] left-[55%] -translate-x-1/2 flex flex-col items-center">
            <span className="vertical-text text-[10px] font-medium uppercase tracking-[0.3em] leading-none text-orange-200/90 whitespace-nowrap">
              MENÚ
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full pt-12 flex flex-col no-scrollbar overflow-y-auto relative">
          {isAuthenticated && (
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} className="absolute top-8 right-2 opacity-30 hover:opacity-100 p-2 z-10">
              <Minimize2 size={14}/>
            </button>
          )}
          {!isAuthenticated ? (
            <div className="px-4 flex-1 flex flex-col pt-10">
              <Bookmark className="mb-4 self-center text-orange-200" size={16}/>
              <form onSubmit={handleLogin} className="space-y-6">
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border-b border-white/10 p-2 text-[9px] outline-none" placeholder="Email"/>
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full bg-white/5 border-b border-white/10 p-2 text-[9px] outline-none" placeholder="Clave"/>
                <button className="w-full bg-[#c5a059] text-black py-2.5 font-black uppercase text-[8px]">Entrar</button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col flex-1 px-3">
              <div className="flex flex-col items-center mb-6 opacity-60">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[10px] mb-2 bg-white/5">{user?.name?.charAt(0)}</div>
                <span className="text-[7px] uppercase tracking-[0.3em] font-bold">{user?.role}</span>
              </div>
              <div className="space-y-2">
                {['publicaciones', 'libros', 'eventos', 'usuarios'].map(menuId => (
                  <div key={menuId}>
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === menuId ? null : menuId); }} className={`w-full flex items-center justify-between p-2.5 rounded ${activeMenu === menuId ? 'bg-white/10' : ''}`}>
                      <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest">
                        {menuId === 'publicaciones' && <FileText size={12}/>}
                        {menuId === 'libros' && <Book size={12}/>}
                        {menuId === 'eventos' && <Calendar size={12}/>}
                        {menuId === 'usuarios' && <Users size={12}/>}
                        {menuId}
                      </div>
                      <ChevronDown size={10} className={activeMenu === menuId ? 'rotate-180' : ''}/>
                    </button>
                    {activeMenu === menuId && <AdminSubmenu type={menuId}/>}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleLogoutAction} 
                className="mt-36 pb-12 text-[8px] uppercase tracking-widest opacity-30 hover:opacity-100 flex items-center gap-2 self-center transition-all"
              >
                <LogOut size={10}/> Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}