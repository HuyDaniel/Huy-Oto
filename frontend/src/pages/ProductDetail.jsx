import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axiosClient.get(`/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                setError('Không tìm thấy sản phẩm hoặc có lỗi xảy ra.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="text-center py-20 text-xl text-gray-500 font-medium">Đang tải thông tin...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;
    if (!product) return null;

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    return (
        <div className="max-w-7xl mx-auto mt-6 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-8 transition-colors font-semibold">
                <ArrowLeft className="w-5 h-5" /> Quay lại
            </button>

            <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-1/2 flex items-center justify-center p-8 border border-gray-100 rounded-2xl bg-gray-50 relative group">
                    {product.stock === 0 ? (
                        <span className="absolute top-4 left-4 bg-gray-500 text-white text-xs font-bold px-3 py-1 rounded shadow-sm z-10">HẾT HÀNG</span>
                    ) : (
                        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded shadow-sm z-10">HOT</span>
                    )}
                    <img
                        src={product.images?.[0] || 'https://placehold.co/600x600/e2e8f0/16a34a?text=Chua+Co+Anh'}
                        alt={product.name}
                        className="max-w-full max-h-[450px] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                <div className="md:w-1/2 flex flex-col">
                    {/* 🟢 ĐÃ FIX: Hứng tên danh mục từ backend thả vào đây */}
                    <p className="text-sm text-gray-400 mb-2 font-medium tracking-wider">
                        SKU: {product.sku || 'N/A'} | Danh mục: {product.category?.name || 'Chưa phân loại'}
                    </p>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{product.name}</h1>

                    {/* 🟢 ĐÃ FIX: Hiện trạng thái tồn kho */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-4xl font-extrabold text-primary">
                            {formatPrice(product.price)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                        </span>
                    </div>

                    <div className="prose text-gray-600 mb-8 leading-relaxed">
                        <p>{product.description || 'Sản phẩm này hiện chưa có mô tả chi tiết từ nhà sản xuất. Vui lòng liên hệ Huy Auto để biết thêm.'}</p>
                    </div>

                    <div className="space-y-4 mb-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span>Cam kết 100% phụ tùng chính hãng</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                            <Truck className="w-5 h-5 text-blue-500" />
                            <span>Giao hàng siêu tốc (Freeship đơn từ 2.000.000đ)</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                            <RotateCcw className="w-5 h-5 text-orange-500" />
                            <span>Đổi trả miễn phí 7 ngày nếu lỗi từ NSX</span>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-100" />

                    <div className="mt-auto">
                        {/* 🟢 ĐÃ FIX: Chặn nút nếu stock = 0 */}
                        <button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all text-lg ${product.stock === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-primary hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:-translate-y-1'}`}
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {product.stock === 0 ? 'Tạm Thời Hết Hàng' : 'Thêm Vào Giỏ Hàng Ngay'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;