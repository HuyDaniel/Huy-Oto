import axios from 'axios';

const axiosClient = axios.create({
    // Đường dẫn gốc tới Backend
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;