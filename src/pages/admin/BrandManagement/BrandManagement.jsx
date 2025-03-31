import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  Select,
  Tag,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState, useCallback } from "react";
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
  const [loading, setLoading] = useState(false);

  const statusMapping = {
    1: { text: "HOẠT ĐỘNG", color: "green" },
    2: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
  };

  const columns = [
    {
      title: <p className="title-product-management">Tên thương hiệu</p>,
      dataIndex: "brandName",
      key: "brandName",
    },
    {
      title: <p className="title-product-management">Mô tả</p>,
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
      title: <p className="title-product-management">Quốc gia</p>,
      dataIndex: "country",
      key: "country",
    },
    {
      title: <p className="title-product-management">Trạng thái</p>,
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
      title: <p className="title-product-management">Nút điều khiển</p>,
      key: "actions",
      render: (text, record) => (
        <div
          className="button"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: 100,
          }}
        >
          <Tooltip title="Sửa">
            <Button
              color="orange"
              variant="filled"
              onClick={() => handleEditBrand(record)}
              style={{ margin: 3, border: "2px solid " }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </Button>
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button
              color="primary"
              variant="filled"
              type="default"
              onClick={() => handleViewDetails(record)}
              style={{ margin: 3, border: "2px solid " }}
            >
              <i className="fa-solid fa-eye"></i>
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
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
                <i className="fa-solid fa-trash"></i>
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/brands"); // Bỏ /haven-skin
      setBrandList(response.data);
    } catch (error) {
      console.error(
        "Error fetching brands:",
        error.response?.data?.message || error.message
      );
      toast.error("Lỗi khi tải danh sách thương hiệu!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/brands/search/${searchText}`); // Bỏ /haven-skin
      setBrandList(response.data);
    } catch (error) {
      console.error(
        "Error searching brands:",
        error.response?.data?.message || error.message
      );
      toast.error("Tìm kiếm thương hiệu không thành công!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    if (!editingBrand) {
      form.resetFields();
    }
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

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    form.setFieldsValue({
      brandName: brand.brandName,
      description: brand.description,
      country: brand.country,
      status: brand.status,
    });
    setModalOpen(true);
  };

  const handleSubmitForm = async (values) => {
    const isDuplicate = brandList.some(
      (brand) =>
        brand.brandName.toLowerCase() === values.brandName.toLowerCase() &&
        (!editingBrand || brand.brandId !== editingBrand.brandId)
    );
  
    if (isDuplicate) {
      toast.error("Tên thương hiệu đã tồn tại! Vui lòng nhập tên khác.");
      return;
    }
  
    // Validation phía frontend cho country
    const countryPattern = /^[\p{L}\s]+$/u; // Regex hỗ trợ Unicode (dùng flag /u)
    if (!countryPattern.test(values.country)) {
      toast.error("Quốc gia chỉ được chứa chữ cái và khoảng trắng, không được chứa ký tự đặc biệt!");
      return;
    }
  
    const brandData = {
      brandName: values.brandName,
      description: values.description,
      country: values.country.trim(),
      ...(editingBrand && { status: values.status }),
    };
  
    try {
      let response;
      if (editingBrand) {
        response = await api.put(`/brands/${editingBrand.brandId}`, brandData);
        toast.success("Đã sửa thương hiệu thành công!");
        setBrandList((prevList) =>
          prevList.map((item) =>
            item.brandId === editingBrand.brandId ? response.data : item
          )
        );
      } else {
        response = await api.post("/brands", brandData);
        toast.success("Đã thêm thương hiệu mới thành công!");
        setBrandList((prevList) => [...prevList, response.data]);
      }
  
      fetchBrands();
      handleCloseModal();
    } catch (error) {
      console.error(
        "Error saving brand:",
        error.response?.data?.message || error.message
      );
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Dữ liệu không hợp lệ!");
      } else if (error.response?.status === 500) {
        toast.error("Lỗi server, vui lòng thử lại sau!");
      } else {
        toast.error(
          editingBrand
            ? "Sửa thương hiệu không thành công!"
            : "Thêm thương hiệu không thành công!"
        );
      }
    }
  };
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const handleDeleteBrand = async (brandId) => {
    try {
      await api.delete(`/brands/${brandId}`);
      toast.success("Đã xóa thương hiệu này thành công!");
      fetchBrands(); // Refresh the brand list after deletion
    } catch (error) {
      console.error(
        "Error deleting brand:",
        error.response?.data?.message || error.message
      );
      toast.error("Xóa thương hiệu không thành công!");
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
        loading={loading}
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
            rules={[
              { required: true, message: "Tên thương hiệu không được bỏ trống!" },
             
            ]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item
  label="Quốc gia"
  name="country"
  rules={[
    { required: true, message: "Quốc gia không được để trống" },
    {
      pattern: /^[\p{L}\s]+$/u,
      message: "Quốc gia chỉ được chứa chữ cái và khoảng trắng, không được chứa ký tự đặc biệt",
    },
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
        dangerouslySetInnerHTML={{ __html: decodeHtml(selectedBrand.description) }}
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