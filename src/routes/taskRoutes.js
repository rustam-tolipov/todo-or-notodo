const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  toggleTaskComplete,
} = require('../controllers/taskController');

// POST task
router.post('/', createTask);

// GET tasks
router.get('/', getAllTasks);

// PATCH task
router.patch('/:id/complete', toggleTaskComplete);

module.exports = router;
