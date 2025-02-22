import "./loginAndSignup.css";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";
import { GoogleLogin } from "@react-oauth/google";
import { Link } from 'react-router-dom';

export default function LoginAndSignup() {

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const CLIENT_ID = "525168437786-6gp97ecr9iuminm11fv9fkuteggdjcd8.apps.googleusercontent.com";

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setIsRegister(!isRegister);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    try {

      if (isRegister) {

        // Kiểm tra trường bị trống
        for (let key in formData) {
          if (formData[key].trim() === "") {
            toast.error(`Vui lòng nhập ${key === "firstName" ? "tên" : key === "lastName" ? "họ" : key}`);
            setLoading(false);
            return;
          }
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error("Email không hợp lệ!");
          setLoading(false);
          return;
        }

        // Kiểm tra số điện thoại (chỉ chứa số, độ dài từ 10-11 số)
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phone)) {
          toast.error("Số điện thoại không hợp lệ! Phải có 10-11 chữ số.");
          setLoading(false);
          return;
        }

        // Kiểm tra độ dài mật khẩu
        if (formData.password.length < 6) {
          toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
          setLoading(false);
          return;
        }

        // Kiểm tra mật khẩu khớp nhau
        if (formData.password !== formData.confirmPassword) {
          toast.error("Mật khẩu không khớp!");
          setLoading(false);
          return;
        }
        await api.post("/users", formData);
        toast.success("Đăng ký thành công!");
        setTimeout(() => navigate("/login-and-signup"), 1500);
      } else {
        const response = await api.post("/users/login", {
          email: formData.email,
          password: formData.password
        });
        console.log("Sending login data:", formData);


        // localStorage.setItem("role", response.data.role);

        const token = response.data.token;
        localStorage.setItem("token", token);
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        console.log("Token:", token);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
    setLoading(false);
  };

  const handleSuccess = async (response) => {
    console.log("Google Token:", response.credential); // Kiểm tra token nhận được
    try {
      const res = await fetch("http://localhost:8080/haven-skin/users/login/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response.credential),
      });

      const data = await res.json();
      console.log("User data:", data);

      if (res.ok && data.token) {
        //  Lưu token vào localStorage
        localStorage.setItem("token", data.token);

        //  Giải mã token lấy role
        const decodedToken = jwtDecode(data.token);
        setRole(decodedToken.role);

      }




      toast.success("Đăng nhập thành công!");
      setTimeout(() => navigate("/"), 1500); // Chuyển hướng về trang chủ
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Đăng nhập thất bại!");
    }
  };

  // const handleSuccess = async (response) => {
  //   console.log("Google Token:", response.credential);
  //   try {
  //     const res = await fetch(
  //       "http://localhost:8080/haven-skin/users/login/google",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(response.credential),
  //       }
  //     );

  //     const data = await res.json();
  //     console.log("User data:", data);

  //     if (res.ok && data.redirectUrl) {
  //       toast.success("Đăng nhập thành công!");
  //       navigate(data.redirectUrl); // Chuyển hướng đúng trang
  //     } else {
  //       console.error("Server returned an error:", data);
  //       toast.error(data.error || "Đăng nhập thất bại!");
  //     }
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //     toast.error("Lỗi kết nối đến server!");
  //   }
  // };


  return (
    <div className="body">
      <ToastContainer />
      <div className={`container login-page ${isRegister ? "active" : ""}`} id="container">
        {isRegister ? (
          <div className="sign-up">
            <form onSubmit={handleSubmit}>
              <h1>Đăng ký tài khoản</h1>
              <div className="icons">
                {/* <Link to="#" className="icon">
                  <i className="fa-brands fa-facebook"></i>
                </Link>
                <Link to="#" className="icon">
                  <i className="fa-brands fa-google"></i>
                  
                </Link>
                <Link to="#" className="icon">
                  <i className="fa-brands fa-github"></i>
                </Link>
                <Link to="#" className="icon">
                  <i className="fa-brands fa-linkedin"></i>
                </Link> */}
                <GoogleLogin
                  className="google-login"
                  clientId={CLIENT_ID}
                  buttonText="Login with Google"
                  onSuccess={handleSuccess}
                  onError={() => console.log("Đăng nhập thất bại")}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
              <span>hoặc dùng email để tạo tài khoản</span>
              <input type="text" name="firstName" placeholder="Tên" onChange={handleChange} />
              <input type="text" name="lastName" placeholder="Họ" onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} />
              <input
                type="text"
                name="phone"
                placeholder="Số điện thoại"
                onChange={handleChange}
              />
              <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} />
              <input type="password" name="confirmPassword" placeholder="Xác nhận lại mật khẩu" onChange={handleChange} />

              <button type="submit" disabled={loading}>{loading ? "Đang xử lý..." : "Đăng ký"}</button>
            </form>
          </div>
        ) : (
          <div className="sign-in">
            <form onSubmit={handleSubmit}>
              <h1>Đăng nhập</h1>
              <div className="icons">
                {/* <Link to="#" className="icon">
                  <i className="fa-brands fa-facebook"></i>
                </Link>
                <Link to="#" className="icon">
                  <i className="fa-brands fa-google"></i>
                </Link>
                <Link to="#" className="icon">
                  <i className="fa-brands fa-github"></i>
                </Link>
                <Link to="#" className="icon">
                  <i className="fa-brands fa-linkedin"></i>
                </Link> */}
                <GoogleLogin
                  className="google-login"
                  clientId={CLIENT_ID}
                  buttonText="Login with Google"
                  onSuccess={handleSuccess}
                  onError={() => console.log("Đăng nhập thất bại")}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
              <span>hoặc dùng email và mật khẩu</span>
              <input type="email" name="email" placeholder="Email" onChange={handleChange} />

              <input type="password" name="password" id="password" placeholder="Mật khẩu" onChange={handleChange} />

              <Link to="#" className="forgot">Quên mật khẩu</Link>
              <button type="submit" disabled={loading}>{loading ? "Đang xử lý..." : "Đăng nhập"}</button>
            </form>
            {role !== null && <p>Vai trò của bạn: {role === 1 ? "ADMIN" : role === 2 ? "STAFF" : "CUSTOMER"}</p>}
          </div>
        )}
        <div className="toogle-container">
          <div className="toogle">
            <div className="toogle-panel toogle-left">

              <h1>Chào mừng!</h1>
              <p>Nếu bạn đã có tài khoản</p>
              <button className="hidden" id="login" onClick={toggleForm}>Đăng nhập</button>
              <div className="back-to-home"><Link to="/"><i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ</Link></div>
            </div>

            <div className="toogle-panel toogle-right">

              <h1>Xin chào!</h1>
              <p>Nếu bạn chưa có tài khoản</p>
              <button className="hidden" id="register" onClick={toggleForm}>Đăng ký</button>
              <div className="back-to-home"><Link to="/"><i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ</Link></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

