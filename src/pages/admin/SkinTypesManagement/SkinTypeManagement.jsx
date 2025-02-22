// import { Button, Form, Input, Modal, Table, Popconfirm } from "antd";
// import { useForm } from "antd/es/form/Form";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import api from "../../../config/api";
// import { Select } from 'antd';
// import { useCallback } from "react";


// const SkinTypeManagement = () => {
//     const [skinTypeList, setSkinTypeList] = useState([]);
//     const [isModalOpen, setModalOpen] = useState(false);
//     const [form] = useForm();
//     const [editingSkinType, setEditingSkinType] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const { Option } = Select;

//     const statusMapping = {
//         1: "ACTIVE",
//         2: "INACTIVE",
//         3: "DELETED"
//     };

//     const columns = [
//         { title: 'Skin Type ID', dataIndex: 'skinTypeId', key: 'skinTypeId' },
//         { title: 'Skin Name', dataIndex: 'skinName', key: 'skinName' },
//         { title: 'Description', dataIndex: 'description', key: 'description' },
//         { title: 'Min Mark', dataIndex: 'minMark', key: 'minMark' },
//         { title: 'Max Mark', dataIndex: 'maxMark', key: 'maxMark' },
//         { title: 'Result Tests', dataIndex: 'resultTests', key: 'resultTests' },
//         { title: 'Plan Skin Care', dataIndex: 'planSkinCare', key: 'planSkinCare' },
//         { title: 'Products', dataIndex: 'products', key: 'products' },
//         { title: 'Skin Type Images', dataIndex: 'skinTypeImages', key: 'skinTypeImages' },
//         {
//             title: 'Status',
//             dataIndex: 'status',
//             key: 'status',
//             render: (status) => statusMapping[status] || "UNKNOWN",
//         },

//         {
//             title: 'Actions',
//             key: 'actions',
//             render: (text, record) => (
//                 <div className="button">
//                     <Button onClick={() => handleEditSkinType(record)} style={{ marginRight: 8 }}>
//                         <i className="fa-solid fa-pen-to-square"></i>
//                         Sửa
//                     </Button>
//                     <Popconfirm
//                         title="Bạn có muốn xóa loại da này không?"
//                         onConfirm={() => handleDeleteSkinType(record.skinTypeId)}
//                         okText="Có"
//                         cancelText="Không"
//                     >
//                         <Button danger>
//                             <i className="fa-solid fa-trash"></i>
//                             Xóa
//                         </Button>
//                     </Popconfirm>
//                 </div>
//             ),
//         },
//     ];


//     const fetchSkinTypes = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.get('/skin-types');
//             setSkinTypeList(response.data);
//         } catch (error) {
//             console.error("Error fetching skin types:", error.response?.data?.message || error.message);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchSkinTypes();
//     }, [fetchSkinTypes]);


//     const handleOpenModal = () => {
//         setModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setModalOpen(false);
//         form.resetFields();
//         setEditingSkinType(null);
//     };

//     const handleSubmitForm = async (values) => {
//         if (editingSkinType) {
//             values.skinTypeId = editingSkinType.skinTypeId;
//             try {
//                 await api.put(`/skin-types/${editingSkinType.skinTypeId}`, values);
//                 toast.success("Đã sửa loại da này thành công!");
//                 fetchSkinTypes();
//                 handleCloseModal();
//             } catch (error) {

//                 toast.error(error.response?.data?.message || "Sửa loại da này không thành công!");


//             }
//         } else {
//             try {
//                 await api.post('/skin-types', values);
//                 toast.success("Đã thêm loại da mới thành công!");
//                 fetchSkinTypes();
//                 handleCloseModal();
//             } catch (error) {
//                 toast.error("Thêm loại da mới không thành công!");
//             }
//         }
//     };

//     const handleEditSkinType = (skinType) => {
//         setEditingSkinType(skinType);
//         form.setFieldsValue(skinType);
//         setModalOpen(true);
//     };

//     const handleDeleteSkinType = async (skinTypeId) => {
//         try {
//             await api.delete(`/skin-types/${skinTypeId}`);
//             toast.success("Đã xóa loại da này thành công!");
//             fetchSkinTypes();
//         } catch (error) {
//             toast.error("Xóa loại da này không thành công!");
//         }
//     };

//     return (
//         <div>
//             <ToastContainer />
//             <h1>Skin Type Management</h1>
//             <Button type="primary" onClick={handleOpenModal}>
//                 <i className="fa-solid fa-plus"></i>
//                 Add New Skin Type
//             </Button>
//             <Table loading={loading} dataSource={skinTypeList} columns={columns} rowKey="skinTypeId" style={{ marginTop: 16 }} />
//             <Modal
//                 title={editingSkinType ? "Chỉnh sửa loại da" : "Tạo loại da mới"}
//                 open={isModalOpen}
//                 onCancel={handleCloseModal}
//                 onOk={() => form.submit()}
//                 okText={editingSkinType ? "Lưu thay đổi" : "Create"}
//                 cancelText="Cancel"
//             >
//                 <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
//                     <Form.Item label="Skin Name" name="skinName" rules={[{ required: true, message: "Skin name is required!" }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item label="Description" name="description" rules={[{ required: true, message: "Description is required!" }]}>
//                         <Input.TextArea />
//                     </Form.Item>
//                     <Form.Item label="Min Mark" name="minMark">
//                         <Input type="number" />
//                     </Form.Item>
//                     <Form.Item label="Max Mark" name="maxMark">
//                         <Input type="number" />
//                     </Form.Item>
//                     {editingSkinType && (
//                         <Form.Item
//                             label="Status"
//                             name="status"
//                             rules={[{ required: false, message: "Status can't be empty!" }]}
//                         >
//                             <Select>
//                                 <Option value={1}>ACTIVE</Option>
//                                 <Option value={2}>INACTIVE</Option>
//                                 <Option value={3}>DELETED</Option>
//                             </Select>
//                         </Form.Item>
//                     )}
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default SkinTypeManagement;


//=============================================================================

import { Button, Form, Input, Modal, Table, Popconfirm, Upload, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../config/api";
import axios from "axios";

const SkinTypeManagement = () => {
    const [skinTypeList, setSkinTypeList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingSkinType, setEditingSkinType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const { Option } = Select;

    const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dawyqsudx/upload";
    const CLOUDINARY_UPLOAD_PRESET = "haven-skin-03-2025";

    const statusMapping = {
        1: "HOẠT ĐỘNG",
        2: "KHÔNG HOẠT ĐỘNG",
        3: "ĐÃ XÓA"
    };

    const columns = [
        { title: 'ID loại da', dataIndex: 'skinTypeId', key: 'skinTypeId' },
        { title: 'Tên loại da', dataIndex: 'skinName', key: 'skinName' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Điểm tối thiểu', dataIndex: 'minMark', key: 'minMark' },
        { title: 'Điểm tối đa', dataIndex: 'maxMark', key: 'maxMark' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => statusMapping[status] || "KHÔNG BIẾT" },
        {
            title: 'Ảnh',
            dataIndex: 'skinTypeImages',
            key: 'skinTypeImages',
            render: (image) => image ? <img src={image} alt="Skin Type" style={{ width: 50, height: 50 }} /> : "Không có ảnh"
        },
        {
            title: 'Nút điều khiển',
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

    const fetchSkinTypes = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/skin-types');
            setSkinTypeList(response.data);
        } catch (error) {
            console.error("Error fetching skin types:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSkinTypes();
    }, [fetchSkinTypes]);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        form.resetFields();
        setEditingSkinType(null);
        setImageFile(null);
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
            console.log("Cloudinary URL:", response.data.secure_url);

            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Lỗi tải ảnh lên Cloudinary!");
            return null;
        }
    };

    const handleSubmitForm = async (values) => {
        let imageUrl = editingSkinType?.skinTypeImages || null;

        if (imageFile) {
            imageUrl = await uploadImageToCloudinary(imageFile);
            if (!imageUrl) return;
        }

        const payload = { ...values, skinTypeImages: imageUrl };

        if (editingSkinType) {
            payload.skinTypeId = editingSkinType.skinTypeId;
            try {
                await api.put(`/skin-types/${editingSkinType.skinTypeId}`, payload);
                toast.success("Đã sửa loại da này thành công!");
                fetchSkinTypes();
                handleCloseModal();
            } catch (error) {
                toast.error(error.response?.data?.message || "Sửa loại da không thành công!");
            }
        } else {
            try {
                await api.post('/skin-types', payload);
                console.log("Payload gửi đến backend:", payload);
                toast.success("Đã thêm loại da mới thành công!");
                fetchSkinTypes();
                handleCloseModal();
            } catch (error) {
                toast.error("Thêm loại da không thành công!");
            }
        }
    };

    const handleEditSkinType = (skinType) => {
        setEditingSkinType(skinType);
        form.setFieldsValue(skinType);
        setModalOpen(true);
    };

    const handleDeleteSkinType = async (skinTypeId) => {
        try {
            await api.delete(`/skin-types/${skinTypeId}`);
            toast.success("Đã xóa loại da này thành công!");
            fetchSkinTypes();
        } catch (error) {
            toast.error("Xóa loại da không thành công!");
        }
    };

    return (
        <div>
            <ToastContainer />
            <h1>Quản lý loại da</h1>
            <Button type="primary" onClick={handleOpenModal}>
                <i className="fa-solid fa-plus"></i>
                Thêm loại da mới
            </Button>
            <Table loading={loading} dataSource={skinTypeList} columns={columns} rowKey="skinTypeId" style={{ marginTop: 16 }} />
            <Modal
                title={editingSkinType ? "Chỉnh sửa loại da" : "Tạo loại da mới"}
                open={isModalOpen}
                onCancel={handleCloseModal}
                onOk={() => form.submit()}
                okText={editingSkinType ? "Lưu thay đổi" : "Tạo"}
                cancelText="Hủy"
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item label="Tên loại da" name="skinName" rules={[{ required: true, message: "Tên loại da không được để trống!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item label="Điểm tối thiểu" name="minMark">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Điểm tối đa" name="maxMark">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Tải hình ảnh lên">
                        <Upload beforeUpload={(file) => { setImageFile(file); return false; }} showUploadList={false}>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                        {editingSkinType?.skinTypeImages && <img src={editingSkinType.skinTypeImages} alt="Preview" style={{ width: 100, marginTop: 8 }} />}
                    </Form.Item>
                    {editingSkinType && (
                         <Form.Item
                             label="Trạng thái"
                             name="status"
                             rules={[{ required: false, message: "Status can't be empty!" }]}
                         >
                             <Select>
                                 <Option value={1}>HOẠT ĐỘNG</Option>
                                 <Option value={2}>KHÔNG HOẠT ĐỘNG</Option>
                                 <Option value={3}>ĐÃ XÓA</Option>
                             </Select>
                         </Form.Item>
                     )}
                </Form>
            </Modal>
        </div>
    );
};

export default SkinTypeManagement;
