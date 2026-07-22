import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Search, ChevronRight, ArrowLeft } from 'lucide-react';

const Policy = () => {
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') || 'warranty';
    const [activeTab, setActiveTab] = useState(tabParam);

    useEffect(() => {
        if (searchParams.get('tab')) {
            setActiveTab(searchParams.get('tab'));
        }
    }, [searchParams]);

    const menuItems = [
        { id: 'warranty', label: 'Chính sách bảo hành & Đổi trả', icon: <ShieldCheck className="w-5 h-5" /> },
        { id: 'shipping', label: 'Chính sách vận chuyển', icon: <Truck className="w-5 h-5" /> },
        { id: 'payment', label: 'Phương thức thanh toán', icon: <CreditCard className="w-5 h-5" /> },
        { id: 'sku-guide', label: 'Hướng dẫn tra cứu mã SKU', icon: <Search className="w-5 h-5" /> },
    ];

    return (
        <div className="max-w-6xl mx-auto my-6">
            {/* Nút quay lại */}
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors font-semibold text-sm">
                <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* 🔴 CỘT TRÁI: MENU CHÍNH SÁCH */}
                <div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-24">
                    <div className="bg-gray-900 text-white font-bold py-4 px-5 text-base border-b border-gray-800 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-primary" /> TRUNG TÂM HỖ TRỢ
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between p-4 text-left transition-all font-medium text-sm ${
                                        activeTab === item.id 
                                            ? 'bg-green-50 text-primary border-l-4 border-primary font-bold' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={activeTab === item.id ? 'text-primary' : 'text-gray-400'}>
                                            {item.icon}
                                        </span>
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 ${activeTab === item.id ? 'text-primary' : 'text-gray-300'}`} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ⚪ CỘT PHẢI: NỘI DUNG CHI TIẾT */}
                <div className="w-full md:w-2/3 bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 min-h-[500px]">
                    
                    {/* 1. TAB BẢO HÀNH & ĐỔI TRẢ */}
                    {activeTab === 'warranty' && (
                        <div className="space-y-6 text-gray-700 leading-relaxed animate-in fade-in duration-200">
                            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                                <ShieldCheck className="w-7 h-7 text-primary" /> Chính Sách Bảo Hành & Đổi Trả
                            </h2>
                            <div className="space-y-4 text-sm">
                                <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-800 font-medium">
                                    💡 <b>Cam kết từ Huy Auto:</b> 100% phụ tùng bán out đều được bảo hành chính hãng từ 6 đến 24 tháng theo quy định nhà sản xuất.
                                </div>
                                <h3 className="font-bold text-base text-gray-800 mt-4">1. Điều kiện áp dụng đổi trả (Trong vòng 7 ngày)</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Sản phẩm còn nguyên tem mác, hộp niêm phong, chưa qua sử dụng hoặc lắp đặt thử lên xe.</li>
                                    <li>Sản phẩm bị lỗi kỹ thuật do Nhà sản xuất (NSX) hoặc gãy vỡ do quá trình vận chuyển.</li>
                                    <li>Giao sai mã SKU, sai quy cách hoặc không đúng dòng xe khách hàng đã đặt.</li>
                                </ul>
                                <h3 className="font-bold text-base text-gray-800 mt-4">2. Các trường hợp TỪ CHỐI bảo hành</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                    <li>Sản phẩm bị biến dạng, chập cháy điện, vô nước do thợ lắp đặt sai kỹ thuật.</li>
                                    <li>Mất tem bảo hành hoặc vỏ hộp bị rách hỏng nặng.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* 2. TAB VẬN CHUYỂN */}
                    {activeTab === 'shipping' && (
                        <div className="space-y-6 text-gray-700 leading-relaxed animate-in fade-in duration-200">
                            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                                <Truck className="w-7 h-7 text-primary" /> Chính Sách Vận Chuyển
                            </h2>
                            <div className="space-y-4 text-sm">
                                <h3 className="font-bold text-base text-gray-800">1. Thời gian giao hàng dự kiến</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><b>Nội thành TP.HCM:</b> Giao hỏa tốc trong 2 - 4 giờ làm việc.</li>
                                    <li><b>Các tỉnh thành khác:</b> Giao tiêu chuẩn từ 2 - 4 ngày (qua GHTK, Viettel Post).</li>
                                </ul>
                                <h3 className="font-bold text-base text-gray-800 mt-4">2. Biểu phí vận chuyển</h3>
                                <div className="bg-gray-50 border p-4 rounded-lg space-y-2">
                                    <p>• Đơn hàng dưới 2.000.000đ: Phí ship đồng giá <b>30.000đ</b> toàn quốc.</p>
                                    <p className="text-primary font-bold">• Đơn hàng từ 2.000.000đ trở lên: FREESHIP 100%.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. TAB THANH TOÁN */}
                    {activeTab === 'payment' && (
                        <div className="space-y-6 text-gray-700 leading-relaxed animate-in fade-in duration-200">
                            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                                <CreditCard className="w-7 h-7 text-primary" /> Phương Thức Thanh Toán
                            </h2>
                            <div className="space-y-4 text-sm">
                                <div className="border p-4 rounded-xl flex items-start gap-3">
                                    <span className="bg-primary text-white p-2 rounded-lg font-bold text-xs">1</span>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">Thanh toán khi nhận hàng (COD)</h4>
                                        <p className="text-gray-600 mt-1">Quý khách được kiểm tra ngoại quan sản phẩm đúng mã SKU trước khi thanh toán tiền mặt cho shipper.</p>
                                    </div>
                                </div>
                                <div className="border p-4 rounded-xl flex items-start gap-3">
                                    <span className="bg-primary text-white p-2 rounded-lg font-bold text-xs">2</span>
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-base">Chuyển khoản Ngân hàng (Banking)</h4>
                                        <p className="text-gray-600 mt-1">Nội dung chuyển khoản: <b>[Số điện thoại] - [Mã đơn hàng]</b>. Đơn hàng sẽ được ưu tiên đóng gói giao ngay sau khi nhận tiền.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 4. TAB HƯỚNG DẪN MÃ SKU */}
                    {activeTab === 'sku-guide' && (
                        <div className="space-y-6 text-gray-700 leading-relaxed animate-in fade-in duration-200">
                            <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                                <Search className="w-7 h-7 text-primary" /> Hướng Dẫn Tra Cứu Mã SKU
                            </h2>
                            <div className="space-y-4 text-sm">
                                <p>Mã SKU (Stock Keeping Unit) là mã định danh duy nhất của từng loại phụ tùng ô tô giúp bạn tìm đúng 100% linh kiện phù hợp với xe của mình.</p>
                                <h3 className="font-bold text-base text-gray-800">Cấu trúc mã SKU tại Huy Auto:</h3>
                                <div className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg text-center text-base">
                                    [MÃ THƯƠNG HIỆU] - [MÃ SẢN PHẨM] - [MÃ DÒNG XE]
                                </div>
                                <p className="text-xs text-gray-500 italic">Ví dụ: BRE-DISC-CAM2022 (Phanh đĩa Brembo dành cho xe Camry 2022).</p>
                                <p className="mt-2">Bạn chỉ cần gõ ký hiệu thương hiệu (VD: <i>Brembo, Bosch, Denso</i>) hoặc tên chi tiết lên ô Tìm kiếm ở Đầu trang để tra cứu nhanh!</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Policy;