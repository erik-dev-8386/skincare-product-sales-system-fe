// import { useEffect } from "react";
// import { handleCallback } from "../../../auth";

// function Callback() {
//   useEffect(() => {
//     handleCallback()
//       .then((user) => {
//         console.log("Người dùng đã đăng nhập:", user);
//         if (user) {
//           window.location.href = "/"; // Chuyển hướng khi user hợp lệ
//         } else {
//           console.error("User không hợp lệ");
//           // Hiển thị thông báo lỗi cho người dùng
//         }
//       })
//       .catch((error) => {
//         console.error("Lỗi xác thực:", error);
//         // Hiển thị lỗi tùy chỉnh nếu cần
//       });
//   }, []);

//   return <h1>Đang xác thực...</h1>;
// }

// export default Callback;

import { useEffect } from "react";
import { handleCallback } from "../../../auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Callback() {
  const navigate = useNavigate(); // Khai báo useNavigate

  useEffect(() => {
    handleCallback()
      .then((user) => {
        console.log("Người dùng đã đăng nhập:", user);
        if (user) {
          navigate("/"); // Chuyển hướng về trang chủ
        } else {
          console.error("User không hợp lệ");
        }
      })
      .catch((error) => {
        console.error("Lỗi xác thực:", error);
      });
  }, []);

  return <h1>Đang xác thực...</h1>;
}

export default Callback;
