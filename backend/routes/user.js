const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// GET /users (Lấy tất cả user)
router.get('/users', userController.getUsers);

// POST /users (Tạo user mới)
router.post('/users', userController.createUser);

module.exports = router;
