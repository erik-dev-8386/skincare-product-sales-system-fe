

import React, { useEffect, useState } from "react";
import { Table, Modal, Tag, Button, Descriptions, Select, Input, Tooltip, Image } from "antd";
import axios from "axios";
import api from "../../../config/api";
import { ToastContainer, toast } from "react-toastify";


const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState({});
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/orders");
      const sortedOrders = response.data.sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return null;
    }
  };


  const fetchProductsForOrder = async (orderDetails) => {
    const productDetails = {};
    for (const item of orderDetails) {
      const product = await fetchProductDetails(item.productId);
      if (product) {
        productDetails[item.productId] = product;
      }
    }
    return productDetails;
  };
  

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/search/${searchText}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error searching orders:", error);
      toast.error("Tìm kiếm đơn hàng không thành công!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    setOrderDetailsLoading(true);
    try {
      const productDetails = await fetchProductsForOrder(order.orderDetails);

      setProducts(prev => ({ ...prev, ...productDetails }));

      setSelectedOrder({
        ...order,
        orderDetails: order.orderDetails.map(item => ({
          ...item,
          product: productDetails[item.productId]
        }))
      });

      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Không thể tải chi tiết đơn hàng!");
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setSelectedStatus(order.status);
    setIsEditModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    if (!editingOrder || selectedStatus === null) return;

    setLoading(true);
    try {
      await api.put(`/orders/${editingOrder.orderId}`, { status: selectedStatus });
      toast.success("Cập nhật trạng thái thành công!");
      fetchOrders();
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Cập nhật trạng thái thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const statusMapping = {
    0: { text: "Đã thêm vào giỏ hàng", color: "default" },
    1: { text: "Chờ xác nhận", color: "blue" },
    2: { text: "Đang chuẩn bị", color: "orange" },
    3: { text: "Đang vận chuyển", color: "purple" },
    4: { text: "Đã giao hàng", color: "green" },
    5: { text: "Đã hủy", color: "red" },
    6: { text: "Đã trả lại", color: "volcano" },
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderTime",
      key: "orderTime",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) => `${text.toLocaleString()} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = statusMapping[status] || { text: "Không xác định", color: "default" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Nút điều khiển",
      key: "actions",
      render: (_, record) => (
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
          <Tooltip title="Chi tiết">
            <Button
              color="primary"
              variant="filled"
              onClick={() => handleViewDetails(record)}
              style={{ margin: 3, border: "2px solid", width: "20px" }}>
              <i className="fa-solid fa-eye"></i>
            </Button>
          </Tooltip>
          <Tooltip title="Sửa">
            <Button
              color="orange"
              variant="filled"
              type="default" onClick={() => handleEditOrder(record)}
              style={{ margin: 3, border: "2px solid", width: "20px" }}>
              <i className="fa-solid fa-pen-to-square"></i>
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <div>
        <h1>Quản lý đơn hàng</h1>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Nhập mã đơn hàng để tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300, marginRight: 8 }}
          />
          <Button type="primary" onClick={handleSearch} loading={loading}>
            Tìm kiếm
          </Button>
          <Button onClick={() => { setSearchText(""); fetchOrders(); }} style={{ marginLeft: 8 }}>
            Reset
          </Button>
        </div>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="orderId"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />

        <Modal
          title="Chi tiết đơn hàng"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
        >
          {selectedOrder && (
            <>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Mã đơn hàng">{selectedOrder.orderId}</Descriptions.Item>
                <Descriptions.Item label="Ngày đặt hàng">
                  {new Date(selectedOrder.orderTime).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Tổng tiền">
                  {selectedOrder.totalAmount.toLocaleString()} đ
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusMapping[selectedOrder.status]?.color || "default"}>
                    {statusMapping[selectedOrder.status]?.text || "Không xác định"}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Phí vận chuyển">
                  {selectedOrder.shipmentFree.toLocaleString()} đ
                </Descriptions.Item>
                <Descriptions.Item label="Thông tin người nhận">
                  <div>
                    <p><strong>Họ và Tên:</strong> {selectedOrder.customerFirstName} {selectedOrder.customerLastName}</p>
                    <p><strong>Số điện thoại:</strong> {selectedOrder.customerPhone}</p>
                    <p><strong>Địa chỉ:</strong> {selectedOrder.address || "Không có thông tin"}</p>
                  </div>
                </Descriptions.Item>
                {/* <Descriptions.Item label="Thời gian hủy">
                  {selectedOrder.cancelTime
                    ? new Date(selectedOrder.cancelTime).toLocaleString()
                    : "Không có"}
                </Descriptions.Item> */}
              </Descriptions>

              <h6 style={{ marginTop: 20 }}>Danh sách sản phẩm</h6>
              <Table
                dataSource={selectedOrder.orderDetails}
                rowKey="orderDetailId"
                pagination={false}
                loading={orderDetailsLoading}
                columns={[
                  {
                    title: "Ảnh",
                    dataIndex: "product",
                    key: "product",
                    align: 'center',
                    render: (product) => (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {product?.productImages?.[0]?.imageURL ? (
                          <Image
                            src={product.productImages[0].imageURL}
                            alt={product.productName}
                            width={50}
                            height={50}
                            style={{ marginRight: 10, objectFit: 'cover' }}
                            
                          />
                        ) : (
                          <div style={{
                            width: 50,
                            height: 50,
                            marginRight: 10,
                            background: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 4
                          }}>
                            No Image
                          </div> 
                        )} 
                       
                        
                      </div>
                    )
                  },
                  {
                    title: "Sản phẩm",
                    dataIndex: "product",
                    key: "product",
                    align: 'center',
                    render: (product) => product?.productName || 'Không có thông tin'
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                    align: 'center'
                  },
                  {
                    title: "Đơn giá",
                    dataIndex: "discountPrice",
                    key: "discountPrice",
                    render: (price) => `${price.toLocaleString()} đ`,
                    align: 'right'
                  },
                  {
                    title: "Thành tiền",
                    key: "total",
                    render: (_, record) => `${(record.quantity * record.discountPrice).toLocaleString()} đ`,
                    align: 'right'
                  }
                ]}
              />
            </>
          )}
        </Modal>

        <Modal
          title="Chỉnh sửa trạng thái đơn hàng"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsEditModalVisible(false)}>
              Hủy
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleUpdateStatus}
              loading={loading}
            >
              Lưu
            </Button>,
          ]}
          width={400}
        >
          {editingOrder && (
            <div>
              <p>
                <strong>Mã đơn hàng:</strong> {editingOrder.orderId}
              </p>
              <p>
                <strong>Trạng thái hiện tại:</strong>{" "}
                <Tag color={statusMapping[editingOrder.status]?.color || "default"}>
                  {statusMapping[editingOrder.status]?.text || "Không xác định"}
                </Tag>
              </p>
              <Select
                style={{ width: "100%", marginTop: 16 }}
                value={selectedStatus}
                onChange={setSelectedStatus}
                loading={loading}
              >
                {Object.entries(statusMapping).map(([key, value]) => (
                  <Select.Option key={key} value={parseInt(key)}>
                    {value.text}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

export default OrderManagement;