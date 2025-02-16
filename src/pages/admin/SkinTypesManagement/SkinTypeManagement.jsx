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
    const [loading, setLoading] = useState(false);

    const columns = [
        { title: 'Skin Type ID', dataIndex: 'skinTypeId', key: 'skinTypeId' },
        { title: 'Skin Name', dataIndex: 'skinName', key: 'skinName' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Min Mark', dataIndex: 'minMark', key: 'minMark' },
        { title: 'Max Mark', dataIndex: 'maxMark', key: 'maxMark' },
        { title: 'Result Tests', dataIndex: 'resultTests', key: 'resultTests' },
        { title: 'Plan Skin Care', dataIndex: 'planSkinCare', key: 'planSkinCare' },
        { title: 'Products', dataIndex: 'products', key: 'products' },
        { title: 'Skin Type Images', dataIndex: 'skinTypeImages', key: 'skinTypeImages' },

        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div className="button">
                    <Button onClick={() => handleEditSkinType(record)} style={{ marginRight: 8 }}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có muốn xóa loại da này không?"
                        onConfirm={() => handleDeleteSkinType(record.skinTypeId)}
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

    const fetchSkinTypes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/haven-skin/skin-types');
            setSkinTypeList(response.data);
        } catch (error) {
            console.error("Error fetching skin types:", error);
        } finally {
            setLoading(false);
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
            values.skinTypeId = editingSkinType.skinTypeId;
            try {
                await axios.put(`http://localhost:8080/haven-skin/skin-types/${editingSkinType.skinTypeId}`, values);
                toast.success("Đã sửa loại da này thành công!");
                fetchSkinTypes();
                handleCloseModal();
            } catch (error) {

                toast.error(error.response?.data?.message || "Sửa loại da này không thành công!");


            }
        } else {
            try {
                await axios.post('http://localhost:8080/haven-skin/skin-types', values);
                toast.success("Đã thêm loại da mới thành công!");
                fetchSkinTypes();
                handleCloseModal();
            } catch (error) {
                toast.error("Thêm loại da mới không thành công!");
            }
        }
    };

    const handleEditSkinType = (skinType) => {
        setEditingSkinType(skinType);
        form.setFieldsValue(skinType);
        handleOpenModal();
    };

    const handleDeleteSkinType = async (skinTypeId) => {
        try {
            await axios.delete(`http://localhost:8080/haven-skin/skin-types/${skinTypeId}`);
            toast.success("Đã xóa loại da này thành công!");
            fetchSkinTypes();
        } catch (error) {
            toast.error("Xóa loại da này không thành công!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Skin Type Management</h1>
            <Button type="primary" onClick={handleOpenModal}>
            <i class="fa-solid fa-plus"></i>
                Add New Skin Type
            </Button>
            <Table loading={loading} dataSource={skinTypeList} columns={columns} rowKey="skinTypeId" style={{ marginTop: 16 }} />
            <Modal
                title={editingSkinType ? "Edit Skin Type" : "Create New Skin Type"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
                okText={editingSkinType ? "Save Changes" : "Create"}
                cancelText="Cancel"
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
