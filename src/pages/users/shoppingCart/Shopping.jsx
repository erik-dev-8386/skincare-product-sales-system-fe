
// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CartContext } from "../../../context/CartContext";
// import api from "../../../config/api";
// import { toast, ToastContainer } from "react-toastify";
// import { jwtDecode } from "jwt-decode";
// import { Table, Button, Card, Typography, Input, Space, Image, Checkbox } from "antd";
// import { MinusOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
// import "./Shopping.css";

// const { Title, Text } = Typography;

// export default function CartPage() {
//   const navigate = useNavigate();
//   const { cart, setCart } = useContext(CartContext);
//   const [productStocks, setProductStocks] = useState({});
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [selectAll, setSelectAll] = useState(false);


//   const handleSelectAll = (e) => {
//     const checked = e.target.checked;
//     setSelectAll(checked);
//     setSelectedRowKeys(checked ? cart.map(item => item.productId) : []);
//   };

//   const handleRowSelect = (productId, e) => {
//     const checked = e.target.checked;
//     setSelectedRowKeys(checked 
//       ? [...selectedRowKeys, productId]
//       : selectedRowKeys.filter(id => id !== productId)
//     );
//     setSelectAll(false);
//   };

//   const deleteSelectedItems = () => {
//     if (selectedRowKeys.length === 0) {
//       toast.warning("Vui lòng chọn sản phẩm để xóa");
//       return;
//     }

//     setCart(prevCart => prevCart.filter(item => !selectedRowKeys.includes(item.productId)));
//     updateLocalStorageAfterDelete(selectedRowKeys);
//     setSelectedRowKeys([]);
//     setSelectAll(false);
//     toast.success(`Đã xóa ${selectedRowKeys.length} sản phẩm trong giỏ hàng`);
//   };

//   const updateLocalStorageAfterDelete = (productIds) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const decodedToken = jwtDecode(token);
//       const email = decodedToken.sub;
//       if (!email) return;

//       const cartKey = `cart_${email}`;
//       const savedCart = localStorage.getItem(cartKey);
//       if (!savedCart) return;

//       const parsedCart = JSON.parse(savedCart);
//       const updatedCart = parsedCart.filter(item => !productIds.includes(item.productId));
//       localStorage.setItem(cartKey, JSON.stringify(updatedCart));
//     } catch (error) {
//       console.error("Lỗi khi cập nhật localStorage:", error);
//     }
//   };

//   useEffect(() => {
//     if (selectedRowKeys.length === cart.length && cart.length > 0) {
//       setSelectAll(true);
//     } else {
//       setSelectAll(false);
//     }
//   }, [selectedRowKeys, cart]);


//   useEffect(() => {
//     const fetchProductStocks = async () => {
//       if (cart.length === 0) {
//         setProductStocks({});
//         return;
//       }

//       try {
//         const stocks = {};
//         for (const item of cart) {
//           const response = await api.get(`/products/${item.productId}`);
//           stocks[item.productId] = response.data.quantity;
//         }
//         setProductStocks(stocks);
//       } catch (error) {
//         console.error("Error fetching product stocks:", error);
//         toast.error("Không thể cập nhật số lượng tồn kho");
//       }
//     };

//     fetchProductStocks();
//   }, [cart]);

//   // const validateQuantity = (id, newQuantity) => {
//   //   const currentStock = productStocks[id] || 0;

//   //   if (newQuantity % 1 !== 0) {
//   //     toast.error("Số lượng phải là số nguyên");
//   //     return false;
//   //   }

//   //   if (newQuantity < 1) {
//   //     toast.error("Số lượng không được nhỏ hơn 1");
//   //     return false;
//   //   }

//   //   if (newQuantity > currentStock) {
//   //     toast.error(`Số lượng không được vượt quá ${currentStock} (số lượng tồn kho)`);
//   //     return false;
//   //   }

//   //   return true;
//   // };

//   const validateQuantity = (id, newQuantity) => {
//     const currentStock = productStocks[id] || 0;
  
//     if (newQuantity % 1 !== 0) {
//       return "Số lượng phải là số nguyên";
//     }
  
//     if (newQuantity < 1) {
//       return "Số lượng không được nhỏ hơn 1";
//     }
  
//     if (newQuantity > currentStock) {
//       return `Số lượng không được vượt quá ${currentStock} (số lượng tồn kho)`;
//     }
  
//     return null; // Trả về null nếu hợp lệ
//   };

//   // const updateCartQuantity = async (id, newQuantity) => {
//   //   if (!validateQuantity(id, newQuantity)) return;

//   //   try {
//   //     const response = await api.get(`/products/${id}`);
//   //     const currentStock = response.data.quantity;

//   //     if (newQuantity > currentStock) {
//   //       toast.error(`Số lượng tồn kho hiện tại chỉ còn ${currentStock}`);
//   //       return;
//   //     }

//   //     setCart((prevCart) =>
//   //       prevCart.map((item) =>
//   //         item.productId === id ? { ...item, quantity: newQuantity } : item
//   //       )
//   //     );

//   //     updateLocalStorage(id, newQuantity);
//   //   } catch (error) {
//   //     console.error("Error verifying stock:", error);
//   //     toast.error("Không thể xác minh số lượng tồn kho");
//   //   }
//   // };

//   const updateCartQuantity = async (id, newQuantity) => {
//     // Chỉ cập nhật state mà không validate ở đây
//     setCart((prevCart) =>
//       prevCart.map((item) =>
//         item.productId === id ? { ...item, quantity: newQuantity } : item
//       )
//     );
  
//     updateLocalStorage(id, newQuantity);
//   };

//   const updateLocalStorage = (id, newQuantity) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const decodedToken = jwtDecode(token);
//       const email = decodedToken.sub;
//       if (!email) return;

//       const cartKey = `cart_${email}`;
//       const savedCart = localStorage.getItem(cartKey);
//       if (!savedCart) return;

//       const parsedCart = JSON.parse(savedCart);
//       const updatedCart = parsedCart.map((item) =>
//         item.productId === id ? { ...item, quantity: newQuantity } : item
//       );
//       localStorage.setItem(cartKey, JSON.stringify(updatedCart));
//     } catch (error) {
//       console.error("Lỗi khi cập nhật localStorage:", error);
//     }
//   };

//   const increaseQuantity = async (id) => {
//     const product = cart.find(item => item.productId === id);
//     const newQuantity = product.quantity + 1;
//     await updateCartQuantity(id, newQuantity);
//   };

//   const decreaseQuantity = async (id) => {
//     const product = cart.find(item => item.productId === id);
//     const newQuantity = product.quantity - 1;
//     await updateCartQuantity(id, newQuantity);
//   };

//   // const handleQuantityChange = async (id, e) => {
//   //   const value = e.target.value;
//   //   if (value === "" || isNaN(value)) {
//   //     toast.error("Vui lòng nhập số hợp lệ");
//   //     return;
//   //   }

//   //   const newQuantity = parseInt(value);
//   //   await updateCartQuantity(id, newQuantity);
//   // };

//   const handleQuantityChange = async (id, e) => {
//     const value = e.target.value;
//     if (value === "" || isNaN(value)) {
//       return;
//     }
  
//     const newQuantity = parseInt(value);
//     await updateCartQuantity(id, newQuantity);
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

//   // const handleCheckout = async () => {
//   //   const token = localStorage.getItem("token");

//   //   if (!token) {
//   //     toast.error("Bạn phải đăng nhập để thanh toán!");
//   //     setTimeout(() => {
//   //       navigate("/login-and-signup", { state: { fromCart: true } });
//   //     }, 3000);
//   //     return;
//   //   }

//   //   setCheckoutLoading(true);

//   //   for (const item of cart) {
//   //     try {
//   //       const response = await api.get(`/products/${item.productId}`);
//   //       const currentStock = response.data.quantity;

//   //       if (item.quantity > currentStock) {
//   //         toast.error(`${item.productName} chỉ còn ${currentStock} sản phẩm trong kho`);
//   //         setCheckoutLoading(false);
//   //         return;
//   //       }
//   //     } catch (error) {
//   //       console.error(`Error checking stock for product ${item.productId}:`, error);
//   //       toast.error(`Không thể kiểm tra số lượng tồn kho cho ${item.productName}`);
//   //       setCheckoutLoading(false);
//   //       return;
//   //     }
//   //   }

//   //   try {
//   //     const decodedToken = jwtDecode(token);
//   //     const email = decodedToken.sub;

//   //     const checkoutItems = cart.map((item) => ({
//   //       productName: item.productName,
//   //       quantity: item.quantity,
//   //       discountPrice: item.discountPrice,
//   //     }));

//   //     const checkoutRequestDTO = {
//   //       email: email,
//   //       cartItemDTO: checkoutItems,
//   //     };

//   //     const response = await api.post("/cart/checkout", checkoutRequestDTO);
//   //     toast.success("Bạn đã đặt hàng thành công!");

//   //     setTimeout(() => {
//   //       navigate("/shopping-cart/cart", {
//   //         state: {
//   //           checkoutResponse: response.data,
//   //           cartItems: cart
//   //         }
//   //       });
//   //     }, 3000);

//   //   } catch (error) {
//   //     console.error("Error during checkout:", error);
//   //     toast.error("Đặt hàng không thành công! Hãy thử lại.");
//   //   }
//   //   setCheckoutLoading(false);
//   // };

//   const handleCheckout = async () => {
//     const token = localStorage.getItem("token");
  
//     if (!token) {
//       toast.error("Bạn phải đăng nhập để thanh toán!");
//       setTimeout(() => {
//         navigate("/login-and-signup", { state: { fromCart: true } });
//       }, 3000);
//       return;
//     }
  
//     // Validate tất cả sản phẩm trước khi đặt hàng
//     for (const item of cart) {
//       const error = validateQuantity(item.productId, item.quantity);
//       if (error) {
//         toast.error(`${item.productName}: ${error}`);
//         return;
//       }
  
//       try {
//         const response = await api.get(`/products/${item.productId}`);
//         const currentStock = response.data.quantity;
  
//         if (item.quantity > currentStock) {
//           toast.error(`${item.productName} chỉ còn ${currentStock} sản phẩm trong kho`);
//           return;
//         }
//       } catch (error) {
//         console.error(`Error checking stock for product ${item.productId}:`, error);
//         toast.error(`Không thể kiểm tra số lượng tồn kho cho ${item.productName}`);
//         return;
//       }
//     }
  
//     setCheckoutLoading(true);
  
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
  
//       setTimeout(() => {
//         navigate("/shopping-cart/cart", {
//           state: {
//             checkoutResponse: response.data,
//             cartItems: cart
//           }
//         });
//       }, 3000);
  
//     } catch (error) {
//       console.error("Error during checkout:", error);
//       toast.error("Đặt hàng không thành công! Hãy thử lại.");
//     }
//     setCheckoutLoading(false);
//   };

//   const columns = [
//     {
//       title: (
//         <Checkbox
//         title="Chọn tất cả sản phẩm"
//           checked={selectAll}
//           onChange={handleSelectAll}
//           disabled={cart.length === 0}
//         />
        
//     ),
//       key: "selection",
//       width: 50,
//       render: (_, record) => (
//         <Checkbox
//           checked={selectedRowKeys.includes(record.productId)}
//           onChange={(e) => handleRowSelect(record.productId, e)}
//         />
//       ),
//     },
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
//             disabled={item.quantity <= 1}
//           />
//           <Input
//             className="quantity-product"
//             min={1}
//             value={item.quantity}
//             onChange={(e) => handleQuantityChange(item.productId, e)}
//             style={{ width: 60, textAlign: "center" }}
//             type="number"
//           />
//           <Button
//             className="btn-increase"
//             icon={<PlusOutlined />}
//             onClick={() => increaseQuantity(item.productId)}
//             size="small"
//             disabled={item.quantity >= (productStocks[item.productId] || item.quantity)}
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
//           danger
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
//       <div className="cart-container">
//         <Card>
//           <h1>Giỏ hàng</h1>
//           {cart.length === 0 ? (
//             <div className="empty-cart-message">
//               <p>Giỏ hàng của bạn đang trống</p>
//               <Button type="primary" onClick={() => navigate("/products")}>
//                 Tiếp tục mua sắm
//               </Button>
//             </div>
//           ) : (
//             <>
//               <div style={{ marginBottom: 16 }}>
//                 <Button
//                   danger
//                   icon={<DeleteOutlined />}
//                   onClick={deleteSelectedItems}
//                   disabled={selectedRowKeys.length === 0}
//                 >
//                   Xóa đã chọn ({selectedRowKeys.length})
//                 </Button>
//               </div>
              
//               <Table
//                 className="table-cart"
//                 dataSource={cart}
//                 columns={columns}
//                 pagination={false}
//                 rowKey="productId"
//               />
              
//               <div className="order-summary">
//                 <span style={{ fontSize: 22 }}>
//                   <strong>Tổng số tiền:</strong>{" "}
//                   <span style={{ color: "red" }}>
//                     {totalAmount.toLocaleString()}{" "}
//                     <span style={{ textDecoration: "underline" }}>đ</span>
//                   </span>
//                 </span>
//                 <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
//                   <Button
//                     size="large"
//                     className="continue-shopping-btn"
//                     onClick={() => navigate("/products")}
//                     icon={<ShoppingCartOutlined />}
//                   >
//                     Tiếp tục mua sắm
//                   </Button>
//                   <Button
//                     size="large"
//                     className="checkout-btn"
//                     onClick={handleCheckout}
//                     loading={checkoutLoading}
//                   >
//                     Đặt hàng
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </Card>
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
import { Table, Button, Card, Typography, Input, Space, Image, Checkbox } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "./Shopping.css";

const { Title, Text } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const [productStocks, setProductStocks] = useState({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchUpdatedProducts = async () => {
    if (cart.length === 0) return;

    try {
      const updatedProducts = await Promise.all(
        cart.map(async (item) => {
          try {
            const response = await api.get(`/products/${item.productId}`);
            const productData = response.data;
            
            return {
              ...item,
              productName: productData.productName,
              discountPrice: productData.discountPrice,
              productImages: productData.productImages,
            };
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
            return item;
          }
        })
      );

      const hasChanges = updatedProducts.some((newItem, index) => {
        const oldItem = cart[index];
        return newItem.discountPrice !== oldItem.discountPrice || 
               newItem.productName !== oldItem.productName;
      });

      if (hasChanges) {
        setCart(updatedProducts);
        updateLocalStorageWithNewData(updatedProducts);
        toast.info("Một số sản phẩm trong giỏ hàng đã được cập nhật");
      }
    } catch (error) {
      console.error("Error fetching updated products:", error);
    }
  };

  const updateLocalStorageWithNewData = (updatedCart) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;
      if (!email) return;

      const cartKey = `cart_${email}`;
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Lỗi khi cập nhật localStorage:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchUpdatedProducts();
    }, 3000); // Kiểm tra mỗi 3 giây

    return () => clearInterval(interval);
  }, [cart]);

  useEffect(() => {
    fetchUpdatedProducts();
  }, []);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedRowKeys(checked ? cart.map(item => item.productId) : []);
  };

  const handleRowSelect = (productId, e) => {
    const checked = e.target.checked;
    setSelectedRowKeys(checked 
      ? [...selectedRowKeys, productId]
      : selectedRowKeys.filter(id => id !== productId)
    );
    setSelectAll(false);
  };

  const deleteSelectedItems = () => {
    if (selectedRowKeys.length === 0) {
      toast.warning("Vui lòng chọn sản phẩm để xóa");
      return;
    }

    setCart(prevCart => prevCart.filter(item => !selectedRowKeys.includes(item.productId)));
    updateLocalStorageAfterDelete(selectedRowKeys);
    setSelectedRowKeys([]);
    setSelectAll(false);
    toast.success(`Đã xóa ${selectedRowKeys.length} sản phẩm trong giỏ hàng`);
  };

  const updateLocalStorageAfterDelete = (productIds) => {
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
      const updatedCart = parsedCart.filter(item => !productIds.includes(item.productId));
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Lỗi khi cập nhật localStorage:", error);
    }
  };

  useEffect(() => {
    if (selectedRowKeys.length === cart.length && cart.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRowKeys, cart]);

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
      return "Số lượng phải là số nguyên";
    }
  
    if (newQuantity < 1) {
      return "Số lượng không được nhỏ hơn 1";
    }
  
    if (newQuantity > currentStock) {
      return `Số lượng không được vượt quá ${currentStock} (số lượng tồn kho)`;
    }
  
    return null;
  };

  const updateCartQuantity = async (id, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id ? { ...item, quantity: newQuantity } : item
      )
    );
  
    updateLocalStorage(id, newQuantity);
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
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("Bạn phải đăng nhập để thanh toán!");
      setTimeout(() => {
        navigate("/login-and-signup", { state: { fromCart: true } });
      }, 3000);
      return;
    }
  
    for (const item of cart) {
      const error = validateQuantity(item.productId, item.quantity);
      if (error) {
        toast.error(`${item.productName}: ${error}`);
        return;
      }
  
      try {
        const response = await api.get(`/products/${item.productId}`);
        const currentStock = response.data.quantity;
  
        if (item.quantity > currentStock) {
          toast.error(`${item.productName} chỉ còn ${currentStock} sản phẩm trong kho`);
          return;
        }
      } catch (error) {
        console.error(`Error checking stock for product ${item.productId}:`, error);
        toast.error(`Không thể kiểm tra số lượng tồn kho cho ${item.productName}`);
        return;
      }
    }
  
    setCheckoutLoading(true);
  
    try {
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;
  
      const checkoutItems = cart.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        discountPrice: item.discountPrice,
      }));
  
      const checkoutRequestDTO = {
        email: email,
        cartItemDTO: checkoutItems,
      };
  
      const response = await api.post("/cart/checkout", checkoutRequestDTO);
      toast.success("Bạn đã đặt hàng thành công!");
  
      setTimeout(() => {
        navigate("/shopping-cart/cart", {
          state: {
            checkoutResponse: response.data,
            cartItems: cart
          }
        });
      }, 3000);
  
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Đặt hàng không thành công! Hãy thử lại.");
    }
    setCheckoutLoading(false);
  };

  const columns = [
    {
      title: (
        <Checkbox
          title="Chọn tất cả sản phẩm"
          checked={selectAll}
          onChange={handleSelectAll}
          disabled={cart.length === 0}
        />
      ),
      key: "selection",
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.productId)}
          onChange={(e) => handleRowSelect(record.productId, e)}
        />
      ),
    },
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
          danger
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
              <div style={{ marginBottom: 16 }}>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={deleteSelectedItems}
                  disabled={selectedRowKeys.length === 0}
                >
                  Xóa đã chọn ({selectedRowKeys.length})
                </Button>
              </div>
              
              <Table
                className="table-cart"
                dataSource={cart}
                columns={columns}
                pagination={false}
                rowKey="productId"
              />
              
              <div className="order-summary">
                <span style={{ fontSize: 22 }}>
                  <strong>Tổng số tiền:</strong>{" "}
                  <span style={{ color: "red" }}>
                    {totalAmount.toLocaleString()}{" "}
                    <span style={{ textDecoration: "underline" }}>đ</span>
                  </span>
                </span>
                <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
                  <Button
                    size="large"
                    className="continue-shopping-btn"
                    onClick={() => navigate("/products")}
                    icon={<ShoppingCartOutlined />}
                  >
                    Tiếp tục mua sắm
                  </Button>
                  <Button
                    size="large"
                    className="checkout-btn"
                    onClick={handleCheckout}
                    loading={checkoutLoading}
                  >
                    Đặt hàng
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </>
  );
}