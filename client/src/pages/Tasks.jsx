import React, { useState, useEffect } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask, getProjects } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckCircle2, Clock, Trash2, ChevronDown, ListTodo, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '', project: '', status: 'Todo', priority: 'Medium' });

  const fetchTasks = async () => {
    try {
      const { data } = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
      if (data.length > 0) setNewTask(prev => ({ ...prev, project: data[0]._id }));
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      alert('Failed to create task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status });
      fetchTasks();
    } catch (error) {
      alert('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const filteredTasks = tasks.filter(task => filter === 'All' || task.status === filter);

  const statusColors = {
    'Todo': 'bg-slate-700/50 text-slate-400 border-white/5',
    'In Progress': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Done': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  };

  const filterCounts = {
    'All': tasks.length,
    'Todo': tasks.filter(t => t.status === 'Todo').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    'Done': tasks.filter(t => t.status === 'Done').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-indigo-400 font-bold text-lg">Loading Tasks...</p>
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
          <h1 className="text-4xl font-black text-white tracking-tight">Task Center</h1>
          <p className="text-slate-400 font-medium italic">"Action is the foundational key to all success."</p>
        </div>
        {user?.role === 'Admin' && (
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-3 px-8 shadow-xl shadow-indigo-600/20"
          >
            <Plus size={24} /> 
            <span className="text-lg">Add Task</span>
          </motion.button>
        )}
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        {/* Filter Bar */}
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-800/40">
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {['All', 'Todo', 'In Progress', 'Done'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  filter === s 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {s}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                  filter === s ? 'bg-white/20' : 'bg-white/5'
                }`}>
                  {filterCounts[s]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
             <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
               Displaying {filteredTasks.length} {filter === 'All' ? '' : filter} Tasks
             </span>
          </div>
        </div>

        {/* Task Items */}
        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={task._id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-slate-800/20 transition-all group gap-4"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className={`p-3 rounded-2xl border border-white/5 ${
                    task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500' :
                    task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-slate-700/50 text-slate-400'
                  }`}>
                    {task.status === 'Done' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{task.title}</h4>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">{task.project?.title}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} /> {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pl-14 sm:pl-0">
                  <div className="relative">
                    <select 
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border ${statusColors[task.status]} outline-none bg-slate-900/50 cursor-pointer appearance-none pr-10`}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-3">
                    {user?.role === 'Admin' && (
                      <button 
                        onClick={() => handleDelete(task._id)}
                        className="p-3 rounded-xl bg-slate-900/50 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5 cursor-pointer"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredTasks.length === 0 && (
            <div className="p-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
                 <ListTodo size={32} />
               </div>
               <p className="text-slate-500 font-medium italic">No tasks found matching this criteria.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Create Task Modal */}
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
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <X size={24} />
              </button>

              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white">Create New Task</h2>
                <p className="text-slate-400 font-medium">Break down your workspace objectives into actionable items.</p>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 ml-1">Task Deliverable</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="e.g. Design High-Fidelity Prototypes"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-1">Workspace</label>
                    <select 
                      className="input-field appearance-none"
                      value={newTask.project}
                      onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                    >
                      {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 ml-1">Initial Priority</label>
                    <select 
                      className="input-field appearance-none"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 px-6 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all border border-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] btn-primary py-4 text-lg">
                    Assign Task
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

export default Tasks;
