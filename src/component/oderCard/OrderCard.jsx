
// import React, { useState, useEffect } from 'react';
// import { Card, Image, List, Tag, Typography, Button, Modal, toast, Popconfirm } from 'antd';
// import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, SyncOutlined, CarOutlined, ShoppingCartOutlined, RedoOutlined } from '@ant-design/icons';
// import { Link } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import api from '../../config/api';
// import './OrderCard.css'

// const { Text } = Typography;

// const getStatusTag = (status) => {
//   switch (status) {
//     case 0:
//       return <Tag icon={<ShoppingCartOutlined />} color="gray">Đã thêm vào giỏ</Tag>;
//     case 1:
//       return <Tag icon={<ClockCircleOutlined />} color="blue">Chờ xác nhận</Tag>;
//     case 2:
//       return <Tag icon={<SyncOutlined spin />} color="orange">Đang chuẩn bị</Tag>;
//     case 3:
//       return <Tag icon={<CarOutlined />} color="cyan">Đang giao hàng</Tag>;
//     case 4:
//       return <Tag icon={<CheckCircleOutlined />} color="green">Đã giao</Tag>;
//     case 5:
//       return <Tag icon={<CloseCircleOutlined />} color="red">Đã hủy</Tag>;
//     case 6:
//       return <Tag icon={<RedoOutlined />} color="purple">Đã trả hàng</Tag>;
//     default:
//       return <Tag color="default">{status}</Tag>;
//   }
// };

// const formatPrice = (price) => {
//   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
// };

// const fetchProducts = async (productName) => {
//   try {
//     const response = await api.get(`/products/search/${encodeURIComponent(productName)}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return null;
//   }
// };

// const OrderCard = ({ order, onOrderCancelled }) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [productIds, setProductIds] = useState({});
//   const [cancelling, setCancelling] = useState(false);

//   useEffect(() => {
//     const fetchProductIds = async () => {
//       const ids = {};
//       for (const item of order.items) {
//         const products = await fetchProducts(item.productName);
//         if (products && products.length > 0) {
//           ids[item.productName] = products[0].productId;
//         }
//       }
//       setProductIds(ids);
//     };

//     fetchProductIds();
//   }, [order.items]);

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleOk = () => {
//     setIsModalVisible(false);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   // Function to check if order can be cancelled
//   // Generally orders can be cancelled when they are in "Chờ xác nhận" (1) or "Đang chuẩn bị" (2) state
//   const canBeCancelled = () => {
//     return order.status === 1 || order.status === 2;
//   };

//   // Function to handle order cancellation
//   const handleCancelOrder = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Vui lòng đăng nhập để hủy đơn hàng");
//       return;
//     }

//     try {
//       setCancelling(true);
//       const decodedToken = jwtDecode(token);
//       const email = decodedToken.sub;

//       // Call the cancel order API endpoint
//       await api.delete(`/orders/cancel-order/${email}/${order.orderId}`);

//       toast.success("Đơn hàng đã được hủy thành công");

//       // If there's a callback function for updating the parent component
//       if (onOrderCancelled) {
//         onOrderCancelled(order.orderId);
//       }
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//       toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau!");
//     } finally {
//       setCancelling(false);
//     }
//   };

//   return (
//     <Card style={{ width: '100%', marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} >
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
//         <Text strong style={{ fontSize: 16 }}>Mã đơn hàng: {order.orderId}</Text>
//         {getStatusTag(order.status)}
//       </div>
//       <Text type="secondary">Ngày đặt hàng: {new Date(order.orderTime).toLocaleString()}</Text>
//       <List
//         itemLayout="horizontal"
//         dataSource={order.items}
//         renderItem={(item) => (
//           <List.Item>
//             <List.Item.Meta
//               avatar={<Image src={item.image} alt={item.productName} style={{ width: 50, height: 50, borderRadius: 4 }} />}
//               title={
//                 <Link to={`/products/${productIds[item.productName]}`}>
//                   <Text>{item.productName}</Text>
//                 </Link>
//               }
//               description={`Số lượng: ${item.quantity} - Giá: ${formatPrice(item.discountPrice)}đ`}
//             />
//           </List.Item>
//         )}
//       />
//       <Text strong style={{ fontSize: 16, color: '#d0021b' }}>Tổng tiền: {formatPrice(order.totalAmount)}đ</Text>

//       <div className='button-order-card' >
//         <Button
//         className='button-detail'
//           color='primary'
//           variant="solid" 
//           onClick={showModal}
//          >
//           <i className="fa-solid fa-eye"></i> Chi tiết đơn hàng
//         </Button>

//         {canBeCancelled() && (
//           <Popconfirm
//             title="Hủy đơn hàng"
//             description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
//             onConfirm={handleCancelOrder}
//             okText="Đồng ý"
//             cancelText="Hủy bỏ"
//           >
//             <Button
//               className='button-cancel'
//               color='danger'
//               variant="solid"
//               loading={cancelling}
//               icon={<CloseCircleOutlined />}
//             >
//               Hủy đơn hàng
//             </Button>
//           </Popconfirm>
//         )}
//       </div>

//       <Modal
//         title={`Chi tiết đơn hàng #${order.orderId}`}
//         width={"150vh"}
//         visible={isModalVisible}
//         onOk={handleOk}
//         onCancel={handleCancel}
//         footer={[
//           canBeCancelled() && (
//             <Button
//               key="cancel"
//               danger
//               onClick={() => {
//                 handleCancel();
//                 handleCancelOrder();
//               }}
//               loading={cancelling}
//             >
//               Hủy đơn hàng
//             </Button>
//           ),
//           <Button key="back" onClick={handleCancel}>
//             Đóng
//           </Button>,
//         ].filter(Boolean)}
//       >
//         <Text strong>Ngày đặt hàng: {new Date(order.orderTime).toLocaleString()}</Text>
//         <br />
//         <Text strong>Trạng thái: </Text>{getStatusTag(order.status)}
//         <br />
//         <Text strong>Danh sách sản phẩm:</Text>
//         <List
//           itemLayout="horizontal"
//           dataSource={order.items}
//           renderItem={(item) => (
//             <List.Item>
//               <List.Item.Meta
//                 avatar={<Image src={item.image} alt={item.productName} style={{ width: 50, height: 50, borderRadius: 4 }} />}
//                 title={
//                   <Link to={`/products/${productIds[item.productName]}`}>
//                     <Text>{item.productName}</Text>
//                   </Link>
//                 }
//                 description={`Số lượng: ${item.quantity} - Giá: ${formatPrice(item.discountPrice)}đ`}
//               />
//             </List.Item>
//           )}
//         />
//         <Text strong style={{ fontSize: 16, color: '#d0021b' }}>Tổng tiền: {formatPrice(order.totalAmount)}đ</Text>
//       </Modal>
//     </Card>
//   );
// };

// export default OrderCard;

//============================================================================

import React, { useState, useEffect } from 'react';
import { Card, Image, List, Tag, Typography, Button, Modal, Popconfirm } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, SyncOutlined, CarOutlined, ShoppingCartOutlined, RedoOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Thư viện giải mã token
import api from '../../config/api'; // Import API service
import './OrderCard.css';
import { toast, ToastContainer } from 'react-toastify';

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

const OrderCard = ({ order, onOrderCancelled }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productIds, setProductIds] = useState({});
  const [cancelling, setCancelling] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // State để lưu thông tin người dùng

  // Hàm lấy thông tin người dùng từ email
  const fetchUserInfo = async (email) => {
    try {
      const response = await api.get(`/users/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  const fetchProducts = async (productName) => {
  try {
    const response = await api.get(`/products/search/${encodeURIComponent(productName)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
};

  useEffect(() => {
    const fetchProductIds = async () => {
      const ids = {};
      for (const item of order.items) {
        const products = await fetchProducts(item.productName);
        if (products && products.length > 0) {
          ids[item.productName] = products[0].productId;
        }
      }
      setProductIds(ids);
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Giải mã token để lấy email
          const decodedToken = jwtDecode(token);
          const email = decodedToken.sub;

          // Gọi API để lấy thông tin người dùng
          const userData = await fetchUserInfo(email);
          setUserInfo(userData);
        } catch (error) {
          console.error('Error decoding token or fetching user info:', error);
        }
      }
    };

    fetchProductIds();
    fetchUserData();
  }, [order.items]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const canBeCancelled = () => {
    return order.status === 1 || order.status === 2;
  };

  const handleCancelOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để hủy đơn hàng");
      return;
    }

    try {
      setCancelling(true);
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;

      await api.delete(`/orders/cancel-order/${email}/${order.orderId}`);

      toast.success("Đơn hàng đã được hủy thành công");

      if (onOrderCancelled) {
        onOrderCancelled(order.orderId);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau!");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
    <ToastContainer/>
    <Card style={{ width: '100%', marginBottom: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text strong style={{ fontSize: 16 }}>Mã đơn hàng: {order.orderId}</Text>
        {getStatusTag(order.status)}
      </div>
      <Text type="secondary">Ngày đặt hàng: {new Date(order.orderTime).toLocaleString()}</Text>
      <List
        itemLayout="horizontal"
        dataSource={order.items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Image src={item.image} alt={item.productName} style={{ width: 50, height: 50, borderRadius: 4 }} />}
              title={
                <Link to={`/products/${productIds[item.productName]}`}>
                  <Text>{item.productName}</Text>
                </Link>
              }
              description={`Số lượng: ${item.quantity} - Giá: ${formatPrice(item.discountPrice)}đ`}
            />
          </List.Item>
        )}
      />
      <Text strong style={{ fontSize: 16, color: '#d0021b' }}>Tổng tiền: {formatPrice(order.totalAmount)}đ</Text>

      <div className='button-order-card' >
        <Button
          className='button-detail'
          color='primary'
          variant="solid"
          onClick={showModal}
        >
          <i className="fa-solid fa-eye"></i> Chi tiết đơn hàng
        </Button>

        {canBeCancelled() && (
          <Popconfirm
            title="Hủy đơn hàng"
            description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
            onConfirm={handleCancelOrder}
            okText="Đồng ý"
            cancelText="Hủy bỏ"
          >
            <Button
              className='button-cancel'
              color='danger'
              variant="solid"
              loading={cancelling}
              icon={<CloseCircleOutlined />}
            >
              Hủy đơn hàng
            </Button>
          </Popconfirm>
        )}
      </div>

      <Modal
        title={<p style={{backgroundColor: "#900001", width: "100%", color: "white", padding: 10, fontSize: 20}}>Chi tiết đơn hàng #{order.orderId}</p>}
        width={"150vh"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          canBeCancelled() && (
            <Button
              key="cancel"
              danger
              onClick={() => {
                handleCancel();
                handleCancelOrder();
              }}
              loading={cancelling}
            >
              Hủy đơn hàng
            </Button>
          ),
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ].filter(Boolean)}
      >
        <div style={{marginBottom: 10, padding: 10, borderBottom: "2px solid #900001"}}>
        <Text strong>Ngày đặt hàng: {new Date(order.orderTime).toLocaleString()}</Text>
        <br />
        <Text strong>Trạng thái: </Text>{getStatusTag(order.status)}
        </div>
        <br />
        <div style={{display: "flex", flexDirection: "column"}}>
          <div style={{marginBottom: 10, borderBottom: "2px solid #900001", padding: 10}}>
            <Text strong>Thông tin người nhận:</Text>
            {userInfo && (
              <div>
                <Text>Họ và tên: {userInfo.lastName} {userInfo.firstName} </Text>
                <br />
                <Text>Số điện thoại: {userInfo.phone}</Text>
                <br />
                <Text>Email: {userInfo.email}</Text>
                <br />
                <Text>Địa chỉ: {userInfo.address}</Text>
              </div>
            )}
          </div>
          <br />
          <div>
            <Text strong>Phương thức thanh toán:</Text>
            <Text> {order.paymentMethod}</Text>
            <br />
            <Text strong>Danh sách sản phẩm:</Text>
            <List
              itemLayout="horizontal"
              dataSource={order.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Image src={item.image} alt={item.productName} style={{ width: 50, height: 50, borderRadius: 4 }} />}
                    title={
                      <Link to={`/products/${productIds[item.productName]}`}>
                        <Text>{item.productName}</Text>
                      </Link>
                    }
                    description={`Số lượng: ${item.quantity} - Giá: ${formatPrice(item.discountPrice)}đ`}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
        <Text strong style={{ fontSize: 16, color: '#d0021b' }}>Tổng tiền: {formatPrice(order.totalAmount)}đ</Text>
      </Modal>
    </Card>
    </>
  );
};

export default OrderCard;