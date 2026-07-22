import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit, X, Save, ShieldCheck, ShoppingBag, Package, Clock } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    // State cho Profile
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);

    // 🟢 State cho Tabs & Đơn hàng
    const [activeTab, setActiveTab] = useState('info'); // 'info' hoặc 'orders'
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const getStatusText = (status) => {
        switch(status) {
            case 'Pending': return 'Chờ xử lý';
            case 'Processing': return 'Đang chuẩn bị';
            case 'Shipped': return 'Đang giao hàng';
            case 'Delivered': return 'Đã giao thành công';
            case 'Cancelled': return 'Đã hủy';
            default: return status || 'Chờ xác nhận';
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Processing': return 'bg-blue-100 text-blue-700';
            case 'Shipped': return 'bg-purple-100 text-purple-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setFormData({
                name: parsedUser.name || '',
                phone: parsedUser.phone || '',
                address: parsedUser.address || ''
            });
            fetchMyOrders(); // Gọi API lấy đơn hàng
        } else {
            navigate('/');
        }
    }, [navigate]);

    const fetchMyOrders = async () => {
        try {
            const response = await axiosClient.get('/orders/myorders');
            setOrders(response.data);
        } catch (error) {
            console.error('Lỗi lấy danh sách đơn hàng:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.put('/users/profile', formData);
            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setIsEditing(false);
            alert('🎉 Cập nhật thông tin thành công!');
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            alert('Cập nhật thất bại. Vui lòng kiểm tra lại!');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm mt-8 mb-12 overflow-hidden">
            {/* Banner trang trí */}
            <div className="bg-gradient-to-r from-primary to-green-600 h-32 w-full relative">
                <div className="absolute right-4 top-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Tài khoản chính chủ
                </div>
            </div>
            
            <div className="px-6 md:px-10 pb-8 relative">
                {/* Avatar */}
                <div className="absolute -top-12 left-6 md:left-10 w-24 h-24 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-md">
                    <div className="w-full h-full bg-green-50 rounded-full flex items-center justify-center text-primary">
                        <User className="w-10 h-10" />
                    </div>
                </div>

                {/* Phần Tên & Email */}
                <div className="pt-16 mb-8">
                    {isEditing ? (
                        <div className="mb-2">
                            <label className="text-xs font-semibold text-gray-400 block mb-1">HỌ VÀ TÊN</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name} 
                                onChange={handleInputChange}
                                className="text-2xl font-bold text-gray-800 border-2 border-primary outline-none bg-white px-3 py-1.5 rounded-lg w-full max-w-md focus:ring-2 focus:ring-green-100"
                            />
                        </div>
                    ) : (
                        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                    )}
                    <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                    </div>
                </div>

                {/* 🟢 KHU VỰC TABS MENU */}
                <div className="flex items-center gap-6 border-b border-gray-200 mb-8">
                    <button 
                        onClick={() => setActiveTab('info')}
                        className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all border-b-2 ${activeTab === 'info' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        <User className="w-4 h-4" /> Thông tin cá nhân
                    </button>
                    <button 
                        onClick={() => setActiveTab('orders')}
                        className={`pb-3 font-semibold text-sm flex items-center gap-2 transition-all border-b-2 ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                    >
                        <ShoppingBag className="w-4 h-4" /> Quản lý đơn hàng
                    </button>
                </div>

                {/* ================= NỘI DUNG TAB: THÔNG TIN CÁ NHÂN ================= */}
                {activeTab === 'info' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-800">Thông tin liên hệ</h3>
                            {!isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="text-sm bg-green-50 text-primary hover:bg-primary hover:text-white px-3.5 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5"
                                >
                                    <Edit className="w-4 h-4" /> Chỉnh sửa
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsEditing(false)} 
                                        className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1 font-medium bg-gray-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Hủy
                                    </button>
                                    <button 
                                        onClick={handleUpdateProfile} 
                                        disabled={loading} 
                                        className="text-sm text-white bg-primary hover:bg-green-700 flex items-center gap-1.5 font-bold px-4 py-1.5 rounded-lg shadow-sm transition-colors"
                                    >
                                        <Save className="w-4 h-4" /> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-gray-50/80 rounded-xl p-6 border border-gray-100 space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white border border-gray-100 rounded-lg text-gray-500 shadow-sm mt-0.5">
                                    <Phone className="w-4 h-4 text-primary" />
                                </div>
                                <div className="w-full">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Số điện thoại</p>
                                    {isEditing ? (
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleInputChange} 
                                            placeholder="Nhập số điện thoại..."
                                            className="w-full max-w-md border border-gray-300 p-2.5 rounded-lg outline-none focus:border-primary text-sm bg-white" 
                                        />
                                    ) : (
                                        <p className={`text-sm font-medium ${user.phone ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                            {user.phone || 'Chưa cập nhật số điện thoại'}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white border border-gray-100 rounded-lg text-gray-500 shadow-sm mt-0.5">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <div className="w-full">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Địa chỉ giao hàng mặc định</p>
                                    {isEditing ? (
                                        <textarea 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleInputChange} 
                                            rows="3" 
                                            placeholder="Nhập địa chỉ nhận hàng chi tiết..."
                                            className="w-full border border-gray-300 p-2.5 rounded-lg outline-none focus:border-primary text-sm bg-white" 
                                        />
                                    ) : (
                                        <p className={`text-sm font-medium ${user.address ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                            {user.address || 'Chưa thiết lập địa chỉ mặc định'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white border border-gray-100 rounded-lg text-gray-500 shadow-sm mt-0.5">
                                    <Calendar className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ngày tham gia hệ thống</p>
                                    <p className="text-sm font-medium text-gray-800">Tháng 7, 2026</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= NỘI DUNG TAB: QUẢN LÝ ĐƠN HÀNG ================= */}
                {activeTab === 'orders' && (
                    <div className="animate-in fade-in duration-300">
                        {loadingOrders ? (
                            <div className="text-center py-10 text-gray-500 font-medium">Đang tải lịch sử mua hàng...</div>
                        ) : orders.length === 0 ? (
                            <div className="bg-gray-50/80 rounded-xl border border-gray-100 py-12 flex flex-col items-center justify-center text-gray-500">
                                <Package className="w-16 h-16 mb-4 text-gray-300" />
                                <p className="font-medium text-gray-700 text-lg">Bạn chưa có đơn hàng nào!</p>
                                <p className="text-sm mt-1 mb-4">Các phụ tùng bạn đặt mua sẽ xuất hiện ở đây.</p>
                                <Link to="/" className="bg-primary hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors shadow-sm">
                                    Mua sắm ngay
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {orders.map((order) => (
                                    <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-3 mb-4 gap-3">
                                            <div>
                                                <span className="text-sm font-bold text-gray-800">Mã đơn: <span className="font-mono text-primary">#{order._id.slice(-8).toUpperCase()}</span></span>
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold w-max ${getStatusBadge(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            {order.orderItems?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <div className="flex-1">
                                                        <span className="font-semibold text-gray-700">{item.name}</span>
                                                        <span className="text-gray-400 ml-2">x{item.qty}</span>
                                                    </div>
                                                    <span className="font-bold text-gray-800">{formatPrice(item.price * item.qty)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                                            <span className="text-sm text-gray-600 font-medium">Tổng thanh toán:</span>
                                            <span className="font-black text-primary text-lg">{formatPrice(order.totalPrice)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;