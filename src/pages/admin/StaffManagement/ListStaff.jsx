

import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  Radio,
  DatePicker,
  Select,
  Tag,
  Image,
  Tooltip,
  Spin,
  Row,
  Col,
  Upload
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { toast, ToastContainer } from 'react-toastify';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../../../config/api';

const { Option } = Select;

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingStaff, setEditingStaff] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const statusMapping = {
    1: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    2: { text: "HOẠT ĐỘNG", color: "green" },
  };

  const fetchStaff = async () => {
    try {
      const response = await api.get('/users/admin-staff');
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Không thể tải danh sách nhân viên!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);



  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingStaff(null);
    setFileList([]);
    setImagePreview(null);
  };

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedStaff(null);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImagePreview(newFileList.length > 0 ? URL.createObjectURL(newFileList[0].originFileObj) : null);
  };

  const handleSubmitForm = async (values) => {
    // Check for duplicate email
    const isDuplicate = staffList.some(
      staff => staff.email === values.email &&
        (!editingStaff || staff.userId !== editingStaff.userId)
    );
  
    if (isDuplicate) {
      toast.error("Email đã tồn tại! Vui lòng sử dụng email khác.");
      return;
    }
  
    try {
      const formData = new FormData();
      const payload = {
        ...values,
        birthDate: values.birthDate ? moment(values.birthDate).format('YYYY-MM-DD') : null
      };
      
      formData.append('users', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      if (editingStaff) {
        await api.put(`/users/update/${editingStaff.email}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Cập nhật nhân viên thành công!");
      } else {
    
        await api.post('/users', payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success("Thêm nhân viên mới thành công!");
      }
      
      fetchStaff();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(editingStaff ? 
        "Cập nhật nhân viên không thành công!" : 
        "Thêm nhân viên không thành công!");
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    form.setFieldsValue({
      ...staff,
      birthDate: moment(staff.birthDate),
    });
    setImagePreview(staff.image || null);
    handleOpenModal();
  };

  const handleDeleteStaff = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success("Xóa nhân viên thành công!");
      fetchStaff();
    } catch (error) {
      toast.error("Xóa nhân viên không thành công!");
    }
  };

  const columns = [
    { title: 'Họ', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Tên', dataIndex: 'lastName', key: 'lastName' },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        switch (gender) {
          case 'Male': return 'Nam';
          case 'Female': return 'Nữ';
          default: return 'Khác';
        }
      }
    },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthDate',
      key: 'birthDate',
      render: (date) => date ? moment(date).format("DD/MM/YYYY") : "N/A"
    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      render: (image) => image ? <Image src={image} alt="Avatar" width={50} height={50} /> : 'N/A'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role === 1 ? "Quản trị viên" : "Nhân viên"
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusInfo = statusMapping[status] || { text: "KHÔNG XÁC ĐỊNH", color: "default" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Nút điều khiển',
      key: 'actions',
      render: (_, record) => (
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
          <Tooltip title="Sửa">
            <Button
              color="orange"
            variant="filled"
             onClick={() => handleEditStaff(record)} 
             style={{ margin: 3, border: "2px solid", width: "20px" }}>
              <i className="fa-solid fa-pen-to-square"></i>
            </Button>
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button
             color="primary"
            variant="filled"
             onClick={() => handleViewDetails(record)}
              style={{ margin: 3, border: "2px solid", width: "20px" }}>
              <i className="fa-solid fa-eye"></i>
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa nhân viên này?"
              onConfirm={() => handleDeleteStaff(record.userId)}
              okText="Có"
              cancelText="Không"
            >
              <Button 
               color="red"
              variant="filled"
              style={{ margin: 3, border: "2px solid", width: "20px" }}>
                <i className="fa-solid fa-trash"></i>
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý nhân viên</h1>
      <div style={{ marginBottom: 16 }}>
    
        <Button type="primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus"></i> Thêm nhân viên mới
        </Button>
      </div>
      <Table
        dataSource={staffList}
        columns={columns}
        rowKey="userId"
        style={{ marginTop: 16 }}
      />

      <Modal
        title={editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingStaff ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Họ" name="firstName" rules={[{ required: true, message: "Không được để trống!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Tên" name="lastName" rules={[{ required: true, message: "Không được để trống!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: "Không được để trống!" }]}>
                <Radio.Group>
                  <Radio value="Male">Nam</Radio>
                  <Radio value="Female">Nữ</Radio>
                  <Radio value="Other">Khác</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Ngày sinh" name="birthDate" rules={[{ required: true, message: "Không được để trống!" }]}>
                <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Không được để trống!" },
                  { type: "email", message: "Email không hợp lệ!" }
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Không được để trống!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Không được để trống!" }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: "Không được để trống!" }]}>
                <Select>
                  <Option value={1}>Quản trị viên</Option>
                  <Option value={2}>Nhân viên</Option>
                </Select>
              </Form.Item>
              {editingStaff && (
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[{ required: true, message: "Không được để trống!" }]}
                >
                  <Select>
                    <Option value={1}>KHÔNG HOẠT ĐỘNG</Option>
                    <Option value={2}>HOẠT ĐỘNG</Option>
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>
          {editingStaff && (
            <Form.Item label="Ảnh đại diện">
              <Upload
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleFileChange}
                accept="image/*"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Thay đổi ảnh</Button>
              </Upload>
              {imagePreview && <Image src={imagePreview} alt="Avatar Preview" width={100} />}
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Modal Chi Tiết */}
      <Modal
        title={<h2>Chi tiết nhân viên</h2>}
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={700}
      >
        {selectedStaff && (
          <div>
            <p><strong>ID: </strong> {selectedStaff.userId}</p>
            <p><strong>Họ: </strong> {selectedStaff.firstName}</p>
            <p><strong>Tên: </strong> {selectedStaff.lastName}</p>
            <p><strong>Giới tính: </strong>
              {selectedStaff.gender === 'Male' ? 'Nam' :
                selectedStaff.gender === 'Female' ? 'Nữ' : 'Khác'}
            </p>
            <p><strong>Ngày sinh: </strong> {moment(selectedStaff.birthDate).format("DD/MM/YYYY")}</p>
            <p><strong>Email: </strong> {selectedStaff.email}</p>
            <p><strong>Số điện thoại: </strong> {selectedStaff.phone}</p>
            <p><strong>Địa chỉ: </strong> {selectedStaff.address}</p>
            <p><strong>Vai trò: </strong> {selectedStaff.role === 1 ? "Quản trị viên" : "Nhân viên"}</p>
            <p><strong>Trạng thái: </strong>
              {selectedStaff.status !== undefined ? (
                <Tag color={statusMapping[selectedStaff.status]?.color}>
                  {statusMapping[selectedStaff.status]?.text}
                </Tag>
              ) : "Không xác định"}
            </p>
            <p>
              <strong>Ảnh đại diện: </strong>
              {selectedStaff.image ? (
                <Image src={selectedStaff.image} alt="Avatar" width={100} />
              ) : 'N/A'}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffManagement;