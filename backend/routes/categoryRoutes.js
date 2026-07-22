const express = require('express');
const router = express.Router();
const { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/', getCategories); // Ai cũng xem được danh mục
router.post('/', protect, admin, createCategory); // Chỉ Admin mới được tạo
router.put('/:id', protect, admin, updateCategory); // Chỉ Admin mới được sửa
router.delete('/:id', protect, admin, deleteCategory); // Chỉ Admin mới được xóa

module.exports = router;