const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

// GET /users (Lấy tất cả user)
router.get('/users', userController.getUsers);

// POST /users (Tạo user mới)
router.post('/users', userController.createUser);

// PUT /users/:id (Sửa user - Hoạt động 7)
router.put('/users/:id', userController.updateUser);

// DELETE /users/:id (Xóa user - Hoạt động 7)
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
