import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../../../component/Footer/Footer.jsx";
import Header from "../../../component/Header/Header.jsx";

const BlogDetail = () => {
  const { id } = useParams(); // lấy id từ URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);
        setBlog(response.data);
        setLoading(false);
      } catch (error) {
        setError("Lỗi khi fetch blog detail");
        setLoading(false);
      }
    };
    fetchBlogDetail();
  }, [id]);

  if (loading) {
    return <div>Đang tải dữ liệu chi tiết...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return <div>Không tìm thấy bài viết.</div>;
  }

  // Ở đây, ta giả sử có sẵn ảnh từ 1.jpg đến 10.jpg trong thư mục src/assets/img_blog
  // Nếu ID vượt quá 10, có thể ảnh sẽ không tồn tại, bạn có thể thêm logic để hiển thị ảnh mặc định.
  const blogImage = `https://picsum.photos/600/400?random=${id}`;
  // const blogImage = `src/assets/img_blog/${id}.jpg`;
 

  return (
    <>
      {/* <Header /> */}
      
      <div  style={{ margin: "2rem", height: 800, paddingTop: 50}}>
        <h2>{blog.title}</h2>
        {/* Hiển thị ảnh */}
        <img
          src={blogImage}
          alt={blog.title}
          style={{ width: "700px", margin: "20px 0", display: "block" }}
        />
        <p>{blog.body}</p>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default BlogDetail;
