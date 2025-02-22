

import React, { useEffect, useState, useNavigate } from "react";
import axios from "axios";
import { Layout, Menu, Table, Card, Statistic, Button, Form, Input, Modal, Popconfirm } from "antd";
import { UserOutlined, DashboardOutlined, AppstoreOutlined, PercentageOutlined, InboxOutlined } from "@ant-design/icons";
import CategoryManagement from '../../pages/admin/CategoryManagement/CategoryManagement';
import DiscountManagement from "../../pages/admin/DiscountManagement/DiscountManagement";
import SkinTypeManagement from "../../pages/admin/SkinTypesManagement/SkinTypeManagement";
import ListStaff from "../../pages/admin/StaffManagement/ListStaff";
import ListProduct from "../../pages/admin/ProductManagement/ListProduct";
import BrandManagement from "../../pages/admin/BrandManagement/BrandManagement";
import '../AdminDashboard/AdminDashboard.css'
import cot from '../../assets/cot.jpg';
import tron from '../../assets/tron.jpg';
import api from "../../config/api";
// import { jwtDecode } from "jwt-decode";

const { Header, Content, Sider } = Layout;

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [staff, setStaff] = useState([]);
    const [products, setProduct] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [skinTypes, setSkinTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState("users");

    const [form] = Form.useForm();
    // const navigate = useNavigate();

    // //Kiểm tra quyền truy cập khi vào trang
    // useEffect(() => {
    //     const token = localStorage.getItem("token"); // Lấy token từ localStorage

    //     if (!token) {
    //         message.error("Bạn chưa đăng nhập!");
    //         navigate("/login-and-signup"); // Chuyển hướng về trang login
    //         return;
    //     }

    //     try {
    //         const decodedToken = jwtDecode(token); // Giải mã token
    //         const userRole = decodedToken.role; // Lấy role từ token

    //         if (userRole !== 1 && userRole !== 2) {
    //             message.error("Bạn không có quyền truy cập vào trang này!");
    //             navigate("/"); // Chuyển hướng về trang chủ
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi kiểm tra quyền truy cập:", error);
    //         message.error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại!");
    //         navigate("/login-and-signup");
    //     }
    // }, [navigate]);


    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/users")
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching user data:", error));
    }, []);

    useEffect(() => {
        api.get("/users")
            .then(response => {
                setStaff(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching staff data:", error));
    }, []);

    useEffect(() => {
        api.get("/products")
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching products data:", error));
    }, []);

    useEffect(() => {
        api.get("/brands")
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching brands data:", error));
    }, []);

    useEffect(() => {
        api.get("/categories")
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching category data:", error));
    }, []);

    useEffect(() => {
        api.get("/discounts")
            .then(response => {
                setDiscounts(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching discount data:", error));
    }, []);

    useEffect(() => {
        api.get("/skin-types")
            .then(response => {
                setSkinTypes(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching discount data:", error));
    }, []);



    const userColumns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
    ];

    const menuItems = [
        { key: "dashboard", icon: <DashboardOutlined />, label: "Bảng điều khiển" },
        { key: "users", icon: <UserOutlined />, label: "Khách hàng" },
        { key: "staff", icon: <UserOutlined />, label: "Nhân viên" },
        { key: "products", icon: <InboxOutlined />, label: "Sản phẩm" },
        { key: "brands", icon: <InboxOutlined />, label: "Thương hiệu" },
        { key: "categories", icon: <AppstoreOutlined />, label: "Loại sản phẩm" },
        { key: "discounts", icon: <PercentageOutlined />, label: "Giảm giá" },
        { 
          key: "skinTypes", 
          icon: <i className="fa-solid fa-hand-dots"></i>, 
          label: "Loại da" 
        },
      ];





    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible>
                <div className="back-to-home" style={{ marginTop: 5, marginLeft: 10 }}><a href="/"><i className="fa-solid fa-arrow-left"></i> Quay lại trang chủ</a></div>
                <div className="avarta">
                    <img className="img-avarta" src="./src/assets/Logo_01.jpg" alt="Avarta" />
                </div>
                <div className="logo text-center text-white py-3">
                    Chào mừng Admin PRO đã trở lại!
                </div>
                {/* <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" onClick={(e) => setSelectedMenu(e.key)}>
                    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Bảng điều khiển</Menu.Item>
                    <Menu.Item key="users" icon={<UserOutlined />}>Khách hàng</Menu.Item>
                    <Menu.Item key="staff" icon={<UserOutlined />}>Nhân viên</Menu.Item>
                    <Menu.Item key="products" icon={<InboxOutlined />}>Sản phẩm</Menu.Item>
                    <Menu.Item key="brands" icon={<InboxOutlined />}>Thương hiệu</Menu.Item>
                    <Menu.Item key="categories" icon={<AppstoreOutlined />}>Loại sản phẩm</Menu.Item>
                    <Menu.Item key="discounts" icon={<PercentageOutlined />}>Giảm giá</Menu.Item>
                    <Menu.Item key="skinTypes" icon={<i className="fa-solid fa-hand-dots"></i>}>Loại da</Menu.Item>
                </Menu> */}
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["dashboard"]}
                    mode="inline"
                    onClick={(e) => setSelectedMenu(e.key)}
                    items={menuItems}
                />;
            </Sider>
            <Layout>
                {/* <Header className="bg-primary text-white text-center" style={{ fontSize: 35 }}>Bảng quản lý</Header> */}
                <Content className="p-4">

                    <div className="mt-4" >
                        {selectedMenu === "dashboard" && (
                            <>
                                <div className="row">
                                    <div className="col-md-3">
                                        <Card>
                                            <Statistic title="Total Users" value={users.length} />
                                        </Card>
                                    </div>
                                    <div className="col-md-3">
                                        <Card>
                                            <Statistic title="Total Staff" value={staff.length} />
                                        </Card>
                                    </div>
                                    <div className="col-md-3">
                                        <Card>
                                            <Statistic title="Total Products" value={products.length} />
                                        </Card>
                                    </div>
                                    <div className="col-md-3">
                                        <Card>
                                            <Statistic title="Total Brands" value={brands.length} />
                                        </Card>
                                    </div>
                                    <div className="col-md-3">
                                        <Card>
                                            <Statistic title="Total Categories" value={categories.length} />
                                        </Card>
                                    </div>
                                    <div className="col-md-3">
                                        <Card>
                                            <Statistic title="Total Discounts" value={discounts.length} />
                                        </Card>
                                    </div>
                                    <div className="col-md-3">
                                        <Card>
                                            <Statistic title="Total Skin Types" value={skinTypes.length} />
                                        </Card>
                                    </div>


                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-6">
                                        <img src={cot} alt="Da kho" className='bieudo' />
                                    </div>
                                    <div className="col-md-6">
                                        <img src={tron} alt="Da kho" className='bieudo' />
                                    </div>
                                </div>
                            </>

                        )}
                        {selectedMenu === "users" && <Table columns={userColumns} dataSource={users} loading={loading} rowKey="id" />}
                        {selectedMenu === "staff" && (
                            <div><ListStaff /></div>
                        )}
                        {selectedMenu === "products" && (
                            <div><ListProduct /></div>
                        )}
                        {selectedMenu === "brands" && (
                            <div><BrandManagement /></div>
                        )}
                        {selectedMenu === "categories" && (
                            <div><CategoryManagement /></div>
                        )}
                        {selectedMenu === "discounts" && (
                            <div ><DiscountManagement /></div>
                        )}
                        {selectedMenu === "skinTypes" && (
                            <div><SkinTypeManagement /></div>
                        )}
                    </div>

                </Content>

            </Layout>

        </Layout>
    );
};

export default AdminDashboard;

