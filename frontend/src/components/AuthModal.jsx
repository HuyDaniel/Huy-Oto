import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { X, Mail, Lock, User as UserIcon } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true); 
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!isLoginView && formData.password !== formData.confirmPassword) {
            return setError('Mật khẩu xác nhận không khớp!');
        }

        setLoading(true);
        try {
            const endpoint = isLoginView ? '/auth/login' : '/auth/register';
            const payload = isLoginView 
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, email: formData.email, password: formData.password };

            const response = await axiosClient.post(endpoint, payload);
            
            const userInfo = {
                _id: response.data._id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            };
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userInfo', JSON.stringify(userInfo));

            onSuccess(userInfo);
            onClose(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Đã sửa dòng này: Dùng bg-black/40 (màu đen với độ mờ 40%) kết hợp backdrop-blur-sm để làm nhòe cảnh nền
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden animate-fadeIn transform transition-all">
                
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 rounded-full p-1 transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-primary text-center mb-6">
                        {isLoginView ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
                    </h2>
                    
                    {error && <div className="bg-red-100 border border-red-200 text-red-600 p-3 rounded text-sm text-center mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginView && (
                            <div className="relative">
                                <UserIcon className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                                <input type="text" name="name" required placeholder="Họ và Tên" value={formData.name} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                            </div>
                        )}
                        
                        <div className="relative">
                            <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input type="email" name="email" required placeholder="Email" value={formData.email} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>
                        
                        <div className="relative">
                            <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                            <input type="password" name="password" required placeholder="Mật khẩu" value={formData.password} onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                        </div>

                        {!isLoginView && (
                            <div className="relative">
                                <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                                <input type="password" name="confirmPassword" required placeholder="Xác nhận mật khẩu" value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors mt-2 shadow-md hover:shadow-lg">
                            {loading ? 'Đang xử lý...' : (isLoginView ? 'Đăng Nhập' : 'Đăng Ký')}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">
                            {isLoginView ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                        </span>
                        <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="text-primary font-bold hover:underline">
                            {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;