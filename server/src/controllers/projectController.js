const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    const { title, description, members } = req.body;
    try {
        const project = await Project.create({
            title,
            description,
            owner: req.user._id,
            members: members || []
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjects = async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'Admin') {
            projects = await Project.find().populate('owner', 'name email').populate('members', 'name email');
        } else {
            projects = await Project.find({
                $or: [
                    { owner: req.user._id },
                    { members: { $in: [req.user._id] } }
                ]
            }).populate('owner', 'name email').populate('members', 'name email');
        }
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'name email')
            .populate('members', 'name email');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
