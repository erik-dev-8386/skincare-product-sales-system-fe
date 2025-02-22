import { Button, Form, Input, Modal, Table, Popconfirm, DatePicker } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Select } from "antd";
import api from "../../../config/api";
import dayjs from "dayjs";

const DiscountManagement = () => {
    const { Option } = Select;
    const [discountList, setDiscountList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingDiscount, setEditingDiscount] = useState(null);




    const statusMapping = {
        0: "HẾT HẠN",
        1: "SẮP TỚI",
        2: "HOẠT ĐỘNG",
        3: "BỊ VÔ HIỆU HÓA"
    };

    const columns = [
        {
            title: 'ID giảm giá',
            dataIndex: 'discountId',
            key: 'discountId',
        },
        {
            title: 'Tên giảm giá',
            dataIndex: 'discountName',
            key: 'discountName',
        },
        {
            title: 'Mã giảm giá',
            dataIndex: 'discountCode',
            key: 'discountCode',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdTime',
            key: 'createdTime',
            render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",

        },
        {
            title: 'Ngày xóa',
            dataIndex: 'deletedTime',
            key: 'deletedTime',
            render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
        },
        {
            title: 'Ngày áp dụng',
            dataIndex: 'actualStartTime',
            key: 'actualStartTime',
            render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",

        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'actualEndTime',
            key: 'actualEndTime',
            render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
        },
        {
            title: 'Phần trăm giảm giá',
            dataIndex: 'discountPercent',
            key: 'discountPercent',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => statusMapping[status] || "KHÔNG BIẾT",
        },
        {
            title: 'Nút điều khiển',
            key: 'actions',
            render: (text, record) => (
                <div className="button">
                    <Button onClick={() => handleEditDiscount(record)} style={{ marginRight: 8 }}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có muốn xóa giảm giá này không?"
                        onConfirm={() => handleDeleteDiscount(record.discountId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger>
                            <i className="fa-solid fa-trash"></i>
                            Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const fetchDiscount = async () => {
        try {
            const response = await api.get('/discounts');
            setDiscountList(response.data);
        } catch (error) {
            console.error("Error fetching Discounts:", error);
        }
    };

    useEffect(() => {
        fetchDiscount();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
        setEditingDiscount(null);
    };

    const handleSubmitForm = async (values) => {

        // Chuyển đổi ngày về dạng YYYY-MM-DD
    const formattedValues = {
        ...values,
        createdTime: values.createdTime?.format('YYYY-MM-DD'),
        deletedTime: values.deletedTime?.format('YYYY-MM-DD'),
        actualStartTime: values.actualStartTime?.format('YYYY-MM-DD'),
        actualEndTime: values.actualEndTime?.format('YYYY-MM-DD'),
    };
        if (editingDiscount) {
            // Chỉnh sửa giảm giá
            formattedValues.discountId = editingDiscount.discountId;
            try {
                await api.put(`/discounts/${editingDiscount.discountId}`, formattedValues);
                toast.success("Đã cập nhật giảm giá thành công!");
                fetchDiscount();
                handleCloseModal();
            } catch (error) {
                toast.error("Cập nhật giảm giá không thành công!");
            }
        } else {
            // Add new Discount
            try {
                await api.post('/discounts', formattedValues);
                toast.success("Đã thêm giảm giá thành công!");
                fetchDiscount();
                handleCloseModal();
            } catch (error) {
                toast.error("Thêm giảm giá không thành công!");
            }
        }
    };

    const handleEditDiscount = (Discount) => {
        setEditingDiscount(Discount);
        form.setFieldsValue({
            ...Discount,
            createdTime: Discount.createdTime ? dayjs(Discount.createdTime) : null,
            deletedTime: Discount.deletedTime ? dayjs(Discount.deletedTime) : null,
            actualStartTime: Discount.actualStartTime ? dayjs(Discount.actualStartTime) : null,
            actualEndTime: Discount.actualEndTime ? dayjs(Discount.actualEndTime) : null,
        });
        handleOpenModal();
    };

    const handleDeleteDiscount = async (id) => {
        try {
            await api.delete(`/discounts/${id}`);
            toast.success("Đã xóa giảm giá thành công!");
            fetchDiscount();
        } catch (error) {
            toast.error("Xóa giảm giá không thành công!");
        }
    };

    return (
        <div >
            <ToastContainer />
            <h1>Quản lý giảm giá</h1>
            <Button type="primary" onClick={handleOpenModal}>
                <i className="fa-solid fa-plus"></i>
                Thêm giảm giá mới
            </Button>
            <Table dataSource={discountList} columns={columns} rowKey="discountId" style={{ marginTop: 16 }} />
            <Modal
                title={editingDiscount ? "Chỉnh sửa giảm giá" : "Tạo giảm giá mới"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
                okText={editingDiscount ? "Lưu thay đổi" : "Tạo"}
                cancelText="Hủy"
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>

                    <Form.Item
                        label="Tên giảm giá"
                        name="discountName"
                        rules={[{ required: true, message: "Tên giảm giá không được để trống!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mã giảm giá"
                        name="discountCode"
                        rules={[{ required: true, message: "Mã giảm giá không được để trống!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: "Mô tả không được để trống!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Ngày tạo"
                        name="createdTime"
                        rules={[{ required: false, message: "Ngày tạo không được để trống!" }]}
                    >
                        <DatePicker value={dayjs()} format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày xóa"
                        name="deletedTime"
                        rules={[{ required: false, message: "Ngày xóa không được để trống!" }]}
                    >
                        <DatePicker value={dayjs()} format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày áp dụng"
                        name="actualStartTime"
                        rules={[{ required: false, message: "Ngày áp dụng không được để trống!" }]}
                    >
                        <DatePicker value={dayjs()} format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày hết hạn"
                        name="actualEndTime"
                        rules={[{ required: false, message: "Ngày hết hạn không được để trống!" }]}
                    >
                        <DatePicker value={dayjs()} format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                        label="Phần trăm giảm giá"
                        name="discountPercent"
                        rules={[
                            { required: true, message: "Phần trăm giảm giá không được để trống!" },
                            // { type: "number", min: 0, max: 100, message: "Giá trị phải từ 0 đến 100!" },
                        ]}
                    >
                        <Input type="number" />
                    </Form.Item>


                    {editingDiscount && (
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                            rules={[{ required: false, message: "Trạng thái không được để trống!" }]}
                        >
                            <Select>
                                <Option value={0}>HẾT HẠN</Option>
                                <Option value={1}>SẮP TỚI</Option>
                                <Option value={2}>HOẠT ĐỘNG</Option>
                                <Option value={3}>BỊ VÔ HIỆU HÓA</Option>
                            </Select>
                        </Form.Item>
                    )}

                </Form>
            </Modal>
        </div>
    );
};

export default DiscountManagement;