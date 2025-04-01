
import React from "react";
import { Card, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./BlogCard.css";

const { Meta } = Card;

const BlogCard = ({ blog, featured = false, onClick }) => {
  const navigate = useNavigate();

  const handleBlogClick = () => {
    navigate(`/blog/${blog.blogId}`);
  };


  if (!blog) {
    return null;
  }


  const categoryName = blog.blogCategory?.blogCategoryName || "Chăm sóc da";

  const createExcerpt = (content) => {
    if (!content) return "";

    const plainText = content.replace(/<[^>]+>/g, "");
    return plainText.substring(0, 120) + (plainText.length > 120 ? "..." : "");
  };

  const excerpt = createExcerpt(blog.blogContent);

  return (
    <Card
      hoverable
      className={`blog-card ${featured ? "blog-card-featured" : ""}`}
      cover={
        <div className="blog-card-image-container" data-category={categoryName}>
          <img
            alt={blog.blogTitle}
            src={
              blog.blogImages && blog.blogImages.length > 0
                ? blog.blogImages[0].imageURL
                : "https://via.placeholder.com/300x200?text=No+Image"
            }
            className="blog-card-image"
          />
        </div>
      }
      onClick={handleBlogClick}
    >
      <Meta
        title={blog.blogTitle}
        description={
          <div className="blog-card-meta">
            <div className="blog-card-date">
              <i className="fa-solid fa-calendar-days"></i>{" "}
              {new Date(blog.postedTime).toLocaleDateString("vi-VN")}
            </div>
            <div className="blog-card-category">
              <i className="fa-solid fa-folder"></i>{" "}
              {blog.blogCategory?.blogCategoryName || "Không có danh mục"}
            </div>
            {excerpt && <div className="blog-card-excerpt">{excerpt}</div>}
            <div className="blog-card-tags">
              {blog.hashtags &&
                blog.hashtags.map((tag) => (
                  <Tag key={tag.blogHashtagId} color="blue">
                    <i className="fa-solid fa-hashtag"></i>{" "}
                    {tag.blogHashtagName}
                  </Tag>
                ))}
            </div>
            <div className="blog-card-views">
              <i className="fa-solid fa-eye"></i>{" "}
              {Math.floor(Math.random() * 1000) + 50}
            </div>
          </div>
        }
      />
    </Card>
  );
};


BlogCard.propTypes = {
  blog: PropTypes.shape({
    blogId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    blogTitle: PropTypes.string.isRequired,
    blogContent: PropTypes.string,
    blogImages: PropTypes.arrayOf(
      PropTypes.shape({
        imageURL: PropTypes.string.isRequired,
      })
    ),
    postedTime: PropTypes.string,
    blogCategory: PropTypes.shape({
      blogCategoryName: PropTypes.string,
    }),
    hashtags: PropTypes.array,
  }).isRequired,
  featured: PropTypes.bool,
  onClick: PropTypes.func,
};

export default BlogCard;
