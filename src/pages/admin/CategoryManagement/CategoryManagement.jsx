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
                        Edit
                    </Button>
                    <Popconfirm
                        title="Do you want to delete this category?"
                        onConfirm={() => handleDeleteCategory(record.categoryId)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>
                            <i class="fa-solid fa-trash"></i>
                           Delete
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
                toast.success("Category updated successfully!");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to update category!");
            }
        } else {
            try {
                const { status, ...newCategory } = values; // Loại bỏ status khi tạo mới
                await axios.post('http://localhost:8080/haven-skin/category', newCategory);
                toast.success("Category added successfully!");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to add category!");
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
            toast.success("Discount deleted successfully!");
            fetchCategories();
        } catch (error) {
            toast.error("Failed to delete discount!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Category Management</h1>
            <Button type="primary" onClick={handleOpenModal}>
                <box-icon name='category' type='solid' color='#ffffff' ></box-icon>
                Add new category
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
