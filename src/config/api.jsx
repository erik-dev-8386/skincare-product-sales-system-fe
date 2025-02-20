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

// import axios from "axios";

// const api = axios.create({
//     baseURL: 'http://localhost:8080/haven-skin',
//     headers: {
//         "Content-Type": "application/json"
//     },
//     withCredentials: true // Để gửi cookie refresh token nếu cần
// });

// let isRefreshing = false;
// let refreshSubscribers = [];

// const onRefreshed = (newToken) => {
//     refreshSubscribers.forEach(callback => callback(newToken));
//     refreshSubscribers = [];
// };

// // Tự động thêm token vào mỗi request
// api.interceptors.request.use(config => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, error => Promise.reject(error));

// // Xử lý tự động refresh token khi gặp lỗi 401
// api.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;

//         if (error.response.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 return new Promise(resolve => {
//                     refreshSubscribers.push(newToken => {
//                         originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
//                         resolve(api(originalRequest));
//                     });
//                 });
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 const response = await axios.post(
//                     "http://localhost:8080/haven-skin/users/refresh-token",
//                     {},
//                     { withCredentials: true }
//                 );

//                 const newToken = response.data.accessToken;
//                 localStorage.setItem("token", newToken);

//                 api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
//                 onRefreshed(newToken);
//                 isRefreshing = false;

//                 return api(originalRequest);
//             } catch (refreshError) {
//                 isRefreshing = false;
//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;
