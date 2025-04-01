
import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, Table, Popconfirm, Upload, Radio, DatePicker, Select, Tag, Image, Tooltip, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { toast, ToastContainer } from 'react-toastify';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import api from '../../../config/api';

const { Option } = Select;

const CustomerManagement = () => {
  const [customerList, setCustomerList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusMapping = {
    1: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    2: { text: "HOẠT ĐỘNG", color: "green" },
  };

  const fetchCustomer = async () => {
    try {
      const response = await api.get('/users/customers');
      setCustomerList(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingCustomer(null);
    setFileList([]);
    setImagePreview(null);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      ...customer,
      birthDate: moment(customer.birthDate),
    });
    setImagePreview(customer.image);
    setModalOpen(true);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImagePreview(newFileList.length > 0 ? URL.createObjectURL(newFileList[0].originFileObj) : null);
  };

  const handleSubmitForm = async (values) => {
    try {
      const formData = new FormData();
      formData.append('users', new Blob([JSON.stringify(values)], { type: 'application/json' }));

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      await api.put(`/users/update/${editingCustomer.email}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Cập nhật khách hàng thành công!");
      fetchCustomer();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating customer:", error);
      toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success("Xóa khách hàng thành công!");
      fetchCustomer();
    } catch (error) {
      toast.error("Xóa khách hàng không thành công!");
    }
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedCustomer(null);
  };

  const columns = [
    { title: 'Họ', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Tên', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate', render: (date) => date ? moment(date).format("YYYY-MM-DD") : "không có thông tin" },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      render: (image) => image ? <Image src={image} alt="Avatar" width={50} height={50} /> : 'Không có ảnh'
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
      render: (_, record) => (
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
          <Tooltip title="Sửa">
            <Button 
            color="orange"
            variant="filled"
            onClick={() => handleEditCustomer(record)} 
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
              title="Bạn có chắc muốn xóa khách hàng này?"
              onConfirm={() => handleDeleteCustomer(record.userId)}
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
      <h1>Quản lý khách hàng</h1>
      <Table dataSource={customerList} columns={columns} rowKey="id" style={{ marginTop: 16 }} />
      <Modal
        title="Chỉnh sửa khách hàng"
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
          <Form.Item label="Họ" name="firstName" rules={[{ required: true, message: "Không được để trống!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên" name="lastName" rules={[{ required: true, message: "Không được để trống!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Giới tính" name="gender" rules={[{ required: false, message: "Không được để trống!" }]}>
            <Radio.Group>
              <Radio value="nam">Nam</Radio>
              <Radio value="nữ">Nữ</Radio>
              <Radio value="khác">Khác</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Ngày sinh" name="birthDate">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Không được để trống!" }, { type: "email", message: "Email không hợp lệ!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Không được để trống!" }]}>
            <Select>
              <Option value={1}>KHÔNG HOẠT ĐỘNG</Option>
              <Option value={2}>HOẠT ĐỘNG</Option>
            </Select>
          </Form.Item>
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
        </Form>
      </Modal>

      <Modal
        title={<h2>Chi tiết khách hàng</h2>}
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedCustomer && (
          <div>
            <p><strong>ID: </strong> {selectedCustomer.userId}</p>
            <p><strong>Họ: </strong> {selectedCustomer.firstName}</p>
            <p><strong>Tên: </strong> {selectedCustomer.lastName}</p>
            <p><strong>Giới tính: </strong> {selectedCustomer.gender}</p>
            <p><strong>Ngày sinh: </strong> {moment(selectedCustomer.birthDate).format("YYYY-MM-DD")}</p>
            <p><strong>Email: </strong> {selectedCustomer.email}</p>
            <p><strong>Số điện thoại: </strong> {selectedCustomer.phone}</p>
            <p><strong>Địa chỉ: </strong> {selectedCustomer.address}</p>
            <p><strong>Ảnh địa diện:</strong> {selectedCustomer.image ? (
              <Image src={selectedCustomer.image} alt="Avatar" width={100} />
            ) : (
              <span>không có ảnh</span>
            )}</p>
            <p><strong>Vai trò: </strong> {selectedCustomer.role === 3 ? "Khách hàng" : "không có thông tin"}</p>
            <p><strong>Trạng thái: </strong>
              {selectedCustomer.status !== undefined ? (
                <Tag color={statusMapping[selectedCustomer.status]?.color}>
                  {statusMapping[selectedCustomer.status]?.text}
                </Tag>
              ) : "Không xác định"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CustomerManagement;