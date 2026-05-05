import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={22} /> },
    { name: 'Projects', path: '/projects', icon: <FolderKanban size={22} /> },
    { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={22} /> },
  ];

  if (user?.role === 'Admin') {
    links.push({ name: 'Team', path: '/team', icon: <Users size={22} /> });
  }

  return (
    <aside className={`fixed left-0 bottom-0 top-20 w-64 border-r border-white/5 p-6 space-y-10 bg-slate-950/80 backdrop-blur-xl z-40 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="space-y-4">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Navigation</p>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) => 
                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 font-bold' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="transition-transform group-hover:scale-110">{link.icon}</span>
              <span className="text-sm tracking-wide">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Management</p>
        <div className="flex flex-col gap-2">
           <button className="flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 hover:bg-white/5 hover:text-white transition-all group cursor-pointer">
             <Settings size={22} className="group-hover:rotate-45 transition-transform" />
             <span className="text-sm tracking-wide">Settings</span>
           </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 right-6">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/10 space-y-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-700">
            <Zap size={80} />
          </div>
          <div className="space-y-1 relative">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Authorized as</p>
            <p className="text-lg font-black text-white italic">{user?.role || 'Guest'}</p>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-500 w-2/3 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
