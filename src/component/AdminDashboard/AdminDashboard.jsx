

import React, { useEffect, useState } from "react";
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
    // const [isModalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();
    // const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/users")
            .then(response => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching user data:", error));
    }, []);

    useEffect(() => {
        axios.get("https://jsonplaceholder.typicode.com/staff")
            .then(response => {
                setStaff(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching staff data:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/haven-skin/products")
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching products data:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/haven-skin/brands")
            .then(response => {
                setProduct(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching brands data:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/haven-skin/category")
            .then(response => {
                setCategories(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching category data:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/haven-skin/discounts")
            .then(response => {
                setDiscounts(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching discount data:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/haven-skin/skin-types")
            .then(response => {
                setSkinTypes(response.data);
                setLoading(false);
            })
            .catch(error => console.error("Error fetching discount data:", error));
    }, []);

    // const handleOpenModal = () => {
    //     setModalOpen(true);
    // };

    // const handleCloseModal = () => {
    //     setModalOpen(false);
    //     form.resetFields();
    //     setEditingCategory(null);
    // };

    // const handleSubmitForm = async (values) => {
    //     if (editingCategory) {
    //         try {
    //             await axios.put(`http://localhost:8080/haven-skin/category/${editingCategory.categoryId}`, values);
    //             fetchCategories();
    //             handleCloseModal();
    //         } catch (error) {
    //             console.error("Error updating category:", error);
    //         }
    //     } else {
    //         try {
    //             await axios.post("http://localhost:8080/haven-skin/category", values);
    //             fetchCategories();
    //             handleCloseModal();
    //         } catch (error) {
    //             console.error("Error adding category:", error);
    //         }
    //     }
    // };

    // const handleEditCategory = (category) => {
    //     setEditingCategory(category);
    //     form.setFieldsValue(category);
    //     handleOpenModal();
    // };

    // const handleDeleteCategory = async (categoryId) => {
    //     try {
    //         await axios.delete(`http://localhost:8080/haven-skin/category/${categoryId}`);
    //         fetchCategories();
    //     } catch (error) {
    //         console.error("Error deleting category:", error);
    //     }
    // };

    const userColumns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Email", dataIndex: "email", key: "email" },
    ];

    // const categoryColumns = [
    //     { title: "Category ID", dataIndex: "categoryId", key: "categoryId" },
    //     { title: "Category Name", dataIndex: "categoryName", key: "categoryName" },
    //     { title: "Description", dataIndex: "description", key: "description" },
    //     { title: "Usage Instruction", dataIndex: "usageInstruction", key: "usageInstruction" },
    //     { title: "Status", dataIndex: "status", key: "status" },
    //     {
    //         title: "Actions",
    //         key: "actions",
    //         render: (text, record) => (
    //             <div>
    //                 <Button onClick={() => handleEditCategory(record)} style={{ marginRight: 8 }}>Edit</Button>
    //                 <Popconfirm
    //                     title="Are you sure to delete this category?"
    //                     onConfirm={() => handleDeleteCategory(record.categoryId)}
    //                     okText="Yes"
    //                     cancelText="No"
    //                 >
    //                     <Button danger>Delete</Button>
    //                 </Popconfirm>
    //             </div>
    //         ),
    //     },
    // ];

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
                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" onClick={(e) => setSelectedMenu(e.key)}>
                    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item key="users" icon={<UserOutlined />}>Users</Menu.Item>
                    <Menu.Item key="staff" icon={<UserOutlined />}>Staff</Menu.Item>
                    <Menu.Item key="products" icon={<InboxOutlined />}>Products</Menu.Item>
                    <Menu.Item key="brands" icon={<InboxOutlined />}>Brands</Menu.Item>
                    <Menu.Item key="categories" icon={<AppstoreOutlined />}>Categories</Menu.Item>
                    <Menu.Item key="discounts" icon={<PercentageOutlined />}>Discounts</Menu.Item>
                    <Menu.Item key="skinTypes" icon={<i className="fa-solid fa-hand-dots"></i>}>Skin Types</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="bg-primary text-white text-center" style={{ fontSize: 35 }}>Bảng quản lý</Header>
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

