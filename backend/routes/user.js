const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const userController = require('../controllers/userController.js');

// GET /users (Lấy tất cả user)
router.get('/users', userController.getUsers);

// POST /users (Tạo user mới)
router.post('/users', userController.createUser);

=======
const userController = require('../controllers/userController');

router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);

router.put('/users/:id', userController.updateUser);   // PUT (Sửa)
router.delete('/users/:id', userController.deleteUser); // DELETE (Xóa)

>>>>>>> backend
module.exports = router;
