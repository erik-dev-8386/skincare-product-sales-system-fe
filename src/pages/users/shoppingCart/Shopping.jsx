import React, { useState } from "react";
import s1 from '../../../assets/home/s1.jpg'
import Footer from "../../../component/Footer/Footer";
import Header from '../../../component/Header/Header'
import './Shopping.css'
export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Tên sản phẩm", price: ".....", category: ".....", quantity: 1, selected: false },
        { id: 2, name: "Tên sản phẩm", price: ".....", category: ".....", quantity: 1, selected: false },
        { id: 3, name: "Tên sản phẩm", price: ".....", category: ".....", quantity: 1, selected: false }
    ]);

    const increaseQuantity = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const decreaseQuantity = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const deleteItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const toggleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setCartItems(cartItems.map(item => ({ ...item, selected: isChecked })));
    };

    const handleCheckout = () => {
        window.location.href = "/cart"; // Điều hướng sang trang mới
    };
    return (
        <>
            <Header />
            <div className="cart-container">
                <div className="cart-header">
                    <h1 className="gh">Giỏ hàng</h1>
                    <span>{cartItems.length} sản phẩm</span>
                </div>

                <div className="cart-items">
                    <div className="select-all">
                        <input type="checkbox" id="select-all" onChange={toggleSelectAll} />
                        <label htmlFor="select-all">Chọn tất cả</label>
                    </div>

                    {cartItems.map(item => (
    <div key={item.id} className="cart-item">
        <div className="product-container">
            <img src={s1} alt="Product" className="sss" />
            <div className="product-info">
                <div className="product-name">{item.name}</div>
                <div className="product-details">
                    Đơn giá: {item.price} | Phân loại: {item.category}
                </div>
            </div>
            <div className="quantity-control">
                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                <span>{String(item.quantity).padStart(2, '0')}</span>
                <button onClick={() => increaseQuantity(item.id)}>+</button>
                <input 
                    type="checkbox" 
                    checked={item.selected} 
                    onChange={() =>
                        setCartItems(cartItems.map(i => i.id === item.id ? { ...i, selected: !i.selected } : i))
                    } 
                />
                <button className="delete-btn" onClick={() => deleteItem(item.id)}>🗑</button>
            </div>
        </div>
    </div>
))}


                </div>

                <div className="order-summary">
                    <div className="summary-header">
                        <h2>Thông tin đơn hàng</h2>
                    </div>
                    <div className="summary-content">
                        <div>Tổng sản phẩm đã chọn: {cartItems.filter(item => item.selected).length}</div>
                        <div>Tạm tính: ..................VNĐ</div>
                        <div>Giảm giá: ......%</div>
                        <div>Tích điểm: ......</div>
                        <div className="total-price">Tổng thanh toán: ..........VNĐ</div>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>Đặt hàng</button>
                </div>
            </div>
            <Footer />
        </>
    );
} 