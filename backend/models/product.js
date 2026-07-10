const mongoose = require('mongoose');

const compatibilitySchema = new mongoose.Schema(
    {
        brand: { type: String, required: true }, // VD: Toyota
        model: { type: String, required: true }, // VD: Camry
        year: { type: String, required: true }   // VD: 2018-2022
    },
    { _id: false } // Không cần tạo _id riêng cho sub-document này
);

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Vui lòng nhập tên phụ tùng'],
            trim: true,
        },
        sku: {
            type: String,
            required: [true, 'Vui lòng nhập mã SKU'],
            unique: true,
            uppercase: true,
        },
        price: {
            type: Number,
            required: [true, 'Vui lòng nhập giá sản phẩm'],
            min: 0,
        },
        stock: {
            type: Number,
            required: [true, 'Vui lòng nhập số lượng tồn kho'],
            min: 0,
            default: 0,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        compatibility: [compatibilitySchema],
        images: [
            {
                type: String,
                required: true,
            }
        ],
        description: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);