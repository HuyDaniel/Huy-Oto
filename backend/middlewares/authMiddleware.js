const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware xác thực token của người dùng công khai
const protect = async (req, res, next) => {
    let token;

    // Kiểm tra xem token có được gửi kèm trong header Authorization hay không
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Tách chuỗi để lấy token định dạng: Bearer <token>
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token bằng JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm user trong database dựa theo ID giải mã và loại bỏ trường password khỏi kết quả
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Cho phép tiếp tục chuyển sang Controller xử lý tiếp theo
        } catch (error) {
            res.status(401).json({ message: 'Không có quyền truy cập, token không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không có quyền truy cập, thiếu token' });
    }
};

// Middleware kiểm tra quyền Quản trị viên (Admin)
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Quyền truy cập bị từ chối, yêu cầu tài khoản Admin' });
    }
};

module.exports = { protect, admin };