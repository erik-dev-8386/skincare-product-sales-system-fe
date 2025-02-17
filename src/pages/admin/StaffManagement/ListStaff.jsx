import { Button, Form, Input, Modal, Table, Popconfirm, Upload, Radio, DatePicker, Select, InputNumber } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingStaff, setEditingStaff] = useState(null);

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
      render: (status) => status === 1 ? "Hoạt động" : "Không hoạt động"
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button onClick={() => handleEditStaff(record)} style={{ marginRight: 8 }}>Sửa</Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhân viên này?"
            onConfirm={() => handleDeleteStaff(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  
  const fetchStaff = async () => {
    try {
      const response = await axios.get('http://localhost:8080/haven-skin/users');
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

  const handleSubmitForm = async (values) => {
    try {
      if (editingStaff) {
        await axios.put(`http://localhost:8080/haven-skin/users/${editingStaff.id}`, values);
        toast.success("Cập nhật nhân viên thành công!");
      } else {
        await axios.post('http://localhost:8080/haven-skin/users', values);
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
      await axios.delete(`http://localhost:8080/haven-skin/users/${id}`);
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
      <Button type="primary" onClick={handleOpenModal}>Thêm nhân viên</Button>
      <Table dataSource={staffList} columns={columns} rowKey="id" style={{ marginTop: 16 }} />
      <Modal
        title={editingStaff ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
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
        </Form>
      </Modal>
    </div>
  );
};

export default StaffManagement;
