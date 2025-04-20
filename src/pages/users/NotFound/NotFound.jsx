import React from 'react'
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <>
    <div  style={{display: "flex", justifyContent: "center", alignItems: "start", margin: 20}}>
    <Link style={{color: "black", textDecoration: 'none'}} to="/"><i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ</Link>
    <img src={'./src/assets/404.jpg'} alt="404" style={{width: "90%", paddingRight: 80}} />
    </div> 
    </>
  )
}
