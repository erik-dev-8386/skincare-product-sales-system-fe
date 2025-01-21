import { UserManager, WebStorageStateStore } from "oidc-client";

let userManager;

const getUserManager = () => {
  if (!userManager) {
    const config = {
      authority: "https://accounts.google.com",
      client_id: "842938867571-dj4ipdv0c2tgvdn83t0e9441u18b33m9.apps.googleusercontent.com",
      redirect_uri: "http://localhost:5173/auth/callback",
      response_type: "token",
      scope: "openid profile email",
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      filterProtocolClaims: true, // Loại bỏ xác minh các claim giao thức
      loadUserInfo: false,        // Không tải user info từ endpoint
    };
    userManager = new UserManager(config);
  }
  return userManager;
};

export const login = () => {
  console.log("Đang bắt đầu xác thực...");
  getUserManager().signinRedirect();
};


export const handleCallback = async () => {
  try {
    console.log("Đang xử lý callback...");
    const user = await getUserManager().signinRedirectCallback();
    console.log("Thông tin người dùng:", user);
  } catch (error) {
    console.error("Lỗi khi xử lý callback:", error);
  }
};

export const logout = () => getUserManager().signoutRedirect();
