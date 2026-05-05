const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask, getAllTasks } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getAllTasks)
    .post(protect, authorize('Admin'), createTask);

router.route('/project/:projectId')
    .get(protect, getTasks);

router.route('/:id')
    .put(protect, updateTask)
    .delete(protect, authorize('Admin'), deleteTask);

module.exports = router;
