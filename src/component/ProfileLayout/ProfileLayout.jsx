import React from 'react';
import { Image, Layout, Menu } from "antd";
import {
  IdcardOutlined, HistoryOutlined, SettingOutlined, FireOutlined
} from "@ant-design/icons";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import './ProfileLayout.css'; // Make sure to import your CSS file

const { Content, Sider } = Layout;

export default function ProfileLayout() {

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/user", icon: <IdcardOutlined />, label: "Thông tin tài khoản" },
    { key: "/user/history", icon: <HistoryOutlined />, label: "Lịch sử mua hàng" },
    { key: "/user/point", icon:  <FireOutlined />, label: "Điểm tích lũy" },
    { key: "/user/setting", icon:  <SettingOutlined />, label: "Cài đặt" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible width={200} breakpoint="lg" className='sider-user-profile'>
        <div className="back-to-home" style={{ marginTop: 5, marginLeft: 10 }}>
          <Link to="/">
            <i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ
          </Link>
        </div>
        <div className="avarta-profile">
          <Image
        // style={{ width: 100, height: 100, borderRadius: "50%" }}
            className="image-avarta"
            src="./src/assets/Logo_01.jpg"
            alt="Avarta"
          />
        </div>
        <div className="logo text-center text-white py-3">Kính chào quý khách!</div>
        <Menu
          className="sider-menu color-menu" // Add your custom class here
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          items={menuItems.map(({ key, icon, label }) => ({
            key,
            icon,
            label: (
              <Link style={{ textDecoration: "none" }} to={key}>
                {label}
              </Link>
            ),
          }))}
        />
      </Sider>
      <Layout className='user-profile-layout'>
        <Content className="content-container">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}