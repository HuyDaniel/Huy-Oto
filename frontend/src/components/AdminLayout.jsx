import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, List, Users, ShoppingCart, LogOut, Store } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 🟢 ĐÃ FIX: Chuyển hướng về Trang chủ '/' thay vì '/login'
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        navigate('/'); // Hoặc dùng window.location.href = '/';
    };

    const menuItems = [
        { title: 'Tổng quan', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { title: 'Sản phẩm', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
        { title: 'Danh mục', path: '/admin/categories', icon: <List className="w-5 h-5" /> },
        { title: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
        { title: 'Khách hàng', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* ⬛ SIDEBAR (Cột Menu bên trái) */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                {/* Logo / Tên Trang */}
                <div className="h-16 flex items-center justify-center border-b border-gray-800">
                    <h1 className="text-2xl font-extrabold text-green-500 tracking-wider">HUY AUTO<span className="text-white text-sm ml-2">ADMIN</span></h1>
                </div>

                {/* Các nút Menu */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Nút Quay Về Trang User & Đăng Xuất ở cuối Sidebar */}
                <div className="p-4 border-t border-gray-800 space-y-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-2.5 text-green-400 hover:bg-gray-800 hover:text-green-300 rounded-lg transition-colors text-sm font-semibold"
                    >
                        <Store className="w-5 h-5" />
                        <span>Xem Cửa Hàng</span>
                    </Link>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 w-full text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors text-sm font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* ⬜ MAIN CONTENT (Khu vực nội dung bên phải) */}
            <main className="flex-1 ml-64 p-8">
                {/* Header nhỏ của Admin */}
                <header className="bg-white shadow-sm rounded-lg px-6 py-4 mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Hệ Thống Quản Trị</h2>
                    
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 bg-green-50 text-primary hover:bg-primary hover:text-white border border-primary px-3.5 py-1.5 rounded-full transition-all text-xs font-bold shadow-sm"
                        >
                            <Store className="w-4 h-4" />
                            <span>Trang bán hàng</span>
                        </Link>

                        <div className="h-8 w-[1px] bg-gray-200"></div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-primary font-bold">
                                AD
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Admin</p>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Nội dung thay đổi */}
                <div className="bg-white rounded-lg shadow-sm p-6 min-h-[70vh]">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;