const express = require('express');
const router = express.Router();
const { createUser, getAllUsers } = require('../controllers/userController');

// POST - user
router.post('/', createUser);

// GET - user
router.get('/', getAllUsers);

module.exports = router;
