// BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../../../component/Footer/Footer.jsx";
import Header from "../../../component/Header/Header.jsx";

const BlogDetail = () => {
  const { id } = useParams(); // lấy id từ URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi fetch blog detail:", error);
      }
    };
    fetchBlogDetail();
  }, [id]);

  if (loading) {
    return <div>Đang tải dữ liệu chi tiết...</div>;
  }

  // Nếu blog null hoặc không có
  if (!blog) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  return (
    <>
      <Header />
      <div style={{ margin: "2rem" }}>
        <h2>{blog.title}</h2>
        <p>{blog.body}</p>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
