import { Button, Form, Input, Modal, Table, Popconfirm, Tag, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Select } from "antd";
import api from "../../../config/api";
import dayjs from "dayjs";
import MyEditor from "../../../component/TinyMCE/MyEditor";

const CategoryManagement = () => {
  const { Option } = Select;
  const [categoryList, setCategoryList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");

  const statusMapping = {
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
    // 1: { text: "CHỜ", color: "orange" },
    2: { text: "HOẠT ĐỘNG", color: "green" },
    // 3: { text: "ĐÃ XÓA", color: "gray" },
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div dangerouslySetInnerHTML={{ __html: text && typeof text === "string" ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : "" }} />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = statusMapping[status] || { text: "KHÔNG BIẾT", color: "default" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Nút điều khiển",
      key: "actions",
      render: (text, record) => (
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
          <Tooltip title="Sửa">
            <Button color="orange" variant="filled" onClick={() => handleEditCategory(record)} style={{ margin: 3, border: "2px solid", width: "20px" }}>
              <i className="fa-solid fa-pen-to-square"></i>
            </Button>
          </Tooltip>
          <Tooltip title="Chi tiết">
            <Button color="primary" variant="filled" type="default" onClick={() => handleViewDetails(record)} style={{ margin: 3, border: "2px solid", width: "20px" }}>
              <i className="fa-solid fa-eye"></i>
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm title="Bạn có muốn xóa loại da này không?" onConfirm={() => handleDeleteCategory(record.categoryId)} okText="Có" cancelText="Không">
              <Button color="red" variant="filled" style={{ margin: 3, border: "2px solid", width: "20px" }}>
                <i className="fa-solid fa-trash"></i>
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ];

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategoryList(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Lấy danh sách danh mục thất bại!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await api.get(`/categories/search/${searchText}`);
      setCategoryList(response.data);
    } catch (error) {
      console.error("Error searching categories:", error);
      toast.error("Tìm kiếm danh mục không thành công!");
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const handleViewDetails = (category) => {
    setSelectedCategory(category);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedCategory(null);
  };

  
  // const stripHtml = (html) => {
  //   const tempDiv = document.createElement("div");
  //   tempDiv.innerHTML = html;
  //   return tempDiv.textContent || tempDiv.innerText || "";
  // };

  const handleSubmitForm = async (values) => {
      // Xoá HTML khỏi phần mô tả
  // values.description = stripHtml(values.description);
   
    const isDuplicate = categoryList.some(
      (category) =>
        category.categoryName === values.categoryName &&
        (!editingCategory || category.categoryId !== editingCategory.categoryId)
    );

    if (isDuplicate) {
      toast.error("Tên danh mục đã tồn tại! Vui lòng nhập tên khác.");
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.categoryId}`, {
          categoryName: values.categoryName,
          description: values.description,
          status: values.status || 2, 
        });
        toast.success("Đã sửa danh mục thành công!");
      } else {
        await api.post("/categories", {
          categoryName: values.categoryName,
          description: values.description,
          status: 2, 
        });
        toast.success("Đã thêm danh mục mới thành công!");
      }
      fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Thao tác không thành công!");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      categoryName: category.categoryName,
      description: category.description,
      status: category.status, 
    });
    handleOpenModal();
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`/categories/${categoryId}`);
      toast.success("Đã xóa danh mục này thành công!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "Xóa danh mục không thành công!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý danh mục</h1>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tên danh mục để tìm kiếm"
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
            fetchCategories();
          }}
          style={{ margin: 8 }}
        >
          Reset
        </Button>
        <Button type="primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus"></i> Thêm danh mục mới
        </Button>
      </div>
      <Table dataSource={categoryList} columns={columns} rowKey="categoryId" style={{ marginTop: 16 }} />
      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingCategory ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
      >
        <Form form={form} labelCol={{ span: 24 }} onFinish={handleSubmitForm}>
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[{ required: true, message: "Tên danh mục không được bỏ trống!" }]}
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

          {editingCategory && (
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: false, message: "Trạng thái không được bỏ trống!" }]}
            >
              <Select>
                <Option value={0}>KHÔNG HOẠT ĐỘNG</Option>
                {/* <Option value={1}>CHỜ</Option> */}
                <Option value={2}>HOẠT ĐỘNG</Option>
                {/* <Option value={3}>ĐÃ XÓA</Option> */}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
      
      <Modal
        title={<h2>Chi tiết danh mục</h2>}
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedCategory && (
          <div>
            <p><strong>ID: </strong> {selectedCategory.categoryId}</p>
            <p><strong>Tên danh mục: </strong> {selectedCategory.categoryName}</p>
            <p><strong>Mô tả: </strong></p>
            <div dangerouslySetInnerHTML={{ __html: selectedCategory.description }} />
            <p><strong>Trạng Thái:</strong>
              {selectedCategory.status !== undefined ? (
                <Tag color={statusMapping[selectedCategory.status]?.color}>
                  {statusMapping[selectedCategory.status]?.text}
                </Tag>
              ) : "Không xác định"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CategoryManagement;