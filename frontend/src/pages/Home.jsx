import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { ShoppingCart, LayoutGrid, Disc, Zap, Droplets, Wrench, ShieldCheck, ChevronRight } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axiosClient.get('/products');
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { name: 'Phụ tùng động cơ', icon: <Wrench className="w-5 h-5" /> },
        { name: 'Hệ thống phanh', icon: <Disc className="w-5 h-5" /> },
        { name: 'Hệ thống điện', icon: <Zap className="w-5 h-5" /> },
        { name: 'Dầu nhớt & Phụ gia', icon: <Droplets className="w-5 h-5" /> },
        { name: 'Phụ kiện ngoại thất', icon: <ShieldCheck className="w-5 h-5" /> },
    ];

    // Tạo mảng Thương hiệu giả lập để test giao diện
    const brands = ['DENSO', 'BREMBO', 'BOSCH', 'K&N', 'MICHELIN', 'MOTUL'];

    if (loading) return <div className="text-center py-20 text-xl text-gray-600">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;

    // Component dùng chung cho các Khối sản phẩm (Tái sử dụng code)
    const ProductCard = ({ product }) => (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative group">
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow-sm">
                HOT
            </span>
            <div className="h-48 flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
                <img 
                    src={`/images/${product.sku}.jpg`} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x400/e2e8f0/16a34a?text=Chua+Co\nAnh'; 
                    }}
                />
            </div>
            <div className="p-4 flex flex-col flex-grow bg-white">
                <p className="text-xs text-gray-400 mb-1 font-medium">SKU: {product.sku}</p>
                <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px] group-hover:text-primary cursor-pointer transition-colors">
                    {product.name}
                </h3>
                <div className="mt-auto pt-2 border-t border-gray-100">
                    <p className="text-primary font-bold text-lg mb-3">
                        {formatPrice(product.price)}
                    </p>
                    <button className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white py-2 rounded flex items-center justify-center gap-2 font-semibold transition-all">
                        <ShoppingCart className="w-4 h-4" />
                        Thêm giỏ
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
            
            {/* 🟢 CỘT TRÁI: MENU DANH MỤC */}
            <div className="w-full md:w-1/4 bg-white border rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="bg-primary text-white font-bold py-3 px-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                    <LayoutGrid className="w-5 h-5" />
                    Danh mục sản phẩm
                </div>
                <ul className="flex flex-col">
                    {categories.map((cat, index) => (
                        <li key={index} className="border-b border-gray-100 last:border-b-0 hover:bg-green-50 hover:pl-2 transition-all duration-200">
                            <a href="#" className="flex items-center gap-3 py-3 px-4 text-gray-700 font-medium hover:text-primary">
                                <span className="text-gray-400">{cat.icon}</span>
                                <span className="flex-grow">{cat.name}</span>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ⚪ CỘT PHẢI: NỘI DUNG CHÍNH */}
            <div className="w-full md:w-3/4 flex flex-col gap-8">
                
                {/* 1. Thanh Thương Hiệu (Brands Slider mộc) */}
                <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
                    {brands.map((brand, idx) => (
                        <div key={idx} className="min-w-[100px] h-12 bg-gray-50 border border-gray-200 rounded flex items-center justify-center font-bold text-gray-400 hover:text-primary hover:border-primary transition-colors cursor-pointer">
                            {brand}
                        </div>
                    ))}
                </div>

                {/* 2. Khối Sản Phẩm Bán Chạy (Cắt 3 sản phẩm đầu tiên) */}
                <div>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold border-l-4 border-primary pl-3 text-secondary uppercase tracking-wide flex items-center gap-2">
                            🔥 Phụ Tùng Bán Chạy
                        </h2>
                        <a href="#" className="text-sm text-primary hover:underline font-medium">Xem tất cả</a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.slice(0, 3).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>

                {/* 3. Dải Banner Mini (Nghỉ nhịp giữa trang) */}
                <div className="w-full h-24 bg-gradient-to-r from-primary to-green-400 rounded-lg shadow-sm flex items-center justify-between px-8 text-white">
                    <div>
                        <h3 className="font-bold text-xl uppercase tracking-wider">Miễn phí giao hàng</h3>
                        <p className="text-sm opacity-90">Cho đơn hàng phụ tùng trên 2.000.000 ₫</p>
                    </div>
                    <Zap className="w-12 h-12 opacity-80" />
                </div>

                {/* 4. Khối Sản Phẩm Mới Nhất (Cắt các sản phẩm còn lại) */}
                <div>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold border-l-4 border-secondary pl-3 text-secondary uppercase tracking-wide flex items-center gap-2">
                            ⚡ Sản Phẩm Mới Nhất
                        </h2>
                        <a href="#" className="text-sm text-primary hover:underline font-medium">Xem tất cả</a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {products.slice(3).map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;