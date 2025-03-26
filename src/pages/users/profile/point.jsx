import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, Radio, Timeline} from 'antd';
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
            key: 1,
            date: wallet.createdAt,
            points: wallet.balance,
            note: 'Tạo ví điểm thưởng'
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

  const [mode, setMode] = useState('left');
  const onChange = e => {
    setMode(e.target.value);
  };

  return (
    <>
      <h1>Quản lý điểm thưởng</h1>
      <div style={{ margin: 16 }}>
        <div >
          <strong>Tổng điểm hiện có:</strong> {totalPoints}
        </div>
        <div>
          <strong>Tương ứng:</strong> {formatPrice(totalPoints)} ₫
        </div>
      </div>

      <Radio.Group
        onChange={onChange}
        value={mode}
        style={{
          marginBottom: 20,
        }}
      >
        <Radio value="left">Left</Radio>
        <Radio value="right">Right</Radio>
        <Radio value="alternate">Alternate</Radio>
      </Radio.Group>
      <Timeline
        mode={mode}
        items={[
          {
            label: '2015-09-01',
            children: 'Create a services',
          },
          {
            label: '2015-09-01 09:12:11',
            children: 'Solve initial network problems',
          },
          {
            children: 'Technical testing',
          },
          {
            label: '2015-09-01 09:12:11',
            children: 'Network problems being solved',
          },
        ]}
      />
    </>


  );
};

export default Point;