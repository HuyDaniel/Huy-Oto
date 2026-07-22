# HUY AUTO PARTS - MERN STACK E-COMMERCE

Hệ thống thương mại điện tử chuyên cung cấp phụ tùng và linh kiện ô tô chính hãng (Brembo, Denso, Bosch, Motul, K&N...). Dự án được xây dựng dựa trên nền tảng **MERN Stack** (MongoDB, Express.js, React.js, Node.js) với giao diện hiện đại sử dụng **Tailwind CSS**.

---

## Các Tính Năng Nổi Bật

* **Trang chủ & Bộ lọc thông minh**:
* Banner trượt (Carousel) tự động chạy kèm nút bấm điều hướng nhanh.
* Hệ thống tìm kiếm theo tên hoặc mã SKU linh hoạt.
* Bộ lọc đa tiêu chí kết hợp giữa **Danh mục phụ tùng** và **Thương hiệu** độc quyền.


* **Giỏ hàng & Thanh toán**:
* Thêm/xóa sản phẩm, cập nhật số lượng trực tiếp trong giỏ hàng.
* Luồng đặt hàng và thanh toán nhanh chóng.


* **Xác thực người dùng**:
* Đăng ký, đăng nhập bảo mật với JWT (JSON Web Token).
* Phân quyền rõ ràng tài khoản Khách hàng và Quản trị viên (Admin).


* **Trang Quản Trị (Admin Dashboard)**:
* Quản lý toàn bộ kho phụ tùng (Thêm mới, chỉnh sửa thông tin, cập nhật tồn kho).
* Hỗ trợ tải lên hình ảnh từ máy tính (Preview trực tiếp) hoặc dán link URL.



---

## 🛠️ Công Nghệ Sử Dụng

### Frontend

* **React.js** (Vite)
* **React Router DOM** (Điều hướng trang)
* **Tailwind CSS** (Giao diện & Responsive)
* **Lucide React** (Bộ icon hiện đại)
* **Axios** (Giao tiếp API)

### Backend

* **Node.js & Express.js** (Xây dựng RESTful APIs)
* **MongoDB & Mongoose** (Database NoSQL)
* **JWT & bcryptjs** (Xác thực và mã hóa mật khẩu)
* **CORS & Dotenv** (Cấu hình bảo mật và biến môi trường)

---

## Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Clone dự án về máy

```bash
git clone https://github.com/your-username/huy-auto.git
cd huy-auto

```

### 2. Cấu hình và chạy Backend

```bash
cd backend
npm install

```

* Tạo file `.env` trong thư mục `backend` với nội dung:

```env
PORT=5000
MONGO_URI=duong_dan_ket_noi_mongodb_cua_ban
JWT_SECRET=ma_bi_mat_jwt

```

* Khởi động server backend:

```bash
npm run dev

```

### 3. Cấu hình và chạy Frontend

```bash
cd ../frontend
npm install
npm run dev

```

---

## 📄 Bản Quyền

© 2026 **Huy AutoParts**. Đồ án Web Nâng Cao.
