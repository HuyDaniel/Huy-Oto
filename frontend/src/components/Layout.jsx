import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, LogOut, ShieldCheck, MapPin, Phone, Mail, Clock, Truck, Headphones, Wrench } from 'lucide-react';
import AuthModal from './AuthModal';
import { useCart } from '../context/CartContext';

const Layout = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [keyword, setKeyword] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { totalItems, clearCart } = useCart(); 

  // Tự động cuộn lên đầu trang mượt mà khi đổi Link
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname, location.search]);

  // Đồng bộ ô Input với URL Search
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setKeyword(urlSearch);
  }, [searchParams]);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthSuccess = (userInfo) => setUser(userInfo);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    clearCart();
    setUser(null); 
    navigate('/'); 
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (keyword.trim()) {
        navigate(`/?search=${encodeURIComponent(keyword.trim())}`);
      } else {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Bấm vào Logo là xóa sạch từ khóa & về trang chủ */}
          <Link to="/" onClick={() => setKeyword('')} className="text-2xl font-bold tracking-wider flex items-center gap-2">
            <Wrench className="w-6 h-6" /> HUY AUTO
          </Link>

          <div className="hidden md:flex items-center bg-white rounded-md px-3 py-1 w-1/3">
            <input 
              type="text" 
              placeholder="Tìm kiếm phụ tùng (Brembo, Bosch, Phanh...)" 
              className="w-full outline-none text-black px-2 py-1 text-sm"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Search 
              className="text-gray-500 w-5 h-5 cursor-pointer hover:text-primary transition-colors" 
              onClick={() => keyword.trim() ? navigate(`/?search=${encodeURIComponent(keyword.trim())}`) : navigate('/')}
            />
          </div>

          <nav className="flex items-center gap-6 font-semibold text-sm">
            <div className="flex items-center gap-4 border-green-500 pl-2">
              <Link to="/cart" className="relative hover:text-green-200 flex items-center gap-1 mr-2">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center gap-2">
                  {(user.role === 'admin' || user.isAdmin) && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-full transition font-bold text-xs shadow-sm"
                      title="Quản trị hệ thống"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Trang Admin</span>
                    </Link>
                  )}

                  <Link to="/profile" className="flex items-center gap-2 text-white hover:text-green-200 transition bg-green-700 px-3 py-1.5 rounded-full">
                    <User className="w-4 h-4" />
                    <span>Xin Chào, {user.name}!</span>
                  </Link>
                  <button onClick={handleLogout} title="Đăng xuất" className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="flex items-center gap-2 hover:text-green-200 border border-white px-3 py-1.5 rounded-full transition hover:bg-white hover:text-primary">
                  <User className="w-5 h-5" />
                  <span>Đăng nhập / Đăng ký</span>
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
      
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="border-b border-gray-800 bg-gray-950/60 py-6">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><Truck className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-white text-sm">Giao hàng toàn quốc</h4>
                <p className="text-xs text-gray-400">Freeship đơn hàng trên 2 triệu</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><ShieldCheck className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-white text-sm">100% Chính hãng</h4>
                <p className="text-xs text-gray-400">Cam kết hoàn tiền nếu hàng nhái</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><Headphones className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-white text-sm">Tư vấn kỹ thuật</h4>
                <p className="text-xs text-gray-400">Hỗ trợ chọn đúng đời xe 24/7</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-xl"><Wrench className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-white text-sm">Đổi trả dễ dàng</h4>
                <p className="text-xs text-gray-400">Đổi trả trong 7 ngày nếu lỗi NSX</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-primary tracking-wider">HUY AUTO</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hệ thống cung cấp phụ tùng ô tô chính hãng hàng đầu. Chuyên linh kiện thay thế cho các dòng xe Toyota, Honda, Mazda, Hyundai, Kia...
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-primary font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Đại lý ủy quyền chính thức
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-l-4 border-primary pl-3">Liên Hệ</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>99 Đường số 10, Phường Hạnh Thông, Quận Gò Vấp, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="text-white font-bold">0909.123.456 (Hotline)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>contact@huyautoparts.vn</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <span>8:00 - 18:00 (Thứ 2 - Chủ Nhật)</span>
              </li>
            </ul>
          </div>

          {/* 🔴 CỘT 3 ĐÃ FIX: Đổi lại thứ tự cho khớp 100% với Sidebar */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-l-4 border-primary pl-3">Danh Mục Phụ Tùng</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" onClick={() => setKeyword('')} className="hover:text-primary transition-colors font-bold text-green-400">
                  Tất cả sản phẩm (Xóa lọc)
                </Link>
              </li>
              <li>
                <Link to="/?search=động cơ" onClick={() => setKeyword('động cơ')} className="hover:text-primary transition-colors">
                  Phụ tùng động cơ & Lọc nhớt
                </Link>
              </li>
              <li>
                <Link to="/?search=phanh" onClick={() => setKeyword('phanh')} className="hover:text-primary transition-colors">
                  Hệ thống phanh Brembo
                </Link>
              </li>
              <li>
                <Link to="/?search=điện" onClick={() => setKeyword('điện')} className="hover:text-primary transition-colors">
                  Hệ thống điện & Bugi Denso
                </Link>
              </li>
              <li>
                <Link to="/?search=dầu" onClick={() => setKeyword('dầu')} className="hover:text-primary transition-colors">
                  Dầu nhớt Motul & Phụ gia
                </Link>
              </li>
              <li>
                <Link to="/?search=ngoại thất" onClick={() => setKeyword('ngoại thất')} className="hover:text-primary transition-colors">
                  Phụ kiện & Đèn chiếu sáng
                </Link>
              </li>
            </ul>
          </div>

          {/* 🔴 CỘT 4: Link trỏ chuẩn xác sang các Tab của trang Policy */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-base border-l-4 border-primary pl-3">Chính Sách Khách Hàng</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/policy?tab=warranty" className="hover:text-primary transition-colors">Chính sách bảo hành & Đổi trả</Link>
              </li>
              <li>
                <Link to="/policy?tab=payment" className="hover:text-primary transition-colors">Phương thức thanh toán (COD/Banking)</Link>
              </li>
              <li>
                <Link to="/policy?tab=shipping" className="hover:text-primary transition-colors">Chính sách vận chuyển siêu tốc</Link>
              </li>
              <li>
                <Link to="/policy?tab=sku-guide" className="hover:text-primary transition-colors">Hướng dẫn tra cứu mã SKU phụ tùng</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 bg-gray-950 py-4 text-center text-xs text-gray-500">
          <p>© 2026 <span className="text-primary font-bold">Huy AutoParts</span>. Đồ án Web Nâng Cao. Tất cả các quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;