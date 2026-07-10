const Category = require('../models/category');

// @desc    Lấy tất cả danh mục
// @route   GET /api/categories
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tải danh mục' });
    }
};

module.exports = { getCategories };