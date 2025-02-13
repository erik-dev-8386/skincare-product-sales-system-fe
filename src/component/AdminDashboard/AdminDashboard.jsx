

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Layout, Menu, Table, Card, Statistic, Button, Form, Input, Modal, Popconfirm } from "antd";
import { UserOutlined, DashboardOutlined, AppstoreOutlined, PercentageOutlined } from "@ant-design/icons";
import CategoryManagement from '../../pages/admin/CategoryManagement/CategoryManagement';
import DiscountManagement from "../../pages/admin/DiscountManagement/DiscountManagement";
import SkinTypeManagement from "../../pages/admin/SkinTypesManagement/SkinTypeManagement";
import '../AdminDashboard/AdminDashboard.css'


const { Header, Content, Sider } = Layout;

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
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
                <div className="avarta">
                    <img className="img-avarta" src="./src/assets/Logo_01.jpg"  alt="Avarta" />
                </div>
                <div className="logo text-center text-white py-3">Chào mừng Admin PRO đã quay trở lại!</div>
                <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" onClick={(e) => setSelectedMenu(e.key)}>
                    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
                    <Menu.Item key="users" icon={<UserOutlined />}>Users</Menu.Item>
                    <Menu.Item key="categories" icon={<AppstoreOutlined />}>Categories</Menu.Item>
                    <Menu.Item key="discounts" icon={<PercentageOutlined />}>Discounts</Menu.Item>
                    <Menu.Item key="skinTypes" icon={<i className="fa-solid fa-hand-dots"></i>}>Skin Types</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className="bg-primary text-white text-center">Admin Dashboard</Header>
                <Content className="p-4">

                    <div className="mt-4" >
                        {selectedMenu === "dashboard" && (
                            <div className="row">
                                <div className="col-md-3">
                                    <Card>
                                        <Statistic title="Total Users" value={users.length} />
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
                        )}
                        {selectedMenu === "users" && <Table columns={userColumns} dataSource={users} loading={loading} rowKey="id" />}
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
            {/* <Modal
                title={editingCategory ? "Edit Category" : "Create New Category"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item
                        label="Category Name"
                        name="categoryName"
                        rules={[{ required: true, message: "Category name can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: "Description can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Usage Instruction"
                        name="usageInstruction"
                        rules={[{ required: true, message: "Usage instruction can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    {editingCategory && (
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: false, message: "Status can't be empty!" }]}
                        >
                            <Input />
                        </Form.Item>
                    )}
                </Form>
            </Modal> */}
        </Layout>
    );
};

export default AdminDashboard;

