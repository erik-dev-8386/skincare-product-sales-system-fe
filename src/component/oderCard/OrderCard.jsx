import React from 'react';
import { Card, List, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, SyncOutlined, CarOutlined, ShoppingCartOutlined, RedoOutlined } from '@ant-design/icons';

const { Text } = Typography;

const getStatusTag = (status) => {
  switch (status) {
    case 0:
      return <Tag icon={<ShoppingCartOutlined />} color="gray">Đã thêm vào giỏ</Tag>;
    case 1:
      return <Tag icon={<ClockCircleOutlined />} color="blue">Chờ xác nhận</Tag>;
    case 2:
      return <Tag icon={<SyncOutlined spin />} color="orange">Đang chuẩn bị</Tag>;
    case 3:
      return <Tag icon={<CarOutlined />} color="cyan">Đang giao hàng</Tag>;
    case 4:
      return <Tag icon={<CheckCircleOutlined />} color="green">Đã giao</Tag>;
    case 5:
      return <Tag icon={<CloseCircleOutlined />} color="red">Đã hủy</Tag>;
    case 6:
      return <Tag icon={<RedoOutlined />} color="purple">Đã trả hàng</Tag>;
    default:
      return <Tag color="default">{status}</Tag>;
  }
};

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const OrderCard = ({ order }) => {
  return (
    <Card style={{ width: '100%', marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong style={{ fontSize: 16 }}>Mã đơn hàng: {order.orderId}</Text>
        {getStatusTag(order.status)}
      </div>
      <Text type="secondary">Ngày đặt hàng: {order.orderTime}</Text>
      <List
        itemLayout="horizontal"
        dataSource={order.items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<img src={item.image} alt={item.productName} style={{ width: 50, height: 50, borderRadius: 4 }} />}
              title={<Text>{item.productName}</Text>}
              description={`Số lượng: ${item.quantity} - Giá: ${formatPrice(item.discountPrice)}đ`}
            />
          </List.Item>
        )}
      />
      <Text strong style={{ fontSize: 16, color: '#d0021b' }}>Tổng tiền: {formatPrice(order.totalAmount)}đ</Text>
    </Card>
  );
};

export default OrderCard;
