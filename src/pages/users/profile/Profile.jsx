// import React, { useState, useEffect } from 'react';
// import "./Profile.css";
// import { Form, Input, DatePicker, Upload, Button, Select, message, Row, Col } from 'antd';
// import api from '../../../config/api';
// import { jwtDecode } from 'jwt-decode';
// import { ToastContainer, toast } from 'react-toastify';
// import moment from 'moment'; // Ensure moment is imported

// const { Option } = Select;

// export default function Profile() {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [userData, setUserData] = useState({});

//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("No token found. Please login.");
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token);
//         const userEmail = decodedToken.sub;

//         const response = await api.get(`/users/${userEmail}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = response.data;
//         setUserData(data);
//         form.setFieldsValue({
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email,
//           gender: data.gender,
//           phone: data.phone,
//           address: data.address,
//           birthDate: data.birthDate ? moment(data.birthDate) : null, // Ensure moment is used correctly
//         });
//       } catch (error) {
//         message.error("Failed to fetch user data.");
//         console.error("Error fetching user data:", error); // Log the error for debugging
//       }
//     };

//     fetchUserData();
//   }, [form]);

//   const handleSubmit = async () => {
//     try {
//       // Validate form fields
//       const values = await form.validateFields();

//       // Create FormData object
//       const formData = new FormData();

//       // Create a JSON string of the user data
//       const userData = {
//         firstName: values.firstName,
//         lastName: values.lastName,
//         email: values.email,
//         gender: values.gender,
//         phone: values.phone,
//         address: values.address,
//         birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
//       };

//       // Append the user data as a Blob
//       formData.append('users', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

//       // Append the image file if it exists
//       if (fileList.length > 0) {
//         formData.append('image', fileList[0].originFileObj);
//       }

//       // Send the request to update user data
//       await api.put(`/users/update/${values.email}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

//       // Show success message
//       toast.success('Chỉnh sửa thông tin thành công!');
//       setIsEditing(false); // Exit editing mode
//     } catch (error) {
//       // Show error message
//       toast.error('Chỉnh sửa thông tin không thành công!');
//       console.error("Error updating user data:", error); // Log the error for debugging
//     }
//   };

//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   const handleCancelClick = () => {
//     setIsEditing(false);
//     form.setFieldsValue(userData); // Reset form values to original user data
//   };

//   return (
//     <div className="profile-container">
//       <Form form={form} layout="vertical">
//         <h1>Thông tin tài khoản</h1>
//         <Row gutter={16}>
//           <Col span={8}><Form.Item name="firstName" label="Tên"><Input disabled={!isEditing} /></Form.Item></Col>
//           <Col span={8}><Form.Item name="lastName" label="Họ"><Input disabled={!isEditing} /></Form.Item></Col>
//           <Col span={8}><Form.Item name="gender" label="Giới tính">
//             <Select disabled={!isEditing}><Option value="other">Khác</Option><Option value="men">Nam</Option><Option value="women">Nữ</Option></Select>
//           </Form.Item></Col>
//         </Row>
//         <Row gutter={16}>
//           <Col span={8}><Form.Item name="email" label="Email"><Input disabled /></Form.Item></Col>
//           <Col span={8}><Form.Item name="phone" label="Số điện thoại"><Input disabled={!isEditing} /></Form.Item></Col>
//           <Col span={8}><Form.Item name="birthDate" label="Ngày sinh"><DatePicker disabled={!isEditing} /></Form.Item></Col>
//         </Row>
//         <Row>
//           <Col span={24}><Form.Item name="address" label="Địa chỉ"><Input disabled={!isEditing} /></Form.Item></Col>
//         </Row>
//         <Row gutter={16}>
//           <Col span={12}>
//             <Upload fileList={fileList} beforeUpload={() => false} disabled={!isEditing}>
//               <Button disabled={!isEditing}>Tải ảnh đại diện lên</Button>
//             </Upload>
//           </Col>
//           <Col span={12} style={{ textAlign: 'right' }}>
//             {isEditing ? (
//               <>
//                 <Button type="primary" onClick={handleSubmit} style={{ marginRight: 8 }}>Lưu</Button>
//                 <Button type="default" onClick={handleCancelClick}>Hủy</Button>
//               </>
//             ) : (
//               <Button type="primary" onClick={handleEditClick}>Chỉnh sửa thông tin</Button>
//             )}
//           </Col>
//         </Row>
//       </Form>
//       <ToastContainer />
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import "./Profile.css";
import { Form, Input, DatePicker, Upload, Button, Select, message, Row, Col } from 'antd';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs'; // Sử dụng dayjs thay vì moment

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
          birthDate: data.birthDate ? dayjs(data.birthDate) : null, // Sử dụng dayjs để chuyển đổi
        });
      } catch (error) {
        message.error("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [form]);

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
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null, // Sử dụng dayjs để định dạng
      };

      formData.append('users', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      await api.put(`/users/update/${values.email}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Chỉnh sửa thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Chỉnh sửa thông tin không thành công!');
      console.error("Error updating user data:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    form.setFieldsValue(userData); // Reset form values to original user data
  };

  return (
    <div className="profile-container">
      <Form form={form} layout="vertical">
        <h1>Thông tin tài khoản</h1>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="firstName" label="Tên"><Input disabled={!isEditing} /></Form.Item></Col>
          <Col span={8}><Form.Item name="lastName" label="Họ"><Input disabled={!isEditing} /></Form.Item></Col>
          <Col span={8}><Form.Item name="gender" label="Giới tính">
            <Select disabled={!isEditing}><Option value="other">Khác</Option><Option value="men">Nam</Option><Option value="women">Nữ</Option></Select>
          </Form.Item></Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="email" label="Email"><Input disabled /></Form.Item></Col>
          <Col span={8}><Form.Item name="phone" label="Số điện thoại"><Input disabled={!isEditing} /></Form.Item></Col>
          <Col span={8}><Form.Item name="birthDate" label="Ngày sinh">
            <DatePicker disabled={!isEditing} format="YYYY-MM-DD" />
          </Form.Item></Col>
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
                <Button type="primary" onClick={handleSubmit} style={{ marginRight: 8 }}>Lưu</Button>
                <Button type="default" onClick={handleCancelClick}>Hủy</Button>
              </>
            ) : (
              <Button type="primary" onClick={handleEditClick}>Chỉnh sửa thông tin</Button>
            )}
          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </div>
  );
}