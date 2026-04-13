const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadAvatar } = require('../middleware/upload.middleware');

// ========================
// PUBLIC ROUTES (no authentication)
// ========================
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/chefs', userController.getAllChefs);      
router.get('/:id', userController.getUserById);        

// ========================
// PROTECTED ROUTES (authentication required)
// ========================
router.post('/logout', protect, userController.logout);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, uploadAvatar.single('avatar'), userController.updateProfile);
router.post('/change-password', protect, userController.changePassword);
router.patch('/avatar', protect, uploadAvatar.single('avatar'), userController.updateAvatar);
// ========================
// ADMIN ROUTES
// ========================
router.get('/', protect, adminOnly, userController.getAllUsers);
router.delete('/:id', protect, adminOnly, userController.deactivateUser);

module.exports = router;