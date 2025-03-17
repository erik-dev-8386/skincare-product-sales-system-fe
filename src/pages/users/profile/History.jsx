// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { List, Spin, message } from 'antd';
// import OrderCard from '../../../component/oderCard/OrderCard';
// import api from '../../../config/api';
// import { jwtDecode } from 'jwt-decode';

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);




//   useEffect(() => {
//     // Gọi API để lấy dữ liệu lịch sử mua hàng
//     const fetchOrders = async () => {

//       const token = localStorage.getItem("token");
//       if (!token) {
//         message.error("No token found. Please login.");
//         return;
//       }
//       try {
//         const decodedToken = jwtDecode(token);
//         const email = decodedToken.sub;

    
//         const response = await api.get(`/cart/${email}`);
//         setOrders(response.data);
//       } catch (error) {
//         message.error('Failed to fetch order history');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   if (loading) {
//     return <Spin size="large" />;
//   }

//   return (
//     <>
//     <h1>Lịch sử mua hàng</h1>
//     {/* <h5>Dưới đây là lịch sử mua hàng của quý khách</h5> */}
//     <div style={{ padding: '24px' }}>
//       <List
//         grid={{ gutter: 16, column: 1 }}
//         dataSource={orders}
//         renderItem={(order) => (
//           <List.Item>
//             <OrderCard order={order} /> {/* Sử dụng OrderCard ở đây */}
//           </List.Item>
//         )}
//       />
//     </div>
//     </>
//   );
// };

// export default OrderHistory;


import React, { useEffect, useState } from 'react';
import { List, Spin, message } from 'antd';
import OrderCard from '../../../component/oderCard/OrderCard';
import api from '../../../config/api';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Không tìm thấy token. Làm ơn hãy đăng nhập.");
      return;
    }
    try {
      setLoading(true);
      const decodedToken = jwtDecode(token);
      const email = decodedToken.sub;

      const response = await api.get(`/cart/${email}`);

      // Chuyển đổi dữ liệu từ response thành cấu trúc phù hợp với OrderCard
      const formattedOrders = response.data.map(order => ({
        ...order,
        items: order.productName.map(product => ({
          productName: product.productName,
          quantity: product.quantity,
          discountPrice: product.discountPrice,
          image: product.imageUrl,
        })),
      }));

      setOrders(formattedOrders);
    } catch (error) {
      toast.error('Failed to fetch order history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Function to handle order cancellation
  const handleOrderCancelled = (orderId) => {
    // Update the local state to reflect the cancelled order
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.orderId === orderId 
          ? { ...order, status: 5 } // 5 is the status code for "Đã hủy"
          : order
      )
    );
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <>
    <ToastContainer/>
      <h1>Lịch sử mua hàng</h1>
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