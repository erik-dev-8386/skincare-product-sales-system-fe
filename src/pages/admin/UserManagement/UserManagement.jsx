import { Button, Form, Input, Modal, Table, Popconfirm, Upload, Radio, DatePicker, Select, InputNumber, Tag, Image } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../../../config/api";
import { center } from "@cloudinary/url-gen/qualifiers/textAlignment";

const CustomerManagement = () => {
  const [customerList, setCustomerList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const statusMapping = {
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    1: { text: "HOẠT ĐỘNG", color: "green" },
  };

  const columns = [
    { title: 'Họ', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Tên', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate', render: (date) => date? moment(date).format("YYYY-MM-DD") : "không có thông tin" },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      render: (image) => image ? <Image src={image} alt="Avatar" width={50} height={50} /> : 'Không có ảnh'
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role === 3 ? "Khách hàng" : "Không biết thông tin"
    },
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: (status) => {
    //     const statusInfo = statusMapping[status] || { text: "KHÔNG BIẾT", color: "default" };
    //     return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    //   }
    // },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="button" style={{display: "flex", justifyContent: "center", flexDirection: "column", width: 100}}>
          <Button color="orange" variant="filled" onClick={() => handleEditCustomer(record)} style={{ margin: 3, border: "2px solid " }}>
            <i className="fa-solid fa-pen-to-square"></i> Sửa
          </Button>
          <Button color="primary" variant="filled" type="default" onClick={() => handleViewDetails(record)} style={{ margin: 3, border: "2px solid " }}>
            <i className="fa-solid fa-eye"></i> Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa khách hàng này?"
            onConfirm={() => handleDeleteCustomer(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button color="red" variant="filled" style={{ margin: 3, border: "2px solid " }}>
              <i className="fa-solid fa-trash"></i> Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchCustomer = async () => {
    try {
      const response = await api.get('/users/customers');
      setCustomerList(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingCustomer(null);
  };

  const handleViewDetails = (staff) => {
    setSelectedCustomer(staff);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSubmitForm = async (values) => {
    try {
      if (editingCustomer) {
        await api.put(`/users/${editingCustomer.id}`, values);
        toast.success("Cập nhật khách hàng thành công!");
      } else {
        await api.post('/users', values);
        toast.success("Thêm khách hàng thành công!");
      }
      fetchCustomer();
      handleCloseModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handleEditCustomer = (staff) => {
    setEditingCustomer(staff);
    form.setFieldsValue({
      ...staff,
      birthDate: moment(staff.birthDate)
    });
    handleOpenModal();
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

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý khách hàng</h1>
      <Button type="primary" onClick={handleOpenModal}>
        <i className="fa-solid fa-plus"></i> Thêm khách hàng mới
      </Button>
      <Table dataSource={customerList} columns={columns} rowKey="id" style={{ marginTop: 16 }} />
      <Modal
        title={editingCustomer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingCustomer ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
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
          <Form.Item label="Ngày tháng năm sinh" name="birthDate" rules={[{ required: true, message: "Không được để trống!" }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Không được để trống!" }, { type: "email", message: "Email không hợp lệ!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Không được để trống!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Không được để trống!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Đánh giá" name="rating" rules={[{ required: true, message: "Không được để trống!" }]}>
            <InputNumber min={0} max={5} />
          </Form.Item>
          <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: "Không được để trống!" }]}>
            <Select>
              
              <Option value={3}>khách hàng</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Không được để trống!" }]}>
            <Select>
              <Option value={0}>KHÔNG HOẠT ĐỘNG</Option>
              <Option value={1}>HOẠT ĐỘNG</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      {/* Modal Chi Tiết */}
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
            <p><strong>Số điện thoại: </strong> {selectedCustomer.phoneNumber}</p>
            <p><strong>Địa chỉ: </strong> {selectedCustomer.address}</p>
            <p><strong>Đánh giá: </strong> {selectedCustomer.rating}</p>
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