

import React, { useState, useEffect } from 'react';
import { Image, Layout, Menu } from "antd";
import {
  IdcardOutlined, HistoryOutlined, SettingOutlined, FireOutlined
} from "@ant-design/icons";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import api from "../../config/api"; 
import './ProfileLayout.css';
import { jwtDecode } from "jwt-decode"; 

const { Content, Sider } = Layout;

export default function ProfileLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUser = async () => {
      try {
        const decoded = jwtDecode(token);
        const email = decoded.sub;
        const userData = await api.get(`users/${email}`);
        setUser(userData.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUser();
  }, []);

  const menuItems = [
    { key: "/user", icon: <IdcardOutlined />, label: "Thông tin tài khoản" },
    { key: "/user/history", icon: <HistoryOutlined />, label: "Lịch sử mua hàng" },
    { key: "/user/setting", icon: <SettingOutlined />, label: "Cài đặt" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        breakpoint="lg"
        className='sider-user-profile'
      >
        <div className="back-to-home" style={{ marginTop: 5, marginLeft: 10 }}>
          <Link to="/">
            <i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ
          </Link>
        </div>
        <div className="avarta-profile">
          {user?.image ? (
            <Image
              className="image-avarta"
              src={user.image}
              alt="Avarta"
            />
          ) : (
            <Image
              className="image-avarta"
              src="./src/assets/Logo_01.jpg"
              alt="Avarta"
            />
          )}
        </div>
        <div className="text-center text-white py-3" style={{fontSize: 16, padding: 3}}>Kính chào {user ? user.firstName : "quý khách"}!</div>
        <Menu
          className="sider-menu color-menu" 
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
        <Content className="content-container" style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}