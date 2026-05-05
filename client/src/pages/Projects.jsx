import React, { useState, useEffect } from 'react';
import { getProjects, createProject, deleteProject } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, X, LayoutGrid, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({ title: '', description: '' });

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setNewProject({ title: '', description: '' });
      setShowModal(false);
      fetchProjects();
    } catch (error) {
      alert('Failed to create project');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will be removed.')) {
      try {
        await deleteProject(id);
        fetchProjects();
      } catch (error) {
        alert('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-indigo-400 font-bold text-lg">Loading Projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Project Hub</h1>
          <p className="text-slate-400 font-medium italic">"Great things are done by a series of small things brought together."</p>
        </div>
        {user?.role === 'Admin' && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-3 px-8 shadow-xl shadow-indigo-600/20"
          >
            <Plus size={24} /> 
            <span className="text-lg">New Workspace</span>
          </motion.button>
        )}
      </motion.div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-20 text-center space-y-6 border-dashed border-2 border-white/5 bg-transparent"
        >
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
            <LayoutGrid size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">No Projects Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Get started by creating your first project workspace and adding team members.</p>
          </div>
          {user?.role === 'Admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors flex items-center gap-2 mx-auto"
            >
              <Plus size={18} /> Create Project Now
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project._id}
                project={project}
                isAdmin={user?.role === 'Admin'}
                onDelete={handleDelete}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-card max-w-xl w-full p-10 space-y-8 relative"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={24} />
              </button>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">New Workspace</h2>
                <p className="text-slate-400 font-medium">Define the scope and objectives for your new project.</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 ml-1">Workspace Title</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Q3 Marketing Sprint"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 ml-1">Project Objective</label>
                  <textarea
                    className="input-field min-h-[150px] resize-none"
                    placeholder="What are we aiming to achieve? Briefly describe the goals..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
                
                <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-4">
                   <Info size={20} className="text-indigo-400 mt-0.5 shrink-0" />
                   <p className="text-xs text-slate-400 leading-relaxed">
                     As an administrator, you will be the owner of this workspace. You can invite team members and assign tasks after creation.
                   </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 px-6 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all border border-white/5 cursor-pointer"
                  >
                    Discard
                  </button>
                  <button type="submit" className="flex-[2] btn-primary py-4 text-lg">
                    Launch Workspace
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
