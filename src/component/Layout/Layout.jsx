import { Outlet } from "react-router-dom";
import React from 'react'
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Layout() {
    return (
        <>
            <Header />
            <main style={{paddingTop: 130}}>
                <Outlet />  {/* Đây là nơi hiển thị nội dung từng trang */}
            </main>
            <Footer />
        </>
    )
}
