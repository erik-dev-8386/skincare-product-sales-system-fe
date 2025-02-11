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
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => handleEditCategory(record)} style={{ marginRight: 8 }}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this category?"
                        onConfirm={() => handleDeleteCategory(record.categoryName)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/haven-skin/categories');
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
                await axios.put(`http://localhost:8080/haven-skin/categories/${editingCategory.categoryName}`, values);
                toast.success("Category updated successfully");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to update category!");
            }
        } else {
            try {
                await axios.post('http://localhost:8080/haven-skin/categories', values);
                toast.success("Category added successfully");
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

    const handleDeleteCategory = async (name) => {
        try {
            await axios.delete(`http://localhost:8080/haven-skin/categories/${name}`);
            toast.success("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            toast.error("Failed to delete category!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Category Management</h1>
            <Button type="primary" onClick={handleOpenModal}>Add New Category</Button>
            <Table dataSource={categoryList} columns={columns} rowKey="categoryName" style={{ marginTop: 16 }} />
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
                        <Input disabled={!!editingCategory} />
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
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;
