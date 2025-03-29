
// import React, { useState, useEffect, useContext } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../../../context/CartContext";
// import { jwtDecode } from "jwt-decode";
// import "./Cart.css";
// import api from "../../../config/api";
// import { toast, ToastContainer } from "react-toastify";
// import { Image, Switch } from "antd";

// export default function Cart() {
//     const location = useLocation();
//     const { checkoutResponse: initialCheckoutResponse } = location.state || {};
//     const navigate = useNavigate();
//     const { setCart } = useContext(CartContext);
//     const initialCartItems = location.state?.cartItems || [];

//     const [cartItems, setCartItems] = useState(initialCartItems);
//     const [checkoutResponse, setCheckoutResponse] = useState(initialCheckoutResponse);
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         address: "",
//         paymentMethod: "",
//     });
//     const [isUserInfoValid, setIsUserInfoValid] = useState(false);
//     const [isInfoConfirmed, setIsInfoConfirmed] = useState(false);
//     const [rewardPoints, setRewardPoints] = useState(0);
//     const [useRewardPoints, setUseRewardPoints] = useState(false);
//     const [discountAmount, setDiscountAmount] = useState(0);
//     const [isConfirming, setIsConfirming] = useState(false);

//     const orderId = checkoutResponse?.orderId;

//     // Format number with dots as thousand separators
//     const formatNumber = (num) => {
//         return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0";
//     };

//     if (!orderId) {
//         console.error("Order ID is missing!");
//         toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
//         return;
//     }

//     // Fetch user information from API
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 console.error("No token found.");
//                 navigate("/login");
//                 return;
//             }

//             try {
//                 const decodedToken = jwtDecode(token);
//                 const userEmail = decodedToken.sub;

//                 // Fetch user data first
//                 const userResponse = await api.get(`/users/${userEmail}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 const userData = userResponse.data;
//                 setFormData({
//                     firstName: userData.firstName || "",
//                     lastName: userData.lastName || "",
//                     email: userData.email || "",
//                     phone: userData.phone || "",
//                     address: userData.address || "",
//                     paymentMethod: formData.paymentMethod,
//                 });

//                 // Then fetch wallet data
//                 try {
//                     const walletResponse = await api.get(`/coinWallets/email/${userEmail}`, {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     setRewardPoints(walletResponse.data.balance || 0);
//                 } catch (walletError) {
//                     if (walletError.response?.status === 404) {
//                         // Wallet not found, set points to 0
//                         setRewardPoints(0);
//                     } else {
//                         // Other errors
//                         console.error("Error fetching wallet data:", walletError);
//                         setRewardPoints(0);
//                         toast.error("Không thể tải thông tin ví điểm thưởng");
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//                 toast.error("Không thể tải thông tin người dùng");
//                 if (error.response?.status === 401) {
//                     // Unauthorized - redirect to login
//                     navigate("/login");
//                 }
//             }
//         };

//         fetchUserData();
//     }, [navigate]);


//     useEffect(() => {
//         const { firstName, lastName, email, phone, address } = formData;
//         const isValid = firstName && lastName && email && phone && address;
//         setIsUserInfoValid(isValid);
//     }, [formData]);

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleCheckOutConfirmation = async () => {
//         setIsConfirming(true);
//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 toast.error("Vui lòng đăng nhập");
//                 return;
//             }

//             const userDTO = {
//                 firstName: formData.firstName,
//                 lastName: formData.lastName,
//                 email: formData.email,
//                 phone: formData.phone,
//                 address: formData.address
//             };

//             const response = await api.post(
//                 `/orders/check-out/${formData.email}/${orderId}`,
//                 userDTO,
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     }
//                 }
//             );

//             const orderData = response.data;

//             setFormData(prev => ({
//                 ...prev,
//                 firstName: orderData.customerFirstName || prev.firstName,
//                 lastName: orderData.customerLastName || prev.lastName,
//                 phone: orderData.customerPhone || prev.phone,
//                 address: orderData.address || prev.address,
//             }));

//             setCheckoutResponse(prev => ({
//                 ...prev,
//                 ...orderData,
//                 customerFirstName: orderData.customerFirstName,
//                 customerLastName: orderData.customerLastName,
//                 customerPhone: orderData.customerPhone,
//                 address: orderData.address
//             }));

//             setIsInfoConfirmed(true);
//             toast.success("Thông tin đã được xác nhận và cập nhật!");
//         } catch (error) {
//             console.error("Error confirming order:", error);
//             toast.error(error.response?.data?.message || "Có lỗi khi xác nhận đơn hàng");
//         } finally {
//             setIsConfirming(false);
//         }
//     };



//     const totalQuantity = checkoutResponse?.cartItems?.reduce(
//         (total, item) => total + item.quantity,
//         0
//     ) || 0;

//     const subtotal = checkoutResponse?.cartItems?.reduce(
//         (total, item) => total + item.discountPrice * item.quantity,
//         0
//     ) || 0;

//     const pointsEarned = Math.floor(subtotal * 0.01);
//     const maxDiscount = subtotal * 0.1; // Maximum 10% of order total
//     const actualDiscount = useRewardPoints ? Math.min(rewardPoints, maxDiscount) : 0;
//     const finalTotal = Math.max(0, subtotal - actualDiscount);

//     const handleRewardPointsChange = (checked) => {
//         const discount = checked ? Math.min(rewardPoints, maxDiscount) : 0;
//         setDiscountAmount(discount);
//         setUseRewardPoints(checked);
//         toast.success(checked
//             ? `Chuẩn bị áp dụng giảm giá ${formatNumber(discount)} đ`
//             : "Đã tắt giảm giá bằng điểm thưởng"
//         );
//     };

//     const handleCheckout = async () => {
//         if (!isInfoConfirmed) {
//             toast.error("Vui lòng xác nhận thông tin trước khi thanh toán.");
//             return;
//         }

//         const token = localStorage.getItem("token");
//         if (!token) {
//             toast.error("Vui lòng đăng nhập");
//             return;
//         }

//         try {
//             // Only call apply-discount API when actually checking out
//             if (useRewardPoints) {
//                 await api.post(
//                     "/coinWallets/apply-discount",
//                     null,
//                     {
//                         params: {
//                             orderId,
//                             useCoinWallet: true
//                         },
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 );
//             }

//             const checkoutRequest = {
//                 email: formData.email,
//                 cartItemDTO: cartItems.map((item) => ({
//                     productName: item.productName,
//                     quantity: item.quantity,
//                     price: item.discountPrice,
//                 })),
//                 orderId: orderId,
//                 total: finalTotal,
//                 useRewardPoints: useRewardPoints
//             };

//             if (formData.paymentMethod === "Momo") {
//                 const response = await api.post(`/momo/create/${orderId}`, checkoutRequest);
//                 const payUrl = response.data;

//                 if (!payUrl.payUrl) {
//                     throw new Error("Không nhận được URL thanh toán từ Momo.");
//                 }

//                 window.location.href = payUrl.payUrl;
//             } else {
//                 const response = await api.get(`/cart/pay/${orderId}`, {
//                     params: checkoutRequest
//                 });

//                 toast.success(`Thanh toán thành công! Tổng tiền: ${formatNumber(finalTotal)} đ`);
//                 setCart([]);
//                 setCartItems([]);

//                 setTimeout(() => {
//                     navigate("/");
//                 }, 3000);
//             }
//         } catch (error) {
//             console.error("Error during checkout:", error);
//             toast.error(error.response?.data?.message || "Có lỗi xảy ra khi thanh toán");
//         }
//     };

//     const handleCancel = async () => {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             console.error("No token found.");
//             toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
//             return;
//         }

//         try {
//             const response = await api.delete(`/cart/delete/${formData.email}/${orderId}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (response.status === 200) {
//                 toast.success("Đơn hàng đã được hủy thành công.");
//                 navigate("/shopping-cart");
//             }
//         } catch (error) {
//             console.error("Error during order cancellation:", error);
//             toast.error("Có lỗi xảy ra khi hủy đơn hàng.");
//         }
//     };

//     return (
//         <>
//             <ToastContainer autoClose={3000} />
//             <div className="container">
//                 <div className="cart-container">
//                     <h2 className="title">Trang thanh toán</h2>
//                     <h4>Thông tin đơn hàng</h4>

//                     <table className="cart-table">
//                         <thead>
//                             <tr>
//                                 <th>Ảnh</th>
//                                 <th>Sản phẩm</th>
//                                 <th>Giá tiền</th>
//                                 <th>Số lượng</th>
//                                 <th>Tổng tiền</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {checkoutResponse?.cartItems ? (
//                                 checkoutResponse.cartItems.map((item) => (
//                                     <tr key={item.productId}>
//                                         <td>
//                                             <Image
//                                                 src={item.imageUrl || ""}
//                                                 alt={item.productName}
//                                                 className="product-image"
//                                                 style={{ width: 80, height: 50 }}
//                                             />
//                                         </td>
//                                         <td>{item.productName}</td>
//                                         <td>
//                                             {formatNumber(item.discountPrice)}{" "}
//                                             <span style={{ textDecoration: "underline" }}>đ</span>
//                                         </td>
//                                         <td>{item.quantity}</td>
//                                         <td>
//                                             {formatNumber(item.quantity * item.discountPrice)}{" "}
//                                             <span style={{ textDecoration: "underline" }}>đ</span>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="5" style={{ textAlign: "center" }}>
//                                         Không có sản phẩm nào trong giỏ hàng.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>

//                     <div className="customer-info">
//                         <h4>Thông tin người nhận</h4>
//                         {["firstName", "lastName", "email", "phone"].map((field) => (
//                             <div key={field} className="input-group">
//                                 <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
//                                 <input
//                                     type={field === "email" ? "email" : "text"}
//                                     name={field}
//                                     value={formData[field]}
//                                     onChange={handleChange}
//                                 />
//                             </div>
//                         ))}
//                         <div className="input-group">
//                             <label>Địa chỉ</label>
//                             <textarea
//                                 name="address"
//                                 value={formData.address}
//                                 onChange={handleChange}
//                             ></textarea>
//                         </div>

//                         <div className="user-info-display">
//                             <h5>Thông tin đã xác nhận:</h5>
//                             {checkoutResponse ? (
//                                 <div style={{display: "block"}}>
//                                     <p>Tên: {checkoutResponse.customerFirstName} {checkoutResponse.customerLastName}</p>
//                                     <p>Email: {formData.email}</p>
//                                     <p>Điện thoại: {checkoutResponse.customerPhone}</p>
//                                     <p>Địa chỉ: {checkoutResponse.address}</p>
//                                 </div>
//                             ) : (
//                                 <p>Chưa có thông tin xác nhận</p>
//                             )}

//                             <button
//                                 onClick={handleCheckOutConfirmation}
//                                 className="btn primary"
//                                 disabled={!isUserInfoValid || isConfirming}
//                             >
//                                 {isConfirming ? 'Đang xác nhận...' : 'Xác nhận thông tin'}
//                             </button>


//                             <div className="reward-points-display">
//                                 <h5>Điểm thưởng hiện có:</h5>
//                                 <p>{formatNumber(rewardPoints)} điểm</p>
//                                 <p>Tương ứng: {formatNumber(rewardPoints)} đ</p>
//                             </div>
//                         </div>


//                     </div>

//                     <div className="order-info">
//                         <h2>Thông tin đơn hàng</h2>
//                         <p>
//                             <strong>Tổng sản phẩm đã chọn:</strong> {totalQuantity}
//                         </p>
//                         <p>
//                             <strong>Tích điểm từ đơn này:</strong> {formatNumber(pointsEarned)} điểm
//                         </p>

//                         <div className="reward-points-apply">
//                             <label>
//                                 <Switch
//                                     checked={useRewardPoints}
//                                     onChange={handleRewardPointsChange}
//                                     disabled={rewardPoints <= 0 || !isInfoConfirmed || subtotal <= 0}
//                                 />
//                                 <span>Sử dụng điểm thưởng (Tối đa 10% đơn hàng)</span>
//                             </label>
//                             {useRewardPoints && (
//                                 <p style={{ color: 'green' }}>
//                                     Đã giảm: {formatNumber(actualDiscount)} đ
//                                 </p>
//                             )}
//                         </div>

//                         <div className="payment-method">
//                             <h5 style={{ fontWeight: 700 }}>Chọn phương thức thanh toán</h5>
//                             <label>
//                                 <input
//                                     type="radio"
//                                     name="paymentMethod"
//                                     value="Momo"
//                                     checked={formData.paymentMethod === "Momo"}
//                                     onChange={handleChange}
//                                 />
//                                 Thanh toán qua Momo
//                             </label>
//                             <label>
//                                 <input
//                                     type="radio"
//                                     name="paymentMethod"
//                                     value="cod"
//                                     checked={formData.paymentMethod === "cod"}
//                                     onChange={handleChange}
//                                 />
//                                 Thanh toán khi nhận hàng
//                             </label>
//                         </div>

//                         <div className="total-payment">
//                             <p style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
//                                 Tổng thanh toán:
//                             </p>
//                             {useRewardPoints && (
//                                 <p style={{ textDecoration: 'line-through', color: 'gray' }}>
//                                     {formatNumber(subtotal)} đ
//                                 </p>
//                             )}
//                             <p>{formatNumber(finalTotal)} đ</p>
//                         </div>

//                         <div className="buttons">
//                             <button onClick={handleCheckout} className="btn primary">
//                                 Mua
//                             </button>
//                             <button
//                                 onClick={handleCancel}
//                                 className="btn secondary"
//                             >
//                                 Hủy
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import { jwtDecode } from "jwt-decode";
import "./Cart.css";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import { Image, Switch } from "antd";

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
    const [isInfoConfirmed, setIsInfoConfirmed] = useState(false);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [useRewardPoints, setUseRewardPoints] = useState(false);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const orderId = checkoutResponse?.orderId;

    // Format number with dots as thousand separators
    const formatNumber = (num) => {
        return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0";
    };

    if (!orderId) {
        console.error("Order ID is missing!");
        toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
        return null;
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

                // Fetch user data and wallet data in parallel
                const [userResponse, walletResponse] = await Promise.all([
                    api.get(`/users/${userEmail}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }),
                    api.get(`/coinWallets/email/${userEmail}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).catch(error => {
                        if (error.response?.status === 404) {
                            return { data: { balance: 0 } }; // Return default wallet if not found
                        }
                        throw error;
                    })
                ]);

                const userData = userResponse.data;
                const walletData = walletResponse.data;

                setFormData({
                    firstName: userData.firstName || "",
                    lastName: userData.lastName || "",
                    email: userData.email || "",
                    phone: userData.phone || "",
                    address: userData.address || "",
                    paymentMethod: formData.paymentMethod,
                });

                setRewardPoints(walletData.balance || 0);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Không thể tải thông tin người dùng");
                if (error.response?.status === 401) {
                    navigate("/login");
                }
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

    const handleCheckOutConfirmation = async () => {
        setIsConfirming(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Vui lòng đăng nhập");
                return;
            }

            const userDTO = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            };

            const response = await api.post(
                `/orders/check-out/${formData.email}/${orderId}`,
                userDTO,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const orderData = response.data;

            setFormData(prev => ({
                ...prev,
                firstName: orderData.customerFirstName || prev.firstName,
                lastName: orderData.customerLastName || prev.lastName,
                phone: orderData.customerPhone || prev.phone,
                address: orderData.address || prev.address,
            }));

            setCheckoutResponse(prev => ({
                ...prev,
                ...orderData,
                customerFirstName: orderData.customerFirstName,
                customerLastName: orderData.customerLastName,
                customerPhone: orderData.customerPhone,
                address: orderData.address
            }));

            setIsInfoConfirmed(true);
            toast.success("Thông tin đã được xác nhận và cập nhật!");
        } catch (error) {
            console.error("Error confirming order:", error);
            toast.error(error.response?.data?.message || "Có lỗi khi xác nhận đơn hàng");
        } finally {
            setIsConfirming(false);
        }
    };

    const updateOrderTotal = async (newTotal) => {
        try {
            const token = localStorage.getItem("token");
            const response = await api.put(
                `/orders/order-amount/${orderId}`,
                {
                    totalAmount: newTotal,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating order total:", error);
            throw error;
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

    const pointsEarned = Math.floor(subtotal * 0.01);
    const maxDiscount = subtotal * 0.1; // Maximum 10% of order total
    const actualDiscount = useRewardPoints ? Math.min(rewardPoints, maxDiscount) : 0;
    const finalTotal = Math.max(0, subtotal - actualDiscount);

    const handleRewardPointsChange = async (checked) => {
        try {
            setIsProcessing(true);
            const discount = checked ? Math.min(rewardPoints, maxDiscount) : 0;

            // Update order total when reward points are toggled
            if (checked) {
                await updateOrderTotal(subtotal - discount);
            } else {
                await updateOrderTotal(subtotal);
            }

            setDiscountAmount(discount);
            setUseRewardPoints(checked);
            toast.success(checked
                ? `Đã áp dụng giảm giá ${formatNumber(discount)} đ`
                : "Đã tắt giảm giá bằng điểm thưởng"
            );
        } catch (error) {
            console.error("Error updating reward points:", error);
            toast.error("Có lỗi khi cập nhật điểm thưởng");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckout = async () => {
        if (!isInfoConfirmed) {
            toast.error("Vui lòng xác nhận thông tin trước khi thanh toán.");
            return;
        }

        if (!formData.paymentMethod) {
            toast.error("Vui lòng chọn phương thức thanh toán");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập");
            return;
        }

        setIsProcessing(true);
        try {
            // Apply discount if reward points are used
            if (useRewardPoints) {
                await api.post(
                    "/coinWallets/apply-discount",
                    null,
                    {
                        params: {
                            orderId,
                            useCoinWallet: true
                        },
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
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
                useRewardPoints: useRewardPoints
            };

            if (formData.paymentMethod === "Momo") {
                const response = await api.post(`/momo/create/${orderId}`, checkoutRequest);
                const payUrl = response.data;

                if (!payUrl.payUrl) {
                    throw new Error("Không nhận được URL thanh toán từ Momo.");
                }

                window.location.href = payUrl.payUrl;
            } else {
                const response = await api.get(`/cart/pay/${orderId}`);

                toast.success(`Thanh toán thành công! Tổng tiền: ${formatNumber(finalTotal)} đ`);
                setCart([]);
                setCartItems([]);

                setTimeout(() => {
                    navigate("/");
                }, 3000);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi thanh toán");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found.");
            toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
            return;
        }

        try {
            const response = await api.delete(`/cart/delete/${formData.email}/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success("Đơn hàng đã được hủy thành công.");
                navigate("/shopping-cart");
            }
        } catch (error) {
            console.error("Error during order cancellation:", error);
            toast.error("Có lỗi xảy ra khi hủy đơn hàng.");
        }
    };

    return (
        <>
            <ToastContainer autoClose={3000} />

            <div className="cart-container">
                <h2 className="title">Thanh toán</h2>
                <h4>Thông tin sản phẩm đơn hàng</h4>

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
                                        {formatNumber(item.discountPrice)}{" "}
                                        <span style={{ textDecoration: "underline" }}>đ</span>
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        {formatNumber(item.quantity * item.discountPrice)}{" "}
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
                <div style={{ display: "flex" }}>
                    <div className="customer-info">
                        <h4>Thông tin người nhận</h4>
                        <div className="name-fields">
                            <div className="input-group half-width">
                                <label>Họ</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Họ người nhận..."
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group half-width">
                                <label>Tên</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Tên người nhận..."
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="contact-fields">
                            <div className="input-group half-width">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email người nhận..."
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group half-width">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Số điện thoại người nhận..."
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Địa chỉ</label>
                            <textarea
                                name="address"
                                placeholder="Địa chỉ người nhận..."
                                value={formData.address}
                                onChange={handleChange}
                            ></textarea>
                        </div>

                        <div className="user-info-display">
                            <h5>Thông tin đã xác nhận:</h5>
                            {checkoutResponse ? (
                                <div style={{ display: "block" }}>
                                    <p>Tên: {checkoutResponse.customerFirstName} {checkoutResponse.customerLastName}</p>
                                    <p>Email: {formData.email}</p>
                                    <p>Điện thoại: {checkoutResponse.customerPhone}</p>
                                    <p>Địa chỉ: {checkoutResponse.address}</p>
                                </div>
                            ) : (
                                <p>Chưa có thông tin xác nhận</p>
                            )}

                            <button
                                onClick={handleCheckOutConfirmation}
                                className="btn primary"
                                style={{marginTop: 10}}
                                disabled={!isUserInfoValid || isConfirming}
                            >
                                {isConfirming ? 'Đang xác nhận...' : 'Xác nhận thông tin'}
                            </button>
                        </div>

                        <div className="reward-points-display">
                            <h5>Điểm thưởng hiện có:</h5>
                            <p>{formatNumber(rewardPoints)} điểm</p>
                            <p>Tương ứng: {formatNumber(rewardPoints)} đ</p>
                        </div>
                    </div>

                    <div className="order-info">
                        <h2>Thông tin đơn hàng</h2>
                        <p>
                            <strong>Tổng sản phẩm đã chọn:</strong> {totalQuantity}
                        </p>
                        <p>
                            <strong>Tích điểm từ đơn này:</strong> {formatNumber(pointsEarned)} điểm
                        </p>

                        <div className="reward-points-apply">
                            <label>
                                <Switch
                                    checked={useRewardPoints}
                                    onChange={handleRewardPointsChange}
                                    disabled={rewardPoints <= 0 || !isInfoConfirmed || subtotal <= 0 || isProcessing}
                                />
                                <span>Sử dụng điểm thưởng (Tối đa 10% đơn hàng)</span>
                            </label>
                            {useRewardPoints && (
                                <p style={{ color: 'green' }}>
                                    Đã giảm: {formatNumber(actualDiscount)} đ
                                </p>
                            )}
                        </div>

                        <div className="payment-method">
                            <h4 style={{ fontWeight: 700 }}>Chọn phương thức thanh toán</h4>
                            <label>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Momo"
                                    checked={formData.paymentMethod === "Momo"}
                                    onChange={handleChange}
                                    disabled={isProcessing}
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
                                    disabled={isProcessing}
                                />
                                Thanh toán khi nhận hàng
                            </label>
                        </div>
                    </div>

                </div>

                <div className="total-payment">
                    <p style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
                        Tổng thanh toán:
                    </p>
                    {useRewardPoints && (
                        <p style={{ textDecoration: 'line-through', color: 'gray' }}>
                            {formatNumber(subtotal)} đ
                        </p>
                    )}
                    <p style={{color: "red"}}>{formatNumber(finalTotal)} đ</p>
                </div>

                <div className="buttons">
                    <button
                        onClick={handleCheckout}
                        className="btn primary"
                        disabled={isProcessing || !formData.paymentMethod}
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Mua'}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="btn secondary"
                        disabled={isProcessing}
                    >
                        Hủy
                    </button>
                </div>

            </div>

        </>
    );
}