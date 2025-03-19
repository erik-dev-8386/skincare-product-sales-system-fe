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

const BlogHashtag = () => {
  const { Option } = Select;
  const [hashtagList, setHashtagList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingHashtag, setEditingHashtag] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const [searchText, setSearchText] = useState("");

  const statusMapping = {
    1: { text: "HOẠT ĐỘNG", color: "green" },
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
  };

  const columns = [
    {
      title: "Tên hashtag",
      dataIndex: "blogHashtagName",
      key: "blogHashtagName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div
          dangerouslySetInnerHTML={{
            __html: text && typeof text === "string"
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
        <div
          className="button"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            width: 100,
          }}
        >
          <Button
            color="orange"
            variant="filled"
            onClick={() => handleEditHashtag(record)}
            style={{ margin: 3, border: "2px solid" }}
          >
            <i className="fa-solid fa-pen-to-square"></i> Sửa
          </Button>
          <Button
            color="primary"
            variant="filled"
            type="default"
            onClick={() => handleViewDetails(record)}
            style={{ margin: 3, border: "2px solid" }}
          >
            <i className="fa-solid fa-eye"></i> Chi tiết
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa hashtag này không?"
            onConfirm={() => handleDeleteHashtag(record.blogHashtagName)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              color="red"
              variant="filled"
              style={{ margin: 3, border: "2px solid" }}
            >
              <i className="fa-solid fa-trash"></i> Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const fetchHashtags = async () => {
    try {
      const response = await api.get("/blog-hashtag");
      setHashtagList(response.data);
    } catch (error) {
      console.error("Error fetching hashtags:", error);
      toast.error("Không thể tải danh sách hashtag!");
    }
  };

  useEffect(() => {
    fetchHashtags();
  }, []);

  const handleSearch = async () => {
    try {
      const encodedSearchText = encodeURIComponent(searchText);
      const response = await api.get(`/blog-hashtag/name/${encodedSearchText}`);
      if (response.data) {
        setHashtagList([response.data]);
      } else {
        setHashtagList([]);
      }
    } catch (error) {
      console.error("Error searching hashtags:", error);
      toast.error("Tìm kiếm hashtag không thành công!");
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setModalOpen(false);
    setEditingHashtag(null);
  };

  const handleViewDetails = (hashtag) => {
    setSelectedHashtag(hashtag);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedHashtag(null);
  };

  const handleSubmitForm = async (values) => {
    const isDuplicate = hashtagList.some(
      (hashtag) =>
        hashtag.blogHashtagName === values.blogHashtagName &&
        (!editingHashtag || hashtag.blogHashtagId !== editingHashtag.blogHashtagId)
    );

    if (isDuplicate) {
      toast.error("Tên hashtag đã tồn tại! Vui lòng nhập tên khác.");
      return;
    }

    if (editingHashtag) {
      try {
        const encodedHashtagName = encodeURIComponent(editingHashtag.blogHashtagName);
        await api.put(
          `/blog-hashtag/${encodedHashtagName}`,
          values
        );
        toast.success("Đã sửa hashtag thành công!");
        fetchHashtags();
        handleCloseModal();
      } catch (error) {
        console.error("Lỗi khi cập nhật hashtag:", error);
        toast.error("Cập nhật hashtag không thành công!");
      }
    } else {
      try {
        const newHashtag = {
          ...values,
          status: 1,
        };
        await api.post("/blog-hashtag", newHashtag);
        toast.success("Đã thêm hashtag mới thành công!");
        fetchHashtags();
        handleCloseModal();
      } catch (error) {
        console.error("Lỗi khi thêm hashtag mới:", error);
        toast.error("Thêm hashtag mới không thành công!");
      }
    }
  };

  const handleEditHashtag = (hashtag) => {
    setEditingHashtag(hashtag);
    setModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue({
        blogHashtagName: hashtag.blogHashtagName,
        description: hashtag.description,
        status: hashtag.status,
      });
    }, 100);
  };

  const handleDeleteHashtag = async (blogHashtagName) => {
    try {
      const encodedHashtagName = encodeURIComponent(blogHashtagName);
      await api.delete(`/blog-hashtag/${encodedHashtagName}`);
      toast.success("Đã xóa hashtag này thành công!");
      fetchHashtags();
    } catch (error) {
      console.error("Lỗi khi xóa hashtag:", error);
      toast.error("Xóa hashtag này không thành công!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý Hashtag Blog</h1>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tên hashtag để tìm kiếm"
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
            fetchHashtags();
          }}
          style={{ margin: 8 }}
        >
          Reset
        </Button>
        <Button type="primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus"></i> Thêm hashtag mới
        </Button>
      </div>
      <Table
        dataSource={hashtagList}
        columns={columns}
        rowKey="blogHashtagId"
        style={{ marginTop: 16 }}
      />
      <Modal
        title={editingHashtag ? "Chỉnh sửa hashtag" : "Tạo hashtag mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingHashtag ? "Lưu thay đổi" : "Tạo"}
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
            label="Tên hashtag"
            name="blogHashtagName"
            rules={[
              { required: true, message: "Tên hashtag không được bỏ trống!" },
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

          {editingHashtag && (
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
        title="Chi tiết hashtag"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={800}
      >
        {selectedHashtag && (
          <div>
            <p>
              <strong>ID: </strong> {selectedHashtag.blogHashtagId}
            </p>
            <p>
              <strong>Tên hashtag: </strong> {selectedHashtag.blogHashtagName}
            </p>
            <p>
              <strong>Mô tả: </strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedHashtag.description }}
            />
            <p>
              <strong>Trạng Thái: </strong>
              {selectedHashtag.status !== undefined ? (
                <Tag color={statusMapping[selectedHashtag.status]?.color}>
                  {statusMapping[selectedHashtag.status]?.text}
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

export default BlogHashtag;
