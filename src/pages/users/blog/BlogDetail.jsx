import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Breadcrumb,
  Spin,
  Tag,
  Divider,
  Image,
  Row,
  Col,
} from "antd";
import api from "../../../config/api";
import "./BlogDetail.css";
// import Footer from "../../../component/Footer/Footer.jsx";
// import Header from "../../../component/Header/Header.jsx";

const { Title } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        console.log(`Fetching blog with ID: ${id}`);

        // Check if the ID is a UUID (contains hyphens)
        const isUUID = id.includes('-');
        
        let blogData;
        
        if (isUUID) {
          // Try to get all blogs and find the one with matching ID
          const allBlogsResponse = await api.get("/blogs");
          blogData = allBlogsResponse.data.find(blog => blog.blogId === id);
        } else {
          // If it's not a UUID, try direct API call
          const response = await api.get(`/blogs/${id}`);
          blogData = response.data;
        }
        
        if (!blogData) {
          setError(`Không tìm thấy bài viết với ID: ${id}`);
          setLoading(false);
          return;
        }
        
        setBlog(blogData);
        
        // Fetch related blogs from the same category
        if (blogData && blogData.blogCategory) {
          const categoryId = blogData.blogCategory.blogCategoryId;
          try {
            const relatedResponse = await api.get(`/blogs/category/${categoryId}`);
            // Filter out the current blog and limit to 3 related blogs
            const filtered = relatedResponse.data
              .filter((b) => b.blogId !== id)
              .slice(0, 3);
            setRelatedBlogs(filtered);
          } catch (relatedError) {
            console.error("Error fetching related blogs:", relatedError);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog detail:", error);
        // Hiển thị thông tin lỗi chi tiết hơn
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          setError(
            `Lỗi server: ${error.response.status} - ${
              error.response.data.message || "Không có thông tin chi tiết"
            }`
          );
        } else if (error.request) {
          console.error("Request made but no response received");
          setError(
            "Không nhận được phản hồi từ server. Vui lòng kiểm tra kết nối mạng."
          );
        } else {
          console.error("Error message:", error.message);
          setError(`Lỗi: ${error.message}`);
        }
        setLoading(false);
      }
    };

    fetchBlogDetail();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <Spin size="large" />
        <p>Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-detail-error">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p>{error}</p>
        <button onClick={() => navigate("/blog")}>Quay lại trang Blog</button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-not-found">
        <i className="fa-solid fa-face-sad-tear"></i>
        <p>Không tìm thấy bài viết.</p>
        <button onClick={() => navigate("/blog")}>Quay lại trang Blog</button>
      </div>
    );
  }

  return (
    <div className="blog-detail-container full-width">
      <Breadcrumb
        className="blog-detail-breadcrumb"
        items={[
          {
            title: (
              <span>
                <i className="fa-solid fa-home"></i> Trang chủ
              </span>
            ),
            onClick: () => navigate("/"),
            style: { cursor: "pointer" },
          },
          {
            title: (
              <span>
                <i className="fa-solid fa-newspaper"></i> Blog
              </span>
            ),
            onClick: () => navigate("/blog"),
            style: { cursor: "pointer" },
          },
          {
            title: <span>{blog.blogTitle}</span>,
          },
        ]}
      />

      <div className="blog-detail-content full-width">
        <Title level={1} className="blog-detail-title" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
          {blog.blogTitle}
        </Title>

        {blog.blogImages && blog.blogImages.length > 0 && (
          <div className="blog-detail-main-image">
            <Image
              src={blog.blogImages[0].imageURL}
              alt={blog.blogTitle}
              preview={false}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </div>
        )}

        <div
          className="blog-detail-body full-width"
          dangerouslySetInnerHTML={{ __html: blog.blogContent }}
        />

        <div className="blog-detail-meta" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px', width: '100%' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="blog-detail-date">
              <i className="fa-solid fa-calendar-days"></i>{" "}
              <strong>Ngày đăng:</strong> {new Date(blog.postedTime).toLocaleDateString("vi-VN")}
            </span>
          </div>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="blog-detail-category">
              <i className="fa-solid fa-folder"></i>{" "}
              <strong>Danh mục:</strong> {blog.blogCategory?.blogCategoryName || "Không có danh mục"}
            </span>
          </div>
          
          {blog.hashtags && blog.hashtags.length > 0 && (
            <div className="blog-detail-tags">
              <strong><i className="fa-solid fa-hashtag"></i> Hashtags:</strong>{" "}
              {blog.hashtags.map((tag) => (
                <Tag key={tag.blogHashtagId} color="blue">
                  {tag.blogHashtagName}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {blog.blogImages && blog.blogImages.length > 1 && (
          <div className="blog-detail-gallery">
            <Divider orientation="left">Hình ảnh khác</Divider>
            <Row gutter={[16, 16]}>
              {blog.blogImages.slice(1).map((image, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Image
                    src={image.imageURL}
                    alt={`${blog.blogTitle} - Ảnh ${index + 2}`}
                    className="blog-detail-gallery-image"
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {relatedBlogs.length > 0 && (
          <div className="blog-detail-related">
            <Divider orientation="left">Bài viết liên quan</Divider>
            <Row gutter={[16, 16]}>
              {relatedBlogs.map((relatedBlog) => (
                <Col xs={24} sm={12} md={8} key={relatedBlog.blogId}>
                  <div
                    className="blog-detail-related-item"
                    onClick={() => {
                      navigate(`/blog/${relatedBlog.blogId}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div className="blog-detail-related-image">
                      <img
                        src={
                          relatedBlog.blogImages &&
                          relatedBlog.blogImages.length > 0
                            ? relatedBlog.blogImages[0].imageURL
                            : "https://via.placeholder.com/300x180?text=No+Image"
                        }
                        alt={relatedBlog.blogTitle}
                      />
                    </div>
                    <div className="blog-detail-related-title">
                      {relatedBlog.blogTitle}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
