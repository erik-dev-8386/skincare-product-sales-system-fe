import React, { useState } from "react";
import { Image, Layout, Menu } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  PercentageOutlined,
  InboxOutlined,
  QuestionOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const { Content, Sider } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/admin", icon: <DashboardOutlined />, label: "Bảng điều khiển" },
    { key: "/admin/list-user", icon: <UserOutlined />, label: "Khách hàng" },
    { key: "/admin/list-staff", icon: <i className="fa-solid fa-user-tie"></i>, label: "Nhân viên" },
    {
      key: "/admin/product-management",
      icon: <i className="fa-solid fa-box"></i>,
      label: "Sản phẩm",
    },
    {
      key: "/admin/order-management",
      icon:  <i className="fa-solid fa-cart-flatbed"></i>,
      label: "Đơn hàng",
    },
   
    {
      key: "/admin/brand-management",
      icon: <i className="fa-brands fa-font-awesome"></i>,
      label: "Thương hiệu",
    },
    {
      key: "/admin/category-management",
      icon: <AppstoreOutlined />,
      label: "Danh mục",
    },
    {
      key: "/admin/discount-management",
      icon: <PercentageOutlined />,
      label: "Giảm giá",
    },
    {
      key: "/admin/skin-type-management",
      icon: <i className="fa-solid fa-hand-dots"></i>,
      label: "Loại da",
    },
    {
      key: "/admin/question-management",
      icon: <i className="fa-solid fa-question"></i>,
      label: "Câu hỏi",
    },
    {
      key: "/admin/answer-management",
      icon: <FireOutlined />,
      label: "Câu trả lời",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={200}
        breakpoint="lg"
        className="sider-admin"
      >
        <div className="back-to-home" style={{ marginTop: 5, marginLeft: 10 }}>
          <Link to="/">
            <i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ
          </Link>
        </div>
        <div className="avarta">
          <Image
            className="img-avarta"
            src="./src/assets/Logo_01.jpg"
            alt="Avarta"
          />
        </div>
        <div className="logo text-center text-white py-3">Chào mừng Admin!</div>
        <Menu
          className="sider-menu"
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
      <Layout className="admin-layout">
        <Content
          className="content-container"
          style={{ marginLeft: collapsed ? 80 : 200 }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;