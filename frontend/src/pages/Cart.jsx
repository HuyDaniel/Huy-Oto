import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowLeft, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext'; // 🟢 Import não bộ vào

const Cart = () => {
    // Lấy hết data và function từ Context ra xài
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // Tính nhẩm lại tổng tiền chuẩn xác
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = (subtotal > 2000000 || subtotal === 0) ? 0 : 30000; 
    const total = subtotal + shippingFee;

    // Nếu giỏ trống thì hiện cái hình xinh xinh báo khách đi mua đồ
    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <ShoppingCart className="w-24 h-24 mb-6 opacity-30" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Giỏ hàng của bạn đang trống</h2>
                <p className="mb-6">Hãy thêm các phụ tùng cần thiết vào giỏ nhé!</p>
                <Link to="/" className="bg-primary hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                    Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                Giỏ Hàng Của Bạn
                <span className="bg-primary text-white text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
                    {cartItems.length} sản phẩm
                </span>
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* 🟢 CỘT TRÁI: DANH SÁCH */}
                <div className="lg:w-2/3 flex flex-col">
                    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                        <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-50 border-b text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            <div className="col-span-3">Sản phẩm</div>
                            <div className="text-center">Đơn giá</div>
                            <div className="text-center">Số lượng</div>
                            <div className="text-right">Số tiền</div>
                        </div>

                        {cartItems.map((item) => (
                            <div key={item._id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-5 border-b last:border-b-0 items-center hover:bg-green-50/30 transition-colors">
                                <div className="col-span-3 flex items-center gap-4">
                                    <button 
                                        onClick={() => removeFromCart(item._id)} 
                                        title="Xóa" 
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <div className="w-20 h-20 bg-white rounded border border-gray-100 p-1 flex shrink-0 shadow-sm">
                                        <img 
                                            src={item.images?.[0] || 'https://placehold.co/400'} 
                                            alt={item.name} 
                                            className="w-full h-full object-contain mix-blend-multiply" 
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 line-clamp-2 hover:text-primary cursor-pointer transition-colors">{item.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1 font-medium">SKU: {item.sku}</p>
                                    </div>
                                </div>
                                <div className="text-center md:text-center font-bold text-gray-600 hidden md:block">
                                    {formatPrice(item.price)}
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                                        <button 
                                            onClick={() => updateQuantity(item._id, -1)}
                                            className="p-2 bg-gray-50 hover:bg-gray-100 hover:text-primary text-gray-600 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input type="text" value={item.quantity} readOnly className="w-10 text-center text-sm font-bold text-gray-700 outline-none bg-white" />
                                        <button 
                                            onClick={() => updateQuantity(item._id, 1)}
                                            className="p-2 bg-gray-50 hover:bg-gray-100 hover:text-primary text-gray-600 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right font-bold text-primary text-lg">
                                    {formatPrice(item.price * item.quantity)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link to="/" className="inline-flex items-center gap-2 text-primary hover:text-green-700 font-medium mt-6 self-start hover:bg-green-50 px-4 py-2 rounded-lg transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm
                    </Link>
                </div>

                {/* ⚪ CỘT PHẢI: BILL TÍNH TIỀN */}
                <div className="lg:w-1/3">
                    <div className="bg-white border rounded-xl shadow-sm p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Chi Tiết Thanh Toán</h3>
                        
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính:</span>
                                <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển:</span>
                                <span className="font-semibold">{shippingFee === 0 ? <span className="text-primary bg-green-50 px-2 py-1 rounded-md text-xs uppercase tracking-wider">Miễn phí</span> : formatPrice(shippingFee)}</span>
                            </div>
                            {shippingFee > 0 && (
                                <p className="text-xs text-orange-500 bg-orange-50 p-2 rounded border border-orange-100 text-right mt-2">
                                    Mua thêm <b>{formatPrice(2000000 - subtotal)}</b> để được <b>Freeship</b>
                                </p>
                            )}
                        </div>

                        <div className="flex justify-between items-center border-t border-dashed pt-4 mb-6">
                            <span className="font-bold text-gray-800 text-lg">Tổng cộng:</span>
                            <span className="font-extrabold text-3xl text-primary">{formatPrice(total)}</span>
                        </div>

                       <Link to="/checkout" className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md hover:shadow-lg">
                            <ShieldCheck className="w-5 h-5" />
                            Tiến Hành Thanh Toán
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;