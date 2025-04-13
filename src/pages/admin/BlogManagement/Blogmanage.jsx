import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Popconfirm,
  Select,
  Tag,
  Upload,
  Image,
  message,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import { toast, ToastContainer } from "react-toastify";
import MyEditor from "../../../component/TinyMCE/MyEditor";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { jwtDecode } from "jwt-decode";

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
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const statusMapping = {
    1: { text: "HIỂN THỊ", color: "green" },
    0: { text: "ẨN", color: "red" },
  };

  const MAX_IMAGES = 2;

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
      render: (images) => (
        <div>
          {images &&
            images.map((image, index) => (
              <Image
                key={index}
                src={image.imageURL}
                alt="Blog"
                style={{ width: 50, height: 50, marginRight: 8 }}
              />
            ))}
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "blogCategory",
      key: "blogCategory",
      render: (blogCategory) => blogCategory?.blogCategoryName || "N/A",
    },
    {
      title: "Hashtags",
      dataIndex: "hashtags",
      key: "hashtags",
      render: (hashtags) => (
        <div>
          {hashtags &&
            hashtags.map((tag, index) => (
              <Tag key={index} color="blue">
                {tag.blogHashtagName}
              </Tag>
            ))}
        </div>
      ),
    },
    {
      title: "Tác giả",
      key: "author",
      render: (text, record) => {
        if (record.user) {
          return `${record.user.firstName} ${record.user.lastName}`;
        }
        return "N/A";
      },
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
        <div className="button" style={{ display: "flex", justifyContent: "center", flexDirection: "column", width: "20px", alignItems: "center" }}>
          <Tooltip title="Sửa">
            <Button
              color="orange"
              variant="filled"
              onClick={() => handleEditBlog(record)}
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
              title="Bạn có muốn xóa blog này không?"
              onConfirm={() => handleDeleteBlog(record.blogTitle)}
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await api.get("/blogCategory");
        const activeCategories = categoriesResponse.data.filter(
          (category) => category.status === 1
        );
        setCategories(activeCategories);

        const hashtagsResponse = await api.get("/blog-hashtag");
        const activeHashtags = hashtagsResponse.data.filter(
          (tag) => tag.status === 1
        );
        setHashtags(activeHashtags);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.info(
          "Không thể tải dữ liệu danh mục và hashtag. Vui lòng kiểm tra kết nối."
        );
      }
    };

    fetchData();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get("/blogs");
      const processedBlogs = response.data.map((blog) => ({
        ...blog,
        author: blog.user,
        blogImages: blog.blogImages
          ?.filter((images) => images.imageURL)
          .map((images) => ({
            imageId: images.imageId || null,
            imageURL: images.imageURL,
            blogId: blog.blogId,
          })),
      }));

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

  const handleOpenModal = () => {
    form.resetFields();
    setEditingBlog(null);
    setModalOpen(true);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBlog(null);
    form.resetFields();
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  const handleViewDetails = (blog) => {
    setSelectedBlog(blog);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedBlog(null);
  };

  const checkTitleExists = async (title) => {
    if (editingBlog && editingBlog.blogTitle === title) {
      return false;
    }
    
    try {
      const response = await api.get(`/blogs/title/${title}`);
      return !!response.data;
    } catch (error) {
      return false;
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setModalOpen(true);
    setTimeout(() => {
      // Giữ nguyên thứ tự ảnh từ server
      const currentImages = blog.blogImages
        ?.sort((a, b) => a.imageId - b.imageId) // Sắp xếp theo imageId để giữ thứ tự
        .map((img) => img.imageURL) || [];
      
      setExistingImages([...currentImages]);
      setImagePreviews([...currentImages]);

      form.setFieldsValue({
        blogTitle: blog.blogTitle,
        blogContent: blog.blogContent,
        blogCategory: {
          blogCategoryName: blog.blogCategory.blogCategoryName,
        },
        hashtags: blog.hashtags.map((tag) => tag.blogHashtagName),
        status: blog.status,
      });
    }, 100);
  };

  const renderPreviewImage = (preview, index) => {
    const isExistingImage = existingImages.includes(preview);
    
    return (
      <div
        key={index}
        style={{ position: "relative", margin: "0 8px 8px 0" }}
      >
        <Image
          src={preview}
          alt="Preview"
          width={100}
          style={{ borderRadius: 4 }}
        />
        {!isExistingImage && (
          <Button
            type="text"
            danger
            icon={<i className="fa-solid fa-times"></i>}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "50%",
              padding: 4,
              minWidth: "auto",
              height: "auto",
            }}
            onClick={() => {
              const newPreviews = [...imagePreviews];
              newPreviews.splice(index, 1);
              setImagePreviews(newPreviews);
              
              const fileIndex = index - existingImages.length;
              if (fileIndex >= 0) {
                const newFiles = [...imageFiles];
                newFiles.splice(fileIndex, 1);
                setImageFiles(newFiles);
              }
            }}
          />
        )}
      </div>
    );
  };

  const handleSubmitForm = async () => {
    try {
      await form.validateFields();
      
      const blogTitle = form.getFieldValue("blogTitle");
      
      const titleExists = await checkTitleExists(blogTitle);
      if (titleExists) {
        message.error("Tiêu đề blog đã tồn tại! Vui lòng nhập tiêu đề khác.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Bạn chưa đăng nhập! Vui lòng đăng nhập để tạo blog.");
        return;
      }

      let email;
      try {
        const decodedToken = jwtDecode(token);
        email = decodedToken.sub;
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        message.error("Không thể xác thực thông tin người dùng. Vui lòng đăng nhập lại!");
        return;
      }

      if (!email) {
        message.error("Không tìm thấy thông tin email người dùng!");
        return;
      }

      let userData = null;
      try {
        const userResponse = await api.get(`/users/${email}`);
        userData = userResponse.data;
      } catch (userError) {
        console.error("Lỗi khi lấy thông tin người dùng:", userError);
        message.warning("Không thể lấy đầy đủ thông tin người tạo blog!");
      }

      let blogContent = form.getFieldValue("blogContent");

      const formData = new FormData();

      const blogData = {
        blogTitle: blogTitle,
        blogContent: blogContent,
        blogCategory: {
          blogCategoryName: form.getFieldValue(["blogCategory", "blogCategoryName"]),
        },
        hashtags: form.getFieldValue("hashtags").map((tag) => ({
          blogHashtagName: tag,
        })),
        status: editingBlog ? form.getFieldValue("status") : 1,
        postedTime: editingBlog ? editingBlog.postedTime : new Date().toISOString(),
      };

      if (userData) {
        blogData.author = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: email,
          userId: userData.userId,
        };
      }

      formData.append("blogs", new Blob([JSON.stringify(blogData)], { type: "application/json" }));
      formData.append("email", email);

      // Giữ nguyên thứ tự ảnh khi gửi lên server
      // 1. Gửi ảnh cũ trước (nếu có)
      if (editingBlog && existingImages.length > 0) {
        // Trong trường hợp edit, server sẽ xử lý giữ nguyên ảnh cũ
        // Chúng ta chỉ cần gửi ảnh mới thêm vào
      }
      
      // 2. Gửi ảnh mới (nếu có)
      if (imageFiles.length > 0) {
        // Giữ nguyên thứ tự upload bằng cách duyệt tuần tự mảng
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      } else if (!editingBlog) {
        // Nếu là tạo mới và không có ảnh, gửi một blob rỗng
        const emptyBlob = new Blob([""], { type: "application/octet-stream" });
        formData.append("images", emptyBlob, "empty.txt");
      }

      let response;
      if (editingBlog) {
        response = await api.put(`/blogs/${editingBlog.blogTitle}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Cập nhật blog thành công!");
      } else {
        response = await api.post("/blogs", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Tạo blog thành công!");
      }

      const updatedBlog = response.data;
      // Sắp xếp ảnh theo thứ tự imageId để đảm bảo hiển thị đúng thứ tự
      const imageURLs = updatedBlog.blogImages
        ?.sort((a, b) => a.imageId - b.imageId)
        .map((img) => img.imageURL) || [];

      let updatedContent = updatedBlog.blogContent;
      if (imageURLs.length > 0) {
        let imageIndex = 0;
        updatedContent = updatedContent.replace(/<img data-placeholder="image-slot"[^>]*>/g, (match) => {
          if (imageIndex < imageURLs.length) {
            const imgTag = `<img src="${imageURLs[imageIndex]}" alt="Blog Image" style="max-width: 100%; height: auto;" />`;
            imageIndex += 1;
            return imgTag;
          }
          return "";
        });
      }

      const processedBlog = { ...updatedBlog, blogContent: updatedContent };
      if (editingBlog) {
        setBlogList((prev) =>
          prev.map((blog) => (blog.blogId === processedBlog.blogId ? processedBlog : blog))
        );
      } else {
        setBlogList((prev) => [...prev, processedBlog]);
      }

      setModalOpen(false);
      form.resetFields();
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
      setEditingBlog(null);
    } catch (error) {
      console.error("Lỗi khi xử lý blog:", error);
      console.error("Error response:", error.response?.data);
      message.error(editingBlog ? "Có lỗi xảy ra khi cập nhật blog!" : "Có lỗi xảy ra khi tạo blog!");
    }
  };

  const handleDeleteBlog = async (blogTitle) => {
    try {
      await api.delete(`/blogs/${blogTitle}`);
      toast.success("Đã xóa blog này thành công!");
      fetchBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
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
        onOk={handleSubmitForm}
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
            rules={[{ required: true, message: "Nội dung không được để trống!" }]}
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

          <Form.Item label="Tải hình ảnh lên (tối đa 2 ảnh)">
            <Upload
              multiple
              beforeUpload={(file) => {
                const remainingSlots = MAX_IMAGES - imagePreviews.length;
                if (remainingSlots <= 0) {
                  message.error(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh!`);
                  return Upload.LIST_IGNORE;
                }

                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("Bạn chỉ có thể tải lên file hình ảnh!");
                  return Upload.LIST_IGNORE;
                }

                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error("Hình ảnh phải nhỏ hơn 5MB!");
                  return Upload.LIST_IGNORE;
                }

                // Thêm ảnh mới vào cuối mảng
                setImageFiles((prev) => [...prev, file]);
                setImagePreviews((prev) => [...prev, URL.createObjectURL(file)]);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <div style={{ marginTop: 8 }}>
              {imagePreviews.length < MAX_IMAGES ? (
                <span style={{ color: '#888' }}>
                  Bạn có thể tải lên thêm {MAX_IMAGES - imagePreviews.length} ảnh
                </span>
              ) : (
                <span style={{ color: 'red' }}>
                  Đã đạt tối đa {MAX_IMAGES} ảnh
                </span>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 8 }}>
              {imagePreviews.map((preview, index) => renderPreviewImage(preview, index))}
            </div>
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
                <Option value={1}>HIỂN THỊ</Option>
                <Option value={0}>ẨN</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

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
              <strong>Tác giả: </strong>
              {selectedBlog.user
                ? `${selectedBlog.user.firstName} ${selectedBlog.user.lastName} (${selectedBlog.user.email})`
                : "Không xác định"}
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
            <p style={{ display: "flex" }}>
              <strong>Ảnh: </strong>
              {selectedBlog.blogImages
                ?.sort((a, b) => a.imageId - b.imageId) // Sắp xếp ảnh theo imageId
                .map((image, index) => (
                  <Image
                    key={index}
                    src={image.imageURL}
                    alt="Blog"
                    style={{ width: 100, margin: "0 8px" }}
                  />
                ))}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BlogManage;