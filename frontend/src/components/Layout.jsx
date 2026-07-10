import { Outlet, Link } from 'react-router-dom';
import { ShoppingCart, User, Search } from 'lucide-react';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 🟢 HEADER CỐ ĐỊNH TRÊN CÙNG */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-wider">
            HUY AUTO
          </Link>

          {/* Thanh tìm kiếm */}
          <div className="hidden md:flex items-center bg-white rounded-md px-3 py-1 w-1/3">
            <input 
              type="text" 
              placeholder="Tìm kiếm phụ tùng..." 
              className="w-full outline-none text-black px-2 py-1"
            />
            <Search className="text-gray-500 w-5 h-5 cursor-pointer" />
          </div>

          {/* Menu & Icons */}
          <nav className="flex items-center gap-6 font-semibold">
            <Link to="/" className="hover:text-green-200 transition">Trang chủ</Link>
            <Link to="/products" className="hover:text-green-200 transition">Sản phẩm</Link>
            
            <div className="flex items-center gap-4 ml-4">
              <Link to="/cart" className="relative hover:text-green-200">
                <ShoppingCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </Link>
              <Link to="/login" className="hover:text-green-200">
                <User className="w-6 h-6" />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* ⚪ NỘI DUNG ĐỘNG (Thay đổi khi chuyển trang) */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* 🟢 FOOTER CỐ ĐỊNH DƯỚI CÙNG */}
      <footer className="bg-primary text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Huy AutoParts</h3>
            <p className="text-sm text-green-100">Chuyên cung cấp phụ tùng ô tô chính hãng, đảm bảo chất lượng và giá cả tốt nhất thị trường.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <p className="text-sm text-green-100">📞 SĐT: 038 834 7672</p>
            <p className="text-sm text-green-100 mt-2">📍 Địa chỉ: Hạnh Thông, Gò Vấp, TP.HCM</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Chính sách</h3>
            <p className="text-sm text-green-100 hover:underline cursor-pointer">Bảo mật thông tin</p>
            <p className="text-sm text-green-100 mt-2 hover:underline cursor-pointer">Chính sách đổi trả</p>
          </div>
        </div>
        <div className="bg-green-800 text-center py-3 text-sm text-green-200">
          © 2026 Huy AutoParts. Đồ án Web Nâng Cao.
        </div>
      </footer>
    </div>
  );
};

export default Layout;