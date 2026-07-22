import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, MapPin, Phone, User, CreditCard } from 'lucide-react';
import axiosClient from '../api/axiosClient'; // 🟢 1. Import axiosClient

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        note: '',
        paymentMethod: 'cod'
    });

    // 🟢 2. Tự động điền thông tin nếu đã đăng nhập
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setFormData(prev => ({
                ...prev,
                fullName: parsedUser.name || '',
                phone: parsedUser.phone || '',
                address: parsedUser.address || ''
            }));
        }
    }, []);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingFee = subtotal > 2000000 || subtotal === 0 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 🟢 3. Xử lý lưu đơn hàng THẬT xuống Backend
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        
        if (cartItems.length === 0) {
            alert('Giỏ hàng trống! Hãy mua thêm đồ nhé.');
            return;
        }

        const storedUser = localStorage.getItem('userInfo');
        const userId = storedUser ? JSON.parse(storedUser)._id : null;

        const orderData = {
            user: userId,
            orderItems: cartItems.map(item => ({
                name: item.name,
                qty: item.quantity,
                price: item.price,
                product: item._id
            })),
            shippingAddress: {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                note: formData.note
            },
            paymentMethod: formData.paymentMethod,
            itemsPrice: subtotal,
            shippingPrice: shippingFee,
            totalPrice: total
        };

        try {
            // 🚀 BẮN API TẠO ĐƠN
            await axiosClient.post('/orders', orderData);

            alert('🎉 Chốt đơn thành công! Cảm ơn bạn đã mua hàng.');
            clearCart(); // Dọn giỏ hàng
            navigate('/profile'); // Chuyển sang Profile để kiểm tra đơn ngay!
        } catch (error) {
            console.error('Lỗi khi đặt hàng:', error);
            alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!');
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20 flex flex-col items-center">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-gray-700">Giỏ hàng của bạn đang trống</h2>
                <Link to="/" className="mt-4 text-primary hover:underline font-medium">Quay lại mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-primary pl-3">TIẾN HÀNH THANH TOÁN</h2>
            
            <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
                {/* 🟢 CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
                            <MapPin className="w-5 h-5 text-primary" /> Thông tin nhận hàng
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:border-primary" placeholder="Nhập họ tên" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border rounded-lg outline-none focus:border-primary" placeholder="Nhập số điện thoại" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng chi tiết *</label>
                                <input required type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary" placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện..." />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn hàng (Tùy chọn)</label>
                                <textarea name="note" value={formData.note} onChange={handleInputChange} rows="3" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-primary" placeholder="Ví dụ: Giao giờ hành chính..."></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700">
                            <CreditCard className="w-5 h-5 text-primary" /> Phương thức thanh toán
                        </h3>
                        <div className="flex flex-col gap-3">
                            <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-primary bg-green-50' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                                    <span className="text-sm text-gray-500">Kiểm tra hàng trước khi thanh toán</span>
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'banking' ? 'border-primary bg-green-50' : 'hover:bg-gray-50'}`}>
                                <input type="radio" name="paymentMethod" value="banking" checked={formData.paymentMethod === 'banking'} onChange={handleInputChange} className="w-4 h-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">Chuyển khoản ngân hàng</span>
                                    <span className="text-sm text-gray-500">Xác nhận nhanh, ưu tiên xử lý đơn</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* ⚪ CỘT PHẢI: BILL TỔNG KẾT */}
                <div className="lg:w-1/3">
                    <div className="bg-white border rounded-xl shadow-sm p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-4">Đơn Hàng Của Bạn</h3>
                        
                        <div className="flex flex-col gap-4 mb-4 max-h-[300px] overflow-y-auto scrollbar-hide">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-3 flex-grow">
                                        <div className="w-12 h-12 bg-gray-50 rounded border p-1 shrink-0">
                                            <img src={item.images?.[0] || 'https://placehold.co/100'} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium line-clamp-1 text-gray-700">{item.name}</span>
                                            <span className="text-xs text-gray-400">SL: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 mb-6 border-t pt-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính:</span>
                                <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển:</span>
                                <span className="font-semibold">{shippingFee === 0 ? <span className="text-primary uppercase tracking-wider text-xs">Miễn phí</span> : formatPrice(shippingFee)}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center border-t border-dashed pt-4 mb-6">
                            <span className="font-bold text-gray-800 text-lg">Tổng cộng:</span>
                            <span className="font-extrabold text-2xl text-primary">{formatPrice(total)}</span>
                        </div>

                        <button type="submit" className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3.5 rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md">
                            <CheckCircle className="w-5 h-5" /> ĐẶT HÀNG NGAY
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;