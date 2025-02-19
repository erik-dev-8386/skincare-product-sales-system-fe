
import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import './Header.css';
import logo from "../../assets/Logo_01.jpg";
import { jwtDecode } from "jwt-decode"; // Import thư viện giải mã JWT

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false);

    const [role, setRole] = useState(null);

    // useEffect(() => {
    //     // Lấy role từ localStorage hoặc từ context nếu có
    //     const userRole = localStorage.getItem("role");
    //     setRole(userRole);
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);

                setRole(decoded.role); // Giả sử role có trong payload token
            } catch (error) {
                console.error("Lỗi khi giải mã token:", error);
                setRole(null);
            }
        }
    }, []);


    // const handleLogout = () => {
    //     localStorage.removeItem("role");
    //     localStorage.removeItem("token");
    //     window.location.reload();
    // };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div className='Header'>
            <div className='col-1'>
                <Link to="/"><img src={logo} alt="Haven Skin Logo" className='logo' /></Link>
            </div>

            <div className='nav col-8'>
                <ul>
                    <li><Link to='/' className="active">Trang chủ</Link></li>
                    <li><Link to='#' className="active">Sản phẩm</Link></li>
                    <li><Link to='/discount' className="active">Giảm giá</Link></li>
                    <li><Link to='/blog' className="active">Blog</Link></li>
                    <li><Link to='#' className="active">Xác định da</Link></li>
                    <li>
                        <Link to='#' className="active">Lộ trình chăm sóc da</Link>
                        <ul className="subnav">
                            <li><Link to="/listskincare/Thuong">Da thường</Link></li>
                            <li><Link to="/listskincare/Nhaycam">Da nhạy cảm</Link></li>
                            <li><Link to="/listskincare/Honhop">Da hỗn hợp</Link></li>
                            <li><Link to="/listskincare/Kho">Da khô</Link></li>
                        </ul>
                    </li>
                    <li><Link to='/about-us'>Giới thiệu & Liên hệ</Link></li>
                </ul>
            </div>

            <div className='icon col-3'>
                <div className="search">
                    <input type="text" placeholder="       " className='searchtt' />
                    <i className="fas fa-search search-icon"></i>
                </div>

                <Link to="/shopping-cart" className="cart">
                    <i className="fas fa-shopping-cart"></i>
                </Link>

                <div className='user-container'>
                    <Link to="#" className="user">
                        <i className="fas fa-user"></i>
                    </Link>
                    {/* <ul className="subnav">
                        <li><Link to="/profile">Hồ sơ</Link></li>
                        <li><Link to="/login-and-signup">Đăng nhập</Link></li>
                        <li><Link to="/login-and-signup">Đăng ký</Link></li>
                         <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
                        {role === "admin" && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
                    </ul> */}

                    <ul className="subnav">
                        {role ? (
                            <>
                                <li><Link to="/profile">Hồ sơ</Link></li>
                                {role === 1 && <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>}
                                <li onClick={handleLogout} style={{ cursor: "pointer", color: "white" }}>Đăng xuất</li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login-and-signup">Đăng nhập</Link></li>
                                <li><Link to="/login-and-signup">Đăng ký</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
