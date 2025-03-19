
import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Upload, Button, Select, message, Row, Col, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs';
import './Profile.css'; // Đảm bảo import file CSS

const { Option } = Select;

export default function Profile() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please login.");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.sub;

        const response = await api.get(`/users/${userEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setUserData(data);
        form.setFieldsValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          gender: data.gender,
          phone: data.phone,
          address: data.address,
          birthDate: data.birthDate ? dayjs(data.birthDate) : null,
        });

        // Nếu có ảnh đại diện, set preview ảnh
        if (data.image) {
          setImagePreviews([data.image]);
        }
      } catch (error) {
        message.error("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [form]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        gender: values.gender,
        phone: values.phone,
        address: values.address,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
      };

      formData.append('users', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj); // Append the image file
      }

      const response = await api.put(`/users/update/${values.email}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Chỉnh sửa thông tin thành công!');
      setIsEditing(false);
      setUserData(response.data); // Update user data with the new data from the server
    } catch (error) {
      toast.error('Chỉnh sửa thông tin không thành công!');
      console.error("Error updating user data:", error);
    }
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setIsEditing(false);
    form.setFieldsValue({
      ...userData,
      birthDate: userData.birthDate ? dayjs(userData.birthDate) : null, // Đảm bảo birthDate là dayjs
    });
    setFileList([]); // Clear the file list
    setImagePreviews(userData.image ? [userData.image] : []); // Reset image previews
  };

  //   const handleCancelClick = () => {
  //     setIsEditing(false);
  //     form.setFieldsValue({
  //       ...userData,
  //       birthDate: userData.birthDate ? dayjs(userData.birthDate) : null, // Đảm bảo birthDate là dayjs
  //     });
  //     setFileList([]); // Reset fileList
  //     setImagePreviews(userData.image ? [userData.image] : []); // Reset image previews
  //   };

  // Handle file upload
  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setImagePreviews([URL.createObjectURL(fileList[0].originFileObj)]);
    } else {
      setImagePreviews([]);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="profile-container">
        <Form form={form} layout="vertical">
          <h1>Thông tin tài khoản</h1>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="firstName" label="Tên">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="lastName" label="Họ">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gender" label="Giới tính">
                <Select disabled={!isEditing}>
                  <Option value="khác">Khác</Option>
                  <Option value="nam">Nam</Option>
                  <Option value="nữ">Nữ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="email" label="Email">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="birthDate" label="Ngày sinh">
                <DatePicker disabled={!isEditing} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="address" label="Địa chỉ">
                <Input disabled={!isEditing} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ảnh đại diện">
                <Upload
                  fileList={fileList}
                  beforeUpload={() => false} // Prevent auto-upload
                  onChange={handleFileChange} // Handle file selection
                  disabled={!isEditing}
                >
                  <Button icon={<UploadOutlined />} disabled={!isEditing}>
                    Tải ảnh đại diện lên
                  </Button>
                </Upload>
                {imagePreviews.length > 0 && (
                  <Image
                    src={imagePreviews[0]}
                    alt="image Preview"
                    width={100}
                    style={{ marginTop: 8 }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              {isEditing ? (
                <>
                  <Button color="primary" variant="solid" onClick={handleSubmit} style={{ marginRight: 8 , border: "2px solid #1677ff"  }}>
                    Lưu
                  </Button>
                  <Button color="danger" variant="solid" onClick={handleCancelClick} style={{ border: "2px solid #ff4d4f"  }}>
                    Hủy
                  </Button>
                </>
              ) : (
                <Button type="primary" onClick={handleEditClick}>
                  Chỉnh sửa thông tin
                </Button>
              )}
            </Col>
          </Row>
        </Form>

      </div>
    </>
  );
}