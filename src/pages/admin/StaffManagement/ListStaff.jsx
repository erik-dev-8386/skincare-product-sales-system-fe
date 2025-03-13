import { Button, Form, Input, Modal, Table, Popconfirm, Upload, Radio, DatePicker, Select, InputNumber, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import api from "../../../config/api";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingStaff, setEditingStaff] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const statusMapping = {
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    1: { text: "HOẠT ĐỘNG", color: "green" },
  };

  const columns = [
    { title: 'Họ', dataIndex: 'firstName', key: 'firstName' },
    { title: 'Tên', dataIndex: 'lastName', key: 'lastName' },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Ngày sinh', dataIndex: 'birthDate', key: 'birthDate', render: (date) => moment(date).format("YYYY-MM-DD") },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'image',
      key: 'image',
      render: (image) => image ? <img src={image} alt="Avatar" width={50} height={50} /> : 'Không có ảnh'
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
        const statusInfo = statusMapping[status] || { text: "KHÔNG BIẾT", color: "default" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="button">
          <Button color="orange" variant="filled" onClick={() => handleEditStaff(record)} style={{ marginRight: 8, border: "2px solid " }}>
            <i className="fa-solid fa-pen-to-square"></i> Sửa
          </Button>
          <Button color="primary" variant="filled" type="default" onClick={() => handleViewDetails(record)} style={{ marginRight: 8, border: "2px solid " }}>
            <i className="fa-solid fa-eye"></i> Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhân viên này?"
            onConfirm={() => handleDeleteStaff(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button color="red" variant="filled" style={{ marginRight: 8, border: "2px solid " }}>
              <i className="fa-solid fa-trash"></i> Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchStaff = async () => {
    try {
      const response = await api.get('/users/admin-staff');
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
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
  };

  const handleViewDetails = (staff) => {
    setSelectedStaff(staff);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedStaff(null);
  };

  const handleSubmitForm = async (values) => {
    try {
      if (editingStaff) {
        await api.put(`/users/${editingStaff.id}`, values);
        toast.success("Cập nhật nhân viên thành công!");
      } else {
        await api.post('/users', values);
        toast.success("Thêm nhân viên thành công!");
      }
      fetchStaff();
      handleCloseModal();
    } catch (error) {
      toast.error("Có lỗi xảy ra! Vui lòng thử lại.");
    }
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    form.setFieldsValue({
      ...staff,
      birthDate: moment(staff.birthDate)
    });
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

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý nhân viên</h1>
      <Button type="primary" onClick={handleOpenModal}>
        <i className="fa-solid fa-plus"></i> Thêm nhân viên mới
      </Button>
      <Table dataSource={staffList} columns={columns} rowKey="id" style={{ marginTop: 16 }} />
      <Modal
        title={editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingStaff ? "Lưu thay đổi" : "Tạo"}
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
          <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: "Không được để trống!" }]}>
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
              <Option value={1}>Quản trị viên</Option>
              <Option value={0}>Nhân viên</Option>
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
        title={<h2>Chi tiết nhân viên</h2>}
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedStaff && (
          <div>
            <p><strong>ID: </strong> {selectedStaff.userId}</p>
            <p><strong>Họ: </strong> {selectedStaff.firstName}</p>
            <p><strong>Tên: </strong> {selectedStaff.lastName}</p>
            <p><strong>Giới tính: </strong> {selectedStaff.gender}</p>
            <p><strong>Ngày sinh: </strong> {moment(selectedStaff.birthDate).format("YYYY-MM-DD")}</p>
            <p><strong>Email: </strong> {selectedStaff.email}</p>
            <p><strong>Số điện thoại: </strong> {selectedStaff.phoneNumber}</p>
            <p><strong>Địa chỉ: </strong> {selectedStaff.address}</p>
            <p><strong>Đánh giá: </strong> {selectedStaff.rating}</p>
            <p><strong>Vai trò: </strong> {selectedStaff.role === 1 ? "Quản trị viên" : "Nhân viên"}</p>
            <p><strong>Trạng thái: </strong>
              {selectedStaff.status !== undefined ? (
                <Tag color={statusMapping[selectedStaff.status]?.color}>
                  {statusMapping[selectedStaff.status]?.text}
                </Tag>
              ) : "Không xác định"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StaffManagement;