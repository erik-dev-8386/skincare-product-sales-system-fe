import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css"; 
import Footer from "../../../component/Footer/Footer";
import Header from '../../../component/Header/Header';

const Cart = () => {
  const navigate = useNavigate();

  // Danh sách sản phẩm trong giỏ hàng
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Sản phẩm A", price: 200000, quantity: 1 },
    { id: 2, name: "Sản phẩm B", price: 150000, quantity: 2 }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Tăng số lượng sản phẩm
  const increaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Giảm số lượng sản phẩm
  const decreaseQuantity = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    ));
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const deleteItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Tính toán tổng sản phẩm, tổng tiền và các giá trị khác
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discount = subtotal > 500000 ? subtotal * 0.1 : 0; // Ví dụ: Giảm 10% nếu tổng tiền > 500K
  const finalTotal = subtotal - discount;
  const rewardPoints = Math.floor(finalTotal / 10000); // Ví dụ: 1 điểm cho mỗi 10K

  const handleCheckout = () => {
    alert("Thanh toán thành công!");
    navigate("/success");
  };

  return (
    <>
      {/* <Header /> */}
      <div className="cart-container">
        {/* Thông tin người nhận */}
        <div className="customer-info">
          <h2>Thông tin người nhận</h2>
          <label>Tên khách hàng</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Số điện thoại</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

          <label>Địa chỉ</label>
          <textarea name="address" value={formData.address} onChange={handleChange}></textarea>
        </div>

        {/* Giỏ hàng */}
        {/* <div className="cart-items">
          <h2>Sản phẩm trong giỏ</h2>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name}</span>
              <span>{item.price.toLocaleString()} VNĐ</span>
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
              <button onClick={() => deleteItem(item.id)}>🗑</button>
            </div>
          ))}
        </div> */}

        {/* Thông tin đơn hàng */}
        <div className="order-info">
          <h2>Thông tin đơn hàng</h2>
          <p><strong>Tổng sản phẩm đã chọn:</strong> {totalQuantity}</p>
          <p><strong>Tạm tính:</strong> {subtotal.toLocaleString()} VNĐ</p>
          <p><strong>Giảm giá:</strong> {discount.toLocaleString()} VNĐ</p>
          <p><strong>Tích điểm:</strong> {rewardPoints} điểm</p>

          {/* Phương thức thanh toán */}
          <div className="payment-method">
            <label>
              <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleChange} />
              Thanh toán khi nhận hàng
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="vnpay" checked={formData.paymentMethod === "vnpay"} onChange={handleChange} />
              Thanh toán qua VNPay
            </label>
          </div>

          {/* Tổng thanh toán */}
          <div className="total-payment">
            <strong>Tổng thanh toán: {finalTotal.toLocaleString()} VNĐ</strong>
          </div>

          {/* Nút Thanh toán & Hủy */}
          <div className="buttons">
            <button onClick={handleCheckout} className="btn primary">Thanh toán</button>
            <button onClick={() => navigate("/cart")} className="btn secondary">Hủy</button>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Cart;
