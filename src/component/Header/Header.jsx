import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Logo_01.jpg";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../../context/CartContext";
import { ShoppingCartOutlined, DashboardOutlined } from "@ant-design/icons";
import { Badge } from "antd";

export default function Header() {
  const [role, setRole] = useState(null);
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        setRole(null);
      }
    }
  }, []);

  const handleLogout = () => {
    // Chỉ xóa token, không làm gì với giỏ hàng
    localStorage.removeItem("token");

    // Sử dụng window.location.href thay vì reload để đảm bảo trang được tải lại hoàn toàn
    window.location.href = "/";
  };

  return (
    <div className="Header">
      <div className="col-1">
        <Link to="/">
          <img src={logo} alt="Haven Skin Logo" className="logo" />
        </Link>
      </div>

      <div className="nav col-8">
        <ul>
          <li>
            <Link to="/" className="active">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link to="/products" className="active">
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/customer-discounts" className="active">
              Giảm giá
            </Link>
          </li>
          <li>
            <Link to="/blog" className="active">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/question" className="active">
              Xác định da
            </Link>
          </li>
          <li>
            <Link to="#" className="active">
              Lộ trình chăm sóc da
            </Link>
            <ul className="subnav">
              <li>
                <Link to="/listskincare/Thuong">Da thường</Link>
              </li>
              <li>
                <Link to="/listskincare/Nhaycam">Da nhạy cảm</Link>
              </li>
              <li>
                <Link to="/listskincare/Honhop">Da hỗn hợp</Link>
              </li>
              <li>
                <Link to="/listskincare/Kho">Da khô</Link>
              </li>
              <li>
                <Link to="/listskincare/Dau">Da dầu</Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to="/about-me">Giới thiệu & Liên hệ</Link>
          </li>
        </ul>
      </div>

      <div className="icon col-3">
        <div className="search">
          <input type="text" placeholder="       " className="searchtt" />
          <i className="fas fa-search search-icon"></i>
        </div>

        <Link to="/shopping-cart">
          <Badge
            count={cart.length}
            style={{ backgroundColor: "yellow", color: "black" }}
          >
            <ShoppingCartOutlined
              style={{
                fontSize: "24px",
                cursor: "pointer",
                color: "white",
                borderRadius: "50%",
                backgroundColor: "none",
                padding: "7.5px",
                border: "1px solid white",
              }}
            />
          </Badge>
        </Link>

        <div className="user-container">
          <Link to="#" className="user">
            <i className="fas fa-user"></i>
          </Link>

          <ul className="subnav">
            {role ? (
              <>
                <li>
                  <Link to="/user">
                    <p>
                      <i className="fa-solid fa-address-card"></i> Hồ sơ
                    </p>
                  </Link>
                </li>
                {(role === 1 || role === 2) && (
                  <li>
                    <Link to="/admin">
                      <p>
                        <DashboardOutlined /> Bảng điều khiển
                      </p>
                    </Link>
                  </li>
                )}
                <li
                  onClick={handleLogout}
                  style={{ cursor: "pointer", color: "white" }}
                >
                  <p>
                    <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                  </p>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login-and-signup">
                    {" "}
                    <p>
                      <i className="fa-solid fa-right-to-bracket"></i> Đăng
                      nhập/Đăng ký
                    </p>
                  </Link>
                </li>
                {/* <li>
                  <Link to="/login-and-signup">Đăng ký</Link>
                </li> */}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
