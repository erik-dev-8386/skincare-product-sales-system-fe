import React, { useEffect, useState } from 'react';
import { Table, Card, Typography } from 'antd';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import api from '../../../config/api';

const { Title } = Typography;

const Point = () => {
  const [pointsData, setPointsData] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage
    if (token) {
      const decoded = jwtDecode(token);
      const email = decoded.sub;

      api.get(`/coinWallets/email/${email}`)
        .then(response => {
          const wallet = response.data;
          setPointsData([{
            key: '1',
            date: '20/03 15:35',
            points: '+30',
            total: 30,
            action: 'Đăng ký thành viên mới',
            content: 'Tài khoản #162972'
          }]);
          setTotalPoints(wallet.balance || 0);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching wallet data:', error);
          setLoading(false);
        });
    }
  }, []);

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Điểm',
      dataIndex: 'points',
      key: 'points',
    },
    {
      title: 'Tổng cuối',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
  ];

  return (
    <Card>
      <Title level={4}>Quản lý điểm thường</Title>
      <div style={{ margin: 16 }}>
      <div >
        <strong>Tổng điểm hiện có:</strong> {totalPoints}
      </div>
      <div>
        <strong>Tương ứng:</strong> {formatPrice(totalPoints)} ₫
      </div>
      </div>
      <Table
        columns={columns}
        dataSource={pointsData}
        loading={loading}
        pagination={false}
      />
      
    </Card>
  );
};

export default Point;