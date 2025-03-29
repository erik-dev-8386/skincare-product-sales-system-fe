
// import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { CartContext } from "../../../context/CartContext";
// import api from "../../../config/api";
// import { toast, ToastContainer } from "react-toastify";
// import { jwtDecode } from "jwt-decode";
// import { Table, Button, Card, Typography, Input, Space, Image } from "antd";
// import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import "./Shopping.css";

// const { Title, Text } = Typography;

// export default function CartPage() {
//   const navigate = useNavigate();
//   const { cart, setCart } = useContext(CartContext);

//   const increaseQuantity = (id) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );

//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const email = decodedToken.sub;
//         if (email) {
//           const cartKey = `cart_${email}`;
//           const savedCart = localStorage.getItem(cartKey);
//           if (savedCart) {
//             const parsedCart = JSON.parse(savedCart);
//             const updatedCart = parsedCart.map((item) =>
//               item.productId === id
//                 ? { ...item, quantity: item.quantity + 1 }
//                 : item
//             );
//             localStorage.setItem(cartKey, JSON.stringify(updatedCart));
//           }
//         }
//       } catch (error) {
//         console.error("Lỗi khi cập nhật localStorage:", error);
//       }
//     }
//   };

//   const decreaseQuantity = (id) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.productId === id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );

//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const email = decodedToken.sub;
//         if (email) {
//           const cartKey = `cart_${email}`;
//           const savedCart = localStorage.getItem(cartKey);
//           if (savedCart) {
//             const parsedCart = JSON.parse(savedCart);
//             const updatedCart = parsedCart.map((item) =>
//               item.productId === id && item.quantity > 1
//                 ? { ...item, quantity: item.quantity - 1 }
//                 : item
//             );
//             localStorage.setItem(cartKey, JSON.stringify(updatedCart));
//           }
//         }
//       } catch (error) {
//         console.error("Lỗi khi cập nhật localStorage:", error);
//       }
//     }
//   };

//   const deleteItem = (id) => {
//     setCart((prevCart) => prevCart.filter((item) => item.productId !== id));

//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         const email = decodedToken.sub;
//         if (email) {
//           const cartKey = `cart_${email}`;
//           const savedCart = localStorage.getItem(cartKey);
//           if (savedCart) {
//             const parsedCart = JSON.parse(savedCart);
//             const updatedCart = parsedCart.filter(
//               (item) => item.productId !== id
//             );
//             localStorage.setItem(cartKey, JSON.stringify(updatedCart));
//           }
//         }
//       } catch (error) {
//         console.error("Lỗi khi cập nhật localStorage:", error);
//       }
//     }
//   };

//   const totalAmount = cart.reduce(
//     (total, item) => total + item.discountPrice * item.quantity,
//     0
//   );

//   const handleCheckout = async () => {
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
//       navigate("/login-and-signup", { state: { fromCart: true } });
//       return;
//     }

//     try {
//       const decodedToken = jwtDecode(token);
//       const email = decodedToken.sub;

//       const checkoutItems = cart.map((item) => ({
//         productName: item.productName,
//         quantity: item.quantity,
//         discountPrice: item.discountPrice,
//       }));

//       const checkoutRequestDTO = {
//         email: email,
//         cartItemDTO: checkoutItems,
//       };

//       const response = await api.post("/cart/checkout", checkoutRequestDTO);
      
//       toast.success("Bạn đã đặt hàng thành công!");
      
//       // Chuyển đến trang thanh toán với thông tin đơn hàng
//       navigate("/cart", { 
//         state: { 
//           checkoutResponse: response.data,
//           cartItems: cart 
//         } 
//       });
      
//     } catch (error) {
//       console.error("Error during checkout:", error);
//       toast.error("Đặt hàng không thành công! Hãy thử lại.");
//     }
//   };

//   const columns = [
//     {
//       title: <p className="title-cart">Ảnh</p>,
//       dataIndex: "productImages",
//       key: "image",
//       render: (images) => (
//         <Image
//           className="image-product"
//           src={images[0]?.imageURL}
//           alt="product"
//           width={100}
//           style={{ borderRadius: 8 }}
//         />
//       ),
//     },
//     {
//       title: <p className="title-cart">Sản phẩm</p>,
//       dataIndex: "productName",
//       key: "productName",
//     },
//     {
//       title: <p className="title-cart">Giá tiền</p>,
//       dataIndex: "discountPrice",
//       key: "price",
//       render: (price) => (
//         <Text>
//           {price.toLocaleString()}{" "}
//           <span style={{ textDecoration: "underline" }}>đ</span>
//         </Text>
//       ),
//     },
//     {
//       title: <p className="title-cart">Số lượng</p>,
//       key: "quantity",
//       render: (_, item) => (
//         <Space>
//           <Button
//             className="btn-decrease"
//             icon={<MinusOutlined />}
//             onClick={() => decreaseQuantity(item.productId)}
//             size="small"
//           />
//           <Input
//             className="quantity-product"
//             min={1}
//             value={item.quantity}
//             style={{ width: 60, textAlign: "center" }}
//           />
//           <Button
//             className="btn-increase"
//             icon={<PlusOutlined />}
//             onClick={() => increaseQuantity(item.productId)}
//             size="small"
//           />
//         </Space>
//       ),
//     },
//     {
//       title: <p className="title-cart">Tổng</p>,
//       key: "total",
//       render: (_, item) => (
//         <Text>
//           {(item.discountPrice * item.quantity).toLocaleString()}{" "}
//           <span style={{ textDecoration: "underline" }}>đ</span>
//         </Text>
//       ),
//     },
//     {
//       title: <p className="title-cart">Nút điều khiển</p>,
//       key: "action",
//       render: (_, item) => (
//         <Button
//           color="danger"
//           variant="solid"
//           style={{border: "2px solid #ff4d4f"}}
//           icon={<DeleteOutlined />}
//           onClick={() => deleteItem(item.productId)}
//         >
//           Xóa
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <>
//       <ToastContainer />
//       <div className="container">
//         <div className="cart-container">
//           <Card>
//             <h1>Giỏ hàng</h1>
//             <Table
//               className="table-cart"
//               dataSource={cart}
//               columns={columns}
//               pagination={false}
//               rowKey="productId"
//             />
//             <div className="order-summary">
//               <div style={{ fontSize: 22 }}>
//                 <strong>Tổng số tiền:</strong>{" "}
//                 <span style={{ color: "red" }}>
//                   {totalAmount.toLocaleString()}{" "}
//                   <span style={{ textDecoration: "underline" }}>đ</span>
//                 </span>
//               </div>
//               <Button
//                 size="large"
//                 className="checkout-btn"
//                 onClick={handleCheckout}
//               >
//                 Đặt hàng
//               </Button>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Table, Button, Card, Typography, Input, Space, Image } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./Shopping.css";

const { Title, Text } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [productStocks, setProductStocks] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false); // Only for checkout

  useEffect(() => {
    const fetchProductStocks = async () => {
      if (cart.length === 0) {
        setProductStocks({});
        return;
      }
      
      try {
        const stocks = {};
        for (const item of cart) {
          const response = await api.get(`/products/${item.productId}`);
          stocks[item.productId] = response.data.quantity;
        }
        setProductStocks(stocks);
      } catch (error) {
        console.error("Error fetching product stocks:", error);
        toast.error("Không thể cập nhật số lượng tồn kho");
      }
    };

    fetchProductStocks();
  }, [cart]);

  const validateQuantity = (id, newQuantity) => {
    const currentStock = productStocks[id] || 0;
    
    if (newQuantity % 1 !== 0) {
      toast.error("Số lượng phải là số nguyên");
      return false;
    }

    if (newQuantity < 1) {
      toast.error("Số lượng không được nhỏ hơn 1");
      return false;
    }

    if (newQuantity > currentStock) {
      toast.error(`Số lượng không được vượt quá ${currentStock} (số lượng tồn kho)`);
      return false;
    }

    return true;
  };

  const updateCartQuantity = async (id, newQuantity) => {
    if (!validateQuantity(id, newQuantity)) return;

    try {
      const response = await api.get(`/products/${id}`);
      const currentStock = response.data.quantity;
      
      if (newQuantity > currentStock) {
        toast.error(`Số lượng tồn kho hiện tại chỉ còn ${currentStock}`);
        return;
      }

      // Update local state immediately for better UX
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === id ? { ...item, quantity: newQuantity } : item
        )
      );

      updateLocalStorage(id, newQuantity);
    } catch (error) {
      console.error("Error verifying stock:", error);
      toast.error("Không thể xác minh số lượng tồn kho");
    }
  };

  const updateLocalStorage = (id, newQuantity) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;
      if (!email) return;

      const cartKey = `cart_${email}`;
      const savedCart = localStorage.getItem(cartKey);
      if (!savedCart) return;

      const parsedCart = JSON.parse(savedCart);
      const updatedCart = parsedCart.map((item) =>
        item.productId === id ? { ...item, quantity: newQuantity } : item
      );
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Lỗi khi cập nhật localStorage:", error);
    }
  };

  const increaseQuantity = async (id) => {
    const product = cart.find(item => item.productId === id);
    const newQuantity = product.quantity + 1;
    await updateCartQuantity(id, newQuantity);
  };

  const decreaseQuantity = async (id) => {
    const product = cart.find(item => item.productId === id);
    const newQuantity = product.quantity - 1;
    await updateCartQuantity(id, newQuantity);
  };

  const handleQuantityChange = async (id, e) => {
    const value = e.target.value;
    if (value === "" || isNaN(value)) {
      toast.error("Vui lòng nhập số hợp lệ");
      return;
    }

    const newQuantity = parseInt(value);
    await updateCartQuantity(id, newQuantity);
  };

  const deleteItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== id));

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;
        if (email) {
          const cartKey = `cart_${email}`;
          const savedCart = localStorage.getItem(cartKey);
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            const updatedCart = parsedCart.filter(
              (item) => item.productId !== id
            );
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
          }
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật localStorage:", error);
      }
    }
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.discountPrice * item.quantity,
    0
  );

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      // Verify stock for all items
      for (const item of cart) {
        const response = await api.get(`/products/${item.productId}`);
        if (item.quantity > response.data.quantity) {
          toast.error(`${item.productName} chỉ còn ${response.data.quantity} sản phẩm trong kho`);
          setCheckoutLoading(false);
          return;
        }
      }

      // Proceed with checkout if all items are available
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login-and-signup", { state: { fromCart: true } });
        return;
      }

      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;

      const checkoutItems = cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        discountPrice: item.discountPrice,
      }));

      const response = await api.post("/cart/checkout", {
        email: email,
        cartItemDTO: checkoutItems,
      });

      toast.success("Đặt hàng thành công!");
      navigate("/cart", { state: { order: response.data } });
      
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Đặt hàng không thành công: " + (error.response?.data?.message || "Lỗi hệ thống"));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const columns = [
    {
      title: <p className="title-cart">Ảnh</p>,
      dataIndex: "productImages",
      key: "image",
      render: (images) => (
        <Image
          className="image-product"
          src={images[0]?.imageURL}
          alt="product"
          width={100}
          style={{ borderRadius: 8 }}
        />
      ),
    },
    {
      title: <p className="title-cart">Sản phẩm</p>,
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: <p className="title-cart">Giá tiền</p>,
      dataIndex: "discountPrice",
      key: "price",
      render: (price) => (
        <Text>
          {price.toLocaleString()}{" "}
          <span style={{ textDecoration: "underline" }}>đ</span>
        </Text>
      ),
    },
    {
      title: <p className="title-cart">Số lượng</p>,
      key: "quantity",
      render: (_, item) => (
        <Space>
          <Button
            className="btn-decrease"
            icon={<MinusOutlined />}
            onClick={() => decreaseQuantity(item.productId)}
            size="small"
            disabled={item.quantity <= 1}
          />
          <Input
            className="quantity-product"
            min={1}
            value={item.quantity}
            onChange={(e) => handleQuantityChange(item.productId, e)}
            style={{ width: 60, textAlign: "center" }}
            type="number"
          />
          <Button
            className="btn-increase"
            icon={<PlusOutlined />}
            onClick={() => increaseQuantity(item.productId)}
            size="small"
            disabled={item.quantity >= (productStocks[item.productId] || item.quantity)}
          />
        </Space>
      ),
    },
    {
      title: <p className="title-cart">Tổng</p>,
      key: "total",
      render: (_, item) => (
        <Text>
          {(item.discountPrice * item.quantity).toLocaleString()}{" "}
          <span style={{ textDecoration: "underline" }}>đ</span>
        </Text>
      ),
    },
    {
      title: <p className="title-cart">Nút điều khiển</p>,
      key: "action",
      render: (_, item) => (
        <Button
          color="danger"
          variant="solid"
          style={{border: "2px solid #ff4d4f"}}
          icon={<DeleteOutlined />}
          onClick={() => deleteItem(item.productId)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      
        <div className="cart-container">
          <Card>
            <h1>Giỏ hàng</h1>
            {cart.length === 0 ? (
              <div className="empty-cart-message">
                <p>Giỏ hàng của bạn đang trống</p>
                <Button type="primary" onClick={() => navigate("/products")}>
                  Tiếp tục mua sắm
                </Button>
              </div>
            ) : (
              <>
                <Table
                  className="table-cart"
                  dataSource={cart}
                  columns={columns}
                  pagination={false}
                  rowKey="productId"
                />
                <div className="order-summary">
                  <div style={{ fontSize: 22 }}>
                    <strong>Tổng số tiền:</strong>{" "}
                    <span style={{ color: "red" }}>
                      {totalAmount.toLocaleString()}{" "}
                      <span style={{ textDecoration: "underline" }}>đ</span>
                    </span>
                  </div>
                  <Button
                    size="large"
                    className="checkout-btn"
                    onClick={handleCheckout}
                    loading={checkoutLoading}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
     
    </>
  );
}