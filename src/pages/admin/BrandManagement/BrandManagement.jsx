import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  Select,
  Tag,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import MyEditor from "../../../component/TinyMCE/MyEditor";
const BrandManagement = () => {
  const { Option } = Select;
  const [brandList, setBrandList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingBrand, setEditingBrand] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const statusMapping = {
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    1: { text: "HOẠT ĐỘNG", color: "green" },
  };

  const columns = [
    // {
    //   title: "ID thương hiệu",
    //   dataIndex: "brandId",
    //   key: "brandId",
    // },
    {
      title: "Tên thương hiệu",
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div
          dangerouslySetInnerHTML={{
            __html:
              text && typeof text === "string"
                ? text.length > 50
                  ? text.substring(0, 50) + "..."
                  : text
                : "",
          }}
        />
      ),
    },
    {
      title: "Quốc gia",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = statusMapping[status] || {
          text: "KHÔNG BIẾT",
          color: "default",
        };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Nút điều khiển",
      key: "actions",
      render: (text, record) => (
        <div className="button">
          <Button
            color="orange"
            variant="filled"
            onClick={() => handleEditBrand(record)}
            style={{ marginRight: 8, border: "2px solid " }}
          >
            <i className="fa-solid fa-pen-to-square"></i> Sửa
          </Button>
          <Button
            color="primary"
            variant="filled"
            type="default"
            onClick={() => handleViewDetails(record)}
            style={{ marginRight: 8, border: "2px solid " }}
          >
            <i className="fa-solid fa-eye"></i> Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa thương hiệu này không?"
            onConfirm={() => handleDeleteBrand(record.brandId)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              color="red"
              variant="filled"
              style={{ marginRight: 8, border: "2px solid " }}
            >
              <i className="fa-solid fa-trash"></i> Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchBrands = async () => {
    try {
      const response = await api.get("/brands");
      setBrandList(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingBrand(null);
  };

  const handleViewDetails = (brand) => {
    setSelectedBrand(brand);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedBrand(null);
  };

  const handleSubmitForm = async (values) => {
    if (editingBrand) {
      try {
        await api.put(`/brands/${editingBrand.brandId}`, values);
        toast.success("Brand updated successfully!");
        fetchBrands();
        handleCloseModal();
      } catch (error) {
        toast.error("Failed to update brand!");
      }
    } else {
      try {
        const { status, ...newBrands } = values;
        await api.post("/brands", newBrands);
        toast.success("Đã thêm thương hiệu mới thành công!");
        fetchBrands();
        handleCloseModal();
      } catch (error) {
        toast.error("Thêm thương hiệu mới không thành công!");
      }
    }
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    form.setFieldsValue(brand);
    handleOpenModal();
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      await api.delete(`/brands/${brandId}`);
      toast.success("Đã xóa thương hiệu này thành công!");
      fetchBrands();
    } catch (error) {
      toast.error("Xóa thương hiệu này không thành công!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý thương hiệu</h1>
      <Button type="primary" onClick={handleOpenModal}>
        <i className="fa-solid fa-plus"></i> Thêm thương hiệu mới
      </Button>
      <Table
        dataSource={brandList}
        columns={columns}
        rowKey="brandId"
        style={{ marginTop: 16 }}
      />
      <Modal
        title={editingBrand ? "Chỉnh sửa thương hiệu" : "Tạo thương hiệu mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingBrand ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
          <Form.Item
            label="Tên thương hiệu"
            name="brandName"
            rules={[{ required: true, message: "Brand name can't be empty!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Mô tả không được để trống!" }]}
          >
            <MyEditor
              value={form.getFieldValue("description")}
              onChange={(value) => form.setFieldsValue({ description: value })}
            />
          </Form.Item>

          <Form.Item
            label="Quốc gia"
            name="country"
            rules={[
              { required: true, message: "Quốc gia không được để trống" },
            ]}
          >
            <Input />
          </Form.Item>

          {editingBrand && (
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[
                { required: true, message: "Trạng thái không được bỏ trống!" },
              ]}
            >
              <Select>
                <Option value={1}>HOẠT ĐỘNG</Option>
                <Option value={0}>KHÔNG HOẠT ĐỘNG</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Modal Chi Tiết */}
      <Modal
        title="Chi tiết loại sản phẩm"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedBrand && (
          <div>
            <p>
              <strong>BrandID: </strong> {selectedBrand.brandId}
            </p>
            <p>
              <strong>Tên thương hiệu: </strong> {selectedBrand.brandName}
            </p>
            <p>
              <strong>Mô tả: </strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedBrand.description }}
            />
            <p>
              <strong>Quốc gia: </strong> {selectedBrand.country}
            </p>
            <p>
              <strong>Trạng Thái:</strong>
              {selectedBrand.status !== undefined ? (
                <Tag color={statusMapping[selectedBrand.status]?.color}>
                  {statusMapping[selectedBrand.status]?.text}
                </Tag>
              ) : (
                "Không xác định"
              )}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BrandManagement;