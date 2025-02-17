import "./loginAndSignup.css";
import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/api";

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
        if (formData.password !== formData.confirmPassword) {
          toast.error("Mật khẩu không khớp!");
          setLoading(false);
          return;
        }
        await api.post("/users", formData);
        toast.success("Đăng ký thành công!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        const response = await api.post("/users/login", {
          email: formData.email,
          password: formData.password
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        const decodedToken = jwtDecode(token);
        setRole(decodedToken.role);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
    setLoading(false);
  };



  return (
    <div className="body">
      <ToastContainer />
      <div className={`container login-page ${isRegister ? "active" : ""}`} id="container">
        {isRegister ? (
          <div className="sign-up">
            <form onSubmit={handleSubmit}>
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
              <input type="email" name="email" placeholder="Email" onChange={handleChange} />

              <input type="password" name="password" id="password" placeholder="Mật khẩu"  onChange={handleChange} />

              <a href="#" className="forgot">Quên mật khẩu</a>
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
              <div className="back-to-home"><a href="/"><i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ</a></div>
            </div>

            <div className="toogle-panel toogle-right">

              <h1>Xin chào!</h1>
              <p>Nếu bạn chưa có tài khoản</p>
              <button className="hidden" id="register" onClick={toggleForm}>Đăng ký</button>
              <div className="back-to-home"><a href="/"><i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


//==========================================================================================================================================

// import "./loginAndSignup.css";
// import React, { useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function loginAndSignup() {
//   const [isRegister, setIsRegister] = useState(false);

//   const toggleForm = () => setIsRegister(!isRegister);



//   return (
//     <div className="body">
//       <ToastContainer />
//       <div className={`container login-page ${isRegister ? "active" : ""}`} id="container">
       
//           <div className="sign-up">
//             <form >
//               <h1>Đăng ký tài khoản</h1>
//               <div className="icons">
//                 <a href="#" className="icon">
//                   <i className="fa-brands fa-facebook"></i>
//                 </a>
//                 <a href="#" className="icon">
//                   <i className="fa-brands fa-google"></i>
//                 </a>
//                 <a href="#" className="icon">
//                   <i className="fa-brands fa-github"></i>
//                 </a>
//                 <a href="#" className="icon">
//                   <i className="fa-brands fa-linkedin"></i>
//                 </a>
//               </div>
//               <span>hoặc dùng email để tạo tài khoản</span>
//               <input type="text" name="firstName" placeholder="Tên"  />
//               <input type="text" name="lastName" placeholder="Họ"  />
//               <input type="email" name="email" placeholder="Email"  />
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Số điện thoại"
            
//               />
//               <input type="password" name="password" placeholder="Mật khẩu"  />
//               <input type="password" name="confirmPassword" placeholder="Xác nhận lại mật khẩu" />

//               <button type="submit" >Đăng ký</button>
//             </form>
//           </div>
    
//           <div className="sign-in">
//             <form >
//               <h1>Đăng nhập</h1>
//               <div className="icons">
//                 <a href="#" className="icon">
//                   <i className="fa-brands fa-facebook"></i>
//                 </a>
//                 <a href="#" className="icon">
//                   <i className="fa-brands fa-google"></i>
//                 </a>
//                 <a href="#" className="icon">
//                   <i className="fa-brands fa-github"></i>
//                 </a>
//                 <a href="#" className="icon">
//                   <i className="fa-brands fa-linkedin"></i>
//                 </a>
//               </div>
//               <span>hoặc dùng email và mật khẩu</span>
//               <input type="email" name="email" placeholder="Email"  />

//               <input type="password" name="password"placeholder="Mật khẩu"  />

//               <a href="#" className="forgot">Quên mật khẩu</a>
//               <button type="submit" >Đăng nhập</button>
//             </form>
           
//           </div>
       
//         <div className="toogle-container">
//           <div className="toogle">
//             <div className="toogle-panel toogle-left">

//               <h1>Chào mừng!</h1>
//               <p>Nếu bạn đã có tài khoản</p>
//               <button className="hidden" id="login" onClick={toggleForm}>Đăng nhập</button>
//               <div className="back-to-home"><a href="/"><i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ</a></div>
//             </div>

//             <div className="toogle-panel toogle-right">

//               <h1>Xin chào!</h1>
//               <p>Nếu bạn chưa có tài khoản</p>
//               <button className="hidden" id="register" onClick={toggleForm}>Đăng ký</button>
//               <div className="back-to-home"><a href="/"><i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ</a></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
  
// }
