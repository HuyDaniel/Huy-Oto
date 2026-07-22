import axios from 'axios';

const axiosClient = axios.create({
    // Đường dẫn gốc tới Backend
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 🟢 BỘ TỰ ĐỘNG KẸP TOKEN: Trình "Vé VIP" cho bảo vệ Backend
axiosClient.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage ra
        const token = localStorage.getItem('token');
        
        // Nếu có token thì nhét vào header Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;