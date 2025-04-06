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
  Tabs,
} from "antd";
import api from "../../../config/api";
import "./BlogDetail.css";

const { Title } = Typography;
const { TabPane } = Tabs;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedByHashtags, setRelatedByHashtags] = useState([]);
  const [relatedByAuthor, setRelatedByAuthor] = useState([]);
  const [processedContent, setProcessedContent] = useState('');


  const commonImageStyle = {
    width: '100%',
    height: '400px',
    objectFit: 'contain',
    borderRadius: '8px',
  };

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        console.log(`Fetching blog with ID: ${id}`);


        const isUUID = id.includes('-');
        
        let blogData;
        
        if (isUUID) {
          const allBlogsResponse = await api.get("/blogs");
          blogData = allBlogsResponse.data.find(blog => blog.blogId === id);
        } else {
          const response = await api.get(`/blogs/${id}`);
          blogData = response.data; 
        }
        
        if (!blogData) {
          setError(`Không tìm thấy bài viết với ID: ${id}`);
          setLoading(false);
          return;
        }
        
        setBlog(blogData);
        await fetchRelatedBlogs(blogData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog detail:", error);
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
    window.scrollTo(0, 0);
  }, [id]);

  const fetchRelatedBlogs = async (blogData) => {
    try {

      if (blogData.blogCategory) {
        const categoryId = blogData.blogCategory.blogCategoryId;
        try {
          const relatedResponse = await api.get(`/blogs`);
          const filtered = relatedResponse.data
            .filter(b => 
              b.blogId !== blogData.blogId &&
              b.blogCategory?.blogCategoryId === categoryId
            )
            .slice(0, 3);
          
          const enhancedBlogs = filtered.map(blog => ({
            ...blog,
            blogCategory: blog.blogCategory || blogData.blogCategory
          }));
          
          setRelatedBlogs(enhancedBlogs);
        } catch (relatedError) {
          console.error("Error fetching related blogs by category:", relatedError);
        }
      }

 
      if (blogData.hashtags && blogData.hashtags.length > 0) {
        try {
          const allBlogsResponse = await api.get("/blogs");
          const allBlogs = allBlogsResponse.data;
          
          const currentHashtagIds = blogData.hashtags.map(tag => tag.blogHashtagId);
          
          const blogsWithCommonHashtags = allBlogs.filter(otherBlog => {
            if (otherBlog.blogId === blogData.blogId) return false;
            if (!otherBlog.hashtags || otherBlog.hashtags.length === 0) return false;
            return otherBlog.hashtags.some(tag => 
              currentHashtagIds.includes(tag.blogHashtagId)
            );
          });
          
          const sortedBlogs = blogsWithCommonHashtags.sort((a, b) => {
            const matchesA = a.hashtags.filter(tag => 
              currentHashtagIds.includes(tag.blogHashtagId)
            ).length;
            const matchesB = b.hashtags.filter(tag => 
              currentHashtagIds.includes(tag.blogHashtagId)
            ).length;
            return matchesB - matchesA;
          });
          
          setRelatedByHashtags(sortedBlogs.slice(0, 3));
        } catch (hashtagError) {
          console.error("Error fetching related blogs by hashtags:", hashtagError);
        }
      }


      if (blogData.user && blogData.user.userId) {
        try {
          const allBlogsResponse = await api.get("/blogs");
          const authorBlogs = allBlogsResponse.data
            .filter(b => 
              b.blogId !== blogData.blogId &&
              b.user && 
              b.user.userId === blogData.user.userId
            )
            .slice(0, 3);
          
          setRelatedByAuthor(authorBlogs);
        } catch (authorError) {
          console.error("Error fetching blogs by same author:", authorError);
        }
      }
    } catch (error) {
      console.error("Error in fetchRelatedBlogs:", error);
    }
  };

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

  const decodeText = (text) => {
    try {
      return decodeURIComponent(escape(text));
    } catch (e) {
      return text;
    }
  };

  const renderCommonHashtags = (relatedBlog) => {
    if (!blog || !blog.hashtags || !relatedBlog.hashtags) return null;
    
    const currentHashtagIds = blog.hashtags.map(tag => tag.blogHashtagId);
    const commonHashtags = relatedBlog.hashtags.filter(tag => 
      currentHashtagIds.includes(tag.blogHashtagId)
    );
    
    if (commonHashtags.length === 0) return null;
    
    return (
      <div style={{ marginTop: '10px' }}>
        <strong>Hashtag chung: </strong>
        {commonHashtags.map(tag => (
          <Tag 
            key={tag.blogHashtagId} 
            color="green"
            style={{
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              margin: '2px'
            }}
          >
            {decodeText(tag.blogHashtagName)}
          </Tag>
        ))}
      </div>
    );
  };

  const renderCategoryInfo = (relatedBlog) => {
    if (!relatedBlog.blogCategory && !relatedBlog.categoryName) return null;
    
    const categoryName = relatedBlog.blogCategory?.blogCategoryName || relatedBlog.categoryName;
    
    return (
      <div style={{ marginTop: '10px' }}>
        <strong>Danh mục: </strong>
        <Tag 
          color="blue"
          style={{
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            margin: '2px'
          }}
        >
          {decodeText(categoryName)}
        </Tag>
      </div>
    );
  };

  const renderAuthorInfo = (relatedBlog) => {
    if (!relatedBlog.user) return null;
    
    return (
      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
        <i className="fa-solid fa-user" style={{ color: '#3498db', marginRight: '5px' }}></i>
        <strong>Tác giả: </strong>
        <span style={{ marginLeft: '5px' }}>
          {relatedBlog.user.firstName} {relatedBlog.user.lastName}
        </span>
      </div>
    );
  };

  const renderBlogCard = (relatedBlog, options = {}) => {
    const { showCommonHashtags = false, showAuthor = false, showCategory = false } = options;
    
    return (
      <div
        onClick={() => {
          navigate(`/blog/${relatedBlog.blogId}`);
          window.scrollTo(0, 0);
        }}
        style={{
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          padding: '15px',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #eee',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Image
          src={
            relatedBlog.blogImages?.[0]?.imageURL ||
            "https://via.placeholder.com/300x180?text=No+Image"
          }
          alt={relatedBlog.blogTitle}
          preview={false}
          style={{ ...commonImageStyle, height: '200px' }}
        />
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          marginTop: '15px',
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
          gap: '10px',
          marginBottom: '10px'
        }}>
          <i className="fa-solid fa-calendar-days"></i>
          {new Date(relatedBlog.postedTime).toLocaleDateString("vi-VN")}
        </div>
        {showCommonHashtags && renderCommonHashtags(relatedBlog)}
        {showAuthor && renderAuthorInfo(relatedBlog)}
        {showCategory && renderCategoryInfo(relatedBlog)}
      </div>
    );
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

          {blog.user && (
            <div style={{ 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <i className="fa-solid fa-user" style={{ color: '#9b59b6' }}></i>
              <strong>Tác giả:</strong> 
              <span>{blog.user.firstName} {blog.user.lastName}</span>
            </div>
          )}
          
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

        {(relatedBlogs.length > 0 || relatedByHashtags.length > 0 || relatedByAuthor.length > 0) && (
          <div className="blog-detail-related" style={{ marginTop: '40px' }}>
            <Divider orientation="left" style={{
              fontSize: '20px',
              color: '#2c3e50',
              marginBottom: '20px'
            }}>
              <i className="fa-solid fa-newspaper" style={{ marginRight: '10px' }}></i>
              Bài viết liên quan
            </Divider>
            
            <Tabs defaultActiveKey="category" type="card" style={{ marginBottom: '30px' }}>
              <TabPane 
                tab={
                  <span>
                    <i className="fa-solid fa-folder" style={{ marginRight: '5px' }}></i>
                    Cùng danh mục
                  </span>
                } 
                key="category"
              >
                {relatedBlogs.length > 0 ? (
                  <div>
                    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
                      <i className="fa-solid fa-info-circle" style={{ color: '#3498db', marginRight: '10px' }}></i>
                      Các bài viết trong cùng danh mục <strong>"{blog.blogCategory?.blogCategoryName}"</strong>
                    </div>
                    
                    <Row gutter={[24, 24]}>
                      {relatedBlogs
                        .filter(relatedBlog => 
                          relatedBlog.blogCategory?.blogCategoryId === blog.blogCategory?.blogCategoryId
                        )
                        .slice(0, 3)
                        .map((relatedBlog) => (
                          <Col xs={24} sm={12} md={8} key={relatedBlog.blogId}>
                            {renderBlogCard(relatedBlog, { 
                              showCategory: true,
                              showCommonHashtags: true 
                            })}
                          </Col>
                        ))
                      }
                    </Row>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    Không có bài viết nào trong cùng danh mục
                  </div>
                )}
              </TabPane>
              
              <TabPane 
                tab={
                  <span>
                    <i className="fa-solid fa-hashtag" style={{ marginRight: '5px' }}></i>
                    Cùng hashtag
                  </span>
                } 
                key="hashtags"
              >
                {relatedByHashtags.length > 0 ? (
                  <div>
                    <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0fff0', borderRadius: '8px' }}>
                      <i className="fa-solid fa-info-circle" style={{ color: '#2ecc71', marginRight: '10px' }}></i>
                      Các bài viết có cùng hashtag với bài viết hiện tại
                    </div>
                    
                    <Row gutter={[24, 24]}>
                      {relatedByHashtags.map((relatedBlog) => (
                        <Col xs={24} sm={12} md={8} key={relatedBlog.blogId}>
                          {renderBlogCard(relatedBlog, { showCommonHashtags: true })}
                        </Col>
                      ))}
                    </Row>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    Không có bài viết nào có hashtag tương tự
                  </div>
                )}
              </TabPane>

              <TabPane 
                tab={
                  <span 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <i className="fa-solid fa-user"></i>
                    Cùng tác giả
                  </span>
                } 
                key="author"
              >
                {relatedByAuthor.length > 0 ? (
                  <div>
                    <div style={{ 
                      marginBottom: '20px', 
                      padding: '10px', 
                      backgroundColor: '#f5f0ff', 
                      borderRadius: '8px' 
                    }}>
                      <i className="fa-solid fa-info-circle" style={{ color: '#9b59b6', marginRight: '10px' }}></i>
                      Các bài viết khác của tác giả <strong>"{blog.user?.firstName} {blog.user?.lastName}"</strong>
                    </div>
                    
                    <Row gutter={[24, 24]}>
                      {relatedByAuthor.map((relatedBlog) => (
                        <Col xs={24} sm={12} md={8} key={relatedBlog.blogId}>
                          {renderBlogCard(relatedBlog, { showAuthor: true })}
                        </Col>
                      ))}
                    </Row>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    Không có bài viết nào từ cùng tác giả
                  </div>
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;