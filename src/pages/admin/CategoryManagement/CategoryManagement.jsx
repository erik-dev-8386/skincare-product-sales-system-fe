import { Button, Form, Input, Modal, Table, Popconfirm, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import MyEditor from "../../../component/TinyMCE/MyEditor";

const CategoryManagement = () => {
    const { Option } = Select;
    const [categoryList, setCategoryList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingCategory, setEditingCategory] = useState(null);
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);


    const statusMapping = {
        0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
        1: { text: "CHỜ", color: "orange" },
        2: { text: "HOẠT ĐỘNG", color: "green" },
        3: { text: "ĐÃ XÓA", color: "gray" }
    };

    const columns = [
        // {
        //     title: 'ID danh mục',
        //     dataIndex: 'categoryId',
        //     key: 'categoryId',
        // },
        {
            title: 'Tên danh mục',
            dataIndex: 'categoryName',
            key: 'categoryName',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <div dangerouslySetInnerHTML={{ __html: text && typeof text === "string" ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : "" }} />
            ),
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
            render: (status) => {
                const statusInfo = statusMapping[status] || { text: "KHÔNG BIẾT", color: "default" };
                return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
            }
        },
        {
            title: 'Nút điều khiển',
            key: 'actions',
            render: (text, record) => (
                <div className="button">
                    <Button color="orange" variant="filled" onClick={() => handleEditCategory(record)} style={{ marginRight: 8, border: "2px solid " }}>
                        <i className="fa-solid fa-pen-to-square"></i> Sửa
                    </Button>
                    <Button color="primary" variant="filled" type="default" onClick={() => handleViewDetails(record)} style={{ marginRight: 8, border: "2px solid " }}>
                        <i className="fa-solid fa-eye"></i> Chi tiết
                    </Button>
                    <Popconfirm
                        title="Bạn có muốn xóa giảm giá này không?"
                        onConfirm={() => handleDeleteCategory(record.categoryId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button color="red" variant="filled" style={{ marginRight: 8, border: "2px solid " }} >
                            <i className="fa-solid fa-trash"></i> Xóa
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

    const handleViewDetails = (category) => {
        setSelectedCategory(category);
        setDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setDetailModalOpen(false);
        setSelectedCategory(null);
    };


    const handleSubmitForm = async (values) => {
        if (editingCategory) {
            try {
                await api.put(`/categories/${editingCategory.categoryId}`, values);
                toast.success("Đã cập nhật danh mục thành công!");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Cập nhật danh mục không thành công!");
            }
        } else {
            try {
                const { status, ...newCategory } = values; // Loại bỏ status khi tạo mới
                await api.post('/categories', newCategory);
                toast.success("Đã thêm danh mục mới thành công!");
                fetchCategories();
                handleCloseModal();
            } catch (error) {
                toast.error("Thêm danh mục mới không thành công!");
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
            toast.success("Đã xóa danh mục này thành công!");
            fetchCategories();
        } catch (error) {
            toast.error("Xóa danh mục này không thành công!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Quản lý danh mục</h1>
            <Button type="primary" onClick={handleOpenModal}>
                <i className="fa-solid fa-plus"></i>
                Thêm danh mục mới
            </Button>
            <Table dataSource={categoryList} columns={columns} rowKey="categoryId" style={{ marginTop: 16 }} />
            <Modal
                title={editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
                okText={editingCategory ? "Lưu thay đổi" : "Tạo"}
                cancelText="Hủy"
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item
                        label="Tên danh mục"
                        name="categoryName"
                        rules={[{ required: true, message: "Tên danh mục không được bỏ trống!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Mô tả không được để trống!" }]}>
                        <MyEditor
                            value={form.getFieldValue("description") || ""}
                            onChange={(value) => form.setFieldsValue({ description: value })}
                        />
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
            {/* Modal Chi Tiết */}
            <Modal
                title={<h2>Chi tiết danh mục</h2>}
                open={isDetailModalOpen}
                onCancel={handleCloseDetailModal}
                footer={null}
                width={800}
            >
                {selectedCategory && (
                    <div>
                        <p><strong>ID: </strong> {selectedCategory.categoryId}</p>
                        <p><strong>Tên giảm giá: </strong> {selectedCategory.categoryName}</p>
                        <p><strong>Mô tả: </strong></p>
                        <div dangerouslySetInnerHTML={{ __html: selectedCategory.description }} />
                        <p><strong>Hướng dẫn sử dụng: </strong> {selectedCategory.usageInstruction}</p>
                        <p><strong>Trạng Thái:</strong>
                            {selectedCategory.status !== undefined ? (
                                <Tag color={statusMapping[selectedCategory.status]?.color}>
                                    {statusMapping[selectedCategory.status]?.text}
                                </Tag>
                            ) : "Không xác định"}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CategoryManagement;
