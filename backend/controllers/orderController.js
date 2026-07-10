const Order = require('../models/order');
const Product = require('../models/product');

// @desc    Tạo đơn hàng mới & Tự động trừ kho
// @route   POST /api/orders
// @access  Private (Chỉ user đã đăng nhập mới đặt được)
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng đang trống' });
        }

        // 1. Tạo đơn hàng mới trong database
        const order = new Order({
            user: req.user._id, // Lấy ID của user từ Middleware protect truyền sang
            orderItems,
            shippingAddress,
            totalPrice,
        });

        const createdOrder = await order.save();

        // 2. Logic ăn điểm: Vòng lặp chạy qua từng món hàng để trừ số lượng tồn kho (stock)
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock -= item.qty; // Trừ số lượng khách mua
                await product.save();
            }
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
    }
};

module.exports = { createOrder };