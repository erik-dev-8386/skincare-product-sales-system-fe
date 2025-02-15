import "./loginAndSignup.css";
import React, { useEffect } from "react";

export default function LoginAndSignup() {
  
  useEffect(() => {
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    if (!container || !registerBtn || !loginBtn) return;

    const handleRegisterClick = () => {
      container.classList.add("active");
    };

    const handleLoginClick = () => {
      container.classList.remove("active");
    };

    registerBtn.addEventListener("click", handleRegisterClick);
    loginBtn.addEventListener("click", handleLoginClick);

    // Cleanup event listeners when component unmounts
    return () => {
      registerBtn.removeEventListener("click", handleRegisterClick);
      loginBtn.removeEventListener("click", handleLoginClick);
    };
  }, []);

  return (
    <div className="body">
      <div className="container login-page" id="container">
        <div className="sign-up">
          <form action="">
            <h1>Đăng ký tài khoản</h1>
            <div className="icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
            <span>hoặc dùng email để tạo tài khoản</span>
            <input type="text" placeholder="Họ và Tên" />
            <input type="text" placeholder="Email" />
            <input type="text" placeholder="Số điện thoại" />
            <input type="password" placeholder="Mật khẩu" />
            <input type="password" placeholder="Xác nhận lại mật khẩu" />
            <button>Đăng ký</button>
          </form>
        </div>

        <div className="sign-in">
          <form action="">
            <h1>Đăng nhập</h1>
            <div className="icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-google"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
            <span>hoặc dùng email và mật khẩu</span>
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Mật khẩu" />
            <a href="#" className="forgot">Quên mật khẩu</a>
            <button>Đăng nhập</button>
          </form>
        </div>

        <div className="toogle-container">
          <div className="toogle">
            <div className="toogle-panel toogle-left">
              <h1>Chào mừng!</h1>
              <p>Nếu bạn đã có tài khoản</p>
              <button className="hidden" id="login">Đăng nhập</button>
            </div>

            <div className="toogle-panel toogle-right">
              <h1>Xin chào!</h1>
              <p>Nếu bạn chưa có tài khoản</p>
              <button className="hidden" id="register">Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
