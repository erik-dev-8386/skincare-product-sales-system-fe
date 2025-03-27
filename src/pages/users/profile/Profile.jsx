// import React, { useState, useEffect } from 'react';
// import { Form, Input, DatePicker, Upload, Button, Select, message, Row, Col, Image } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import api from '../../../config/api';
// import { jwtDecode } from 'jwt-decode';
// import { ToastContainer, toast } from 'react-toastify';
// import dayjs from 'dayjs';
// import './Profile.css'; // Đảm bảo import file CSS

// const { Option } = Select;

// export default function Profile() {
//   const [form] = Form.useForm();
//   const [fileList, setFileList] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [userData, setUserData] = useState({});
//   const [totalPoints, setTotalPoints] = useState(0);

//   // Fetch user data on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("No token found. Please login.");
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
//           birthDate: data.birthDate ? dayjs(data.birthDate) : null,
//         });

//         // Nếu có ảnh đại diện, set preview ảnh
//         if (data.image) {
//           setImagePreviews([data.image]);
//         }
//       } catch (error) {
//         message.error("Failed to fetch user data.");
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, [form]);

//   // Handle form submission
//   const handleSubmit = async () => {
//     try {
//       const values = await form.validateFields();

//       const formData = new FormData();
//       const userData = {
//         firstName: values.firstName,
//         lastName: values.lastName,
//         email: values.email,
//         gender: values.gender,
//         phone: values.phone,
//         address: values.address,
//         birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
//       };

//       formData.append('users', new Blob([JSON.stringify(userData)], { type: 'application/json' }));

//       if (fileList.length > 0) {
//         formData.append('image', fileList[0].originFileObj); // Append the image file
//       }

//       const response = await api.put(`/users/update/${values.email}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       toast.success('Chỉnh sửa thông tin thành công!');
//       setIsEditing(false);
//       setUserData(response.data); // Update user data with the new data from the server
//     } catch (error) {
//       toast.error('Chỉnh sửa thông tin không thành công!');
//       console.error("Error updating user data:", error);
//     }
//   };

//   // Handle edit button click
//   const handleEditClick = () => {
//     setIsEditing(true);
//   };

//   // Handle cancel button click
//   const handleCancelClick = () => {
//     setIsEditing(false);
//     form.setFieldsValue({
//       ...userData,
//       birthDate: userData.birthDate ? dayjs(userData.birthDate) : null, // Đảm bảo birthDate là dayjs
//     });
//     setFileList([]); // Clear the file list
//     setImagePreviews(userData.image ? [userData.image] : []); // Reset image previews
//   };

//   // Handle file upload
//   const handleFileChange = ({ fileList }) => {
//     setFileList(fileList);
//     if (fileList.length > 0) {
//       setImagePreviews([URL.createObjectURL(fileList[0].originFileObj)]);
//     } else {
//       setImagePreviews([]);
//     }
//   };

//   const formatPrice = (price) => {
//     return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage
//     if (token) {
//       const decoded = jwtDecode(token);
//       const email = decoded.sub;

//       api.get(`/coinWallets/email/${email}`)
//         .then(response => {
//           const wallet = response.data;
//           setPointsData([{
//             key: 1,

//             points: wallet.balance,
//             note: 'Tạo ví điểm thưởng'
//           }]);
//           setTotalPoints(wallet.balance || 0);
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching wallet data:', error);
//           setLoading(false);
//         });
//     }
//   }, []);

//   return (
//     <>
//       <ToastContainer />
//       <div className="user-profile-page">
//         <div className="profile-container">
//           <div className="profile-card">
//             <div className="profile-header">
//               <div className="profile-cover"></div>
//               <div className="profile-avatar-wrapper">
//                 {imagePreviews.length > 0 ? (
//                   <Image

//                     src={imagePreviews[0]}
//                     alt="Avatar Preview"
//                     className="profile-avatar"
//                   />
//                 ) : (
//                   <div className="profile-avatar-placeholder">
//                     {userData.firstName ? userData.firstName[0] : ''}
//                   </div>
//                 )}
//                 {isEditing && (
//                   <Upload
//                     fileList={fileList}
//                     beforeUpload={() => false}
//                     onChange={handleFileChange}
//                     className="avatar-upload-overlay"
//                   >
//                     <Button icon={<UploadOutlined />} className="upload-button">
//                       Thay đổi ảnh
//                     </Button>
//                   </Upload>
//                 )}
//               </div>
//               <h1 className="profile-name">
//                 {userData.firstName} {userData.lastName}
//               </h1>
//             </div>

//             <Form form={form} layout="vertical" className="profile-form">
//               <div className="form-grid">
//                 <div className="form-section">
//                   <h2 className="section-title">Thông tin cá nhân</h2>
//                   <div className="form-row">
//                     <Form.Item name="firstName" label="Tên">
//                       <Input disabled={!isEditing} />
//                     </Form.Item>
//                     <Form.Item name="lastName" label="Họ">
//                       <Input disabled={!isEditing} />
//                     </Form.Item>
//                   </div>

//                   <div className="form-row">
//                     <Form.Item name="gender" label="Giới tính">
//                       <Select disabled={!isEditing}>
//                         <Option value="nam">Nam</Option>
//                         <Option value="nữ">Nữ</Option>
//                         <Option value="khác">Khác</Option>
//                       </Select>
//                     </Form.Item>
//                     <Form.Item name="birthDate" label="Ngày sinh">
//                       <DatePicker
//                         disabled={!isEditing}
//                         format="DD/MM/YYYY"
//                         style={{ width: '100%' }}
//                       />
//                     </Form.Item>
//                   </div>
//                   <div style={{ margin: 16 }}>
//                     <div >
//                       <strong>Tổng điểm hiện có:</strong> {totalPoints}
//                     </div>
//                     <div>
//                       <strong>Tương ứng:</strong> {formatPrice(totalPoints)} ₫
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-section">
//                   <h2 className="section-title">Thông tin liên hệ</h2>
//                   <Form.Item name="email" label="Email">
//                     <Input disabled />
//                   </Form.Item>
//                   <Form.Item name="phone" label="Số điện thoại">
//                     <Input disabled={!isEditing} />
//                   </Form.Item>
//                   <Form.Item name="address" label="Địa chỉ">
//                     <Input disabled={!isEditing} />
//                   </Form.Item>
//                 </div>
//               </div>

//               <div className="profile-actions">
//                 {isEditing ? (
//                   <div className="action-buttons">
//                     <Button
//                       type="primary"
//                       onClick={handleSubmit}
//                       className="save-button"
//                       style={{
//                         backgroundColor: '#900001',
//                         borderColor: '#900001'
//                       }}
//                     >
//                       Lưu thay đổi
//                     </Button>
//                     <Button
//                       onClick={handleCancelClick}
//                       className="cancel-button"
//                       style={{
//                         color: '#900001',
//                         borderColor: '#900001'
//                       }}
//                     >
//                       Hủy
//                     </Button>
//                   </div>
//                 ) : (
//                   <Button
//                     type="primary"
//                     onClick={handleEditClick}
//                     className="edit-button"
//                     style={{
//                       backgroundColor: '#900001',
//                       borderColor: '#900001'
//                     }}
//                   >
//                     Chỉnh sửa thông tin
//                   </Button>
//                 )}
//               </div>
//             </Form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
//================================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, DatePicker, Upload, Button, Select, message, Row, Col, Image, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import dayjs from 'dayjs';
import './Profile.css';

const { Option } = Select;

export default function Profile() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  // Memoized function to format price
  const formatPrice = useCallback((price) => {
    return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || '0';
  }, []);

  // Fetch user data and points
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để xem thông tin");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.sub;

        // Fetch user data and wallet data in parallel
        const [userResponse, walletResponse] = await Promise.all([
          api.get(`/users/${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/coinWallets/email/${userEmail}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        const userData = userResponse.data;
        const walletData = walletResponse.data;

        setUserData(userData);
        setTotalPoints(walletData.balance || 0);

        form.setFieldsValue({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          gender: userData.gender,
          phone: userData.phone,
          address: userData.address,
          birthDate: userData.birthDate ? dayjs(userData.birthDate) : null,
        });

        if (userData.image) {
          setImagePreviews([userData.image]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        return;
      }

      const formData = new FormData();
      const updatedUserData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        gender: values.gender,
        phone: values.phone,
        address: values.address,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
      };

      formData.append('users', new Blob([JSON.stringify(updatedUserData)], { 
        type: 'application/json' 
      }));

      if (fileList.length > 0) {
        formData.append('image', fileList[0].originFileObj);
      }

      const response = await api.put(
        `/users/update/${values.email}`, 
        formData,
        {
          headers: { 
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          },
        }
      );

      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setUserData(response.data);
      setFileList([]);
      
      // Update image preview if new image was uploaded
      if (fileList.length > 0) {
        setImagePreviews([URL.createObjectURL(fileList[0].originFileObj)]);
      } else if (response.data.image) {
        setImagePreviews([response.data.image]);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error('Cập nhật thông tin không thành công!');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    form.setFieldsValue({
      ...userData,
      birthDate: userData?.birthDate ? dayjs(userData.birthDate) : null,
    });
    setFileList([]);
    setImagePreviews(userData?.image ? [userData.image] : []);
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImagePreviews(
      newFileList.length > 0 
        ? [URL.createObjectURL(newFileList[0].originFileObj)] 
        : userData?.image ? [userData.image] : []
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <p>Không thể tải thông tin người dùng</p>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="user-profile-page">
        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-cover"></div>
              <div className="profile-avatar-wrapper">
                {/* {imagePreviews.length > 0 ? (
                  <Image
                    src={imagePreviews[0]}
                    alt="Avatar"
                    className="profile-avatar"
                    preview={false}
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {userData.firstName?.[0] || ''}
                  </div>
                )} */}

                {imagePreviews.length > 0 ? (
                  <Image

                     src={imagePreviews[0]}
                    alt="Avatar Preview"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="profile-avatar-placeholder">
                    {userData.firstName ? userData.firstName[0] : ''}
                  </div>
                )}
                {isEditing && (
                  <Upload
                    fileList={fileList}
                    beforeUpload={() => false}
                    onChange={handleFileChange}
                    className="avatar-upload-overlay"
                    accept="image/*"
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />} className="upload-button">
                      Thay đổi ảnh
                    </Button>
                  </Upload>
                )}
              </div>
              <h1 className="profile-name">
                {userData.firstName} {userData.lastName}
              </h1>
            </div>

            <Form form={form} layout="vertical" className="profile-form">
              <div className="form-grid">
                <div className="form-section">
                  <h2 className="section-title">Thông tin cá nhân</h2>
                  <div className="form-row">
                    <Form.Item 
                      name="firstName" 
                      label="Tên"
                      rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                      <Input disabled={!isEditing} />
                    </Form.Item>
                    <Form.Item 
                      name="lastName" 
                      label="Họ"
                      rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                    >
                      <Input disabled={!isEditing} />
                    </Form.Item>
                  </div>

                  <div className="form-row">
                    <Form.Item 
                      name="gender" 
                      label="Giới tính"
                      rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                    >
                      <Select disabled={!isEditing}>
                        <Option value="nam">Nam</Option>
                        <Option value="nữ">Nữ</Option>
                        <Option value="khác">Khác</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="birthDate" label="Ngày sinh">
                      <DatePicker
                        disabled={!isEditing}
                        format="DD/MM/YYYY"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </div>
                  <div className="points-info">
                    <div>
                      <strong>Tổng điểm hiện có:</strong> {totalPoints}
                    </div>
                    <div>
                      <strong>Tương ứng:</strong> {formatPrice(totalPoints)} ₫
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h2 className="section-title">Thông tin liên hệ</h2>
                  <Form.Item name="email" label="Email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item 
                    name="phone" 
                    label="Số điện thoại"
                    rules={[
                      { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' }
                    ]}
                  >
                    <Input disabled={!isEditing} maxLength={10} />
                  </Form.Item>
                  <Form.Item name="address" label="Địa chỉ">
                    <Input.TextArea disabled={!isEditing} rows={3} />
                  </Form.Item>
                </div>
              </div>

              <div className="profile-actions">
                {isEditing ? (
                  <div className="action-buttons">
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      className="save-button"
                      style={{
                        backgroundColor: '#900001',
                        borderColor: '#900001'
                      }}
                    >
                      Lưu thay đổi
                    </Button>
                    <Button
                      onClick={handleCancelClick}
                      className="cancel-button"
                      style={{
                        color: '#900001',
                        borderColor: '#900001'
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleEditClick}
                    className="edit-button"
                    style={{
                      backgroundColor: '#900001',
                      borderColor: '#900001'
                    }}
                  >
                    Chỉnh sửa thông tin
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}