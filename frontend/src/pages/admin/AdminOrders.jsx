import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Search, X, Package } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal xem chi tiết
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Lỗi tải đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

    const handleStatusChange = async (orderId, newStatus) => {
        if(window.confirm(`Bạn muốn chuyển đơn này sang trạng thái: ${newStatus}?`)) {
            try {
                await axiosClient.put(`/orders/${orderId}/status`, { status: newStatus });
                alert('Cập nhật trạng thái thành công!');
                fetchOrders(); // Refresh bảng
            } catch (error) {
                console.error('Lỗi đổi trạng thái:', error);
                alert('Có lỗi xảy ra, vui lòng thử lại!');
            }
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700'; // Chờ xử lý
            case 'Processing': return 'bg-blue-100 text-blue-700'; // Đang xử lý
            case 'Shipped': return 'bg-purple-100 text-purple-700'; // Đang giao
            case 'Delivered': return 'bg-green-100 text-green-700'; // Đã giao
            case 'Cancelled': return 'bg-red-100 text-red-700'; // Đã hủy
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredOrders = orders.filter(o => 
        o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (o.shippingAddress?.phone && o.shippingAddress.phone.includes(searchTerm))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-bold text-gray-800 border-l-4 border-primary pl-3 flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-primary" /> QUẢN LÝ ĐƠN HÀNG
                </h3>
                
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm mã đơn hoặc SĐT..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-primary text-sm"
                    />
                </div>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                                <th className="py-3 px-4 font-bold">Mã Đơn</th>
                                <th className="py-3 px-4 font-bold">Khách hàng</th>
                                <th className="py-3 px-4 font-bold">Ngày đặt</th>
                                <th className="py-3 px-4 font-bold">Tổng tiền</th>
                                <th className="py-3 px-4 font-bold">Trạng thái</th>
                                <th className="py-3 px-4 font-bold text-center w-24">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-500">Chưa có đơn hàng nào!</td></tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-mono font-bold text-gray-700 text-xs uppercase">
                                            #{order._id.substring(0, 8)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-gray-800">{order.user?.name || 'Khách vãng lai'}</p>
                                            <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="py-3 px-4 font-bold text-primary">{formatPrice(order.totalPrice)}</td>
                                        <td className="py-3 px-4">
                                            {/* DROPDOWN ĐỔI TRẠNG THÁI NHANH */}
                                            <select 
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className={`text-xs font-bold px-2 py-1 rounded-full outline-none cursor-pointer border-transparent ${getStatusBadge(order.status)}`}
                                            >
                                                <option value="Pending">Chờ xử lý</option>
                                                <option value="Processing">Đang xử lý</option>
                                                <option value="Shipped">Đang giao</option>
                                                <option value="Delivered">Đã giao</option>
                                                <option value="Cancelled">Đã hủy</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button 
                                                onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }} 
                                                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Xem chi tiết"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 🟢 MODAL CHI TIẾT ĐƠN HÀNG */}
            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Chi tiết đơn hàng</h3>
                                <p className="text-xs text-gray-500 font-mono uppercase">Mã: #{selectedOrder._id}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6 bg-gray-50/50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 border rounded-xl shadow-sm">
                                    <h4 className="font-bold text-gray-700 mb-3 border-b pb-2 text-sm">📍 Thông tin giao hàng</h4>
                                    <ul className="text-sm space-y-2 text-gray-600">
                                        <li><span className="font-medium text-gray-800">Khách hàng:</span> {selectedOrder.user?.name || 'Khách vãng lai'}</li>
                                        <li><span className="font-medium text-gray-800">Số điện thoại:</span> {selectedOrder.shippingAddress?.phone}</li>
                                        <li><span className="font-medium text-gray-800">Địa chỉ:</span> {selectedOrder.shippingAddress?.address}</li>
                                    </ul>
                                </div>
                                <div className="bg-white p-4 border rounded-xl shadow-sm">
                                    <h4 className="font-bold text-gray-700 mb-3 border-b pb-2 text-sm">💳 Thanh toán & Trạng thái</h4>
                                    <ul className="text-sm space-y-2 text-gray-600">
                                        <li><span className="font-medium text-gray-800">Ngày đặt:</span> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</li>
                                        <li><span className="font-medium text-gray-800">Trạng thái:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(selectedOrder.status)}`}>{selectedOrder.status}</span></li>
                                        <li><span className="font-medium text-gray-800">Tổng tiền:</span> <span className="font-bold text-primary">{formatPrice(selectedOrder.totalPrice)}</span></li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                                <h4 className="font-bold text-gray-700 p-4 border-b bg-gray-50 text-sm flex items-center gap-2">
                                    <Package className="w-4 h-4" /> Danh sách sản phẩm
                                </h4>
                                <ul className="divide-y text-sm">
                                    {selectedOrder.orderItems.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center p-4 hover:bg-gray-50">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-800">{item.name}</span>
                                                <span className="text-xs text-gray-500">Đơn giá: {formatPrice(item.price)}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="bg-gray-100 px-2 py-1 rounded font-medium text-gray-600">x{item.qty}</span>
                                                <span className="font-bold text-primary w-24 text-right">{formatPrice(item.price * item.qty)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <div className="p-4 bg-gray-50 flex justify-end items-center gap-4 border-t">
                                    <span className="font-medium text-gray-600 text-sm">Tổng cộng:</span>
                                    <span className="text-xl font-extrabold text-primary">{formatPrice(selectedOrder.totalPrice)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;