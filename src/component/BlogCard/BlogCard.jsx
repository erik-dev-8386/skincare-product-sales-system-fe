import React from "react";
import { Card } from "antd";

const BlogCard = ({ title, description, image }) => {
  return (
    <Card
      hoverable
      style={{ width: 300, margin: "10px" }}
      cover={<img alt={title} src={image} />}
    >
      <Card.Meta title={title} description={description} />
    </Card>
  );
};

export default BlogCard;