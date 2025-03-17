// Blog.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Select,
  Layout,
  Menu,
  Row,
  Col,
  Breadcrumb,
  Spin,
  Divider,
  Typography,
} from "antd";
import api from "../../../config/api";
import "./Blog.css";
import BlogCard from "../../../component/BlogCard/BlogCard.jsx";
import Footer from "../../../component/Footer/Footer.jsx";
import Header from "../../../component/Header/Header.jsx";

const { Option } = Select;
const { Sider, Content, Header: LayoutHeader } = Layout;
const { Title, Paragraph } = Typography;

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
    fetchHashtags();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/blogs");
      console.log("Blog data:", response.data);
      setBlogs(response.data);
      setFilteredBlogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blogCategory");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching blog categories:", error);
    }
  };

  const fetchHashtags = async () => {
    try {
      const response = await api.get("/blog-hashtag");
      setHashtags(response.data);
    } catch (error) {
      console.error("Error fetching blog hashtags:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    filterBlogs(query, selectedCategory, selectedHashtag, sortOption);
  };

  const handleSort = (value) => {
    setSortOption(value);
    filterBlogs(searchTerm, selectedCategory, selectedHashtag, value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterBlogs(searchTerm, category, selectedHashtag, sortOption);
  };

  const handleHashtagSelect = (hashtag) => {
    setSelectedHashtag(hashtag);
    filterBlogs(searchTerm, selectedCategory, hashtag, sortOption);
  };

  const filterBlogs = (search, category, hashtag, sort) => {
    let filtered = [...blogs];

    if (search) {
      filtered = filtered.filter((blog) =>
        blog.blogTitle.toLowerCase().includes(search)
      );
    }

    if (category) {
      filtered = filtered.filter(
        (blog) => blog.blogCategory?.blogCategoryId === category
      );
    }

    if (hashtag) {
      filtered = filtered.filter((blog) =>
        blog.hashtags?.some((tag) => tag.blogHashtagId === hashtag)
      );
    }

    switch (sort) {
      case "a-z":
        filtered.sort((a, b) => a.blogTitle.localeCompare(b.blogTitle));
        break;
      case "z-a":
        filtered.sort((a, b) => b.blogTitle.localeCompare(a.blogTitle));
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.postedTime) - new Date(a.postedTime)
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.postedTime) - new Date(b.postedTime)
        );
        break;
      default:
        break;
    }

    setFilteredBlogs(filtered);
  };

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          textAlign: "center",
          padding: "100px",
          background: "linear-gradient(to right, #f8f9fa, #e9ecef)",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          margin: "50px auto",
          maxWidth: "500px",
        }}
      >
        <Spin size="large" />
        <p style={{ marginTop: "20px", fontSize: "16px", color: "#6c757d" }}>
          Đang tải bài viết...
        </p>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <Layout style={{ minHeight: "100vh", background: "#fff" }}>
        <Breadcrumb
          style={{
            margin: "20px 0",
            padding: "10px 20px",
            background: "#f8f9fa",
            borderRadius: "4px",
          }}
          items={[
            {
              title: (
                <span style={{ color: "#6c757d" }}>
                  <i className="fa-solid fa-home"></i> Trang chủ
                </span>
              ),
              onClick: () => navigate("/"),
              style: { cursor: "pointer" },
            },
            {
              title: (
                <span style={{ color: "#212529" }}>
                  <i className="fa-solid fa-newspaper"></i> Blog
                </span>
              ),
              onClick: () => navigate("/blog"),
              style: { cursor: "pointer" },
            },
          ]}
        />

        <div className="blog-header-banner">
          <div className="blog-header-overlay">
            <Title level={1} className="blog-title">
              Blog của Haven Skin
            </Title>
            <Paragraph className="blog-subtitle">
              Khám phá những bài viết về chăm sóc da, làm đẹp và sức khỏe
            </Paragraph>
          </div>
        </div>

        <Layout className="blog-content-layout">
          <Sider
            width={280}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.09)",
              margin: "0 20px 20px 0",
            }}
            className="blog-sider"
          >
            <div className="filter-section">
              <Title
                level={4}
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "#495057",
                }}
              >
                <i className="fa-solid fa-filter"></i> Bộ lọc
              </Title>

              <Divider style={{ margin: "10px 0" }} />

              <Title level={5} className="filter-title">
                <i className="fa-solid fa-list"></i> Danh mục
              </Title>
              <Menu
                className="blog-menu"
                mode="inline"
                selectedKeys={[selectedCategory]}
                onClick={(e) => handleCategorySelect(e.key)}
                items={[
                  {
                    key: "",
                    label: "Tất cả danh mục",
                    icon: <i className="fa-solid fa-border-all"></i>,
                  },
                  ...categories.map((category) => ({
                    key: category.blogCategoryId,
                    label: category.blogCategoryName,
                    icon: <i className="fa-solid fa-folder"></i>,
                  })),
                ]}
              />

              <Divider style={{ margin: "20px 0" }} />

              <Title level={5} className="filter-title">
                <i className="fa-solid fa-hashtag"></i> Hashtags
              </Title>
              <Menu
                className="blog-menu"
                mode="inline"
                selectedKeys={[selectedHashtag]}
                onClick={(e) => handleHashtagSelect(e.key)}
                items={[
                  {
                    key: "",
                    label: "Tất cả hashtags",
                    icon: <i className="fa-solid fa-tags"></i>,
                  },
                  ...hashtags.map((tag) => ({
                    key: tag.blogHashtagId,
                    label: tag.blogHashtagName,
                    icon: <i className="fa-solid fa-tag"></i>,
                  })),
                ]}
              />
            </div>
          </Sider>

          <Layout style={{ background: "#fff", padding: "0 20px 20px 0" }}>
            <Content className="blog-main-content">
              <div className="blog-search-sort">
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={handleSearch}
                  prefix={<i className="fa-solid fa-magnifying-glass"></i>}
                  className="blog-search-input"
                />
                <Select
                  placeholder={
                    <span>
                      <i className="fa-solid fa-sort"></i> Sắp xếp theo...
                    </span>
                  }
                  onChange={handleSort}
                  value={sortOption || undefined}
                  className="blog-sort-select"
                >
                  <Option value="a-z">
                    <i className="fa-solid fa-arrow-down-a-z"></i> A-Z
                  </Option>
                  <Option value="z-a">
                    <i className="fa-solid fa-arrow-down-z-a"></i> Z-A
                  </Option>
                  <Option value="newest">
                    <i className="fa-solid fa-calendar-plus"></i> Mới nhất
                  </Option>
                  <Option value="oldest">
                    <i className="fa-solid fa-calendar-minus"></i> Cũ nhất
                  </Option>
                </Select>
              </div>

              <div className="blog-results-info">
                <p>
                  <i className="fa-solid fa-newspaper"></i> Hiển thị{" "}
                  {filteredBlogs.length} bài viết
                  {selectedCategory &&
                  categories.find((c) => c.blogCategoryId === selectedCategory)
                    ? ` trong danh mục "${
                        categories.find(
                          (c) => c.blogCategoryId === selectedCategory
                        ).blogCategoryName
                      }"`
                    : ""}
                  {selectedHashtag &&
                  hashtags.find((h) => h.blogHashtagId === selectedHashtag)
                    ? ` với hashtag "${
                        hashtags.find(
                          (h) => h.blogHashtagId === selectedHashtag
                        ).blogHashtagName
                      }"`
                    : ""}
                </p>
              </div>

              {filteredBlogs.length > 0 ? (
                <>
                  {/* Featured blog post - first post gets featured treatment */}
                  {filteredBlogs.length > 0 && (
                    <div className="blog-section-header">
                      <h2 className="blog-section-title">Bài viết nổi bật</h2>
                      <div className="blog-section-line"></div>
                    </div>
                  )}

                  <div className="blog-featured-post">
                    <BlogCard blog={filteredBlogs[0]} featured={true} />
                  </div>

                  {/* Regular blog posts */}
                  {filteredBlogs.length > 1 && (
                    <div className="blog-section-header">
                      <h2 className="blog-section-title">Bài viết mới</h2>
                      <div className="blog-section-line"></div>
                      <a href="#" className="blog-section-view-all">
                        Xem tất cả
                      </a>
                    </div>
                  )}

                  <div className="blog-cards-container">
                    {filteredBlogs.slice(1).map((blog) => (
                      <BlogCard key={blog.blogId} blog={blog} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-blogs-found">
                  <i className="fa-solid fa-face-sad-tear no-results-icon"></i>
                  <p>Không tìm thấy bài viết nào phù hợp.</p>
                  <p>Vui lòng thử lại với các bộ lọc khác.</p>
                </div>
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default Blog;
