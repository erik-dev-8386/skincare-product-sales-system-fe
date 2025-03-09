import React, { useState } from 'react'
import "./Profile.css";
import { Form, Input, DatePicker, Upload, Button, Select, message } from 'antd';
import axios from 'axios';
import api from '../../../config/api';


const { Option } = Select;

export default function Profile() {
    const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('gender', values.gender);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('address', values.address);
    formData.append('birthDate', values.birthDate.format('YYYY-MM-DD'));
    // formData.append('skin_types', values.skin_types);
    if (fileList.length > 0) {
      formData.append('image', fileList[0].originFileObj);
    }

    try {
      const response = await api.post('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success('Profile updated successfully!');
    } catch (error) {
      message.error('Failed to update profile.');
    }
  };

  const handleChange = ({ fileList }) => setFileList(fileList);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
        <h1>Thông tin khác hàng</h1>
      <Form.Item name="firstName" label="Tên" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="lastName" label="Họ" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>
      <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
      <Select placeholder="Chọn giới tính">
          <Option value="other">Khác</Option>
          <Option value="men">Nam</Option>
          <Option value="women">Nữ</Option>
          <Option value="unknow">Bí mật</Option>  
        </Select>
      </Form.Item>
      <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="birthDate" label="Ngày tháng năm sinh" rules={[{ required: true }]}>
        <DatePicker />
      </Form.Item>
      {/* <Form.Item name="skin_types" label="Loại da" rules={[{ required: true }]}>
        <Select placeholder="Select skin type">
          <Option value="oily">Oily</Option>
          <Option value="dry">Dry</Option>
          <Option value="combination">Combination</Option>
          <Option value="sensitive">Sensitive</Option>
        </Select>
      </Form.Item> */}
      <Form.Item label="Profile Picture">
        <Upload
          fileList={fileList}
          onChange={handleChange}
          beforeUpload={() => false} // Prevent automatic upload
        >
          <Button>Upload</Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
