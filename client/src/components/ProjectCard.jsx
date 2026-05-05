import React from 'react';
import { ExternalLink, Trash2, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, isAdmin, onDelete, index = 0 }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-8 group hover:border-indigo-500/40 flex flex-col h-full bg-gradient-to-br from-slate-800/80 to-slate-900/50 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg">
          <ExternalLink size={28} />
        </div>
        {isAdmin && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(project._id); }}
            className="p-3 rounded-xl bg-slate-900/50 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5 cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
      <div className="flex-grow space-y-3">
        <h3 className="text-2xl font-black text-white leading-tight group-hover:text-indigo-400 transition-colors">{project.title}</h3>
        <p className="text-slate-400 text-sm font-medium line-clamp-3 leading-relaxed">{project.description || "No description provided."}</p>
      </div>
      <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <Users size={16} className="text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-widest">{project.members?.length || 0} Members</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar size={14} />
            <span className="text-[10px] font-bold uppercase">{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Owner: {project.owner?.name?.split(' ')[0] || 'System'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
