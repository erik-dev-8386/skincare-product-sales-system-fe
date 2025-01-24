import React from "react";
import { Card } from "antd";
import "./BlogCard.css"

const BlogCard = ({ title, description, image }) => {
  return (
    <Card className="card-blog"
      hoverable
      style={{ width: 300, height: 350, margin: "10px" }}
      cover={<img className="img-blog" alt={title} src={image} />}
    >
      <Card.Meta title={title} description={description} />
    </Card>
  );
};

export default BlogCard;