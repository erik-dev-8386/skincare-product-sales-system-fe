import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const SkinTypeManagement = () => {
    const [skinTypeList, setSkinTypeList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingSkinType, setEditingSkinType] = useState(null);

    const columns = [
        { title: 'Skin Name', dataIndex: 'skinName', key: 'skinName' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Min Mark', dataIndex: 'minMark', key: 'minMark' },
        { title: 'Max Mark', dataIndex: 'maxMark', key: 'maxMark' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div className="button">
                    <Button onClick={() => handleEditSkinType(record)} style={{ marginRight: 8 }}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this skin type?"
                        onConfirm={() => handleDeleteSkinType(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const fetchSkinTypes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/haven-skin/skin-types');
            setSkinTypeList(response.data);
        } catch (error) {
            console.error("Error fetching skin types:", error);
        }
    };

    useEffect(() => {
        fetchSkinTypes();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
        setEditingSkinType(null);
    };

    const handleSubmitForm = async (values) => {
        if (editingSkinType) {
            values.id = editingSkinType.id;
            try {
                await axios.put(`http://localhost:8080/haven-skin/skin-types/${editingSkinType.id}`, values);
                toast.success("Skin type updated successfully");
                fetchSkinTypes();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to update skin type");
            }
        } else {
            try {
                await axios.post('http://localhost:8080/haven-skin/skin-types', values);
                toast.success("Skin type added successfully");
                fetchSkinTypes();
                handleCloseModal();
            } catch (error) {
                toast.error("Failed to add skin type");
            }
        }
    };

    const handleEditSkinType = (skinType) => {
        setEditingSkinType(skinType);
        form.setFieldsValue(skinType);
        handleOpenModal();
    };

    const handleDeleteSkinType = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/haven-skin/skin-types/${id}`);
            toast.success("Skin type deleted successfully!");
            fetchSkinTypes();
        } catch (error) {
            toast.error("Failed to delete skin type");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Skin Type Management</h1>
            <Button type="primary" onClick={handleOpenModal}>
                Add New Skin Type
            </Button>
            <Table dataSource={skinTypeList} columns={columns} rowKey="id" style={{ marginTop: 16 }} />
            <Modal
                title={editingSkinType ? "Edit Skin Type" : "Create New Skin Type"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item label="Skin Name" name="skinName" rules={[{ required: true, message: "Skin name is required!" }]}> 
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description is required!" }]}> 
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Min Mark" name="minMark"> 
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Max Mark" name="maxMark"> 
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SkinTypeManagement;
