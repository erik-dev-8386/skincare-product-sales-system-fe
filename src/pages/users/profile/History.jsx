import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Spin, message } from 'antd';
import OrderCard from '../../../component/oderCard/OrderCard';
import api from '../../../config/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API để lấy dữ liệu lịch sử mua hàng
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        message.error('Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
    <h1>Lịch sử mua hàng</h1>
    {/* <h5>Dưới đây là lịch sử mua hàng của quý khách</h5> */}
    <div style={{ padding: '24px' }}>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={orders}
        renderItem={(order) => (
          <List.Item>
            <OrderCard order={order} /> {/* Sử dụng OrderCard ở đây */}
          </List.Item>
        )}
      />
    </div>
    </>
  );
};

export default OrderHistory;