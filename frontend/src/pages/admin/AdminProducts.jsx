import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Image as ImageIcon, Box, Tag, Upload } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        category: '',
        image: '',
        stock: '',
        description: ''
    });

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productRes, categoryRes] = await Promise.all([
                axiosClient.get('/products'),
                axiosClient.get('/categories').catch(() => ({ data: [] }))
            ]);
            setProducts(productRes.data);
            setCategories(categoryRes.data);
        } catch (error) {
            console.error('Lỗi lấy dữ liệu:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openModal = (product = null) => {
        if (product) {
            setEditingId(product._id);
            setFormData({
                name: product.name,
                sku: product.sku || '',
                price: product.price,
                category: product.category?._id || product.category || '', 
                image: product.images?.[0] || '',
                stock: product.stock || 0,
                description: product.description || ''
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', sku: '', price: '', category: '', image: '', stock: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 🟢 HÀM XỬ LÝ CHỌN ẢNH TỪ MÁY TÍNH (Đổi thành Base64 để lưu trực tiếp hoặc hiển thị mượt mà)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            ...formData,
            images: [formData.image],
            price: Number(formData.price),
            stock: Number(formData.stock)
        };

        try {
            if (editingId) {
                await axiosClient.put(`/products/${editingId}`, payload);
                alert('Cập nhật sản phẩm thành công!');
            } else {
                await axiosClient.post('/products', payload);
                alert('Thêm sản phẩm mới thành công!');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.error('Lỗi lưu SP:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phụ tùng này không?')) {
            try {
                await axiosClient.delete(`/products/${id}`);
                fetchData();
            } catch (error) {
                console.error('Lỗi xóa sản phẩm:', error);
                alert('Xóa thất bại!');
            }
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-bold text-gray-800 border-l-4 border-primary pl-3 flex items-center gap-2">
                    <Box className="w-6 h-6 text-primary" /> QUẢN LÝ PHỤ TÙNG
                </h3>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm tên hoặc SKU..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm"
                        />
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="bg-primary hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shadow-sm"
                    >
                        <Plus className="w-4 h-4" /> Thêm Mới
                    </button>
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                                <th className="py-3 px-4 font-bold w-16">Ảnh</th>
                                <th className="py-3 px-4 font-bold">Tên sản phẩm</th>
                                <th className="py-3 px-4 font-bold">Danh mục</th>
                                <th className="py-3 px-4 font-bold">Giá bán</th>
                                <th className="py-3 px-4 font-bold">Tồn kho</th>
                                <th className="py-3 px-4 font-bold text-center w-28">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-500">Không có dữ liệu!</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="w-12 h-12 rounded border bg-white p-1">
                                                <img 
                                                    src={product.images?.[0] || 'https://placehold.co/100'} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100?text=No+Img'; }}
                                                />
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku || 'N/A'}</p>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600 font-medium">
                                            <span className="flex items-center gap-1"><Tag className="w-3 h-3 text-primary"/> {product.category?.name || 'N/A'}</span>
                                        </td>
                                        <td className="py-3 px-4 font-bold text-primary">{formatPrice(product.price)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock > 0 ? `${product.stock} cái` : 'Hết hàng'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openModal(product)} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Sửa">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors" title="Xóa">
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
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingId ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="productForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên phụ tùng *</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã SKU</label>
                                    <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary" />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                                    <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary">
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) *</label>
                                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho *</label>
                                    <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary" />
                                </div>
                                
                                {/* 🟢 TÍCH HỢP TẢI ẢNH TỪ MÁY TÍNH KÈM PREVIEW */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm *</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-4 p-3 border rounded-lg bg-gray-50">
                                        <div className="w-20 h-20 border rounded bg-white flex items-center justify-center overflow-hidden shrink-0">
                                            {formData.image ? (
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-contain" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="flex-grow w-full space-y-2">
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={handleFileChange}
                                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-green-700 cursor-pointer" 
                                            />
                                            <input 
                                                type="text" 
                                                name="image" 
                                                placeholder="Hoặc dán link URL ảnh tại đây..." 
                                                value={formData.image} 
                                                onChange={handleInputChange} 
                                                className="w-full px-3 py-1.5 border rounded-md text-xs outline-none focus:border-primary bg-white" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary text-sm" />
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setIsModalOpen(false)} type="button" className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors">Hủy bỏ</button>
                            <button form="productForm" type="submit" className="px-4 py-2 text-white bg-primary hover:bg-green-700 rounded-lg font-bold shadow-sm transition-colors">
                                {editingId ? 'Lưu Thay Đổi' : 'Thêm Sản Phẩm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;