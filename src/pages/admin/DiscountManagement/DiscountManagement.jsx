import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Select } from "antd";
import api from "../../../config/api";

const DiscountManagement = () => {
    const { Option } = Select;
    const [discountList, setDiscountList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingDiscount, setEditingDiscount] = useState(null);


    const statusMapping = {
        0: "EXPIRED",
        1: "UPCOMING",
        2: "ACTIVE",
        3: "DISABLED"
    };

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
            render: (status) => statusMapping[status] || "UNKNOWN",
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div className="button">
                    <Button onClick={() => handleEditDiscount(record)} style={{ marginRight: 8 }}>
                        <i class="fa-solid fa-pen-to-square"></i>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Do you want to delete this discount?"
                        onConfirm={() => handleDeleteDiscount(record.discountId)}
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
        if (editingDiscount) {
            // Edit Discount
            values.discountId = editingDiscount.discountId;
            try {
                await api.put(`/discounts/${editingDiscount.discountId}`, values);
                toast.success("Discount updated successfully!");
                fetchDiscount();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to update discount!");
            }
        } else {
            // Add new Discount
            try {
                await api.post('/discounts', values);
                toast.success("Discount added successfully!");
                fetchDiscount();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to add discount!");
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
            await api.delete(`/discounts/${id}`);
            toast.success("Discount deleted successfully!");
            fetchDiscount();
        } catch (error) {
            toast.error("Failed to delete discount!");
        }
    };

    return (
        <div >
            <ToastContainer />
            <h1>Discount Management</h1>
            <Button type="primary" onClick={handleOpenModal}>
            <i class="fa-solid fa-plus"></i>
                Add new discount
            </Button>
            <Table dataSource={discountList} columns={columns} rowKey="discountId" style={{ marginTop: 16 }} />
            <Modal
                title={editingDiscount ? "Edit Discount" : "Create New Discount"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>

                    <Form.Item
                        label="Discount Name"
                        name="discountName"
                        rules={[{ required: true, message: "Discount Name can't be empty!" }]}
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
                        rules={[{ required: false, message: "Created Time can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Deleted Time"
                        name="deletedTime"
                        rules={[{ required: false, message: "Deleted Time can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Actual Start Time"
                        name="actualStartTime"
                        rules={[{ required: false, message: "Actual Start Time can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Actual End Time"
                        name="actualEndTime"
                        rules={[{ required: false, message: "Actual End Time can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Discount Percent"
                        name="discountPercent"
                        rules={[{ required: true, message: "Discount Percent can't be empty!" }]}
                    >
                        <Input type="number" />
                    </Form.Item>
                   

                    {editingDiscount && (
                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{ required: false, message: "Status can't be empty!" }]}
                        >
                            <Select>
                                <Option value={0}>EXPIRED</Option>
                                <Option value={1}>UPCOMING</Option>
                                <Option value={2}>ACTIVE</Option>
                                <Option value={3}>DISABLED</Option>
                            </Select>
                        </Form.Item>
                    )}

                </Form>
            </Modal>
        </div>
    );
};

export default DiscountManagement;