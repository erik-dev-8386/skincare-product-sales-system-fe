import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/haven-skin',
    headers: {
        "Content-Type": "application/json"
    }

});

// Tự động thêm token vào mỗi request

api.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

export default api;

//-----------------------------------------------------------------------------
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/haven-skin",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // Để gửi cookie refresh token nếu cần
// });

// let isRefreshing = false;
// let refreshSubscribers = [];

// const onRefreshed = (newToken) => {
//   refreshSubscribers.forEach((callback) => callback(newToken));
//   refreshSubscribers = [];
// };

// // Tự động xử lý Content-Type cho FormData và thêm token
// api.interceptors.request.use(
//   (config) => {
//     // Xử lý token
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Xử lý FormData - xóa Content-Type để axios tự động set boundary
//     if (config.data instanceof FormData) {
//       delete config.headers["Content-Type"];
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Xử lý tự động refresh token khi gặp lỗi 401
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       if (isRefreshing) {
//         return new Promise((resolve) => {
//           refreshSubscribers.push((newToken) => {
//             originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//             resolve(api(originalRequest));
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const response = await axios.post(
//           "http://localhost:8080/haven-skin/users/refresh-token",
//           {}, // Gửi body rỗng vì refresh token được gửi qua cookie
//           { withCredentials: true }
//         );

//         const newToken = response.data.token;
//         localStorage.setItem("token", newToken);
//         api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//         onRefreshed(newToken);
//         isRefreshing = false;

//         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         isRefreshing = false;
//         localStorage.removeItem("token");
//         window.location.href = "/login-and-signup"; // Chuyển hướng đến trang đăng nhập nếu refresh thất bại
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
