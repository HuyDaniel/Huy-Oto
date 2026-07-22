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

// @desc    Tạo danh mục mới (Admin)
// @route   POST /api/categories
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const categoryExists = await Category.findOne({ name });

        if (categoryExists) {
            return res.status(400).json({ message: 'Danh mục này đã tồn tại!' });
        }

        const category = await Category.create({ name, description });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi tạo danh mục' });
    }
};

// @desc    Cập nhật danh mục (Admin)
// @route   PUT /api/categories/:id
const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);

        if (category) {
            category.name = name || category.name;
            category.description = description || category.description;
            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi cập nhật danh mục' });
    }
};

// @desc    Xóa danh mục (Admin)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (category) {
            await Category.deleteOne({ _id: category._id });
            res.json({ message: 'Đã xóa danh mục' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa danh mục' });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };