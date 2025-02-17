import Logo from '../../../assets/Logo_01.jpg';
import { login } from '../../../auth';
import "../login/Login.css"
import Google from '../../../assets/google.png';


import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button, Card } from "antd";
import { toast, ToastContainer } from "react-toastify";

const CLIENT_ID = "525168437786-6gp97ecr9iuminm11fv9fkuteggdjcd8.apps.googleusercontent.com";

function Login() {

  const navigate = useNavigate(); // Khai báo navigate để chuyển trang

  // const handleSuccess = async (response) => {
  //   try {
  //     const { credential } = response; // Dùng "credential" thay vì "tokenId"
  //     const res = await axios.post("http://localhost:8080/haven-skin/users/login/google", { token: credential });

  //     alert("Đăng nhập thành công!"); // Thông báo thành công
  //     toast.success("Đăng nhập thành công!");
  //     navigate("/"); // Chuyển hướng về trang chủ
  //   } catch (error) {
  //     console.error("Đăng nhập thất bại", error);
  //     toast.error("Đăng nhập thất bại!");
  //   }
  // };

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
      toast.success("Đăng nhập thành công!");
      navigate("/"); // Chuyển hướng về trang chủ
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Đăng nhập thất bại!");
    }
  };

  return (
    <>
    <ToastContainer />
      <form>
        <div className="login">
          <div className='login-logo'>
            <a href="/"><img src={Logo} alt="" /></a>
            <h1>Đăng nhập</h1>

          </div>
          <div className='input'>
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="form2Example1">Tên người dùng:</label>
              <input type="email" id="form2Example1" className="form-control" />
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="form2Example2">Mật khẩu:</label>
              <input type="password" id="form2Example2" className="form-control" />
            </div>
          </div>

          {/* <!-- 2 column grid layout for inline styling --> */}
          <div className="row mb-4">


            <div className="text-loss col">
              {/* <!-- Simple link --> */}

              <a href="#!">Quên mật khẩu</a>
            </div>
          </div>

          {/* <!-- Submit button --> */}
          <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn-login btn-light btn-block mb-4">Đăng nhập</button>

          {/* <!-- Register buttons --> */}
          <div className="text-center">
            <p>Bạn không có tài khoản? <a href="/register">Đăng ký</a></p>
            <p>Hoặc đăng nhập với:</p>


            <div>
              {/* <a href="#"> */}
                {/*<button type="button" onClick={login} data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
                 <img className='google' src={Google} alt="login-with-google" />
                 Đăng nhập với google
               </button>*/}

                <GoogleLogin
                className="google-login"
                  clientId={CLIENT_ID}
                  buttonText="Login with Google"
                  onSuccess={handleSuccess}
                  onError={() => console.log("Đăng nhập thất bại")}
                  cookiePolicy={"single_host_origin"}
                />
                

              {/* </a> */}

            </div>



          </div>
        </div>
      </form>

    </>
  );
}


export default Login



// import React from "react";
// import { GoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { Button, Card } from "antd";

// const CLIENT_ID = "525168437786-6gp97ecr9iuminm11fv9fkuteggdjcd8.apps.googleusercontent.com";

// const Login = () => {
//   const navigate = useNavigate(); // Khai báo navigate để chuyển trang

//   const handleSuccess = async (response) => {
//     try {
//       const { credential } = response; // Dùng "credential" thay vì "tokenId"
//       const res = await axios.post("http://localhost:8080/login/oauth2/code/google", { token: credential });

//       alert("Đăng nhập thành công!"); // Thông báo thành công
//       navigate("/"); // Chuyển hướng về trang chủ
//     } catch (error) {
//       console.error("Đăng nhập thất bại", error);

//     }
//   };

//   return (
//     <div className="d-flex justify-content-center align-items-center vh-100">
//       <Card className="p-4 text-center">
//         <h2>Đăng nhập bằng Google</h2>
//         <GoogleLogin
//           clientId={CLIENT_ID}
//           buttonText="Login with Google"
//           onSuccess={handleSuccess}
//           onError={() => console.log("Đăng nhập thất bại")}
//           cookiePolicy={"single_host_origin"}
//         />
//       </Card>
//     </div>
//   );
// };

// export default Login;

