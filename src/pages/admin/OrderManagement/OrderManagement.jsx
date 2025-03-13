import React, { useEffect, useState } from "react";
import { Table, Modal, Tag, Button, Descriptions, Select, message } from "antd";
import axios from "axios";
import api from "../../../config/api";
import { ToastContainer, toast } from "react-toastify";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]); // Khởi tạo là một mảng rỗng
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null); // Trạng thái được chọn

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders"); // Thay thế bằng API thực tế của bạn
      const data = response.data;

      // Đảm bảo data là một mảng
      if (!Array.isArray(data)) {
        console.error("API response is not an array:", data);
        setOrders([]); // Đặt orders là một mảng rỗng nếu dữ liệu không hợp lệ
        return;
      }

      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setSelectedStatus(order.status); // Đặt trạng thái hiện tại làm giá trị mặc định
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditingOrder(null);
    setSelectedStatus(null); // Reset trạng thái được chọn
  };

  const handleUpdateStatus = async () => {
    if (!editingOrder || selectedStatus === null) return;

    setLoading(true);
    try {
      // Gọi API để cập nhật trạng thái
      await api.put(`/orders/${editingOrder.orderId}`, { status: selectedStatus });
      toast.success("Cập nhật trạng thái thành công!");

      // Cập nhật lại danh sách đơn hàng
      fetchOrders();
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Cập nhật trạng thái thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Mapping trạng thái đơn hàng
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
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            onClick={() => handleViewDetails(record)}
            style={{ marginRight: 8 }}
          >
            <i className="fa-solid fa-eye"></i> Xem chi tiết
          </Button>
          <Button
            type="default"
            onClick={() => handleEditOrder(record)}
          >
            <i className="fa-solid fa-pen-to-square"></i> Chỉnh sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
    <ToastContainer />
    <div>
      <h1>Quản lý đơn hàng</h1>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="orderId"
        pagination={{ pageSize: 10 }}
      />

      {/* Modal xem chi tiết */}
      <Modal
        title="Chi tiết đơn hàng"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã đơn hàng">
              {selectedOrder.orderId}
            </Descriptions.Item>
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
            <Descriptions.Item label="Địa chỉ">
              {selectedOrder.address || "Không có thông tin"}
            </Descriptions.Item>
            <Descriptions.Item label="Thời gian hủy">
              {selectedOrder.cancelTime
                ? new Date(selectedOrder.cancelTime).toLocaleString()
                : "Không có"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal chỉnh sửa trạng thái */}
      <Modal
        title="Chỉnh sửa trạng thái đơn hàng"
        visible={isEditModalVisible}
        onCancel={handleCloseEditModal}
        footer={[
          <Button key="cancel" onClick={handleCloseEditModal}>
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
              onChange={(value) => setSelectedStatus(value)}
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