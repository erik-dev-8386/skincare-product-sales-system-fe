
import React, { useEffect, useState } from 'react';
import { List, Spin, message, Dropdown, Button, Space, Tabs, Badge } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import OrderCard from '../../../component/oderCard/OrderCard';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import "./History.css"

const OrderHistory = () => {
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('default');
  const [activeStatus, setActiveStatus] = useState('all');

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const email = decodedToken?.sub;

  const statusLabels = {
    all: "Tất cả",
    // 0: "Chưa thanh toán",
    1: "Chờ xác nhận",
    2: "Đang chuẩn bị",
    3: "Đang giao hàng",
    4: "Đã giao",
    5: "Đã hủy",
    6: "Trả hàng"
  };

  const fetchOrders = async (sortType = 'default') => {
    if (!token || !email) {
      toast.error("Không tìm thấy token. Làm ơn hãy đăng nhập.");
      return;
    }

    try {
      setLoading(true);
      let response;

      if (sortType === 'desc') {
        response = await api.get(`/orders/sort-desc/${email}`);
      } else if (sortType === 'asc') {
        response = await api.get(`/orders/sort-asc/${email}`);
      } else {
     
        response = await api.get(`/cart/${email}`);
      }

     
      const formattedOrders = response.data.map(order => ({
        ...order,
        items: order.productName?.map(product => ({
          productName: product.productName,
          quantity: product.quantity,
          discountPrice: product.discountPrice,
          image: product.imageUrl,
        })) || [], 
      }));

      setAllOrders(formattedOrders);
      filterOrdersByStatus(activeStatus, formattedOrders);
      setSortMethod(sortType);
    } catch (error) {
      toast.error('Failed to fetch order history');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByStatus = (status, ordersToFilter = allOrders) => {
    if (status === 'all') {
      setFilteredOrders(ordersToFilter);
    } else {
      const filtered = ordersToFilter.filter(order => order.status === Number(status));
      setFilteredOrders(filtered);
    }
    setActiveStatus(status);
  };

  useEffect(() => {
    fetchOrders();
  }, [email]);

  useEffect(() => {
    filterOrdersByStatus(activeStatus);
  }, [allOrders]);

  const handleOrderCancelled = (orderId) => {
    setAllOrders(prevOrders =>
      prevOrders.map(order =>
        order.orderId === orderId
          ? { ...order, status: 5 }
          : order
      )
    );
  };

  const handleMenuClick = (e) => {
    fetchOrders(e.key);
  };

  const items = [
    {
      label: 'Mặc định',
      key: 'default',
    },
    {
      label: 'Mới nhất',
      key: 'desc',
    },
    {
      label: 'Cũ nhất',
      key: 'asc',
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  const getStatusCount = (status) => {
    if (status === 'all') return allOrders.length;
    return allOrders.filter(order => order.status === Number(status)).length;
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Lịch sử mua hàng</h1>
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              {sortMethod === 'default' ? 'Sắp xếp' : sortMethod === 'desc' ? 'Mới nhất' : 'Cũ nhất'}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>

      {/* Status Filter Tabs */}
      <Tabs
        className='status-tabs'
        activeKey={activeStatus}
        onChange={filterOrdersByStatus}
        type="card"
        style={{ marginBottom: 24 }}
      >
        {Object.entries(statusLabels).map(([key, label]) => (
          <Tabs.TabPane
            key={key}
            tab={
              <Badge count={getStatusCount(key)} offset={[10, -5]}>
                {label}
              </Badge>
            }
          />
        ))}
      </Tabs>

      <div style={{ padding: '24px' }}>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={filteredOrders}
          renderItem={(order) => (
            <List.Item>
              <OrderCard
                order={order}
                onOrderCancelled={handleOrderCancelled}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default OrderHistory;


