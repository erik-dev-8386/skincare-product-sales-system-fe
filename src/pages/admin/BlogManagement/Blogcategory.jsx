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
import { useEffect, useState } from "react";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import MyEditor from "../../../component/TinyMCE/MyEditor";

const BlogCategory = () => {
  const { Option } = Select;
  const [categoryList, setCategoryList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchText, setSearchText] = useState("");

  const statusMapping = {
    1: { text: "HOẠT ĐỘNG", color: "green" },
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "blogCategoryName",
      key: "blogCategoryName",
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
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
          <Tooltip title="Sửa">
            <Button
              color="orange"
              variant="filled"
              onClick={() => handleEditCategory(record)}
              style={{ margin: 3, border: "2px solid", width: "20px" }}
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
              style={{ margin: 3, border: "2px solid", width: "20px" }}
            >
              <i className="fa-solid fa-eye"></i>
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có muốn xóa danh mục này không?"
              onConfirm={() => handleDeleteCategory(record.blogCategoryName)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                color="red"
                variant="filled"
                style={{ margin: 3, border: "2px solid", width: "20px" }}
              >
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
      const response = await api.get("/blogCategory");
      console.log("Fetched categories:", response.data);
      setCategoryList([...response.data]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Không thể tải danh sách danh mục!");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = async () => {
    try {
      const encodedSearchText = encodeURIComponent(searchText);
      const response = await api.get(`/blogCategory/name/${encodedSearchText}`);
      if (response.data) {
        setCategoryList([response.data]);
      } else {
        setCategoryList([]);
      }
    } catch (error) {
      console.error("Error searching categories:", error);
      toast.error("Tìm kiếm danh mục không thành công!");
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setModalOpen(false);
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

  const handleSubmitForm = async (values) => {
    const isDuplicate = categoryList.some(
      (category) =>
        category.blogCategoryName === values.blogCategoryName &&
        (!editingCategory ||
          category.blogCategoryId !== editingCategory.blogCategoryId)
    );

    if (isDuplicate) {
      toast.error("Tên danh mục đã tồn tại! Vui lòng nhập tên khác.");
      return;
    }

    if (editingCategory) {
      try {
        const encodedCategoryName = encodeURIComponent(editingCategory.blogCategoryName);
        const response = await api.put(`/blogCategory/${encodedCategoryName}`, values);
        toast.success("Đã sửa danh mục thành công!");
        // Cập nhật danh sách ngay lập tức với dữ liệu từ response
        setCategoryList((prevList) =>
          prevList.map((item) =>
            item.blogCategoryId === editingCategory.blogCategoryId ? response.data : item
          )
        );
        handleCloseModal();
      } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        toast.error("Cập nhật danh mục không thành công!");
      }
    } else {
      try {
        const newCategory = {
          ...values,
          status: 1,
        };
        const response = await api.post("/blogCategory", newCategory);
        toast.success("Đã thêm danh mục mới thành công!");
        setCategoryList((prevList) => [...prevList, response.data]);
        handleCloseModal();
      } catch (error) {
        console.error("Lỗi khi thêm danh mục mới:", error);
        toast.error("Thêm danh mục mới không thành công!");
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue({
        blogCategoryName: category.blogCategoryName,
        description: category.description,
        status: category.status,
      });
    }, 100);
  };

  const handleDeleteCategory = async (blogCategoryName) => {
    try {
      const encodedCategoryName = encodeURIComponent(blogCategoryName);
      await api.delete(`/blogCategory/${encodedCategoryName}`);
      toast.success("Đã xóa danh mục này thành công!");
      setCategoryList((prevList) =>
        prevList.map((item) =>
          item.blogCategoryName === blogCategoryName ? { ...item, status: 0 } : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Xóa danh mục này không thành công!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý danh mục Blog</h1>
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
      <Table
        dataSource={categoryList}
        columns={columns}
        rowKey="blogCategoryId"
        style={{ marginTop: 16 }}
      />
      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingCategory ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
        destroyOnClose={true}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleSubmitForm}
          preserve={false}
        >
          <Form.Item
            label="Tên danh mục"
            name="blogCategoryName"
            rules={[
              { required: true, message: "Tên danh mục không được bỏ trống!" },
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
              value={form.getFieldValue("description")}
              onChange={(value) => form.setFieldsValue({ description: value })}
            />
          </Form.Item>
          {editingCategory && (
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
      <Modal
        title="Chi tiết danh mục"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedCategory && (
          <div>
            <p>
              <strong>ID: </strong> {selectedCategory.blogCategoryId}
            </p>
            <p>
              <strong>Tên danh mục: </strong> {selectedCategory.blogCategoryName}
            </p>
            <p>
              <strong>Mô tả: </strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedCategory.description }}
            />
            <p>
              <strong>Trạng Thái: </strong>
              {selectedCategory.status !== undefined ? (
                <Tag color={statusMapping[selectedCategory.status]?.color}>
                  {statusMapping[selectedCategory.status]?.text}
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

export default BlogCategory;