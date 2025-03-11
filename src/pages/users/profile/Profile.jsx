import React, { useState, useEffect } from 'react';
import "./Profile.css";
import { Form, Input, DatePicker, Upload, Button, Select, message, Row, Col } from 'antd';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';

const { Option } = Select;

export default function Profile() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("No token found. Please login.");
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
          birthDate: data.birthDate ? moment(data.birthDate) : null,
        });
      } catch (error) {
        message.error("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [form]);

  const onFinish = async (values) => {
    const formData = new FormData();
  
    // Append user data as JSON string
    formData.append('users', JSON.stringify({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      gender: values.gender,
      phone: values.phone,
      address: values.address,
      birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
    }));
  
    // Append the image or null
    if (fileList.length > 0) {
      formData.append('images', fileList[0].originFileObj);
    } else {
      formData.append('images', null); // Explicitly set null if no image is uploaded
    }
  
    try {
      await api.put(`/users/update/${values.email}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This should be correct for file uploads
        },
      });
      toast.success('Chỉnh sửa thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Chỉnh sửa thông tin không thành công!');
    }
  };

  // const onFinish = async (values) => {
  //   const formData = new FormData();
    
  //   // Append user data as JSON string
  //   formData.append('users', JSON.stringify({
  //     firstName: values.firstName,
  //     lastName: values.lastName,
  //     email: values.email,
  //     gender: values.gender,
  //     phone: values.phone,
  //     address: values.address,
  //     birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
  //   }));
    
  //   // Append the image with the correct key
  //   if (fileList.length > 0) {
  //     formData.append('images', fileList[0].originFileObj);
  //   }
    
  //   try {
  //     await api.put(`/users/update/${values.email}`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data', // This line may not be needed
  //       },
  //     });
  //     toast.success('Chỉnh sửa thông tin thành công!');
  //     setIsEditing(false);
  //   } catch (error) {
  //     toast.error('Chỉnh sửa thông tin không thành công!');
  //   }
  // };

  return (
    <div className="profile-container">

      <Form form={form} layout="vertical" onFinish={onFinish} >
        <h1 >Thông tin tài khoản</h1>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="firstName" label="Tên"><Input disabled={!isEditing} /></Form.Item></Col>
          <Col span={8}><Form.Item name="lastName" label="Họ"><Input disabled={!isEditing} /></Form.Item></Col>
          <Col span={8}><Form.Item name="gender" label="Giới tính">
            <Select disabled={!isEditing}>
              <Option value="other">Khác</Option>
              <Option value="men">Nam</Option>
              <Option value="women">Nữ</Option></Select>
          </Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="email" label="Email"><Input disabled /></Form.Item></Col>
          <Col span={8}><Form.Item name="phone" label="Số điện thoại"><Input disabled={!isEditing} /></Form.Item></Col>
          <Col span={8}><Form.Item name="birthDate" label="Ngày sinh"><DatePicker disabled={!isEditing} /></Form.Item></Col>
        </Row>
        <Row>
          <Col span={24}><Form.Item name="address" label="Địa chỉ"><Input disabled={!isEditing} /></Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Upload fileList={fileList} beforeUpload={() => false} disabled={!isEditing}>
              <Button disabled={!isEditing}>Tải ảnh đại diện lên</Button>
            </Upload>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            {isEditing ? (
              <>
                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>Lưu</Button>
                <Button type="default" onClick={() => setIsEditing(false)}>Hủy</Button>
              </>
            ) : (
              <Button type="primary" onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</Button>
            )}
          </Col>
        </Row>
      </Form>
      </div>
  );
}
