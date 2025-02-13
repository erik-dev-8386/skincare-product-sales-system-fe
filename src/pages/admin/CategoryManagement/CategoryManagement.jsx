import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";

const CategoryManagement = () => {
    const [categoryList, setCategoryList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingCategory, setEditingCategory] = useState(null);

    const columns = [
        {
            title: 'Category ID',
            dataIndex: 'categoryId',
            key: 'categoryId',
        },
        {
            title: 'Category Name',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Usage Instruction',
            dataIndex: 'usageInstruction',
            key: 'usageInstruction',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleEditCategory(record)} style={{ marginRight: 8 }}>
                    <i class="fa-solid fa-pen-to-square"></i>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắt muốn xóa category này không?"
                        onConfirm={() => handleDeleteCategory(record.categoryId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>
                            <i class="fa-solid fa-trash"></i>
                            Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/haven-skin/category');
            setCategoryList(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
        setEditingCategory(null);
    };

    const handleSubmitForm = async (values) => {
        if (editingCategory) {
            try {
                await axios.put(`http://localhost:8080/haven-skin/category/${editingCategory.categoryId}`, values);
                toast.success("Cập nhật category thành công!");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Cập nhật category không thành công!");
            }
        } else {
            try {
                const { status, ...newCategory } = values; // Loại bỏ status khi tạo mới
                await axios.post('http://localhost:8080/haven-skin/category', newCategory);
                toast.success("Thêm category thành công");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Thêm category không thành công!");
            }
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        form.setFieldsValue(category);
        handleOpenModal();
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            await axios.delete(`http://localhost:8080/haven-skin/category/${categoryId}`);
            toast.success("Xóa category thành công!");
            fetchCategories();
        } catch (error) {
            toast.error("Xóa category không thành công!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Quản lý loại sản phẩm</h1>
            <Button type="primary" onClick={handleOpenModal}>
                <box-icon name='category' type='solid' color='#ffffff' ></box-icon>
                Thêm category mới
            </Button>
            <Table dataSource={categoryList} columns={columns} rowKey="categoryId" style={{ marginTop: 16 }} />
            <Modal
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
            </Modal>
        </div>
    );
};

export default CategoryManagement;
