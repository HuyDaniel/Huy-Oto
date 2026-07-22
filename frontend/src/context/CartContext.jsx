import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    // Lấy data từ localStorage lên (nếu có), không có thì mảng rỗng
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Mỗi khi giỏ hàng thay đổi -> Tự động lưu lại vào localStorage
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hành động 1: Thêm vào giỏ
    const addToCart = (product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                // Đã có thì tăng số lượng lên 1
                return prev.map(item => 
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            // Chưa có thì thêm mới vào
            return [...prev, { ...product, quantity: 1 }];
        });
        alert(`Đã thêm ${product.name} vào giỏ!`); // Tạm dùng alert, mốt xài Toast xịn sau
    };

    // Hành động 2: Xóa khỏi giỏ
    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    // Hành động 3: Tăng/Giảm số lượng
    const updateQuantity = (id, amount) => {
        setCartItems(prev => prev.map(item => {
            if (item._id === id) {
                const newQuantity = item.quantity + amount;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
            }
            return item;
        }));
    };

    // Hành động 4: Xóa sạch giỏ (khi thanh toán xong)
    const clearCart = () => setCartItems([]);

    // Tính tổng số lượng sản phẩm để nhét lên cái icon đỏ đỏ ở Header
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems 
        }}>
            {children}
        </CartContext.Provider>
    );
};