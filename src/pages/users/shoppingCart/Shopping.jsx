import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../../context/CartContext"; // Import CartContext
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Table, Button, Card, Typography, Input, Space, Image } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./Shopping.css";

const { Title, Text } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext); // Use CartContext

  const increaseQuantity = (id) => {
    // Cập nhật state cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    // Cập nhật localStorage
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
            const updatedCart = parsedCart.map((item) =>
              item.productId === id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            console.log(
              "Đã cập nhật giỏ hàng trong localStorage sau khi tăng số lượng:",
              updatedCart
            );
          }
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật localStorage:", error);
      }
    }
  };

  const decreaseQuantity = (id) => {
    // Cập nhật state cart
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    // Cập nhật localStorage
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
            const updatedCart = parsedCart.map((item) =>
              item.productId === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
            localStorage.setItem(cartKey, JSON.stringify(updatedCart));
            console.log(
              "Đã cập nhật giỏ hàng trong localStorage sau khi giảm số lượng:",
              updatedCart
            );
          }
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật localStorage:", error);
      }
    }
  };

  const deleteItem = (id) => {
    // Cập nhật state cart
    setCart((prevCart) => prevCart.filter((item) => item.productId !== id));

    // Cập nhật localStorage
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
            console.log(
              "Đã cập nhật giỏ hàng trong localStorage sau khi xóa sản phẩm:",
              updatedCart
            );
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
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    let email;
    try {
      const decodedToken = jwtDecode(token);
      email = decodedToken.sub;
    } catch (error) {
      console.error("Token decoding failed:", error);
      toast.error("Failed to decode token. Please log in again.");
      return;
    }

    const checkoutItems = cart.map((item) => ({
      productName: item.productName,
      quantity: item.quantity,
      discountPrice: item.discountPrice,
    }));

    const checkoutRequestDTO = {
      email: email,
      cartItemDTO: checkoutItems,
    };

    try {
      const response = await api.post("/cart/checkout", checkoutRequestDTO);
      toast.success("Checkout successfully!");
      // setCart([]); // Clear cart after successful checkout
      navigate("/cart", { state: { checkoutResponse: response.data } }); // Redirect to homepage or order confirmation page
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Checkout failed! Please try again.");
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "productImages",
      key: "image",
      render: (images) => (
        <Image
          src={images[0]?.imageURL}
          alt="product"
          width={100}
          style={{ borderRadius: 8 }}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Giá tiền",
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
      title: "Số lượng",
      key: "quantity",
      render: (_, item) => (
        <Space>
          <Button
            color="primary"
            variant="solid"
            icon={<MinusOutlined />}
            onClick={() => decreaseQuantity(item.productId)}
            size="small"
          />
          <Input
            min={1}
            value={item.quantity}
            style={{ width: 60, textAlign: "center" }}
          />
          <Button
            color="primary"
            variant="solid"
            icon={<PlusOutlined />}
            onClick={() => increaseQuantity(item.productId)}
            size="small"
          />
        </Space>
      ),
    },
    {
      title: "Tổng",
      key: "total",
      render: (_, item) => (
        <Text>
          {(item.discountPrice * item.quantity).toLocaleString()}{" "}
          <span style={{ textDecoration: "underline" }}>đ</span>
        </Text>
      ),
    },
    {
      title: "Nút điều khiển",
      key: "action",
      render: (_, item) => (
        <Button
          color="danger"
          variant="solid"
          icon={<DeleteOutlined />}
          onClick={() => deleteItem(item.productId)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div className="container">
      <ToastContainer />
      <div className="cart-container">
        <Card>
          <Title level={2} className="cart-header">
            Giỏ hàng
          </Title>
          <Table
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
              type="primary"
              size="large"
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Đặt hàng
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

//=========================================================================================

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
//   };

//   const decreaseQuantity = (id) => {
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.productId === id && item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       )
//     );
//   };

//   const deleteItem = (id) => {
//     setCart((prevCart) => prevCart.filter((item) => item.productId !== id));
//   };

//   const totalAmount = cart.reduce(
//     (total, item) => total + item.discountPrice * item.quantity,
//     0
//   );

//   const handleCheckout = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("No token found. Please log in.");
//       return;
//     }

//     let email;
//     try {
//       const decodedToken = jwtDecode(token);
//       email = decodedToken.sub;
//     } catch (error) {
//       console.error("Token decoding failed:", error);
//       toast.error("Failed to decode token. Please log in again.");
//       return;
//     }

//     const checkoutItems = cart.map((item) => ({
//       productName: item.productName,
//       quantity: item.quantity,
//       discountPrice: item.discountPrice,
//     }));

//     const checkoutRequestDTO = {
//       email: email,
//       cartItemDTO: checkoutItems,
//     };

//     try {
//       const response = await api.post("/cart/checkout", checkoutRequestDTO);
//       toast.success("Checkout successfully!");
//       navigate("/cart", { state: { checkoutResponse: response.data } });
//     } catch (error) {
//       console.error("Error during checkout:", error);
//       toast.error("Checkout failed! Please try again.");
//     }
//   };

//   const columns = [
//     {
//       title: "Ảnh",
//       dataIndex: "productImages",
//       key: "image",
//       render: (images) => (
//         <Image
//           src={images[0]?.imageURL}
//           alt="product"
//           width={100}
//           style={{ borderRadius: 8 }}
//         />
//       ),
//     },
//     {
//       title: "Sản phẩm",
//       dataIndex: "productName",
//       key: "productName",
//     },
//     {
//       title: "Giá tiền",
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
//       title: "Số lượng",
//       key: "quantity",
//       render: (_, item) => (
//         <Space>
//           <Button
//             color="primary"
//             variant="solid"
//             icon={<MinusOutlined />}
//             onClick={() => decreaseQuantity(item.productId)}
//             size="small"
//           />
//           <Input
//             min={1}
//             value={item.quantity}
//             style={{ width: 60, textAlign: "center" }}
//           />
//           <Button
//             color="primary"
//             variant="solid"
//             icon={<PlusOutlined />}
//             onClick={() => increaseQuantity(item.productId)}
//             size="small"
//           />
//         </Space>
//       ),
//     },
//     {
//       title: "Tổng",
//       key: "total",
//       render: (_, item) => (
//         <Text>
//           {(item.discountPrice * item.quantity).toLocaleString()}{" "}
//           <span style={{ textDecoration: "underline" }}>đ</span>
//         </Text>
//       ),
//     },
//     {
//       title: "Nút điều khiển",
//       key: "action",
//       render: (_, item) => (
//         <Button
//           color="danger"
//           variant="solid"
//           icon={<DeleteOutlined />}
//           onClick={() => deleteItem(item.productId)}
//         >
//           Xóa
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div className="container">
//       <ToastContainer />
//       <div className="cart-container">
//         <Card>
//           <Title level={2} className="cart-header">
//             Giỏ hàng
//           </Title>
//           <Table
//             dataSource={cart}
//             columns={columns}
//             pagination={false}
//             rowKey="productId"
//           />
//           <div className="order-summary">
//             <div style={{ fontSize: 22 }}>
//               <strong>Tổng số tiền:</strong>{" "}
//               <span style={{ color: "red" }}>
//                 {totalAmount.toLocaleString()}{" "}
//                 <span style={{ textDecoration: "underline" }}>đ</span>
//               </span>
//             </div>
//             <Button
//               type="primary"
//               size="large"
//               className="checkout-btn"
//               onClick={handleCheckout}
//             >
//               Đặt hàng
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }