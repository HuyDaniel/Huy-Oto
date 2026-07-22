const express = require('express');
const router = express.Router();
const { updateUserProfile, getUsers, deleteUser } = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware'); 

router.put('/profile', protect, updateUserProfile);

// 🟢 Các route dành riêng cho Admin
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;