// import React, { useState, useEffect, useContext  } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { CartContext } from "../../../context/CartContext";
// import { jwtDecode } from "jwt-decode";
// import "./Cart.css";
// import api from "../../../config/api";

// export default function Cart() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { setCart } = useContext(CartContext);
//   const initialCartItems = location.state?.cartItems || [];

//   const [cartItems, setCartItems] = useState(initialCartItems);
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     address: "",
//     paymentMethod: "",
//   });

//   // Fetch user information from API
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found.");
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token);
//         const userEmail = decodedToken.sub;

//         const response = await api.get(`/users/${userEmail}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = response.data;
//         setFormData((prev) => ({
//           ...prev,
//           firstName: data.firstName || prev.firstName,
//           lastName: data.lastName || prev.lastName,
//           email: data.email || prev.email,
//           phone: data.phone || prev.phone,
//           address: data.address || prev.address,
//         }));
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const totalQuantity = cartItems.reduce(
//     (total, item) => total + item.quantity,
//     0
//   );

//   const subtotal = cartItems.reduce(
//     (total, item) => total + item.discountPrice * item.quantity,
//     0
//   );

//   const rewardPoints = Math.floor(subtotal * 0.01);
//   const finalTotal = subtotal;

//   const handleCheckout = async () => {
//     if (formData.paymentMethod === "vnpay") {
//       try {
//         const response = await api.get('/vnpays/pay'); // Call your backend to generate VNPay URL
//         const paymentUrl = response.data; // Assuming your backend returns the payment URL
//         window.location.href = paymentUrl; // Redirect to VNPay payment page

//         // Reset cart items after successful payment
//         setCart([]);
//         setCartItems([]);
//         // Optionally, you may want to navigate to a success page or show a success message
//       } catch (error) {
//         console.error("Error during payment process:", error);
//         alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
//       }
//     } else {
//       alert("Thanh toán thành công!");
//       setCart([]);
//       setCartItems([]); // Reset cart items for COD as well
//       navigate("/");
//     }
//   };

//   return (
//     <div className="container">
//       <div className="cart-container">
//         <h2 className="title">Trang thanh toán</h2>

//         <table className="cart-table">
//           <thead>
//             <tr>
//               <th>Ảnh</th>
//               <th>Sản phẩm</th>
//               <th>Giá tiền</th>
//               <th>Số lượng</th>
//               <th>Tổng tiền</th>
//             </tr>
//           </thead>
//           <tbody>
//             {cartItems.map((item) => (
//               <tr key={item.productId}>
//                 <td>
//                   <img
//                     src={item.productImages[0]?.imageURL}
//                     alt={item.productName}
//                     className="product-image"
//                   />
//                 </td>
//                 <td>{item.productName}</td>
//                 <td>{item.discountPrice} <span style={{ textDecoration: "underline" }}>đ</span></td>
//                 <td>{item.quantity}</td>
//                 <td>{item.quantity * item.discountPrice} <span style={{ textDecoration: "underline" }}>đ</span></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         <div className="customer-info">
//           <h2>Thông tin người nhận</h2>
//           {["firstName", "lastName", "email", "phone"].map((field) => (
//             <div key={field} className="input-group">
//               <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
//               <input
//                 type={field === "email" ? "email" : "text"}
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleChange}
//               />
//             </div>
//           ))}
//           <div className="input-group">
//             <label>Địa chỉ</label>
//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//             ></textarea>
//           </div>
//         </div>

//         <div className="order-info">
//           <h2>Thông tin đơn hàng</h2>
//           <p><strong>Tổng sản phẩm đã chọn:</strong> {totalQuantity}</p>
//           <p><strong>Tích điểm:</strong> {rewardPoints} điểm</p>

//           <div className="payment-method">
//             <h5 style={{fontWeight: 700}}>Chọn phương thức thanh toán</h5>
//             <label>
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="vnpay"
//                 checked={formData.paymentMethod === "vnpay"}
//                 onChange={handleChange}
//               />
//               Thanh toán qua VNPay
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="cod"
//                 checked={formData.paymentMethod === "cod"}
//                 onChange={handleChange}
//               />
//               Thanh toán khi nhận hàng
//             </label>
//           </div>

//           <div className="total-payment">
//             <p style={{color: "black", fontSize: 20, fontWeight: "bold"}} >Tổng thanh toán:</p> {finalTotal.toLocaleString()} <span style={{ textDecoration: "underline" }}>đ</span>
//           </div>

//           <div className="buttons">
//             <button onClick={handleCheckout} className="btn primary">
//               Mua
//             </button>
//             <button
//               onClick={() => navigate("/shopping-cart")}
//               className="btn secondary"
//             >
//               Hủy
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
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
  const [checkoutResponse, setCheckoutResponse] = useState(
    initialCheckoutResponse
  );

 // const orderId = checkoutResponse?.orderId; // Extract orderId safely

  // if (!orderId) {
  //   console.error("Order ID is missing!");
  //   toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
  //   return;
  // }

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "",
  });

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Fetch user information from API
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found.");
        navigate("/login"); // Redirect to login if no token
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
        setFormData((prev) => ({
          ...prev,
          firstName: data.firstName || prev.firstName,
          lastName: data.lastName || prev.lastName,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          address: data.address || prev.address,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalQuantity =
    checkoutResponse?.cartItems?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  const subtotal =
    checkoutResponse?.cartItems?.reduce(
      (total, item) => total + item.discountPrice * item.quantity,
      0
    ) || 0;

  const rewardPoints = Math.floor(subtotal * 0.01);
  const finalTotal = subtotal;

  //   const handleCheckout = async () => {
  //     if (formData.paymentMethod === "vnpay") {
  //       try {
  //         const response = await api.get('/vnpays/pay'); // Call your backend to generate VNPay URL
  //         const paymentUrl = response.data; // Assuming your backend returns the payment URL
  //         window.location.href = paymentUrl; // Redirect to VNPay payment page

  //         // Reset cart items after successful payment
  //         setCart([]);
  //         setCartItems([]);
  //         // Optionally, you may want to navigate to a success page or show a success message
  //       } catch (error) {
  //         console.error("Error during payment process:", error);
  //         alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
  //       }
  //     } else {
  //       alert("Thanh toán thành công!");
  //       setCart([]);
  //       setCartItems([]); // Reset cart items for COD as well
  //       navigate("/");
  //     }
  //   };

  const handleCheckout = async () => {
    const checkoutRequest = {
      email: formData.email,
      cartItemDTO: cartItems.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.discountPrice,
      })),
      // orderId: orderId,
      // total: finalTotal,
    };

    if (formData.paymentMethod === "vnpay") {
      try {
        // Gọi API backend để lấy URL thanh toán VNPay
      //  const response = await api.get(`/vnpays/pay/${orderId}`, checkoutRequest);

        // Kiểm tra xem paymentUrl có tồn tại không
        const paymentUrl = response.data;
        console.log("Payment URL:", paymentUrl);
        if (!paymentUrl) {
          throw new Error("Không nhận được URL thanh toán từ VNPay.");
        }

        // Chuyển hướng đến trang thanh toán VNPay
        window.location.href = paymentUrl;
      } catch (error) {
        console.error("Error during VNPay payment process:", error);
        toast.error(
          "Có lỗi xảy ra khi thanh toán qua VNPay. Vui lòng thử lại."
        );
      }
    } else {
      try {
        const response = await api.post("/cart/checkout", checkoutRequest);
        const checkoutResponse = response.data;

        setCheckoutResponse(checkoutResponse); // Update checkout response state

        // Tính toán total nếu API không trả về
        const total = checkoutResponse.total || subtotal;

        toast.success(
          `Thanh toán thành công! Tổng tiền: ${total.toLocaleString()} đ`
        );

        // Reset cart items after successful checkout
        setCart([]);
        setCartItems([]);

        // Delay navigation for 3 seconds
        setTimeout(() => {
          navigate("/"); // Redirect to homepage or success page
        }, 3000); // 3 seconds delay
      } catch (error) {
        console.error("Error during checkout:", error);
        toast.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
      }
    }
  };

  // const handleCancel = async () => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     console.error("No token found.");
  //     toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
  //     return;
  //   }
  
  //   const email = formData.email; // Get the email from form data
  //   const checkoutRequest = {
  //     cartItemDTO: cartItems.map((item) => ({
  //       productName: item.productName,
  //       quantity: item.quantity,
  //       price: item.discountPrice,
  //     })),
  //   };
  
  //   try {
  //     const response = await api.delete(`/orders/cancel-order/${email}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       data: checkoutRequest,
  //     });
  
  //     if (response.status === 200) {
  //       toast.success("Đơn hàng đã được hủy thành công.");
       
  //       navigate("/shopping-cart"); 
  //     } else {
  //       toast.error("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.");
  //     }
  //   } catch (error) {
  //     console.error("Error during order cancellation:", error);
  //     toast.error("Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại.");
  //   }
  // };

  const handleCancel = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found.");
        toast.error("Lỗi: Không tìm thấy mã đơn hàng.");
        return;
    }
  
    const email = formData.email; // Use the email from form data
  
    try {
        const response = await api.delete(`/orders/cancel-order/${email}`, {
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
                        // src={item.productImages?.[0]?.imageURL || ""}
                        src={item.imageUrl || ""}
                        alt={item.productName}
                        className="product-image"
                        style={{ width: 80, height: 50 }}
                      />
                    </td>
                    <td>{item.productName}</td>
                    <td>
                      {formatPrice(item.discountPrice)}{" "}
                      <span style={{ textDecoration: "underline" }}>đ</span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      {formatPrice(item.quantity * item.discountPrice)}{" "}
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
              <p style={{ color: "black", fontSize: 20, fontWeight: "bold" }}>
                Tổng thanh toán:
              </p>
              {(checkoutResponse?.total || subtotal).toLocaleString()}{" "}
              <span style={{ textDecoration: "underline" }}>đ</span>
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
