const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, // 🟢 Đổi thành FALSE để khách không có tài khoản vẫn mua được
            ref: 'User', 
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product', 
                },
            },
        ],
        shippingAddress: {
            address: { type: String, required: true },
            phone: { type: String, required: true },
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            required: true,
            default: 'Pending', 
        },
    },
    {
        timestamps: true, 
    }
);

module.exports = mongoose.model('Order', orderSchema);