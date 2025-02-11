import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const BrandManagement = () => {
    const [brandList, setBrandList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingBrand, setEditingBrand] = useState(null);

    const columns = [
        {
            title: 'Brand Name',
            dataIndex: 'brandName',
            key: 'brandName',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div className="button">
                    <Button onClick={() => handleEditBrand(record)} style={{ marginRight: 8 }}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this brand?"
                        onConfirm={() => handleDeleteBrand(record.brandName)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>
                            <i className="fa-solid fa-trash"></i>
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const fetchBrands = async () => {
        try {
            const response = await axios.get('http://localhost:8080/haven-skin/brand');
            setBrandList(response.data);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
        setEditingBrand(null);
    };

    const handleSubmitForm = async (values) => {
        if (editingBrand) {
            try {
                await axios.put(`http://localhost:8080/haven-skin/brand/${editingBrand.brandName}`, values);
                toast.success("Brand updated successfully");
                fetchBrands();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to update brand");
            }
        } else {
            try {
                await axios.post('http://localhost:8080/haven-skin/brand', values);
                toast.success("Brand added successfully");
                fetchBrands();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to add brand");
            }
        }
    };

    const handleEditBrand = (brand) => {
        setEditingBrand(brand);
        form.setFieldsValue(brand);
        handleOpenModal();
    };

    const handleDeleteBrand = async (name) => {
        try {
            await axios.delete(`http://localhost:8080/haven-skin/brand/${name}`);
            toast.success("Brand deleted successfully");
            fetchBrands();
        } catch (error) {
            toast.error("Failed to delete brand");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Brand Management</h1>
            <Button type="primary" onClick={handleOpenModal}>
                Add New Brand
            </Button>
            <Table dataSource={brandList} columns={columns} rowKey="brandName" style={{ marginTop: 16 }} />
            <Modal
                title={editingBrand ? "Edit Brand" : "Create New Brand"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item
                        label="Brand Name"
                        name="brandName"
                        rules={[{ required: true, message: "Brand name can't be empty!" }]}
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
                        label="Country"
                        name="country"
                        rules={[{ required: true, message: "Country can't be empty!" }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BrandManagement;
