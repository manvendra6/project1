import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, Search, Command, Menu } from 'lucide-react';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 z-[60] border-b border-white/5 bg-slate-900/60 backdrop-blur-2xl flex items-center justify-between px-4 md:px-10">
      <div className="flex items-center gap-4 md:gap-12">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-white/5 cursor-pointer"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-xl shadow-indigo-500/20 text-lg md:text-xl transition-all group-hover:rotate-12 group-hover:scale-110">
            P
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter gradient-text uppercase italic">ProTrack</span>
        </div>

        <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-slate-800/40 rounded-2xl border border-white/5 text-slate-500 w-96 group focus-within:border-indigo-500/30 transition-all shadow-inner">
           <Search size={18} className="group-focus-within:text-indigo-400 transition-colors" />
           <span className="text-sm font-medium">Search workspace...</span>
           <div className="ml-auto flex items-center gap-1.5 opacity-40">
              <Command size={14} />
              <span className="text-[10px] font-black">K</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <button className="text-slate-500 hover:text-white transition-colors relative p-2 hover:bg-white/5 rounded-xl cursor-pointer">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
        </button>
        
        {user && (
          <div className="flex items-center gap-3 md:gap-5 pl-4 md:pl-8 border-l border-white/5">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black text-white tracking-wide uppercase">{user.name}</span>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.role}</span>
              </div>
            </div>
            <button 
              onClick={logout}
              className="p-3 md:p-3.5 rounded-2xl bg-slate-800/80 hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 shadow-lg cursor-pointer"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
