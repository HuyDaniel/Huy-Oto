import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, List, X } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    // Lấy dữ liệu
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Lỗi fetch danh mục:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Xử lý Modal
    const openModal = (category = null) => {
        if (category) {
            setEditingId(category._id);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingId(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Thêm / Cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/categories/${editingId}`, formData);
                alert('Cập nhật thành công!');
            } else {
                await axiosClient.post('/categories', formData);
                alert('Thêm danh mục mới thành công!');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            console.error('Lỗi submit:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra!');
        }
    };

    // Xóa
    const handleDelete = async (id) => {
        if (window.confirm('Cảnh báo: Bạn có chắc muốn xóa danh mục này? Các sản phẩm thuộc danh mục này có thể bị ảnh hưởng!')) {
            try {
                await axiosClient.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Lỗi xóa:', error);
                alert('Xóa thất bại!');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800 border-l-4 border-primary pl-3 flex items-center gap-2">
                    <List className="w-6 h-6 text-primary" /> QUẢN LÝ DANH MỤC
                </h3>
                <button 
                    onClick={() => openModal()}
                    className="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" /> Thêm Danh Mục
                </button>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                            <th className="py-3 px-6 font-bold w-1/3">Tên Danh Mục</th>
                            <th className="py-3 px-6 font-bold">Mô tả</th>
                            <th className="py-3 px-6 font-bold text-center w-32">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {loading ? (
                            <tr><td colSpan="3" className="text-center py-10 text-gray-500">Đang tải...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan="3" className="text-center py-10 text-gray-500">Chưa có danh mục nào!</td></tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-gray-800">{cat.name}</td>
                                    <td className="py-4 px-6 text-gray-500">{cat.description || <span className="italic text-gray-300">Không có mô tả</span>}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openModal(cat)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Sửa">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(cat._id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors" title="Xóa">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Sửa Danh Mục' : 'Thêm Danh Mục'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="p-6">
                            <form id="categoryForm" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary" placeholder="VD: Hệ thống phanh..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary" placeholder="Nhập thông tin mô tả..."></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} type="button" className="px-4 py-2 text-gray-600 bg-white border rounded-lg hover:bg-gray-100 font-medium">Hủy</button>
                            <button form="categoryForm" type="submit" className="px-4 py-2 text-white bg-primary hover:bg-green-700 rounded-lg font-bold">Lưu lại</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;