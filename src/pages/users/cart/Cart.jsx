import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Cart.css";

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || []; // Nhận dữ liệu giỏ hàng

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

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  // Giả sử chương trình tích điểm (1% giá trị đơn hàng)
  const rewardPoints = Math.floor(subtotal * 0.01);

  // Tổng thanh toán (có thể thêm phí ship nếu cần)
  const finalTotal = subtotal; // Nếu có phí ship, thêm vào đây

  const handleCheckout = () => {
    alert("Thanh toán thành công!");
    navigate("/success");
  };

  return (
    <div className="container my-5">
      <h2>Checkout Page</h2>

      {/* Bảng hiển thị giỏ hàng */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.productId}>
              <td>
                <img
                  src={item.productImages[0]?.imageURL}
                  alt={item.productName}
                  width="50"
                />
                {item.productName}
              </td>
              <td>{item.unitPrice} VND</td>
              <td>{item.quantity}</td>
              <td>{item.quantity * item.unitPrice} VND</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Thông tin người nhận */}
      <div className="cart-container">
        <div className="customer-info">
          <h2>Thông tin người nhận</h2>
          <label>Tên khách hàng</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Địa chỉ</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="order-info">
          <h2>Thông tin đơn hàng</h2>
          <p>
            <strong>Tổng sản phẩm đã chọn:</strong> {totalQuantity}
          </p>
          <p>
            <strong>Tích điểm:</strong> {rewardPoints} điểm
          </p>

          {/* Phương thức thanh toán */}
          <div className="payment-method">
            {/* <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Thanh toán khi nhận hàng
            </label> */}
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="vnpay"
                checked={formData.paymentMethod === "vnpay"}
                onChange={handleChange}
              />
              Thanh toán qua VNPay
            </label>
          </div>

          {/* Tổng thanh toán */}
          <div className="total-payment">
            <strong>Tổng thanh toán: {finalTotal.toLocaleString()} VNĐ</strong>
          </div>

          {/* Nút Thanh toán & Hủy */}
          <div className="buttons">
            <button onClick={handleCheckout} className="btn primary">
              Thanh toán
            </button>
            <button
              onClick={() => navigate("/shopping-cart")}
              className="btn secondary"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
