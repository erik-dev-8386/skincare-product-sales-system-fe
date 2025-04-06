import { Button, Form, Input, Modal, Table, Popconfirm, DatePicker, Col, Row, Tag, Select, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import api from "../../../config/api";
import dayjs from "dayjs";
import MyEditor from "../../../component/TinyMCE/MyEditor";

const DiscountManagement = () => {
  const { Option } = Select;
  const [discountList, setDiscountList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [searchText, setSearchText] = useState("");

  const statusMapping = {
    0: { text: "HẾT HẠN", color: "red" },
    1: { text: "SẮP TỚI", color: "orange" },
    2: { text: "HOẠT ĐỘNG", color: "green" },
    3: { text: "BỊ VÔ HIỆU HÓA", color: "gray" }
  };

  const columns = [
    {
      title: 'Tên giảm giá',
      dataIndex: 'discountName',
      key: 'discountName',
    },
    {
      title: 'Mã giảm giá',
      dataIndex: 'discountCode',
      key: 'discountCode',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text && typeof text === "string" ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : "" }} />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
    },
    {
      title: 'Ngày xóa',
      dataIndex: 'deletedTime',
      key: 'deletedTime',
      render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
    },
    {
      title: 'Ngày áp dụng',
      dataIndex: 'actualStartTime',
      key: 'actualStartTime',
      render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'actualEndTime',
      key: 'actualEndTime',
      render: (date) => date ? dayjs(date).format("YYYY-MM-DD") : "",
    },
    {
      title: 'Phần trăm giảm giá (%)',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusInfo = statusMapping[status] || { text: "KHÔNG BIẾT", color: "default" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Nút điều khiển',
      key: 'actions',
      render: (text, record) => (
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
          <Tooltip title="Sửa">
          <Button color="orange" variant="filled" size="small" onClick={() => handleEditDiscount(record)} style={{ margin: 3, border: "2px solid", width: "30px", height:30 }}>
            <i className="fa-solid fa-pen-to-square"></i>
          </Button>
          </Tooltip>
          <Tooltip title="Chi tiết">
          <Button color="primary" variant="filled" size="small" onClick={() => handleViewDetails(record)} style={{ margin: 3, border: "2px solid", width: "30px", height:30 }}>
            <i className="fa-solid fa-eye"></i> 
          </Button>
          </Tooltip>
          <Tooltip title="Xóa">
          <Popconfirm
            title="Bạn có muốn xóa giảm giá này không?"
            onConfirm={() => handleDeleteDiscount(record.discountId)}
            okText="Có"
            cancelText="Không"
          >
            <Button color="red" variant="filled" size="small" style={{ margin: 3, border: "2px solid", width: "30px", height:30 }} >
              <i className="fa-solid fa-trash"></i>
            </Button>
          </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const fetchDiscount = async () => {
    try {
      const response = await api.get('/discounts');
      setDiscountList(response.data);
    } catch (error) {
      console.error("Error fetching Discounts:", error);
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await api.get(`/discounts/search/${searchText}`);
      setDiscountList(response.data);
    } catch (error) {
      console.error("Error searching discounts:", error);
      toast.error("Tìm kiếm giảm giá không thành công!");
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingDiscount(null);
  };

  const handleViewDetails = (discount) => {
    setSelectedDiscount(discount);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedDiscount(null);
  };

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };
  

  const handleSubmitForm = async (values) => {
      // Xoá HTML khỏi phần mô tả
  values.description = stripHtml(values.description);

    const isDuplicate = discountList.some(
      (discount) =>
        discount.discountName === values.discountName &&
        (!editingDiscount || discount.discountId !== editingDiscount.discountId)
    );

    if (isDuplicate) {
      toast.error("Tên giảm giá đã tồn tại! Vui lòng nhập tên khác.");
      return;
    }

    const formattedValues = {
      ...values,
      createdTime: values.createdTime?.format('YYYY-MM-DD'),
      deletedTime: values.deletedTime?.format('YYYY-MM-DD'),
      actualStartTime: values.actualStartTime?.format('YYYY-MM-DD'),
      actualEndTime: values.actualEndTime?.format('YYYY-MM-DD'),
    };

    if (editingDiscount) {
      formattedValues.discountId = editingDiscount.discountId;
      try {
        await api.put(`/discounts/${editingDiscount.discountId}`, formattedValues);
        toast.success("Đã cập nhật giảm giá thành công!");
        fetchDiscount();
        handleCloseModal();
      } catch (error) {
        toast.error("Cập nhật giảm giá không thành công!");
      }
    } else {
      try {
        await api.post('/discounts', formattedValues);
        toast.success("Đã thêm giảm giá mới thành công!");
        fetchDiscount();
        handleCloseModal();
      } catch (error) {
        toast.error("Thêm giảm giá mới không thành công!");
      }
    }
  };

  const handleEditDiscount = (discount) => {
    setEditingDiscount(discount);
    form.setFieldsValue({
      ...discount,
      createdTime: discount.createdTime ? dayjs(discount.createdTime) : null,
      deletedTime: discount.deletedTime ? dayjs(discount.deletedTime) : null,
      actualStartTime: discount.actualStartTime ? dayjs(discount.actualStartTime) : null,
      actualEndTime: discount.actualEndTime ? dayjs(discount.actualEndTime) : null,
    });
    handleOpenModal();
  };

  const handleDeleteDiscount = async (id) => {
    try {
      await api.delete(`/discounts/${id}`);
      toast.success("Đã xóa giảm giá thành công!");
      fetchDiscount();
    } catch (error) {
      toast.error("Xóa giảm giá không thành công!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý giảm giá</h1>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tên giảm giá để tìm kiếm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300, marginRight: 8 }}
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button
          onClick={() => {
            setSearchText("");
            fetchDiscount();
          }}
          style={{ marginLeft: 8 }}
        >
          Reset
        </Button>
        <Button type="primary" onClick={handleOpenModal} style={{ marginLeft: 8 }}>
          <i className="fa-solid fa-plus"></i> Thêm giảm giá mới
        </Button>
      </div>
      <Table dataSource={discountList} columns={columns} rowKey="discountId" style={{ marginTop: 16 }} />
      <Modal
        title={editingDiscount ? "Chỉnh sửa giảm giá" : "Tạo giảm giá mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingDiscount ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
        width={800}
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm} layout="vertical">
          <Form.Item
            label="Tên giảm giá"
            name="discountName"
            rules={[{ required: true, message: "Tên giảm giá không được để trống!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mã giảm giá"
            name="discountCode"
            rules={[{ required: true, message: "Mã giảm giá không được để trống!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Phần trăm giảm giá (%)"
            name="discountPercent"
            rules={[
              { required: true, message: "Phần trăm giảm giá không được để trống!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Ngày tạo"
                name="createdTime"
                rules={[{ required: false, message: "Ngày tạo không được để trống!" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                label="Ngày xóa"
                name="deletedTime"
                rules={[{ required: false, message: "Ngày xóa không được để trống!" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ngày áp dụng"
                name="actualStartTime"
                rules={[{ required: false, message: "Ngày áp dụng không được để trống!" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                label="Ngày hết hạn"
                name="actualEndTime"
                rules={[{ required: false, message: "Ngày hết hạn không được để trống!" }]}
              >
                <DatePicker format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Mô tả không được để trống!" }]}
          >
            <MyEditor
              value={form.getFieldValue("description") || ""}
              onChange={(value) => form.setFieldsValue({ description: value })}
            />
          </Form.Item>
          {editingDiscount && (
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: false, message: "Trạng thái không được bỏ trống!" }]}
            >
              <Select>
                <Option value={0}>HẾT HẠN</Option>
                <Option value={1}>SẮP TỚI</Option>
                <Option value={2}>HOẠT ĐỘNG</Option>
                <Option value={3}>BỊ VÔ HIỆU HÓA</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
      <Modal
        title={<h2>Chi tiết giảm giá</h2>}
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedDiscount && (
          <div>
            <p><strong>ID: </strong> {selectedDiscount.discountId}</p>
            <p><strong>Tên giảm giá: </strong> {selectedDiscount.discountName}</p>
            <p><strong>Mã giảm giá: </strong> {selectedDiscount.discountCode}</p>
            <p><strong>Mô tả: </strong></p>
            <div dangerouslySetInnerHTML={{ __html: selectedDiscount.description }} />
            <p><strong>Ngày tạo: </strong> {selectedDiscount.createdTime ? dayjs(selectedDiscount.createdTime).format("YYYY-MM-DD") : "N/A"}</p>
            <p><strong>Ngày áp dụng: </strong> {selectedDiscount.actualStartTime ? dayjs(selectedDiscount.actualStartTime).format("YYYY-MM-DD") : "N/A"}</p>
            <p><strong>Ngày hết hạn: </strong> {selectedDiscount.actualEndTime ? dayjs(selectedDiscount.actualEndTime).format("YYYY-MM-DD") : "N/A"}</p>
            <p><strong>Phần trăm giảm giá (%): </strong> {selectedDiscount.discountPercent}%</p>
            <p><strong>Trạng Thái:</strong>
              {selectedDiscount.status !== undefined ? (
                <Tag color={statusMapping[selectedDiscount.status]?.color}>
                  {statusMapping[selectedDiscount.status]?.text}
                </Tag>
              ) : "Không xác định"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DiscountManagement;
