import React from 'react';
import { Layout, Menu, Input, Button, Upload, Typography } from 'antd';
import { UploadOutlined, UserOutlined, TeamOutlined, ShoppingOutlined, FileTextOutlined, BarChartOutlined, MessageOutlined, LaptopOutlined } from '@ant-design/icons';
import Header from '../../../component/Header/Header';
import Footer from '../../../component/Footer/Footer';

const { Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: '1', icon: <UserOutlined />, label: 'Bảng điều khiển' },
  { key: '2', icon: <TeamOutlined />, label: 'Quản lý nhân viên' },
  { key: '3', icon: <UserOutlined />, label: 'Quản lý khách hàng' },
  { key: '4', icon: <ShoppingOutlined />, label: 'Quản lý sản phẩm' },
  { key: '5', icon: <FileTextOutlined />, label: 'Quản lý đơn hàng' },
  { key: '6', icon: <BarChartOutlined />, label: 'Báo cáo doanh thu' },
  { key: '7', icon: <MessageOutlined />, label: 'Quản lý câu hỏi đánh giá' },
  { key: '8', icon: <LaptopOutlined />, label: 'Quản lý Blog' },
];

const EmployeeForm = () => {
  return (
    <>
      {/* <Header /> */}
      <Layout style={{backgroundColor:''}}>
        <Sider width={300} style={{ background: '#d9b999', minHeight: '100vh', padding: '25px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'pink', margin: '0 auto' }}></div>
            <h7 style={{ fontWeight: 'bold' ,color:'white'}}>Avatar</h7>
            <h5 style={{ fontWeight: 'bold' ,color:'white', paddingTop:'15px'}}>Chào mừng bạn đã trở lại!</h5>
          </div>
          <Menu mode="vertical" defaultSelectedKeys={['2']} style={{ borderRight: 0 ,borderRadius: '10px' }} items={menuItems} />
        </Sider>
        <Content style={{ padding: '180px', background: '#f5e1c6', minHeight: '100vh' }}>
          <Title style={{ fontWeight: 'bold' ,color:'white'}}level={3}>Tạo nhân viên</Title>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
              <Input placeholder="ID nhân viên" />
              <Input placeholder="Họ và tên" />
              <Input placeholder="Địa chỉ email" />
              <Input placeholder="Địa chỉ thường trú" />
              <Input placeholder="Số điện thoại" />
              <Input placeholder="Ngày tháng năm sinh" />
              <Input placeholder="Nơi sinh" />
              <Input placeholder="Số CMND" />
              <Input placeholder="Ngày cấp" />
              <Input placeholder="Nơi cấp" />
              <Input placeholder="Giới tính" />
              <Input placeholder="Chức vụ" />
              <Input placeholder="Bằng cấp" />
              <Upload>
                <Button icon={<UploadOutlined />}>Ảnh 3x4 nhân viên</Button>
              </Upload>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Button type="primary" style={{ backgroundColor: 'green', marginRight: '10px' }}>Lưu lại</Button>
              <Button type="primary" danger>Hủy bỏ</Button>
            </div>
          </div>
        </Content>
      </Layout>
      {/* <Footer /> */}
    </>
  );
};

export default EmployeeForm;
