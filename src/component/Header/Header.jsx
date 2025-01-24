import React from 'react'
import './Header.css'
import logo from "../../assets/Logo_01.jpg"
export default function Header() {
    return (
        <div className='Header'>
            <img src={logo} alt=" Haven SkinLogo" className='logo' />
            <div className='nav'>
                <ul>
                    <li><a href='/'>Trang chủ</a></li>
                    <li><a href='#'>Sản phẩm</a></li>
                    <li><a href='#'>Giảm giá</a></li>
                    <li><a href='/blog'>Blog</a></li>
                    <li><a href='#'>Xác định da</a></li>
                    <li>
                        <a href='#'>
                            Lộ trình chăm sóc da
                        </a>
                        <ul class="subnav">
                        <li><a href="">Da thường</a></li>
                        <li><a href="">Da nhạy cảm</a></li>
                        <li><a href="">Da hỗn hợp</a></li>
                        <li><a href="">Da khô</a></li>
                        </ul>
                    </li>
                    <li><a href='#'>Giới thiệu & Liên hệ</a></li>
                </ul>
            </div>

            <div className='icon'>
                <div class="search">
                    <input type="text" placeholder="       " className='searchtt' />
                    <i class="fas fa-search search-icon"></i>
                </div>

                <a href="#" className="cart">
                    <i className="fas fa-shopping-cart"></i>
                </a>

                <a href="/login" className="user">
                    <i className="fas fa-user"></i>
                </a>
            </div>
        </div>
    )
}
