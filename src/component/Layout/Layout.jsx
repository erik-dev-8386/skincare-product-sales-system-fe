import { Outlet } from "react-router-dom";
import React from 'react'
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Layout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />  {/* Đây là nơi hiển thị nội dung từng trang */}
            </main>
            <Footer />
        </>
    )
}
