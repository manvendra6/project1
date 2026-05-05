const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    const { title, description, status, priority, assignedTo, project, dueDate } = req.body;
    try {
        const task = await Task.create({
            title,
            description,
            status,
            priority,
            assignedTo,
            project,
            dueDate
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId })
            .populate('assignedTo', 'name email')
            .populate('project', 'title');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        let query = {};
        if (req.user.role !== 'Admin') {
            query = { assignedTo: req.user._id };
        }
        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email')
            .populate('project', 'title');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
