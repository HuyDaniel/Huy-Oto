const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user'); // 🟢 Cần import thêm User để đếm tổng tài khoản

// @desc    Tạo đơn hàng mới & Tự động trừ kho
// @route   POST /api/orders
// @access  Public (Mở cửa cho cả khách vãng lai)
const createOrder = async (req, res) => {
    try {
        // Lấy thêm user từ req.body (nếu khách vãng lai thì user sẽ là null)
        const { user, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng đang trống' });
        }

        // 1. Tạo đơn hàng mới trong database
        const order = new Order({
            user: user || null, // 🟢 Sửa lại: Dùng ID từ Frontend gửi xuống hoặc để null
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // 2. Logic ăn điểm: Vòng lặp chạy qua từng món hàng để trừ số lượng tồn kho (stock)
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                // Đảm bảo không bị trừ âm kho
                product.stock = Math.max(0, product.stock - (item.qty || item.quantity)); 
                await product.save();
            }
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('Lỗi tạo đơn:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo đơn hàng' });
    }
};

// @desc    Lấy thông kê cho Dashboard 
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        const orders = await Order.find({});
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name');

        res.json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue,
            recentOrders
        });
    } catch (error) {
        console.error('Lỗi thống kê:', error);
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu thống kê' });
    }
};
// @desc    Lấy tất cả đơn hàng (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        // Lấy danh sách đơn, sắp xếp mới nhất lên đầu, kèm thông tin user (nếu có)
        const orders = await Order.find({})
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách đơn hàng' });
    }
};

// @desc    Cập nhật trạng thái đơn hàng (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn hàng' });
    }
};
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tải lịch sử đơn hàng' });
    }
};

module.exports = { createOrder, getDashboardStats, getOrders, updateOrderStatus, getMyOrders };