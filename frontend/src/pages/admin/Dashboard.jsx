import { useState, useEffect } from 'react';
import { Package, ShoppingCart, Users, DollarSign, ArrowUpRight, Clock, TrendingUp } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const Dashboard = () => {
    // 🟢 State này sẽ chứa data thật từ DB
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    // Báo cáo doanh thu tuần (Tạm giữ nguyên UI Demo cho phần biểu đồ)
    const weeklyRevenue = [
        { day: 'Thứ 2', amount: '12.000.000 ₫', percentage: '40%' },
        { day: 'Thứ 3', amount: '19.000.000 ₫', percentage: '60%' },
        { day: 'Thứ 4', amount: '15.000.000 ₫', percentage: '50%' },
        { day: 'Thứ 5', amount: '22.000.000 ₫', percentage: '75%' },
        { day: 'Thứ 6', amount: '28.000.000 ₫', percentage: '85%' },
        { day: 'Thứ 7', amount: '35.000.000 ₫', percentage: '95%' },
        { day: 'Chủ Nhật', amount: '42.000.000 ₫', percentage: '100%' },
    ];

    // 🟢 GỌI API LẤY SỐ LIỆU THẬT
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosClient.get('/orders/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Lỗi lấy thống kê:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đã giao': return 'bg-green-100 text-green-700';
            case 'Đang xử lý': return 'bg-blue-100 text-blue-700';
            case 'Đã hủy': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700'; 
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 font-bold mt-10">Đang tải dữ liệu thống kê thật từ Database...</div>;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-l-4 border-primary pl-3">
                TỔNG QUAN TÌNH HÌNH
            </h3>
            
            {/* 🔴 KHU VỰC 1: CÁC THẺ THỐNG KÊ (ĐÃ GẮN BIẾN DATA THẬT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 relative overflow-hidden group">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><DollarSign className="w-8 h-8" /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng Doanh Thu</p>
                        <h4 className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</h4>
                        <p className="text-xs text-green-500 flex items-center mt-1"><ArrowUpRight className="w-3 h-3 mr-1"/> Real-time</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 relative overflow-hidden group">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><ShoppingCart className="w-8 h-8" /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng Đơn Hàng</p>
                        <h4 className="text-2xl font-bold text-gray-900">{stats.totalOrders} Đơn</h4>
                        <p className="text-xs text-blue-500 flex items-center mt-1"><ArrowUpRight className="w-3 h-3 mr-1"/> Cập nhật liên tục</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 relative overflow-hidden group">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Package className="w-8 h-8" /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Mặt Hàng Hiện Có</p>
                        <h4 className="text-2xl font-bold text-gray-900">{stats.totalProducts} Cái</h4>
                        <p className="text-xs text-orange-500 mt-1">Hệ thống kho</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4 relative overflow-hidden group">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Users className="w-8 h-8" /></div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Khách Hàng</p>
                        <h4 className="text-2xl font-bold text-gray-900">{stats.totalUsers} User</h4>
                        <p className="text-xs text-purple-500 mt-1">Tài khoản đăng ký</p>
                    </div>
                </div>
            </div>

            {/* 🔴 KHU VỰC 2: BIỂU ĐỒ & ĐƠN HÀNG MỚI NHẤT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="bg-white border rounded-xl shadow-sm p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" /> Báo Cáo Doanh Thu Tuần
                        </h4>
                        <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded">UI Demo</span>
                    </div>
                    
                    <div className="space-y-4">
                        {weeklyRevenue.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-600">{item.day}</span>
                                    <span className="text-gray-900 font-bold">{item.amount}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <div 
                                        className="bg-primary h-3 rounded-full transition-all duration-500" 
                                        style={{ width: item.percentage }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🟢 CỘT BÊN PHẢI: LIST 5 ĐƠN HÀNG MỚI NHẤT THẬT */}
                <div className="bg-white border rounded-xl shadow-sm p-6 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" /> Đơn Hàng Mới
                        </h4>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
                        {stats.recentOrders.length === 0 ? (
                            <p className="text-center text-sm text-gray-500 py-4">Chưa có đơn hàng nào.</p>
                        ) : (
                            stats.recentOrders.map((order) => (
                                <div key={order._id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-gray-800 text-xs">#{order._id.substring(0, 6).toUpperCase()}</span>
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                                            {order.status || 'Chờ xác nhận'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1 line-clamp-1">
                                        {order.shippingAddress?.fullName || order.shippingAddress?.address || 'Khách hàng'}
                                    </p>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                        <span className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="font-bold text-primary text-sm">{formatPrice(order.totalPrice)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;