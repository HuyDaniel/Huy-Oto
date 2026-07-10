const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Liên kết với bảng User để biết ai mua
        },
        orderItems: [
            {
                name: { type: String, required: true },
                qty: { type: Number, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product', // Liên kết với sản phẩm để trừ kho
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
            default: 'Pending', // Các trạng thái: Pending, Processing, Shipped, Delivered, Cancelled
        },
    },
    {
        timestamps: true, // Tự động thêm ngày tạo đơn (createdAt)
    }
);

module.exports = mongoose.model('Order', orderSchema);