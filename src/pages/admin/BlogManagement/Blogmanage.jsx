import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  Select,
  Tag,
  DatePicker,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import MyEditor from "../../../component/TinyMCE/MyEditor";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";

const BlogManage = () => {
  const { Option } = Select;
  const [blogList, setBlogList] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form] = useForm();
  const [editingBlog, setEditingBlog] = useState(null);
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [fileList, setFileList] = useState([]);

  const statusMapping = {
    1: { text: "HOẠT ĐỘNG", color: "green" },
    0: { text: "KHÔNG HOẠT ĐỘNG", color: "red" },
  };

  // Fetch categories và hashtags khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, hashtagsRes] = await Promise.all([
          api.get("/blogCategory"),
          api.get("/blog-hashtag"),
        ]);
        setCategories(categoriesRes.data);
        setHashtags(hashtagsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "blogTitle",
      key: "blogTitle",
    },
    {
      title: "Nội dung",
      dataIndex: "blogContent",
      key: "blogContent",
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
      title: "Hình ảnh",
      dataIndex: "blogImages",
      key: "blogImages",
      render: (blogImages, record) => {
        console.log("Rendering blog images for:", record.blogTitle, blogImages);
        return (
          <div style={{ display: "flex", gap: "8px" }}>
            {blogImages &&
            Array.isArray(blogImages) &&
            blogImages.length > 0 ? (
              blogImages.map((image, index) => (
                <img
                  key={index}
                  src={image.imageURL}
                  alt={`Blog image ${index + 1}`}
                  style={{
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  onError={(e) => {
                    console.error("Image load error for URL:", image.imageURL);
                    e.target.style.display = "none";
                  }}
                />
              ))
            ) : (
              <span>Không có hình ảnh</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: ["blogCategory", "blogCategoryName"],
      key: "category",
    },
    {
      title: "Hashtags",
      dataIndex: "hashtags",
      key: "hashtags",
      render: (hashtags) => (
        <>
          {hashtags?.map((tag) => (
            <Tag key={tag.blogHashtagId}>{tag.blogHashtagName}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "postedTime",
      key: "postedTime",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
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
            onClick={() => handleEditBlog(record)}
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
            title="Bạn có muốn xóa blog này không?"
            onConfirm={() => handleDeleteBlog(record.blogTitle)}
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

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");
      console.log("Raw blog data:", response.data);

      // Xử lý dữ liệu trước khi set vào state
      const processedBlogs = response.data.map((blog) => ({
        ...blog,
        blogImages: blog.blogImages
          ?.filter((img) => img.imageURL)
          .map((img) => ({
            imageId: img.imageId || null,
            imageURL: img.imageURL,
            blogId: blog.blogId, // Thêm blogId từ blog cha
          })),
      }));

      console.log("Processed blog data:", processedBlogs);
      setBlogList(processedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Không thể tải danh sách blog!");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await api.get(`/blogs/title/${searchText}`);
      if (response.data) {
        setBlogList([response.data]);
      } else {
        setBlogList([]);
      }
    } catch (error) {
      console.error("Error searching blogs:", error);
      toast.error("Tìm kiếm blog không thành công!");
    }
  };

  // Thêm các hàm xử lý form và modal tương tự như các component khác
  const handleOpenModal = () => {
    form.resetFields();
    setFileList([]);
    setEditingBlog(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setFileList([]);
    setModalOpen(false);
    setEditingBlog(null);
  };

  const handleViewDetails = (blog) => {
    setSelectedBlog(blog);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedBlog(null);
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmitForm = async (values) => {
    try {
      const imagePromises = fileList.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = (error) => reject(error);
        });
      });

      const imageUrls = await Promise.all(imagePromises);

      const blogData = {
        blogTitle: values.blogTitle,
        blogContent: values.blogContent,
        blogCategory: {
          blogCategoryName: values.blogCategory.blogCategoryName,
        },
        hashtags: values.hashtags.map((tagName) => ({
          blogHashtagName: tagName,
        })),
        blogImages: imageUrls.map((url) => ({
          imageURL: url,
        })),
        postedTime: new Date(),
        status: editingBlog ? values.status : 1,
        user: {
          email: "admin@gmail.com",
        },
      };

      console.log("Submitting blog data:", blogData);

      let response;
      if (editingBlog) {
        response = await api.put(`/blogs/${editingBlog.blogTitle}`, blogData);
      } else {
        response = await api.post("/blogs", blogData);
      }

      console.log("Server response:", response.data);

      // Đợi một chút trước khi fetch lại dữ liệu
      setTimeout(async () => {
        await fetchBlogs();
        handleCloseModal();
        toast.success(
          editingBlog
            ? "Đã sửa blog thành công!"
            : "Đã thêm blog mới thành công!"
        );
      }, 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        editingBlog
          ? "Cập nhật blog không thành công!"
          : "Thêm blog mới không thành công!"
      );
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setModalOpen(true);
    setTimeout(() => {
      // Convert existing images to fileList format
      const existingImages =
        blog.blogImages?.map((img, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: "done",
          url: img.imageURL,
        })) || [];

      setFileList(existingImages);

      form.setFieldsValue({
        blogTitle: blog.blogTitle,
        blogContent: blog.blogContent,
        blogCategory: {
          blogCategoryName: blog.blogCategory.blogCategoryName,
        },
        hashtags: blog.hashtags.map((tag) => tag.blogHashtagName),
        status: blog.status,
        blogImages: existingImages,
      });
    }, 100);
  };

  const handleDeleteBlog = async (blogTitle) => {
    try {
      await api.delete(`/blogs/${blogTitle}`);
      toast.success("Đã xóa blog này thành công!");
      fetchBlogs();
    } catch (error) {
      toast.error("Xóa blog này không thành công!");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Quản lý Blog</h1>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Nhập tiêu đề blog để tìm kiếm"
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
            fetchBlogs();
          }}
          style={{ margin: 8 }}
        >
          Reset
        </Button>
        <Button type="primary" onClick={handleOpenModal}>
          <i className="fa-solid fa-plus"></i> Thêm blog mới
        </Button>
      </div>

      <Table
        dataSource={blogList}
        columns={columns}
        rowKey="blogId"
        style={{ marginTop: 16 }}
      />

      <Modal
        title={editingBlog ? "Chỉnh sửa blog" : "Tạo blog mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={editingBlog ? "Lưu thay đổi" : "Tạo"}
        cancelText="Hủy"
        width={1000}
        destroyOnClose={true}
      >
        <Form
          form={form}
          labelCol={{ span: 24 }}
          onFinish={handleSubmitForm}
          preserve={false}
        >
          <Form.Item
            label="Tiêu đề"
            name="blogTitle"
            rules={[
              { required: true, message: "Tiêu đề không được bỏ trống!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nội dung"
            name="blogContent"
            rules={[
              { required: true, message: "Nội dung không được để trống!" },
            ]}
          >
            <MyEditor
              value={form.getFieldValue("blogContent")}
              onChange={(value) => form.setFieldsValue({ blogContent: value })}
            />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name={["blogCategory", "blogCategoryName"]}
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select>
              {categories.map((category) => (
                <Option
                  key={category.blogCategoryId}
                  value={category.blogCategoryName}
                >
                  {category.blogCategoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Hashtags"
            name="hashtags"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất một hashtag!" },
            ]}
          >
            <Select mode="multiple">
              {hashtags.map((tag) => (
                <Option key={tag.blogHashtagId} value={tag.blogHashtagName}>
                  {tag.blogHashtagName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="blogImages"
            rules={[
              {
                required: true,
                message: "Vui lòng tải lên ít nhất một hình ảnh!",
              },
            ]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto upload
              multiple
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>

          {editingBlog && (
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
        title="Chi tiết blog"
        open={isDetailModalOpen}
        onCancel={handleCloseDetailModal}
        footer={null}
        width={1000}
      >
        {selectedBlog && (
          <div>
            <p>
              <strong>ID: </strong> {selectedBlog.blogId}
            </p>
            <p>
              <strong>Tiêu đề: </strong> {selectedBlog.blogTitle}
            </p>
            <p>
              <strong>Nội dung: </strong>
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: selectedBlog.blogContent }}
            />
            <p>
              <strong>Danh mục: </strong>{" "}
              {selectedBlog.blogCategory.blogCategoryName}
            </p>
            <p>
              <strong>Hashtags: </strong>
              {selectedBlog.hashtags?.map((tag) => (
                <Tag key={tag.blogHashtagId}>{tag.blogHashtagName}</Tag>
              ))}
            </p>
            <p>
              <strong>Ngày đăng: </strong>
              {moment(selectedBlog.postedTime).format("DD/MM/YYYY HH:mm")}
            </p>
            <p>
              <strong>Trạng thái: </strong>
              {selectedBlog.status !== undefined ? (
                <Tag color={statusMapping[selectedBlog.status]?.color}>
                  {statusMapping[selectedBlog.status]?.text}
                </Tag>
              ) : (
                "Không xác định"
              )}
            </p>
            <p>
              <strong>Hình ảnh: </strong>
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {selectedBlog.blogImages?.map((image, index) => (
                <img
                  key={index}
                  src={image.imageURL}
                  alt={`Blog image ${index + 1}`}
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogManage;
