import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const DiscountManagement = () => {
    const [discountList, setDiscountList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingDiscount, setEditingDiscount] = useState(null);

    const columns = [
        {
            title: 'Discount ID',
            dataIndex: 'discountId',
            key: 'discountId',
        },
        {
            title: 'Discount Name',
            dataIndex: 'discountName',
            key: 'discountName',
        },
        {
            title: 'Discount Code',
            dataIndex: 'discountCode',
            key: 'discountCode',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created Time',
            dataIndex: 'createdTime',
            key: 'createdTime',
            // render: (text) => text ? dayjs(text).format('DD-MM-YYYY ss:mm:HH') : 'N/A',
        },
        {
            title: 'Deleted Time',
            dataIndex: 'deletedTime',
            key: 'deletedTime',
        },
        {
            title: 'ActualStart Time',
            dataIndex: 'actualStartTime',
            key: 'actualStartTime',
            // render: (text) => text ? dayjs(text).format('DD-MM-YYYY ss:mm:HH') : 'N/A',
        },
        {
            title: 'Actual End Time',
            dataIndex: 'actualEndTime',
            key: 'actualEndTime',
        },
        {
            title: 'Discount Percent',
            dataIndex: 'discountPercent',
            key: 'discountPercent',
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
                <div className="button">
                    <Button onClick={() => handleEditDiscount(record)} style={{ marginRight: 8 }}>
                        <i class="fa-solid fa-pen-to-square"></i>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắt muốn xóa Discount này không?"
                        onConfirm={() => handleDeleteDiscount(record.discountId)}
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

    const fetchDiscount = async () => {
        try {
            const response = await axios.get('http://localhost:8080/haven-skin/discounts');
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
        if (editingDiscount) {
            // Edit Discount
            values.discountId = editingDiscount.discountId;
            try {
                await axios.put(`http://localhost:8080/haven-skin/discounts/${editingDiscount.discountId}`, values);
                toast.success("Discount đã sửa thành công");
                fetchDiscount();
                handleCloseModal();
            } catch (error) {
                toast.error("Sửa discount không thành công!");
            }
        } else {
            // Add new Discount
            try {
                await axios.post('http://localhost:8080/haven-skin/discounts', values);
                toast.success("Discount đã thêm thành công");
                fetchDiscount();
                handleCloseModal();
            } catch (error) {
                toast.error("Thêm discount không thành công!");
            }
        }
    };

    const handleEditDiscount = (Discount) => {
        setEditingDiscount(Discount);
        form.setFieldsValue(Discount);
        handleOpenModal();
    };

    const handleDeleteDiscount = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/haven-skin/discounts/${id}`);
            toast.success("Discount đã xóa thành công!");
            fetchDiscount();
        } catch (error) {
            toast.error("Xóa discount không thành công!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Quản lý giảm giá</h1>
            <Button type="primary" onClick={handleOpenModal}>
                <box-icon name='discount' type='solid' color='#fffdfd' ></box-icon>
                Thêm Discount mới
            </Button>
            <Table dataSource={discountList} columns={columns} rowKey="discountId" style={{ marginTop: 16 }} />
            <Modal
                title={editingDiscount ? "Edit Discount" : "Create New Discount"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    {/* <Form.Item
                        label="Discount ID"
                        name="discountId"
                        rules={[{ required: false, message: "Code can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item> */}
                    <Form.Item
                        label="Discount Name"
                        name="discountName"
                        rules={[{ required: true, message: "Discount name can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Discount Code"
                        name="discountCode"
                        rules={[{ required: true, message: "Discount Code can't be empty!" }]}
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
                        label="Created Time"
                        name="createdTime"
                        rules={[{ required: false, message: "Code can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Deleted Time"
                        name="deletedTime"
                        rules={[{ required: false, message: "Code can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Actual Start Time"
                        name="actualStartTime"
                        rules={[{ required: false, message: "Code can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Actual End Time"
                        name="actualEndTime"
                        rules={[{ required: false, message: "Code can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Discount Percent"
                        name="discountPercent"
                        rules={[{ required: true, message: "Discount Percent can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    {editingDiscount && (
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

export default DiscountManagement;