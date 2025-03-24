
// import React, { useEffect, useState } from 'react';
// import { List, Spin, message } from 'antd';
// import OrderCard from '../../../component/oderCard/OrderCard';
// import api from '../../../config/api';
// import { jwtDecode } from 'jwt-decode';
// import { toast, ToastContainer } from 'react-toastify';

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Không tìm thấy token. Làm ơn hãy đăng nhập.");
//       return;
//     }
//     try {
//       setLoading(true);
//       const decodedToken = jwtDecode(token);
//       const email = decodedToken.sub;

//       const response = await api.get(`/cart/${email}`);

//       // Chuyển đổi dữ liệu từ response thành cấu trúc phù hợp với OrderCard
//       const formattedOrders = response.data.map(order => ({
//         ...order,
//         items: order.productName.map(product => ({
//           productName: product.productName,
//           quantity: product.quantity,
//           discountPrice: product.discountPrice,
//           image: product.imageUrl,
//         })),
//       }));

//       setOrders(formattedOrders);
//     } catch (error) {
//       toast.error('Failed to fetch order history');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Function to handle order cancellation
//   const handleOrderCancelled = (orderId) => {
//     // Update the local state to reflect the cancelled order
//     setOrders(prevOrders => 
//       prevOrders.map(order => 
//         order.orderId === orderId 
//           ? { ...order, status: 5 } // 5 is the status code for "Đã hủy"
//           : order
//       )
//     );
//   };

//   if (loading) {
//     return <Spin size="large" />;
//   }

//   return (
//     <>
//     <ToastContainer/>
//       <h1>Lịch sử mua hàng</h1>
      
//       <div style={{ padding: '24px' }}>
//         <List
//           grid={{ gutter: 16, column: 1 }}
//           dataSource={orders}
//           renderItem={(order) => (
//             <List.Item>
//               <OrderCard 
//                 order={order} 
//                 onOrderCancelled={handleOrderCancelled} 
//               />
//             </List.Item>
//           )}
//         />
//       </div>
//     </>
//   );
// };

// export default OrderHistory;

//===================================================================================================
import React, { useEffect, useState } from 'react';
import { List, Spin, message, Dropdown, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import OrderCard from '../../../component/oderCard/OrderCard';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('default');

  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode(token) : null;
  const email = decodedToken?.sub;

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
        // Default fetch without sorting
        response = await api.get(`/cart/${email}`);
      }

      // Format orders data consistently regardless of the endpoint
      const formattedOrders = response.data.map(order => ({
        ...order,
        items: order.productName?.map(product => ({
          productName: product.productName,
          quantity: product.quantity,
          discountPrice: product.discountPrice,
          image: product.imageUrl,
        })) || [], // Handle cases where productName might not exist
      }));

      setOrders(formattedOrders);
      setSortMethod(sortType);
    } catch (error) {
      toast.error('Failed to fetch order history');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [email]);

  const handleOrderCancelled = (orderId) => {
    setOrders(prevOrders => 
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

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
      <ToastContainer/>
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
      
      <div style={{ padding: '24px' }}>
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={orders}
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