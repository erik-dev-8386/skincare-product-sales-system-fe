import { Button, Form, Input, Modal, Table, Popconfirm, Upload, Select, Col, Row, Tag, Image } from "antd";
import { useForm } from "antd/es/form/Form";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../config/api";
import axios from "axios";
import MyEditor from "../../../component/TinyMCE/MyEditor";
import uploadFile from "../../../utils/upload";




const SkinTypeManagement = () => {
    const [skinTypeList, setSkinTypeList] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [form] = useForm();
    const [editingSkinType, setEditingSkinType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // Thêm state để lưu URL ảnh tạm thời
    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedSkinType, setSelectedSkinType] = useState(null);
    const { Option } = Select;

    const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dawyqsudx/upload";
    const CLOUDINARY_UPLOAD_PRESET = "haven-skin-03-2025";

    const statusColors = {
        1: { text: "HOẠT ĐỘNG", color: "green" },
        2: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
        3: { text: "ĐÃ XÓA", color: "gray" }
    };

    const columns = [
        { title: 'ID loại da', dataIndex: 'skinTypeId', key: 'skinTypeId' },
        { title: 'Tên loại da', dataIndex: 'skinName', key: 'skinName' },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <div dangerouslySetInnerHTML={{ __html: text && typeof text === "string" ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : "" }} />
            ),
        },
        { title: 'Điểm tối thiểu', dataIndex: 'minMark', key: 'minMark' },
        { title: 'Điểm tối đa', dataIndex: 'maxMark', key: 'maxMark' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const statusData = statusColors[status] || { text: "KHÔNG BIẾT", color: "default" };
                return <Tag color={statusData.color}>{statusData.text}</Tag>;
            }
        },
        {
            title: 'Ảnh',
            dataIndex: 'skinTypeImages',
            key: 'skinTypeImages',
            // render: (image) => image ? <img src={image} alt="Skin Type" style={{ width: 50, height: 50 }} /> : "Không có ảnh"
            render: (skinTypeImages) => skinTypeImages ? <Image src={skinTypeImages} alt="Skin Type" style={{ width: 50, height: 50 }}/> : "Không có ảnh",
        },
        {
            title: 'Nút điều khiển',
            key: 'actions',
            render: (text, record) => (
                <div className="button">
                    <Button color="orange" variant="filled" onClick={() => handleEditSkinType(record)} style={{ marginRight: 8, border: "2px solid " }}>
                        <i className="fa-solid fa-pen-to-square"></i>
                        Sửa
                    </Button>
                    <Button color="primary" variant="filled" onClick={() => handleViewDetails(record)} style={{ marginRight: 8, border: "2px solid " }}>
                        <i className="fa-solid fa-eye"></i>
                        Chi tiết
                    </Button>
                    <Popconfirm
                        title="Bạn có muốn xóa loại da này không?"
                        onConfirm={() => handleDeleteSkinType(record.skinTypeId)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button color="red" variant="filled" style={{ marginRight: 8, border: "2px solid " }}>
                            <i className="fa-solid fa-trash"></i>
                            Xóa
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // antd upload image
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });



    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

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
        setImagePreview(null); // Reset ảnh tạm thời khi đóng modal
    };

    const handleViewDetails = (skinType) => {
        setSelectedSkinType(skinType);
        setDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setDetailModalOpen(false);
        setSelectedSkinType(null);
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Lỗi tải ảnh lên Cloudinary!");
            return null;
        }
    };

    const handleSubmitForm = async (values) => {
        console.log(values)


        if(values.skinTypeImages){
           const url = await uploadFile(values.skinTypeImages.file.originFileObj);
           values.skinTypeImages = url;
        }



        if (editingSkinType) {
            values.skinTypeId = editingSkinType.skinTypeId;
            try {
                await api.put(`/skin-types/${editingSkinType.skinTypeId}`, values);
                toast.success("Đã sửa loại da này thành công!");
                fetchSkinTypes();
                handleCloseModal();
            } catch (error) {
                toast.error(error.response?.data?.message || "Sửa loại da không thành công!");
            }
        } else {
            try {
        //         await api.post('/skin-types', payload);
                await api.post('/skin-types', values);
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
        setImagePreview(skinType.skinTypeImages); // Hiển thị ảnh hiện tại khi chỉnh sửa
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
                width={800}
            >
                <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
                    <Form.Item label="Tên loại da" name="skinName" rules={[{ required: true, message: "Tên loại da không được để trống!" }]}>
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
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Điểm tối thiểu" name="minMark">
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item label="Điểm tối đa" name="maxMark">
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Tải hình ảnh lên">
                               
                                <Upload
                                     action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                                    
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={handlePreview}
                                    onChange={handleChange}
                                >
                                    {fileList.length >= 8 ? null : uploadButton}
                                </Upload>
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
                        </Col>
                    </Row>
                </Form>

            </Modal>
            {previewImage && (
                <Image
                    wrapperStyle={{
                        display: 'none',
                    }}
                    preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),
                    }}
                    src={previewImage}
                />
            )}
            <Modal
                title="Chi tiết loại da"
                open={isDetailModalOpen}
                onCancel={handleCloseDetailModal}
                footer={null}
                width={800}
            >
                {selectedSkinType && (
                    <div>
                        <p><strong>ID: </strong> {selectedSkinType.skinTypeId}</p>
                        <p><strong>Tên loại da: </strong> {selectedSkinType.skinName}</p>
                        <p><strong>Mô tả: </strong></p>
                        <div dangerouslySetInnerHTML={{ __html: selectedSkinType.description }} />
                        <p><strong>Điểm tối thiểu: </strong> {selectedSkinType.minMark}</p>
                        <p><strong>Điểm tối đa: </strong> {selectedSkinType.maxMark}</p>
                        <p><strong>Ảnh: </strong> <img src={selectedSkinType.skinTypeImages} alt="Skin Type" style={{ width: 100 }} /></p>
                        <p><strong>Trạng Thái:</strong>
                            {selectedSkinType.status !== undefined ? (
                                <Tag color={statusColors[selectedSkinType.status]?.color}>
                                    {statusColors[selectedSkinType.status]?.text}
                                </Tag>
                            ) : "Không xác định"}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default SkinTypeManagement;


