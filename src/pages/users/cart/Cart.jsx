import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { jwtDecode } from "jwt-decode";
import "./Cart.css";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import { Image } from "antd";

export default function Cart() {
    const location = useLocation();
    const { checkoutResponse: initialCheckoutResponse } = location.state || {};
    const navigate = useNavigate();
    const { setCart } = useContext(CartContext);
    const initialCartItems = location.state?.cartItems || [];

    const [cartItems, setCartItems] = useState(initialCartItems);
    const [checkoutResponse, setCheckoutResponse] = useState(initialCheckoutResponse);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "",
    });
    const [isUserInfoValid, setIsUserInfoValid] = useState(false);
    const [isInfoConfirmed, setIsInfoConfirmed] = useState(false); // Thêm state này

    const orderId = checkoutResponse?.orderId;

    if (!orderId) {
        console.error("Order ID is missing!");
        toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
        return;
    }

    // Fetch user information from API
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found.");
                navigate("/login");
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const userEmail = decodedToken.sub;

                const response = await api.get(`/users/${userEmail}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = response.data;
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    paymentMethod: formData.paymentMethod,
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        const { firstName, lastName, email, phone, address } = formData;
        const isValid = firstName && lastName && email && phone && address;
        setIsUserInfoValid(isValid);
    }, [formData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // const handleCheckOutConfirmation = async () => {
    //     try {
    //         const response = await api.post(`/users/check-out/${formData.email}/${orderId}`, formData);
    //         const updatedUser = response.data;

    //         setFormData({
    //             firstName: updatedUser.firstName || "",
    //             lastName: updatedUser.lastName || "",
    //             email: updatedUser.email || "",
    //             phone: updatedUser.phone || "",
    //             address: updatedUser.address || "",
    //             paymentMethod: formData.paymentMethod,
    //         });

    //         setIsInfoConfirmed(true); // Cập nhật state khi thông tin được xác nhận
    //         toast.success("Thông tin đã được xác nhận!");
    //     } catch (error) {
    //         console.error("Error checking out user:", error);
    //         toast.error("Có lỗi xảy ra khi xác nhận thông tin.");
    //     }
    // };

    const handleCheckOutConfirmation = async () => {
        try {
            // Gọi API để lưu thông tin khách hàng vào database
            const response = await api.post(`/users/check-out/${formData.email}/${orderId}`, formData);
            const updatedUser = response.data;
    
            // Cập nhật state với thông tin mới từ server
            setFormData({
                firstName: updatedUser.firstName || "",
                lastName: updatedUser.lastName || "",
                email: updatedUser.email || "",
                phone: updatedUser.phone || "",
                address: updatedUser.address || "",
                paymentMethod: formData.paymentMethod,
            });
    
            // Đánh dấu thông tin đã được xác nhận
            setIsInfoConfirmed(true);
            toast.success("Thông tin đã được xác nhận và lưu thành công!");
        } catch (error) {
            console.error("Error checking out user:", error);
            toast.error("Có lỗi xảy ra khi xác nhận thông tin.");
        }
    };

    const totalQuantity = checkoutResponse?.cartItems?.reduce(
        (total, item) => total + item.quantity,
        0
    ) || 0;

    const subtotal = checkoutResponse?.cartItems?.reduce(
        (total, item) => total + item.discountPrice * item.quantity,
        0
    ) || 0;

    const rewardPoints = Math.floor(subtotal * 0.01);
    const finalTotal = subtotal;

    const handleCheckout = async () => {
        if (!isInfoConfirmed) {
            toast.error("Vui lòng xác nhận thông tin trước khi thanh toán.");
            return;
        }

        const checkoutRequest = {
            email: formData.email,
            cartItemDTO: cartItems.map((item) => ({
                productName: item.productName,
                quantity: item.quantity,
                price: item.discountPrice,
            })),
            orderId: orderId,
            total: finalTotal,
        };

        if (formData.paymentMethod === "Momo") {
            try {
                const response = await api.post(`/momo/create/${orderId}`, checkoutRequest);
                const payUrl = response.data;

                if (!payUrl.payUrl) {
                    throw new Error("Không nhận được URL thanh toán từ Momo.");
                }

                window.location.href = payUrl.payUrl;
                setCart([]);
                setCartItems([]);

                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } catch (error) {
                console.error("Error during Momo payment process:", error);
                toast.error("Có lỗi xảy ra khi thanh toán qua Momo. Vui lòng thử lại.");
            }
        } else {
            try {
                const response = await api.get(`/cart/pay/${orderId}`, checkoutRequest);
                const total = checkoutResponse.total || subtotal;

                toast.success(`Thanh toán thành công! Tổng tiền: ${total.toLocaleString()} đ`);
                setCart([]);
                setCartItems([]);

                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } catch (error) {
                console.error("Error during checkout:", error);
                toast.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
            }
        }
    };

    const handleCancel = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found.");
            toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
            return;
        }

        const email = formData.email;

        try {
            const response = await api.delete(`/cart/delete/${email}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success("Đơn hàng đã được hủy thành công.");
                navigate("/shopping-cart");
            } else {
                toast.error("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error during order cancellation:", error);
            toast.error("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.");
        }
    };

    return (
        <>
            <ToastContainer autoClose={3000} />
            <div className="container">
                <div className="cart-container">
                    <h2 className="title">Trang thanh toán</h2>
                    <h4>Thông tin đơn hàng</h4>

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
                            {checkoutResponse?.cartItems ? (
                                checkoutResponse.cartItems.map((item) => (
                                    <tr key={item.productId}>
                                        <td>
                                            <Image
                                                src={item.imageUrl || ""}
                                                alt={item.productName}
                                                className="product-image"
                                                style={{ width: 80, height: 50 }}
                                            />
                                        </td>
                                        <td>{item.productName}</td>
                                        <td>
                                            {item.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                            <span style={{ textDecoration: "underline" }}>đ</span>
                                        </td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            {(item.quantity * item.discountPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}{" "}
                                            <span style={{ textDecoration: "underline" }}>đ</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        Không có sản phẩm nào trong giỏ hàng.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="customer-info">
                        <h4>Thông tin người nhận</h4>
                        {["firstName", "lastName", "email", "phone"].map((field) => (
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

                        <div className="user-info-display">
                            <h5>Thông tin đã điền:</h5>
                            <p>Tên: {formData.firstName} {formData.lastName}</p>
                            <p>Email: {formData.email}</p>
                            <p>Điện thoại: {formData.phone}</p>
                            <p>Địa chỉ: {formData.address}</p>
                        </div>

                        <button
                            onClick={handleCheckOutConfirmation}
                            className="btn primary"
                            disabled={!isUserInfoValid}
                        >
                            Xác nhận thông tin
                        </button>
                    </div>

                    <div className="order-info">
                        <h2>Thông tin đơn hàng</h2>
                        <p>
                            <strong>Tổng sản phẩm đã chọn:</strong> {totalQuantity}
                        </p>
                        <p>
                            <strong>Tích điểm:</strong> {rewardPoints} điểm
                        </p>

                        <div className="payment-method">
                            <h5 style={{ fontWeight: 700 }}>Chọn phương thức thanh toán</h5>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Momo"
                                    checked={formData.paymentMethod === "Momo"}
                                    onChange={handleChange}
                                />
                                Thanh toán qua Momo
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
                            <p style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
                                Tổng thanh toán:
                            </p>
                            {subtotal.toLocaleString()} <span style={{ textDecoration: "underline" }}>đ</span>
                        </div>

                        <div className="buttons">
                            <button onClick={handleCheckout} className="btn primary">
                                Mua
                            </button>
                            <button
                                onClick={handleCancel}
                                className="btn secondary"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}