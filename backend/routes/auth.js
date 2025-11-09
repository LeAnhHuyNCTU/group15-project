const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes (cần token)
router.get('/me', protect, authController.getMe);

// Profile routes - Hoạt động 2
router.get('/profile', protect, authController.viewProfile);
router.put('/profile', protect, authController.updateProfile);

module.exports = router;
