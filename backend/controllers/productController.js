const Product = require('../models/product');

// @desc    Lấy danh sách tất cả phụ tùng
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        // Dùng .populate() để lấy luôn thông tin chi tiết của danh mục thay vì chỉ lấy cái ID
        const products = await Product.find({}).populate('category', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tải sản phẩm' });
    }
};

// @desc    Lọc phụ tùng theo Hãng xe, Dòng xe và Đời xe
// @route   GET /api/products/filter?brand=Toyota&model=Camry&year=2022
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category', 'name');
        
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm này' });
        }
    } catch (error) {
        // Fix lỗi app bị crash nếu ID truyền vào không đúng định dạng của MongoDB
        res.status(500).json({ message: 'ID sản phẩm không hợp lệ hoặc lỗi server' });
    }
};

const filterProductsByCar = async (req, res) => {
    try {
        const { brand, model, year } = req.query;

        // Nếu khách hàng chưa chọn gì thì trả về mảng rỗng hoặc báo lỗi
        if (!brand || !model || !year) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đủ thông tin Hãng, Dòng và Đời xe' });
        }

        // Toán tử $elemMatch tìm kiếm bên trong mảng 'compatibility' của mỗi sản phẩm
        // Xem có object nào khớp hoàn toàn với 3 tiêu chí khách chọn hay không
        const matchedProducts = await Product.find({
            compatibility: {
                $elemMatch: {
                    brand: brand,
                    model: model,
                    year: { $regex: year } // Dùng regex để tìm tương đối (VD: xe 2022 vẫn lọt vào khoảng "2018-2024")
                }
            }
        }).populate('category', 'name');

        res.json(matchedProducts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi trong quá trình lọc phụ tùng' });
    }
};
// @desc    Tạo mới một sản phẩm (Dành cho Admin)
// @route   POST /api/products
const createProduct = async (req, res) => {
    try {
        // Tạo một sản phẩm mẫu, Admin sẽ dùng hàm Update để sửa lại thông tin thật sau
        const product = new Product({
            name: 'Tên sản phẩm mẫu',
            sku: 'SKU-SAMPLE',
            price: 0,
            stock: 0,
            category: '65a000000000000000000001', // Nhét tạm 1 ID danh mục có sẵn
            compatibility: [],
            images: ['https://via.placeholder.com/150'],
            description: 'Mô tả cho sản phẩm này...'
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
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
            product.price = price || product.price;
            product.stock = stock || product.stock;
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
