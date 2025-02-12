import React from 'react';
import { Layout, Menu, Button, Typography, Pagination } from 'antd';
import { UserOutlined, TeamOutlined, ShoppingOutlined, FileTextOutlined, BarChartOutlined, MessageOutlined, LaptopOutlined } from '@ant-design/icons';
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

const EmployeeList = () => {
  return (
    <>
 
      <Layout>
        <Sider width={250} style={{ background: '#d9b999', minHeight: '100vh', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'pink', margin: '0 auto' }}></div>
            <h7 style={{ fontWeight: 'bold' ,color:'white'}}>Avatar</h7>
            <h5 style={{ fontWeight: 'bold' ,color:'white', paddingTop:'15px'}}>Chào mừng bạn đã trở lại!</h5>
          </div>
         <Menu mode="vertical" defaultSelectedKeys={['2']} style={{ borderRight: 0 ,borderRadius: '10px' }} items={menuItems} />
        </Sider>
        <Content style={{ padding: '50px', background: '#f5e1c6', minHeight: '100vh' }}>
           <a href='/create-staff'>Thêm sản phẩm</a>
          <Title level={3}>Danh sách sản phẩm {'>'} Quản lý sản phẩm</Title>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
            {[1, 2, 3, 4, 5].map((id) => (
              <div key={id} style={{ marginBottom: '15px', padding: '15px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px' }}>
                <span>Sản phẩm {id}:</span>
                <Button style={{ background: 'yellow', borderColor: 'yellow' }}>Xóa</Button>
              </div>
            ))}
            <Pagination defaultCurrent={1} total={200} pageSize={5} style={{ textAlign: 'center', marginTop: '20px' }} />
          </div>
        </Content>
      </Layout>

    </>
  );
};

export default EmployeeList;
