import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom'; 
import axiosClient from '../api/axiosClient';
import { ShoppingCart, LayoutGrid, Disc, Zap, Droplets, Wrench, ShieldCheck, ChevronRight, X, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

// 🟢 COMPONENT BANNER TRƯỢT CÓ TÍCH HỢP NÚT BẤM (CTA BUTTON)
const HeroBannerSlider = () => {
    const navigate = useNavigate();
    const banners = [
        {
            id: 1,
            title: "PHỤ TÙNG CHÍNH HÃNG 100%",
            subtitle: "Cam kết hoàn tiền gấp đôi nếu phát hiện hàng giả, hàng nhái.",
            bg: "from-green-600 to-emerald-800",
            actionUrl: "/",
            btnText: "Khám phá ngay"
        },
        {
            id: 2,
            title: "ƯU ĐÃI ĐẶC BIỆT THÁNG 7",
            subtitle: "Freeship toàn quốc cho mọi đơn hàng phụ tùng từ 2.000.000 ₫.",
            bg: "from-blue-600 to-indigo-800",
            actionUrl: "/?search=phanh",
            btnText: "Săn deal ngay"
        },
        {
            id: 3,
            title: "HỆ THỐNG PHANH BREMBO CAO CẤP",
            subtitle: "Nâng cấp hiệu suất phanh, an toàn tuyệt đối trên mọi cung đường.",
            bg: "from-red-600 to-rose-800",
            actionUrl: "/?search=BREMBO",
            btnText: "Xem ngay Brembo"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? banners.length - 1 : prevIndex - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    };

    return (
        <div className="relative w-full h-52 md:h-68 rounded-2xl overflow-hidden shadow-md group mb-6">
            <div 
                className="w-full h-full flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div 
                        key={banner.id} 
                        className={`w-full h-full shrink-0 bg-gradient-to-r ${banner.bg} text-white flex items-center justify-between px-8 md:px-14 relative`}
                    >
                        <div className="z-10 max-w-lg space-y-3">
                            <span className="bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Huy Auto Hot Deal</span>
                            <h2 className="text-2xl md:text-3xl font-black tracking-wide">{banner.title}</h2>
                            <p className="text-sm md:text-base text-gray-100 font-medium">{banner.subtitle}</p>
                            
                            <button 
                                onClick={() => navigate(banner.actionUrl)}
                                className="mt-2 bg-white text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 w-max group/btn"
                            >
                                {banner.btnText} <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={prevSlide} 
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
                onClick={nextSlide} 
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${currentIndex === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    const [activeCategory, setActiveCategory] = useState('');
    const [activeBrand, setActiveBrand] = useState('');

    const formatPrice = (price) =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

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

    const brands = ['DENSO', 'BREMBO', 'BOSCH', 'K&N', 'MICHELIN', 'MOTUL'];

    const getCategoryName = (category) =>
        typeof category === 'object' ? category?.name : category;

    if (loading) return <div className="text-center py-20 text-xl text-gray-600">Đang tải dữ liệu...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-semibold">{error}</div>;

    // 🟢 HỆ THỐNG TỪ KHÓA THÔNG MINH ĐỂ BẮT CHUẨN MỌI DANH MỤC TRONG DB
    const categoryKeywords = {
        'Phụ tùng động cơ': ['động cơ', 'lọc', 'máy', 'curoa', 'gioăng', 'càng', 'phuộc'],
        'Hệ thống phanh': ['phanh', 'gầm', 'phuộc', 'giảm xóc', 'má phanh', 'càng a'],
        'Hệ thống điện': ['điện', 'bugi', 'ắc quy', 'đèn', 'còi', 'mô bin'],
        'Dầu nhớt & Phụ gia': ['dầu', 'nhớt', 'phụ gia', 'mỡ'],
        'Phụ kiện ngoại thất': ['ngoại thất', 'phụ kiện', 'gạt mưa', 'bạt', 'đèn']
    };

    const filteredProducts = products.filter((p) => {
        const name = p.name || '';
        const sku = p.sku || '';
        const q = searchQuery.toLowerCase();
        const catName = getCategoryName(p.category) || '';

        const matchSearch = searchQuery
            ? name.toLowerCase().includes(q) || sku.toLowerCase().includes(q)
            : true;

        const matchBrand = activeBrand
            ? p.brand
                ? p.brand.toUpperCase() === activeBrand 
                : name.toUpperCase().includes(activeBrand) || sku.toUpperCase().includes(activeBrand) 
            : true;

        // Kiểm tra từ khóa thông minh cho danh mục
        const matchCategory = activeCategory
            ? (categoryKeywords[activeCategory] || []).some(keyword => 
                catName.toLowerCase().includes(keyword) || 
                name.toLowerCase().includes(keyword)
              ) || catName.toLowerCase().includes(activeCategory.toLowerCase())
            : true;

        return matchSearch && matchBrand && matchCategory;
    });

    const clearAllFilters = () => {
        setActiveCategory('');
        setActiveBrand('');
        navigate('/');
    };

    const ProductCard = ({ product }) => (
        <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative group">
            {product.stock === 0 ? (
                <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow-sm">HẾT HÀNG</span>
            ) : (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow-sm">HOT</span>
            )}

            <Link to={`/product/${product._id}`} className="h-48 flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden cursor-pointer">
                <img
                    src={product.images?.[0] || 'https://placehold.co/400x400/e2e8f0/16a34a?text=Chua+Co+Anh'}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/e2e8f0/16a34a?text=Loi+Anh'; }}
                />
            </Link>

            <div className="p-4 flex flex-col flex-grow bg-white">
                <p className="text-xs text-gray-400 mb-1 font-medium line-clamp-1">
                    SKU: {product.sku || 'N/A'} | {getCategoryName(product.category) || 'Chưa phân loại'}
                </p>
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[40px] group-hover:text-primary cursor-pointer transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto pt-2 border-t border-gray-100 space-y-2">
                    <p className="text-primary font-bold text-lg">{formatPrice(product.price)}</p>
                    
                    <div className="grid grid-cols-2 gap-2">
                        <Link 
                            to={`/product/${product._id}`}
                            className="py-2 rounded text-center text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors flex items-center justify-center"
                        >
                            Xem chi tiết
                        </Link>

                        <button 
                            onClick={() => addToCart(product)} 
                            disabled={product.stock === 0}
                            className={`py-2 rounded text-xs font-bold transition-all flex items-center justify-center ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-700 text-white shadow-sm'}`}
                        >
                            {product.stock === 0 ? 'Hết hàng' : 'Thêm giỏ'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const FilterStatus = () => {
        if (!searchQuery && !activeCategory && !activeBrand) return null;
        return (
            <div className="flex flex-wrap items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm">
                <span className="font-semibold text-gray-600">Đang lọc theo:</span>

                {searchQuery && (
                    <span
                        className="bg-white px-3 py-1 rounded-full border shadow-sm text-primary flex items-center gap-2 cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                        onClick={() => navigate('/')}
                    >
                        Từ khóa: "{searchQuery}" <X className="w-3 h-3" />
                    </span>
                )}

                {activeCategory && (
                    <span
                        className="bg-white px-3 py-1 rounded-full border shadow-sm text-primary flex items-center gap-2 cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                        onClick={() => setActiveCategory('')}
                    >
                        Danh mục: {activeCategory} <X className="w-3 h-3" />
                    </span>
                )}

                {activeBrand && (
                    <span
                        className="bg-white px-3 py-1 rounded-full border shadow-sm text-primary flex items-center gap-2 cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                        onClick={() => setActiveBrand('')}
                    >
                        Hãng: {activeBrand} <X className="w-3 h-3" />
                    </span>
                )}
            </div>
        );
    };

    const newestProducts = filteredProducts.slice(3);
    const showNewestSection = !searchQuery && !activeCategory && !activeBrand && newestProducts.length > 0;

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
            {/* CỘT TRÁI: SIDEBAR DANH MỤC */}
            <div className="w-full md:w-1/4 bg-white border rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="bg-primary text-white font-bold py-3 px-4 flex items-center gap-2 uppercase tracking-wide text-sm">
                    <LayoutGrid className="w-5 h-5" /> Danh mục sản phẩm
                </div>
                <ul className="flex flex-col">
                    <li
                        className={`border-b border-gray-100 transition-all duration-200 cursor-pointer ${activeCategory === '' && !searchQuery ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                        onClick={clearAllFilters}
                    >
                        <div className={`flex items-center gap-3 py-3 px-4 font-medium ${activeCategory === '' && !searchQuery ? 'text-primary' : 'text-gray-700'}`}>
                            <LayoutGrid className="w-5 h-5 opacity-50" />
                            <span className="flex-grow">Tất cả sản phẩm</span>
                        </div>
                    </li>
                    {categories.map((cat, index) => (
                        <li
                            key={index}
                            className={`border-b border-gray-100 last:border-b-0 transition-all duration-200 cursor-pointer ${activeCategory === cat.name ? 'bg-green-50 border-l-4 border-primary' : 'hover:bg-gray-50'}`}
                            onClick={() => setActiveCategory((prev) => (prev === cat.name ? '' : cat.name))}
                        >
                            <div className={`flex items-center gap-3 py-3 px-4 font-medium ${activeCategory === cat.name ? 'text-primary' : 'text-gray-700'}`}>
                                <span className={activeCategory === cat.name ? 'text-primary' : 'text-gray-400'}>{cat.icon}</span>
                                <span className="flex-grow">{cat.name}</span>
                                <ChevronRight className={`w-4 h-4 ${activeCategory === cat.name ? 'text-primary' : 'text-gray-300'}`} />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* CỘT PHẢI: SẢN PHẨM & BANNER */}
            <div className="w-full md:w-3/4 flex flex-col gap-8">
                {/* BANNER TRƯỢT CÓ NÚT BẤM */}
                <HeroBannerSlider />

                {/* LỌC THEO HÃNG */}
                <div className="bg-white border rounded-lg p-4 shadow-sm flex items-center justify-start gap-4 overflow-x-auto scrollbar-hide">
                    <div
                        className={`min-w-[100px] h-12 border rounded flex items-center justify-center font-bold transition-colors cursor-pointer ${activeBrand === '' ? 'bg-primary text-white border-primary' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-primary hover:border-primary'}`}
                        onClick={() => setActiveBrand('')}
                    >
                        TẤT CẢ
                    </div>
                    {brands.map((brand, idx) => (
                        <div
                            key={idx}
                            className={`min-w-[100px] h-12 border rounded flex items-center justify-center font-bold transition-colors cursor-pointer ${activeBrand === brand ? 'bg-primary text-white border-primary shadow-md' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-primary hover:border-primary'}`}
                            onClick={() => setActiveBrand((prev) => (prev === brand ? '' : brand))}
                        >
                            {brand}
                        </div>
                    ))}
                </div>

                <div>
                    <FilterStatus />
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h2 className="text-xl font-bold border-l-4 border-primary pl-3 text-secondary uppercase tracking-wide flex items-center gap-2">
                            {(searchQuery || activeCategory || activeBrand) ? 'KẾT QUẢ TÌM KIẾM' : '🔥 PHỤ TÙNG BÁN CHẠY'}
                        </h2>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-lg text-gray-500 border border-dashed border-gray-300">
                            <Disc className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Không tìm thấy phụ tùng nào phù hợp!</p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 text-primary hover:underline font-medium"
                            >
                                Xóa bộ lọc và xem tất cả
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {(searchQuery || activeCategory || activeBrand ? filteredProducts : filteredProducts.slice(0, 3)).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {!searchQuery && !activeCategory && !activeBrand && (
                    <div className="w-full h-24 bg-gradient-to-r from-primary to-green-400 rounded-lg shadow-sm flex items-center justify-between px-8 text-white">
                        <div>
                            <h3 className="font-bold text-xl uppercase tracking-wider">Miễn phí giao hàng</h3>
                            <p className="text-sm opacity-90">Cho đơn hàng phụ tùng trên 2.000.000 ₫</p>
                        </div>
                        <Zap className="w-12 h-12 opacity-80" />
                    </div>
                )}

                {showNewestSection && (
                    <div>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-xl font-bold border-l-4 border-secondary pl-3 text-secondary uppercase tracking-wide flex items-center gap-2">
                                ⚡ Sản Phẩm Mới Nhất
                            </h2>
                            <Link to="/" className="text-sm text-primary hover:underline font-medium">Xem tất cả</Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {newestProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;