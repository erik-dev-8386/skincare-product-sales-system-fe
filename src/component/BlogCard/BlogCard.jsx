// BlogCard.jsx
import React from "react";
import { Card } from "antd";
// Thêm Link từ react-router-dom
import { Link } from "react-router-dom";
import "./BlogCard.css"

const BlogCard = ({ id, title, description, image }) => {
  return (
    <Link to={`/blog/${id}`} style={{ textDecoration: 'none' }}>
      <Card className="card-blog"
        hoverable
        style={{ width: 300, height: 350, margin: 10, padding: 20 }}
        cover={<img className="img-blog" alt={title} src={image} />}
      >
        <Card.Meta 
          title={title} 
          description={description} 
        />
      </Card>
    </Link>
  );
};

export default BlogCard;
