import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Cart.css";
import api from "../../../config/api";

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.cartItems || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  // Fetch user information from API
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // Adjust if you store the token elsewhere
      if (!token) {
        console.error("No token found.");
        return;
      }

      try {
        // Decode the token to get user info
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.sub; // Get the email from the token

        const response = await api.get(`/users/${userEmail}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        const data = response.data; // Adjust based on your API response structure
        setFormData((prev) => ({
          ...prev,
          name: data.firstName || prev.firstName,
          email: data.email || prev.email,
          phone: data.phoneNumber || prev.phoneNumber,
          address: data.address || prev.address,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.discountPrice * item.quantity,
    0
  );

  const rewardPoints = Math.floor(subtotal * 0.01);
  const finalTotal = subtotal;

  const handleCheckout = () => {
    alert("Thanh toán thành công!");
    navigate("/success");
  };

  return (
    <div className="container">
      <div className="cart-container">
        <h2 className="title">Trang thanh toán</h2>

        <table className="cart-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Sản phẩm</th>
              <th>Giá tiền</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.productId}>
                <td>
                  <img
                    src={item.productImages[0]?.imageURL}
                    alt={item.productName}
                    className="product-image"

                  />
                </td>
                <td>{item.productName}</td>
                <td>{item.discountPrice} <span style={{ textDecoration: "underline" }}>đ</span></td>
                <td>{item.quantity}</td>
                <td>{item.quantity * item.discountPrice} <span style={{ textDecoration: "underline" }}>đ</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="customer-info">
          <h2>Thông tin người nhận</h2>
          {["Tên", "email", "số điện thoại"].map((field) => (
            <div key={field} className="input-group">
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="input-group">
            <label>Địa chỉ</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <div className="order-info">
          <h2>Thông tin đơn hàng</h2>
          <p><strong>Tổng sản phẩm đã chọn:</strong> {totalQuantity}</p>
          <p><strong>Tích điểm:</strong> {rewardPoints} điểm</p>

          <div className="payment-method">
            <h5 style={{fontWeight: 700}}>Chọn phương thức thanh toán</h5>
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
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === "cod"}
                onChange={handleChange}
              />
              Thanh toán khi nhận hàng
            </label>
          </div>

          <div className="total-payment">
            <p style={{color: "black", fontSize: 20, fontWeight: "bold"}} >Tổng thanh toán:</p> {finalTotal.toLocaleString()} <span style={{ textDecoration: "underline" }}>đ</span>
          </div>

          <div className="buttons">
            <button onClick={handleCheckout} className="btn primary">
              Mua
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