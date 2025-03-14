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
  const [searchText, setSearchText] = useState("");

  const statusMapping = {

    1: { text: "HOẠT ĐỘNG", color: "green" },
    2: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
  };

  const columns = [
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
        <div className="button" style={{display: "flex", justifyContent: "center", flexDirection: "column", width: 100}}> 
          <Button
            color="orange"
            variant="filled"
            onClick={() => handleEditBrand(record)}
            style={{ margin: 3, border: "2px solid " }}
          >
            <i className="fa-solid fa-pen-to-square"></i> Sửa
          </Button>
          <Button
            color="primary"
            variant="filled"
            type="default"
            onClick={() => handleViewDetails(record)}
            style={{ margin: 3, border: "2px solid " }}
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
              style={{ margin: 3, border: "2px solid " }}
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

  const handleSearch = async () => {
    try {
      const response = await api.get(`/brands/search/${searchText}`);
      setBrandList(response.data);
    } catch (error) {
      console.error("Error searching brands:", error);
      toast.error("Tìm kiếm thương hiệu  không thành công!");
    }
  };

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
    // Check for duplicate brand name
    const isDuplicate = brandList.some(
      (brand) =>
        brand.brandName === values.brandName &&
        (!editingBrand || brand.brandId !== editingBrand.brandId) // Allow editing the same brand
    );

    if (isDuplicate) {
      toast.error("Tên thương hiệu đã tồn tại! Vui lòng nhập tên khác.");
      return; // Prevent form submission
    }

    if (editingBrand) {
      try {
        await api.put(`/brands/${editingBrand.brandId}`, values);
        toast.success("Đã sửa thương hiệu thành công!");
        fetchBrands();
        handleCloseModal();
      } catch (error) {
        toast.error("Cập nhật thương hiệu không thành công!");
      }
    } else {
      try {
        await api.post('/brands', values);
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
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tên thương hiệu để tìm kiếm"
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
            fetchBrands();
          }}
          style={{ margin: 8 }}
        >
          Reset
        </Button>
        <Button type="primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus"></i> Thêm thương hiệu mới
        </Button>
      </div>
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
            rules={[{ required: true, message: "Tên thương hiệu không được bỏ trống!" }]}
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
                <Option value={2}>KHÔNG HOẠT ĐỘNG</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Modal Chi Tiết */}
      <Modal
        title="Chi tiết thương hiệu"
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