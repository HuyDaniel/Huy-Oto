const User = require('../models/user'); 

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone || user.phone;
            user.address = req.body.address || user.address;

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role,
            });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        console.error('Lỗi update profile:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
    }
};

// 🟢 Lấy danh sách tất cả người dùng (Dành cho Admin)
const getUsers = async (req, res) => {
    try {
        // .select('-password') để không trả về chuỗi hash mật khẩu
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách user' });
    }
};

// 🟢 Xóa người dùng (Dành cho Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Chặn Admin tự xóa chính mình để tránh "tự hủy"
            if (user._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: 'Bạn không thể tự xóa tài khoản của chính mình!' });
            }
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'Đã xóa người dùng thành công' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa user' });
    }
};

module.exports = { updateUserProfile, getUsers, deleteUser };