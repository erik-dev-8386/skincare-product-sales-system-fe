// import React, { useEffect, useState } from 'react';
// import { Card, Button, Select, Spin, Form, Input, Modal, notification, Upload, DatePicker, Row, Col } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import api from '../../../config/api';
// import moment from 'moment';
// import './ProfilePage.css'; // Import your CSS file

// const { Option } = Select;

// const ProfilePage = () => {
//     const [users, setUsers] = useState([]);
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [form] = Form.useForm();

//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         setLoading(true);
//         try {
//             const response = await api.get('/users');
//             setUsers(response.data);
//             if (response.data.length > 0) {
//                 setUser(response.data[0]);
//             }
//         } catch (error) {
//             console.error("Error fetching users:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleUserChange = async (userId) => {
//         setLoading(true);
//         try {
//             const response = await api.get(`/users/${userId}`);
//             setUser(response.data);
//         } catch (error) {
//             console.error("Error fetching user data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEdit = () => {
//         form.setFieldsValue({
//             ...user,
//             birthDate: user.birthDate ? moment(user.birthDate) : null,
//         });
//         setIsModalVisible(true);
//     };

//     const handleDelete = () => {
//         Modal.confirm({
//             title: 'Confirm Deletion',
//             content: 'Do you want to delete your account?',
//             onOk: async () => {
//                 setLoading(true);
//                 try {
//                     await api.delete(`/users/${user.userId}`);
//                     notification.success({ message: 'User deleted successfully!' });
//                     fetchUsers();
//                     setUser(null);
//                 } catch (error) {
//                     console.error("Error deleting user:", error);
//                     notification.error({ message: 'Error deleting user!' });
//                 } finally {
//                     setLoading(false);
//                 }
//             },
//         });
//     };

//     const handleFinish = async (values) => {
//         setLoading(true);
//         try {
//             if (values.avatar && values.avatar.fileList.length > 0) {
//                 const formData = new FormData();
//                 formData.append('file', values.avatar.fileList[0].originFileObj);
//                 await api.post(`/users/${user.userId}/upload-avatar`, formData);
//             }

//             await api.put(`/users/${user.userId}`, {
//                 ...values,
//                 birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
//             });
//             notification.success({ message: 'User updated successfully!' });
//             fetchUsers();
//             setIsModalVisible(false);
//         } catch (error) {
//             console.error("Error updating user:", error);
//             notification.error({ message: 'Error updating user!' });
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <Spin size="large" />;
//     }

//     return (
//         <div className="profile-container">
//             <Select 
//                 defaultValue={user ? user.userId : ''} 
//                 onChange={handleUserChange} 
//                 className="user-select"
//             >
//                 {users.map((u) => (
//                     <Option key={u.userId} value={u.userId}>
//                         {u.firstName} {u.lastName}
//                     </Option>
//                 ))}
//             </Select>
//             {user && (
//                 <Card title="User Profile" className="profile-card">
//                     <Row gutter={16}>
//                         <Col span={12}><strong>Avatar:</strong></Col>
//                         <Col span={12}>
//                             <img src={user.image || 'default-avatar.png'} alt="Avatar" className="avatar" />
//                         </Col>
//                         <Col span={12}><strong>First Name:</strong></Col>
//                         <Col span={12}>{user.firstName}</Col>
//                         <Col span={12}><strong>Last Name:</strong></Col>
//                         <Col span={12}>{user.lastName}</Col>
//                         <Col span={12}><strong>Email:</strong></Col>
//                         <Col span={12}>{user.email}</Col>
//                         <Col span={12}><strong>Gender:</strong></Col>
//                         <Col span={12}>{user.gender || "N/A"}</Col>
//                         <Col span={12}><strong>Address:</strong></Col>
//                         <Col span={12}>{user.address || "N/A"}</Col>
//                         <Col span={12}><strong>Birth Date:</strong></Col>
//                         <Col span={12}>{user.birthDate ? moment(user.birthDate).format('YYYY-MM-DD') : "N/A"}</Col>
//                         <Col span={12}><strong>Rating:</strong></Col>
//                         <Col span={12}>{user.rating}</Col>
//                         <Col span={12}><strong>Role:</strong></Col>
//                         <Col span={12}>{user.role === 1 ? "Admin" : "User"}</Col>
//                         <Col span={12}><strong>Status:</strong></Col>
//                         <Col span={12}>{user.status === 0 ? "Inactive" : "Active"}</Col>
//                     </Row>
//                     <div className="button-group">
//                         <Button type="primary" onClick={handleEdit}>Edit Profile</Button>
//                         <Button type="danger" onClick={handleDelete}>Delete User</Button>
//                     </div>
//                 </Card>
//             )}

//             <Modal
//                 title="Edit User"
//                 visible={isModalVisible}
//                 onCancel={() => setIsModalVisible(false)}
//                 footer={[
//                     <Button key="back" onClick={() => setIsModalVisible(false)}>
//                         Close
//                     </Button>,
//                     <Button key="submit" type="primary" onClick={() => form.submit()}>
//                         Update User
//                     </Button>,
//                 ]}
//             >
//                 <Form form={form} onFinish={handleFinish} layout="vertical">
//                     <Form.Item name="avatar" label="Upload Avatar">
//                         <Upload beforeUpload={() => false} accept="image/*">
//                             <Button icon={<UploadOutlined />}>Click to upload</Button>
//                         </Upload>
//                     </Form.Item>
//                     <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="gender" label="Gender">
//                         <Select>
//                             <Option value="male">Male</Option>
//                             <Option value="female">Female</Option>
//                             <Option value="other">Other</Option>
//                         </Select>
//                     </Form.Item>
//                     <Form.Item name="address" label="Address">
//                         <Input />
//                     </Form.Item>
//                     <Form.Item name="birthDate" label="Birth Date">
//                         <DatePicker style={{ width: '100%' }} />
//                     </Form.Item>
//                     <Form.Item name="rating" label="Rating">
//                         <Input type="number" />
//                     </Form.Item>
//                     <Form.Item name="role" label="Role" initialValue={user.role}>
//                         <Select>
//                             <Option value={1}>Admin</Option>
//                             <Option value={0}>User</Option>
//                         </Select>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default ProfilePage;