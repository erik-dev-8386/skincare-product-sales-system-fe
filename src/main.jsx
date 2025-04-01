import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CartProvider } from "./context/CartContext"; 
import dayjs from "dayjs";
import "dayjs/locale/vi"; 
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi"); 

const clientId =
  "525168437786-6gp97ecr9iuminm11fv9fkuteggdjcd8.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <CartProvider>
          <App />
        </CartProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
