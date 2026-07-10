const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    filterProductsByCar, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/productController');

// ⚠️ QUAN TRỌNG: Import 2 cái ổ khóa bảo mật vào
const { protect, admin } = require('../middlewares/authMiddleware');

// Các Route khách hàng (Ai cũng xem được)
router.get('/filter', filterProductsByCar);
router.get('/', getProducts);
router.get('/:id', getProductById); 

// Các Route Admin (Phải qua 2 lớp khóa: đã đăng nhập + có quyền admin)
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;