import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";

const CategoryManagement = () => {
    const { Option } = Select;
    const [categoryList, setCategoryList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingCategory, setEditingCategory] = useState(null);


    const statusMapping = {
        0: "KHÔNG HOẠT ĐỘNG",
        1: "CHỜ",
        2: "HOẠT ĐỘNG",
        3: "ĐÃ XÓA"
    };

    const columns = [
        {
            title: 'ID loại sản phẩm',
            dataIndex: 'categoryId',
            key: 'categoryId',
        },
        {
            title: 'Tên loại sản phẩm',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Hướng dẫn sử dụng',
            dataIndex: 'usageInstruction',
            key: 'usageInstruction',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => statusMapping[status] || "UNKNOWN",
        },
        {
            title: 'Nút điều khiển',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button onClick={() => handleEditCategory(record)} style={{ marginRight: 8 }}>
                        <i class="fa-solid fa-pen-to-square"></i>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có muốn xóa loại sản phẩm này không?"
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
            const response = await api.get('/categories');
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
                await api.put(`/categories/${editingCategory.categoryId}`, values);
                toast.success("Đã cập nhật loại sản phẩm thành công!");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Cập nhật loại sản phẩm không thành công!");
            }
        } else {
            try {
                const { status, ...newCategory } = values; // Loại bỏ status khi tạo mới
                await api.post('/categories', newCategory);
                toast.success("Đã thêm loại sản phẩm mới thành công!");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Thêm loại sản phẩm mới không thành công!");
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
            await api.delete(`/categories/${categoryId}`);
            toast.success("Đã xóa loại sản phẩm này thành công!");
            fetchCategories();
        } catch (error) {
            toast.error("Xóa loại sản phẩm này không thành công!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Quản lý loại sản phẩm</h1>
            <Button type="primary" onClick={handleOpenModal}>
            <i class="fa-solid fa-plus"></i>
            Thêm loại sản phẩm mới
            </Button>
            <Table dataSource={categoryList} columns={columns} rowKey="categoryId" style={{ marginTop: 16 }} />
            <Modal
                title={editingCategory ? "Chỉnh sửa loại sản phẩm" : "Tạo loại sản phẩm mới"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
                okText={editingCategory ? "Lưu thay đổi" : "Tạo"}
                cancelText="Hủy"
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item
                        label="Tên loại sản phẩm"
                        name="categoryName"
                        rules={[{ required: true, message: "Tên loại sản phẩm không được bỏ trống!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Mô tả không được bỏ trống!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Hướng dẫn sử dụng"
                        name="usageInstruction"
                        rules={[{ required: true, message: "Hướng dẫn sử dụng không được bỏ trống!" }]}
                    >
                        <Input />
                    </Form.Item>
                  

                    {editingCategory && (
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: false, message: "Trạng thái không được bỏ trống!" }]}
                        >
                            <Select>
                                <Option value={0}>KHÔNG HOẠT ĐỘNG</Option>
                                <Option value={1}>CHỜ</Option>
                                <Option value={2}>HOẠT ĐỘNG</Option>
                                <Option value={3}>ĐÃ XÓA</Option>
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement;
