import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));


  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };


    window.addEventListener("storage", handleStorageChange);


    const intervalId = setInterval(() => {
      const currentToken = localStorage.getItem("token");
      if (currentToken !== token) {
        setToken(currentToken);
      }
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [token]);


  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        if (decoded.sub) {
          setUserEmail(decoded.sub); 
          console.log("User email set to:", decoded.sub);
        } else {
          console.error("Token không chứa email (sub)");
          setUserEmail(null);
        }
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        setUserEmail(null);
      }
    } else {
      console.log("Không tìm thấy token trong localStorage");
      setUserEmail(null);
      
      setCart([]);
    }
  }, [token]);


  useEffect(() => {
    if (userEmail) {
      const cartKey = `cart_${userEmail}`;
      const savedCart = localStorage.getItem(cartKey);
      console.log("Đang tải giỏ hàng cho user:", userEmail);
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          console.log("Đã tải giỏ hàng từ localStorage:", parsedCart);
          setCart(parsedCart);
        } catch (error) {
          console.error("Lỗi khi parse giỏ hàng từ localStorage:", error);
          setCart([]);
        }
      } else {
        console.log(
          "Không tìm thấy giỏ hàng trong localStorage, khởi tạo giỏ hàng trống"
        );
        setCart([]);
      }
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      const cartKey = `cart_${userEmail}`;
      localStorage.setItem(cartKey, JSON.stringify(cart));
      console.log(
        "Đã lưu giỏ hàng vào localStorage cho user:",
        userEmail,
        cart
      );
    }
  }, [cart, userEmail]);

  const addToCart = (product) => {
    if (!userEmail) {
   
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    console.log("Đang thêm sản phẩm vào giỏ hàng:", product);

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) => item.productId === product.productId
      );

      let newCart;
      if (existingProduct) {
        console.log("Sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng");
        newCart = prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        console.log("Thêm sản phẩm mới vào giỏ hàng");
        newCart = [...prevCart, product];
      }

      console.log("Giỏ hàng sau khi cập nhật:", newCart);
      return newCart;
    });
  };


  const clearCart = () => {
    console.log("Xóa giỏ hàng khỏi state (không xóa khỏi localStorage)");
    setCart([]);

  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, clearCart, userEmail }}
    >
      {children}
    </CartContext.Provider>
  );
};
