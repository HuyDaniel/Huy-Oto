const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getDashboardStats, 
    getOrders, 
    updateOrderStatus,
    getMyOrders // 🟢 Đã import hàm
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Các route của Admin
router.get('/stats', protect, admin, getDashboardStats);
router.get('/', protect, admin, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

// 🟢 Route lấy đơn hàng cá nhân (Phải đặt TRÊN các route có :id nếu có)
router.get('/myorders', protect, getMyOrders);

// Route tạo đơn hàng
router.post('/', createOrder);

module.exports = router;