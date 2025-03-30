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
  const [uploadFileList, setUploadFileList] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const statusMapping = {
    1: { text: "HIỂN THỊ", color: "green" },
    0: { text: "ẨN", color: "red" },
  };

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

  // Fetch categories và hashtags khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog categories
        const categoriesResponse = await api.get("/blogCategory");
        setCategories(categoriesResponse.data);

        // Fetch blog hashtags
        const hashtagsResponse = await api.get("/blog-hashtag");
        setHashtags(hashtagsResponse.data);
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
      console.log("Raw blog data:", response.data);

      // Xử lý dữ liệu trước khi set vào state
      const processedBlogs = response.data.map((blog) => ({
        ...blog,
        blogImages: blog.blogImages
          ?.filter((images) => images.imageURL)
          .map((images) => ({
            imageId: images.imageId || null,
            imageURL: images.imageURL,
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

  const handleOpenModal = () => {
    form.resetFields();
    setUploadFileList([]);
    setEditingBlog(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBlog(null);
    form.resetFields();
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleViewDetails = (blog) => {
    setSelectedBlog(blog);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
    setSelectedBlog(null);
  };

  const handleSubmitForm = async () => {
    try {
      // Lấy token từ localStorage và giải mã để lấy email
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Bạn chưa đăng nhập! Vui lòng đăng nhập để tạo blog.");
        return;
      }

      let email;
      try {
        const decodedToken = jwtDecode(token);
        email = decodedToken.sub; // sub chứa email trong JWT
        console.log("Decoded token:", decodedToken);
        console.log("Email from token:", email);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        message.error(
          "Không thể xác thực thông tin người dùng. Vui lòng đăng nhập lại!"
        );
        return;
      }

      if (!email) {
        message.error("Không tìm thấy thông tin email người dùng!");
        return;
      }

      // Lấy giá trị status từ form
      const statusValue = form.getFieldValue("status");
      console.log("Form status value:", statusValue);

      if (editingBlog) {
        // For update, we need to use JSON format instead of multipart/form-data
        // Extract the blog data without images
        const updateData = {
          blogTitle: form.getFieldValue("blogTitle"),
          blogContent: form.getFieldValue("blogContent"),
          blogCategory: {
            blogCategoryName: form.getFieldValue([
              "blogCategory",
              "blogCategoryName",
            ]),
          },
          hashtags: form.getFieldValue("hashtags").map((tag) => ({
            blogHashtagName: tag,
          })),
          status: statusValue, // Sử dụng giá trị status được lấy từ form
          blogId: editingBlog.blogId,
          postedTime: editingBlog.postedTime, // Giữ ngày đăng cũ khi chỉnh sửa
        };

        console.log("Update data being sent:", updateData);

        // Send JSON data for update
        const response = await api.put(
          `/blogs/${editingBlog.blogTitle}`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        message.success("Cập nhật blog thành công!");
        
        // Check the response to ensure success
        console.log("Update response:", response.data);
      } else {
        const formData = new FormData();

        // Tạo đối tượng blog để gửi lên server
        const blogData = {
          blogTitle: form.getFieldValue("blogTitle"),
          blogContent: form.getFieldValue("blogContent"),
          blogCategory: {
            blogCategoryName: form.getFieldValue([
              "blogCategory",
              "blogCategoryName",
            ]),
          },
          hashtags: form.getFieldValue("hashtags").map((tag) => ({
            blogHashtagName: tag,
          })),
          status: 1, // Mặc định là hiển thị khi tạo mới
          postedTime: new Date().toISOString(),
        };

        console.log("Create blog data being sent:", blogData);

        // Thêm dữ liệu blog vào FormData
        formData.append(
          "blogs",
          new Blob([JSON.stringify(blogData)], { type: "application/json" })
        );

        // Thêm email vào request
        formData.append("email", email);

        // Thêm các file ảnh vào FormData
        if (imageFiles.length > 0) {
          imageFiles.forEach((file) => {
            formData.append("images", file);
          });
        } else {
          // Nếu không có ảnh, thêm một file rỗng
          const emptyBlob = new Blob([""], { type: "application/octet-stream" });
          formData.append("images", emptyBlob, "empty.txt");
        }

        // For create, continue using multipart/form-data
        const response = await api.post("/blogs", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        message.success("Tạo blog thành công!");
      }

      // Cập nhật lại danh sách blog và reset form
      setModalOpen(false);
      fetchBlogs(); // Cập nhật lại danh sách blog sau khi thêm/sửa
      form.resetFields();
      setUploadFileList([]);
      setImageFiles([]);
      setImagePreviews([]);
      setEditingBlog(null);
    } catch (error) {
      console.error("Lỗi khi xử lý blog:", error);
      console.error("Error response:", error.response?.data);
      message.error(
        editingBlog
          ? "Có lỗi xảy ra khi cập nhật blog!"
          : "Có lỗi xảy ra khi tạo blog!"
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

      setUploadFileList(existingImages);

      // Hiển thị ảnh hiện tại trong preview
      const currentImagePreviews =
        blog.blogImages?.map((img) => img.imageURL) || [];
      setImagePreviews(currentImagePreviews);

      // Set form values including status
      form.setFieldsValue({
        blogTitle: blog.blogTitle,
        blogContent: blog.blogContent,
        blogCategory: {
          blogCategoryName: blog.blogCategory.blogCategoryName,
        },
        hashtags: blog.hashtags.map((tag) => tag.blogHashtagName),
        status: blog.status, // Make sure this is set correctly
        blogImages: existingImages,
      });

      // Log form values for debugging
      console.log("Setting form values:", {
        blogTitle: blog.blogTitle,
        status: blog.status,
      });
    }, 100);
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

          <Form.Item label="Tải hình ảnh lên">
            <Upload
              multiple
              beforeUpload={(file) => {
                // Kiểm tra định dạng file
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("Bạn chỉ có thể tải lên file hình ảnh!");
                  return Upload.LIST_IGNORE;
                }

                // Kiểm tra kích thước file (ví dụ: giới hạn 5MB)
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                  message.error("Hình ảnh phải nhỏ hơn 5MB!");
                  return Upload.LIST_IGNORE;
                }

                // Lưu file vào state
                setImageFiles((prev) => [...prev, file]);
                setImagePreviews((prev) => [
                  ...prev,
                  URL.createObjectURL(file),
                ]);
                return false; // Prevent automatic upload
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 8 }}>
              {imagePreviews.map((preview, index) => (
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
                      // Xóa ảnh khỏi preview và imageFiles
                      setImagePreviews((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setImageFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  />
                </div>
              ))}
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
            <p style={{ display: "flex" }}>
              <strong>Ảnh: </strong>
              {selectedBlog.blogImages?.map((image, index) => (
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