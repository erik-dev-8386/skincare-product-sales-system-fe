import React, { useState } from 'react';
import './Header.css';
import logo from "../../assets/Logo_01.jpg";

export default function Header() {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className='Header'>
            <div className='col-1'>
                <a href="/"><img src={logo} alt="Haven SkinLogo" className='logo' /></a>
            </div>

            <div className='nav col-8'>
                <ul>
                    <li><a href='/' className="active">Trang chủ</a></li>
                    <li><a href='#' className="active">Sản phẩm</a></li>
                    <li><a href='/discount' className="active">Giảm giá</a></li>
                    <li><a href='/blog' className="active">Blog</a></li>
                    <li><a href='#' className="active">Xác định da</a></li>
                    <li>
                        <a href='#' className="active">Lộ trình chăm sóc da</a>
                        <ul className="subnav">
                            <li><a href="/listskincare/Thuong">Da thường</a></li>
                            <li><a href="/listskincare/Nhaycam">Da nhạy cảm</a></li>
                            <li><a href="/listskincare/Honhop">Da hỗn hợp</a></li>
                            <li><a href="/listskincare/Kho">Da khô</a></li>
                        </ul>
                    </li>
                    <li><a href='/about-us'>Giới thiệu & Liên hệ</a></li>
                </ul>
            </div>

            <div className='icon col-3'>
                <div className="search">
                    <input type="text" placeholder="       " className='searchtt' />
                    <i className="fas fa-search search-icon"></i>
                </div>

                <a href="/shopping-cart" className="cart">
                    <i className="fas fa-shopping-cart"></i>
                </a>

                <div className='user-container'>
                    <a href="#" className="user">
                        <i className="fas fa-user"></i>
                    </a>
                    <ul className="subnav">
                        <li><a href="/profile">Profile</a></li>
                        <li><a href="/admin-dashboard">Admin Dashboard</a></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}
