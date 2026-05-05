import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllTasks, getProjects } from '../services/api';
import { CheckCircle2, Clock, AlertCircle, LayoutGrid, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const statCardStyles = {
  indigo: {
    iconBg: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    hoverBorder: 'hover:border-indigo-500/30',
    glow: 'group-hover:shadow-indigo-500/10',
  },
  blue: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    hoverBorder: 'hover:border-blue-500/30',
    glow: 'group-hover:shadow-blue-500/10',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/30',
    glow: 'group-hover:shadow-emerald-500/10',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    hoverBorder: 'hover:border-amber-500/30',
    glow: 'group-hover:shadow-amber-500/10',
  },
};

const StatCard = ({ title, value, icon, color, delay = 0 }) => {
  const style = statCardStyles[color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`glass-card p-6 flex items-center justify-between group ${style.hoverBorder} cursor-pointer`}
    >
      <div className="space-y-1">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${style.iconBg} ${style.iconColor} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, projects: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [tasksRes, projectsRes] = await Promise.all([
          getAllTasks(),
          getProjects()
        ]);
        
        const tasks = tasksRes.data;
        setRecentTasks(tasks.slice(0, 5));
        
        setStats({
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'Done').length,
          pending: tasks.filter(t => t.status !== 'Done').length,
          projects: projectsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-indigo-400 font-bold text-lg">Loading Workspace...</p>
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
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 font-medium">Welcome back, <span className="text-indigo-400 font-bold">@{user?.name?.split(' ')[0]?.toLowerCase()}</span>. Here's your project status.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-800/50 rounded-xl border border-white/5">
          <Calendar size={18} className="text-indigo-400" />
          <span className="text-sm font-bold text-slate-300">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={stats.projects} icon={<LayoutGrid size={28} />} color="indigo" delay={0.1} />
        <StatCard title="Active Tasks" value={stats.total} icon={<Clock size={28} />} color="blue" delay={0.2} />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 size={28} />} color="emerald" delay={0.3} />
        <StatCard title="Pending" value={stats.pending} icon={<AlertCircle size={28} />} color="amber" delay={0.4} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 glass-card p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10">
                <TrendingUp size={20} className="text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black text-white">Recent Activity</h2>
            </div>
            <button
              onClick={() => navigate('/tasks')}
              className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
            >
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentTasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'Done' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                    task.status === 'In Progress' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-500'
                  }`} />
                  <div>
                    <p className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">{task.title}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">{task.project?.title || 'Main Workspace'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                     task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                     task.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-700/50 text-slate-400 border-white/5'
                   }`}>
                    {task.status}
                  </span>
                </div>
              </motion.div>
            ))}
            {recentTasks.length === 0 && <p className="text-slate-500 text-center py-10 font-medium italic">No recent tasks to display.</p>}
          </div>
        </motion.div>

        {/* Quick Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-br from-slate-800/70 to-indigo-900/20"
        >
          <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 shadow-2xl shadow-indigo-500/20 animate-bounce-slow">
            <LayoutGrid size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Create Workspace</h2>
            <p className="text-slate-400 text-sm font-medium px-4">Start a new project and invite your team to collaborate in real-time.</p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="btn-primary w-full py-4 text-lg"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
