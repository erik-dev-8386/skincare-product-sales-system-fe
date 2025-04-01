

import React, { useContext, useEffect, useState } from 'react';
import { Result, Button, Card, Row, Col, Typography, Divider, Steps, Spin, Image } from 'antd';
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  CarOutlined,
  SmileOutlined,
  CloseCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import api from '../../../config/api';
import { toast } from 'react-toastify';
import { CartContext } from "../../../context/CartContext";


const { Title, Text } = Typography;
const { Step } = Steps;

const SuccessPayment = () => {
  const { setCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async (productId) => {
      try {
        const response = await api.get(`/products/${productId}`);
        return {
          name: response.data.productName,
          image: response.data.productImages[0]?.imageURL || '' 
        };
      } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return {
          name: `Sản phẩm ${productId}`,
          image: ''
        };
      }
    };

    const processPayment = async () => {
      try {
        const orderId = searchParams.get('orderId') || location.state?.orderId;
        const resultCode = searchParams.get('resultCode');
        const requestId = searchParams.get('requestId');
        const amount = searchParams.get('amount');

        if (!orderId) {
          setError('Không tìm thấy mã đơn hàng');
          setLoading(false);
          return;
        }


        const { data: orderData } = await api.get(`/orders/${orderId}`);

        const initialOrderDetails = {
          orderId: orderData.orderId,
          date: new Date(orderData.orderTime).toLocaleDateString('vi-VN'),
          totalAmount: `${orderData.totalAmount.toLocaleString('vi-VN')} đ`,
          paymentMethod: orderData.transactionType = 1 ? 'Ví điện tử Momo' : 'COD',
          shippingAddress: orderData.address,
          customerName: `${orderData.customerFirstName} ${orderData.customerLastName}`,
          customerPhone: orderData.customerPhone,
          items: orderData.orderDetails?.map(detail => ({
            id: detail.productId,
            name: 'Đang tải...',
            image: null,
            price: `${detail.discountPrice.toLocaleString('vi-VN')} đ`,
            quantity: detail.quantity
          })) || []
        };

        setOrderDetails(initialOrderDetails);
        setProductsLoading(true);


        const productDetails = await Promise.all(
          orderData.orderDetails?.map(async (detail) => {
            const productInfo = await fetchProductDetails(detail.productId);
            return {
              id: detail.productId,
              ...productInfo,
              price: `${detail.discountPrice.toLocaleString('vi-VN')} đ`,
              quantity: detail.quantity
            };
          }) || []
        );


        setOrderDetails(prev => ({
          ...prev,
          items: productDetails
        }));
        setProductsLoading(false);


        if (resultCode !== null) {
          const payload = {
            orderId,
            requestId: requestId || '',
            resultCode: parseInt(resultCode),
            amount: amount && !isNaN(amount) ? parseInt(amount) : undefined
          };

          const response = await api.post('/momo/ipn-handler-new', payload);
          if (response.status === 200) {
            const success = parseInt(resultCode) === 0;
            setPaymentStatus(success ? 'success' : 'failed');
            if (success) {
              toast.success('Thanh toán thành công qua Momo');
              setCart([]);
            }
          }
        } else {
          setPaymentStatus('success');
          setCart([]);
        }

      } catch (err) {
        console.error('Lỗi xử lý đơn hàng:', err);
        setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi xử lý đơn hàng');
        setPaymentStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams, location.state, setCart]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} tip="Đang xử lý đơn hàng..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Result
          status="error"
          title="Đã xảy ra lỗi"
          subTitle={error}
          extra={<Button type="primary" onClick={() => navigate('/')}>Về Trang Chủ</Button>}
        />
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Result
          status="error"
          title="Thanh Toán Thất Bại!"
          subTitle="Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."
          extra={[
            <Button type="primary" key="retry" onClick={() => navigate('/shopping-cart', { state: { orderId: orderDetails?.orderId } })}>
              Thử lại thanh toán
            </Button>,
            <Button key="contact" onClick={() => navigate('/about-us')}>Liên hệ hỗ trợ</Button>,
          ]}
        />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Result
          status="warning"
          title="Không tìm thấy thông tin đơn hàng"
          subTitle={`Mã đơn hàng: ${searchParams.get('orderId')}`}
          extra={[
            <Button key="home" type="primary" onClick={() => navigate('/')}>Về Trang Chủ</Button>,
            <Button key="contact" onClick={() => navigate('/about-us')}>Liên hệ hỗ trợ</Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Result
        status="success"
        title="Thanh Toán Thành Công!"
        subTitle={`Mã đơn hàng: ${orderDetails.orderId}. Cảm ơn bạn đã mua sắm!`}
        extra={[
          <Button type="primary" key="home" onClick={() => navigate('/')} icon={<ShoppingOutlined />}>Về Trang Chủ</Button>,
          <Button key="order" onClick={() => navigate('/user/history', { state: { orderId: orderDetails.orderId } })}>Xem Chi Tiết Đơn Hàng</Button>,
        ]}
      />

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card title="Chi tiết đơn hàng" bordered={false}>
            <Steps current={paymentStatus === 'success' ? 1 : 0} responsive >
              <Step title="Đặt hàng" icon={<ShoppingOutlined />} status="finish" />
              <Step
                title="Thanh toán"
                icon={paymentStatus === 'success' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                status={paymentStatus === 'success' ? 'finish' : paymentStatus === 'failed' ? 'error' : 'process'}
              />
              <Step
                title="Vận chuyển"
                icon={<CarOutlined />}
                status="wait"
                style={{ opacity: 0.5 }}
              />
              <Step
                title="Hoàn thành"
                icon={<SmileOutlined />}
                status="wait"
                style={{ opacity: 0.5 }}
              />
            </Steps>

            <Divider />

            <h5>Sản phẩm đã mua</h5>
            {productsLoading ? (
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            ) : (
              orderDetails.items.map(item => (
                <div key={item.id} style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover' }}
                      fallback="fallback-image.jpg"
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block', marginBottom: '4px' }}>{item.name}</Text>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '4px' }}>
                      Số lượng: {item.quantity}
                    </Text>
                    <Text strong style={{ color: '#1890ff' }}>{item.price}</Text>
                  </div>
                </div>
              ))
            )}

            <Divider />

            <div style={{ textAlign: 'right' }}>
              <Text strong>Tổng cộng: </Text>
              <Title level={4} style={{ marginTop: '8px', color: '#1890ff' }}>
                {orderDetails.totalAmount}
              </Title>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Thông tin giao hàng" bordered={false}>
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Khách hàng:</Text>
              <Text style={{ display: 'block' }}>{orderDetails.customerName}</Text>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Số điện thoại:</Text>
              <Text style={{ display: 'block' }}>{orderDetails.customerPhone}</Text>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Phương thức thanh toán:</Text>
              <Text style={{ display: 'block' }}>{orderDetails.paymentMethod}</Text>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>Ngày đặt hàng:</Text>
              <Text style={{ display: 'block' }}>{orderDetails.date}</Text>
            </div>

            <div>
              <Text strong>Địa chỉ nhận hàng:</Text>
              <Text style={{ display: 'block' }}>{orderDetails.shippingAddress}</Text>
            </div>

            <Divider />

            <Button type="primary" block onClick={() => window.print()}>In hóa đơn</Button>
          </Card>
        </Col>
      </Row>

      <Divider />

      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Text type="secondary">
          Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi. Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ hỗ trợ khách hàng.
        </Text>
      </div>
    </div>
  );
};

export default SuccessPayment;