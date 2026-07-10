const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên'],
        },
        email: {
            type: String,
            required: [true, 'Vui lòng nhập email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Email không hợp lệ',
            ],
        },
        password: {
            type: String,
            required: [true, 'Vui lòng nhập mật khẩu'],
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer',
        },
        phone: {
            type: String,
            default: '',
        },
        address: {
            type: String,
            default: '',
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);