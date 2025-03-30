import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Modal, 
  Space, 
  Typography,
  Divider,
  Alert
} from 'antd';
import { 
  LogoutOutlined, 
  DeleteOutlined, 
  LockOutlined,
  LoginOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Title, Text } = Typography;

export default function Setting() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const navigate = useNavigate();
  
    // Lấy thông tin user từ token
    const token = localStorage.getItem('token');
    const user = token ? jwtDecode(token) : null;
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      toast.success('Đăng xuất thành công');
      navigate('/login');
    };
  
    const handleLoginOther = () => {
      localStorage.removeItem('token');
      navigate('/login');
    };
  
    const showDeleteModal = () => {
      setDeleteModalVisible(true);
    };
  
    const handleDeleteCancel = () => {
      setDeleteModalVisible(false);
    };
  
    const handleDeleteAccount = async () => {
      setConfirmLoading(true);
      try {
        await axios.delete('/api/user/delete-account', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Tài khoản đã được xóa thành công');
        localStorage.removeItem('token');
        navigate('/register');
      } catch (error) {
        toast.error('Xóa tài khoản thất bại: ' + error.message);
      } finally {
        setConfirmLoading(false);
        setDeleteModalVisible(false);
      }
    };
  
    const onFinishChangePassword = async (values) => {
      setLoading(true);
      try {
        await axios.post('/api/user/change-password', values, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Đổi mật khẩu thành công');
        form.resetFields();
      } catch (error) {
        toast.error('Đổi mật khẩu thất bại: ' + error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <h1>Cài đặt tài khoản</h1>
        <Text type="secondary">Quản lý thông tin và bảo mật tài khoản</Text>
        <Divider />
  
        <Card title="Thông tin tài khoản" style={{ marginBottom: 20 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Email:</Text>
            <Text>{user?.email || 'Chưa đăng nhập'}</Text>
            
            <Text strong>Thời gian tạo tài khoản:</Text>
            <Text>{user?.iat ? new Date(user.iat * 1000).toLocaleString() : 'Không xác định'}</Text>
          </Space>
        </Card>
  
        <Card title="Đổi mật khẩu" style={{ marginBottom: 20 }}>
          <Form
            form={form}
            name="change_password"
            onFinish={onFinishChangePassword}
            layout="vertical"
          >
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
  
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
  
            <Form.Item
              name="confirmPassword"
              label="Xác nhận mật khẩu mới"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
  
            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<LockOutlined />}
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Card>
  
        <Card title="Hành động" style={{ marginBottom: 20 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              type="default" 
              block 
              icon={<LoginOutlined />} 
              onClick={handleLoginOther}
            >
              Đăng nhập vào tài khoản khác
            </Button>
            
            <Button 
              type="default" 
              block 
              danger 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
            
            <Button 
              type="default" 
              block 
              danger 
              icon={<DeleteOutlined />} 
              onClick={showDeleteModal}
            >
              Xóa tài khoản
            </Button>
          </Space>
        </Card>
  
        <Modal
          title="Xác nhận xóa tài khoản"
          visible={deleteModalVisible}
          onOk={handleDeleteAccount}
          confirmLoading={confirmLoading}
          onCancel={handleDeleteCancel}
          okText="Xóa tài khoản"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Alert
            message="Cảnh báo"
            description="Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn."
            type="error"
            showIcon
          />
          <Divider />
          <Text strong>Hậu quả của việc xóa tài khoản:</Text>
          <ul>
            <li>Tất cả dữ liệu cá nhân sẽ bị xóa vĩnh viễn</li>
            <li>Bạn sẽ không thể khôi phục tài khoản này</li>
            <li>Tất cả các dịch vụ liên quan sẽ ngừng hoạt động</li>
          </ul>
        </Modal>
      </div>
    );
  };

