// Middleware xử lý khi không tìm thấy route (404)
// Đặt middleware này SAU tất cả các route và TRƯỚC errorHandler trong server.js
const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy đường dẫn - ${req.originalUrl}`);
    res.status(404);
    next(error); // Chuyển lỗi này xuống errorHandler xử lý tiếp
};

// Middleware xử lý lỗi tập trung (phải đặt cuối cùng trong server.js)
const errorHandler = (err, req, res, next) => {
    // Nếu không có mã lỗi cụ thể thì mặc định là lỗi 500 (Internal Server Error)
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Lỗi máy chủ, vui lòng thử lại sau';

    // Xử lý lỗi CastError của Mongoose (VD: truyền sai định dạng ObjectId)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Không tìm thấy tài nguyên';
    }

    // Xử lý lỗi ValidationError của Mongoose (VD: thiếu field required trong schema)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
    }

    // Xử lý lỗi trùng khóa duy nhất (unique) trong MongoDB, VD: email/sđt đã tồn tại
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue).join(', ');
        message = `Giá trị của trường "${field}" đã tồn tại`;
    }

    // Log lỗi ra terminal server để tiện theo dõi/debug
    console.error(err.stack);

    res.status(statusCode);
    res.json({
        message,
        // Chỉ hiện chi tiết dòng lỗi (stack) khi đang dev, khi lên production thì ẩn đi để bảo mật
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler, notFound };