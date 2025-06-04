const express = require("express");
const router = express.Router();
const { createTask, getAllTasks } = require("../controllers/taskController");

// POST task
router.post("/", createTask);

// GET tasks
router.get("/", getAllTasks);

module.exports = router;
