import React from 'react'
import './Header.css'
import logo from "../../assets/Logo_01.jpg"

export default function Header() {
    return (
        <div className='Header'>
            <div className='col-1'><a href="/"><img src={logo} alt=" Haven SkinLogo" className='logo' /></a></div>
            <div className='nav col-8'>
                <ul>
                    <li><a href='/' class="active">Trang chủ</a></li>
                    <li><a href='#' class="active">Sản phẩm</a></li>
                    <li><a href='/discount'class="active" >Giảm giá</a></li>
                    <li><a href='/blog' class="active">Blog</a></li>
                    <li><a href='#' class="active">Xác định da</a></li>
                    <li>
                        <a href='#'class="active">
                            Lộ trình chăm sóc da
                        </a>
                        <ul class="subnav">
                            <li><a href="/listskincare/Thuong" >Da thường</a></li>
                            <li><a href="/listskincare/Nhaycam" >Da nhạy cảm</a></li>
                            <li><a href="/listskincare/Honhop" >Da hỗn hợp</a></li>
                            <li><a href="/listskincare/Kho" >Da khô</a></li>
                        </ul>
                    </li>
                    <li><a href='/about-us' >Giới thiệu & Liên hệ</a></li>
                </ul>   
            </div>

            <div className='icon col-3'>
                <div class="search">
                    <input type="text" placeholder="       " className='searchtt' />
                    <i class="fas fa-search search-icon"></i>
                </div>

                <a href="/shopping-cart" className="cart">
                    <i className="fas fa-shopping-cart"></i>
                </a>
                <a href='/login-and-signup' className="user">
                    <i className="fas fa-user"></i>
                </a>
            </div>
        </div>
    )
}
