const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// Khởi tạo ứng dụng Express
const app = express();

// Kết nối cơ sở dữ liệu MongoDB
connectDB();

// Cấu hình Middlewares
app.use(cors());
app.use(express.json()); // Đọc dữ liệu JSON từ body request

// Khai báo các Tuyến đường (Routes) API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Route kiểm tra trạng thái hoạt động của Server (Health Check)
app.get('/api/health', (req, res) => {
    res.send('API phụ tùng ô tô đang vận hành ổn định...');
});

// 🟢 PHẦN TÍCH HỢP ĐỂ RENDER CHẠY FULLSTACK (FRONTEND + BACKEND)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use(notFound);
app.use(errorHandler);

// Cấu hình Cổng (Port) chạy Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
