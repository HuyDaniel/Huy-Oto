const Product = require('../models/product');

// @desc    Lấy danh sách tất cả phụ tùng
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tải sản phẩm' });
    }
};

// @desc    Lọc phụ tùng theo Hãng xe, Dòng xe và Đời xe
// @route   GET /api/products/filter?brand=...
const filterProductsByCar = async (req, res) => {
    try {
        const { brand, model, year } = req.query;
        if (!brand || !model || !year) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin Hãng, Dòng và Đời xe' });
        }

        const matchedProducts = await Product.find({
            compatibility: {
                $elemMatch: {
                    brand: brand,
                    model: model,
                    year: { $regex: year }
                }
            }
        }).populate('category', 'name');

        res.json(matchedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi trong quá trình lọc phụ tùng' });
    }
};

// @desc    Lấy chi tiết 1 sản phẩm
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm này' });
        }
    } catch (error) {
        res.status(500).json({ message: 'ID sản phẩm không hợp lệ hoặc lỗi server' });
    }
};

// @desc    Tạo mới một sản phẩm (Dành cho Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        // 🟢 Đã fix: Bắt dữ liệu thật từ Frontend gửi lên thay vì hardcode
        const { name, sku, price, stock, category, compatibility, images, description } = req.body;

        const product = new Product({
            name,
            sku,
            price,
            stock, // 🟢 Vẫn giữ nguyên biến stock theo đúng thiết kế gốc của bạn
            category,
            compatibility: compatibility || [],
            images: images || [],
            description
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error('Lỗi tạo SP:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo sản phẩm' });
    }
};

// @desc    Cập nhật thông tin sản phẩm (Dành cho Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
    try {
        const { name, sku, price, stock, category, compatibility, images, description } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.sku = sku || product.sku;
            product.price = price !== undefined ? price : product.price;
            
            // 🟢 Đã fix: Bắt điều kiện rõ ràng để sửa tồn kho về 0 không bị lỗi
            product.stock = stock !== undefined ? stock : product.stock;
            
            product.category = category || product.category;
            product.compatibility = compatibility || product.compatibility;
            product.images = images || product.images;
            product.description = description || product.description;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm cần sửa' });
        }
    } catch (error) {
        console.error('Lỗi cập nhật SP:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật sản phẩm' });
    }
};

// @desc    Xóa sản phẩm (Dành cho Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Đã xóa sản phẩm thành công khỏi hệ thống' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm cần xóa' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
    }
};

module.exports = { getProducts, filterProductsByCar, getProductById, createProduct, updateProduct, deleteProduct };