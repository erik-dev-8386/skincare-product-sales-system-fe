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
  const [processedContent, setProcessedContent] = useState('');

  // Định nghĩa style chung cho tất cả hình ảnh
  const commonImageStyle = {
    width: '100%',
    height: '400px', // Thống nhất chiều cao cho tất cả hình ảnh
    objectFit: 'contain',
    borderRadius: '8px',
  };

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

  useEffect(() => {
    // Thêm meta charset nếu chưa có
    const meta = document.createElement('meta');
    meta.setAttribute('charset', 'UTF-8');
    document.head.appendChild(meta);
  }, []);

  useEffect(() => {
    if (blog?.blogContent && blog.blogImages && blog.blogImages.length > 1) {
      const paragraphs = blog.blogContent.split('</p>');
      
      let newContent = paragraphs.map((paragraph, index) => {
        if (index === 0) {
          return `${paragraph}</p>`;
        }
        
        if (blog.blogImages[index] && index < paragraphs.length - 1) {
          return `
            <div style="text-align: center; margin: 20px 0;">
              <img 
                src="${blog.blogImages[index].imageURL}" 
                alt="Blog image ${index + 1}"
                style="width: 100%; height: 400px; object-fit: contain; border-radius: 8px;"
              />
            </div>
            ${paragraph}</p>
          `;
        }
        
        return `${paragraph}</p>`;
      }).join('');

      setProcessedContent(newContent);
    }
  }, [blog]);

  // Thêm hàm helper
  const decodeText = (text) => {
    try {
      return decodeURIComponent(escape(text));
    } catch (e) {
      return text;
    }
  };

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
    <div className="blog-detail-container" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      minHeight: '100vh'
    }}>
      {/* <Breadcrumb
        className="blog-detail-breadcrumb"
        style={{
          
          padding: '0px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
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
      /> */}

      <div className="blog-detail-content" style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <Title level={1} className="blog-detail-title" style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '2rem', 
          textAlign: 'center',
          color: '#2c3e50',
          borderBottom: '2px solid #eee',
          paddingBottom: '20px'
        }}>
          {decodeText(blog.blogTitle)}
        </Title>

        {blog.blogImages && blog.blogImages.length > 0 && (
          <div className="blog-detail-main-image" style={{ 
            width: '100%',
            margin: '0 auto 2rem auto',
          }}>
            <Image
              src={blog.blogImages[0].imageURL}
              alt={blog.blogTitle}
              preview={true}
              style={commonImageStyle}
            />
          </div>
        )}

        <div
          className="blog-detail-body"
          style={{
            fontSize: '16px',
            lineHeight: '1.8',
            color: '#2c3e50',
            margin: '30px 0',
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px'
          }}
          dangerouslySetInnerHTML={{ 
            __html: processedContent || decodeText(blog.blogContent) 
          }}
        />

        <div className="blog-detail-meta" style={{ 
          marginTop: '2rem', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#3498db' }}></i>
            <strong>Ngày đăng:</strong> 
            <span>{new Date(blog.postedTime).toLocaleDateString("vi-VN")}</span>
          </div>
          
          <div style={{ 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fa-solid fa-folder" style={{ color: '#e67e22' }}></i>
            <strong>Danh mục:</strong> 
            <span>{blog.blogCategory?.blogCategoryName || "Không có danh mục"}</span>
          </div>
          
          {blog.hashtags && blog.hashtags.length > 0 && (
            <div className="blog-detail-tags" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              <i className="fa-solid fa-hashtag" style={{ color: '#2ecc71' }}></i>
              <strong>Hashtags:</strong>
              {blog.hashtags.map((tag) => (
                <Tag 
                  key={tag.blogHashtagId} 
                  color="blue"
                  style={{
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '14px'
                  }}
                >
                  {decodeText(tag.blogHashtagName)}
                </Tag>
              ))}
            </div>
          )}
        </div>

        {blog.blogImages && blog.blogImages.length > 2 && (
          <div className="blog-detail-gallery" style={{ marginTop: '40px' }}>
            <Divider orientation="left" style={{
              fontSize: '20px',
              color: '#2c3e50',
              marginBottom: '30px'
            }}>
              <i className="fa-solid fa-images" style={{ marginRight: '10px' }}></i>
              Hình ảnh khác
            </Divider>
            <Row gutter={[24, 24]}>
              {blog.blogImages.slice(2).map((image, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Image
                    src={image.imageURL}
                    alt={`${blog.blogTitle} - Ảnh ${index + 3}`}
                    preview={true}
                    style={commonImageStyle}
                  />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {relatedBlogs.length > 0 && (
          <div className="blog-detail-related" style={{ marginTop: '40px' }}>
            <Divider orientation="left" style={{
              fontSize: '20px',
              color: '#2c3e50',
              marginBottom: '30px'
            }}>
              <i className="fa-solid fa-newspaper" style={{ marginRight: '10px' }}></i>
              Bài viết liên quan
            </Divider>
            <Row gutter={[24, 24]}>
              {relatedBlogs.map((relatedBlog) => (
                <Col xs={24} sm={12} md={8} key={relatedBlog.blogId}>
                  <div
                    onClick={() => {
                      navigate(`/blog/${relatedBlog.blogId}`);
                      window.scrollTo(0, 0);
                    }}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease',
                      ':hover': {
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <Image
                      src={
                        relatedBlog.blogImages?.[0]?.imageURL ||
                        "https://via.placeholder.com/300x180?text=No+Image"
                      }
                      alt={relatedBlog.blogTitle}
                      preview={false}
                      style={commonImageStyle}
                    />
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '10px',
                      color: '#2c3e50',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {decodeText(relatedBlog.blogTitle)}
                    </h3>
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <i className="fa-solid fa-calendar-days"></i>
                      {new Date(relatedBlog.postedTime).toLocaleDateString("vi-VN")}
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
