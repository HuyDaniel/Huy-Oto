import { useState, useEffect } from 'react';
import { Users, Trash2, Search, ShieldCheck, User } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Lỗi tải danh sách người dùng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Toàn bộ dữ liệu của họ sẽ bị mất!')) {
            try {
                await axiosClient.delete(`/users/${id}`);
                alert('Xóa người dùng thành công!');
                fetchUsers();
            } catch (error) {
                console.error('Lỗi xóa user:', error);
                alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa!');
            }
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h3 className="text-xl font-bold text-gray-800 border-l-4 border-primary pl-3 flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" /> QUẢN LÝ KHÁCH HÀNG
                </h3>
                
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Tìm tên hoặc email..." 
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
                                <th className="py-3 px-4 font-bold">Họ và tên</th>
                                <th className="py-3 px-4 font-bold">Email</th>
                                <th className="py-3 px-4 font-bold">Số điện thoại</th>
                                <th className="py-3 px-4 font-bold">Quyền hạn</th>
                                <th className="py-3 px-4 font-bold text-center w-24">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-500">Đang tải dữ liệu...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-500">Không tìm thấy tài khoản nào!</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-gray-800 flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                {user.role === 'admin' ? <ShieldCheck className="w-4 h-4 text-amber-500" /> : <User className="w-4 h-4" />}
                                            </div>
                                            {user.name}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                        <td className="py-3 px-4 text-gray-600">{user.phone || 'Chưa cập nhật'}</td>
                                        <td className="py-3 px-4">
                                            {user.role === 'admin' ? (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Admin</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Customer</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button 
                                                onClick={() => handleDelete(user._id)} 
                                                className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded transition-colors" 
                                                title="Xóa tài khoản"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;