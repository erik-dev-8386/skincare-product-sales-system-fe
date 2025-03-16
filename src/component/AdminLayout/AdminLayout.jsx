import React, { useState, useEffect } from "react";
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
import api from "../../config/api";
import "./AdminLayout.css";
import { jwtDecode } from "jwt-decode";

const { Content, Sider } = Layout;

const AdminLayout = () => {
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
    { key: "/admin", icon: <DashboardOutlined />, label: "Bảng điều khiển" },
    { key: "/admin/list-user", icon: <UserOutlined />, label: "Khách hàng" },
    {
      key: "/admin/list-staff",
      icon: <i className="fa-solid fa-user-tie"></i>,
      label: "Nhân viên",
    },
    {
      key: "/admin/product-management",
      icon: <i className="fa-solid fa-box"></i>,
      label: "Sản phẩm",
    },
    {
      key: "/admin/order-management",
      icon: <i className="fa-solid fa-cart-flatbed"></i>,
      label: "Đơn hàng",
    },
    {
      key: "category-group",
      icon: <AppstoreOutlined />,
      label: "Quản lý mục",
      children: [
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
          key: "/admin/skin-type-management",
          icon: <i className="fa-solid fa-hand-dots"></i>,
          label: "Loại da",
        },
        {
          key: "/admin/discount-management",
          icon: <PercentageOutlined />,
          label: "Giảm giá",
        },
      ],
    },
    {
      key: "qa-group",
      icon: <i className="fa-solid fa-comments"></i>,
      label: "Hỏi đáp",
      children: [
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
      ],
    },
    {
      key: "blog-group",
      icon: <i className="fa-solid fa-blog"></i>,
      label: "Quản lý Blog",
      children: [
        {
          key: "/admin/blog-management",
          icon: <i className="fa-solid fa-file-lines"></i>,
          label: "Bài viết",
        },
        {
          key: "/admin/blog-category",
          icon: <i className="fa-solid fa-tags"></i>,
          label: "Danh mục Blog",
        },
        {
          key: "/admin/blog-hastag",
          icon: <i className="fa-solid fa-hashtag"></i>,
          label: "Hashtag Blog",
        },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        breakpoint="lg"
        className="sider-admin"
      >
        <div className="sider-content">
          <div
            className="back-to-home"
            style={{ marginTop: 5, marginLeft: 10 }}
          >
            <Link to="/">
              <i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ
            </Link>
          </div>
          <div className="avarta">
            {user?.image ? (
              <Image className="img-avarta" size={64} src={user.image} />
            ) : (
              <Image className="img-avarta" size={64} src="./src/assets/Logo_01.jpg" />
            )}
          </div>

          <div className="logo text-center text-white py-3">
            Chào mừng {user ? user.firstName : "Admin"}!
          </div>

          <Menu
            className="sider-menu"
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={(e) => navigate(e.key)}
            items={menuItems}
          />
        </div>
      </Sider>
      <Layout className="admin-layout">
        <Content
          className="content-container"
          style={{
            marginLeft: collapsed ? 80 : 250,
            padding: "20px",
            transition: "margin-left 0.2s",
            minHeight: "100vh",
            width: `calc(100% - ${collapsed ? 80 : 250}px)`,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;