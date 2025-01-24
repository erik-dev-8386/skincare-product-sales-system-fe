import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import axios from "axios";
import "./Blog.css"
import BlogCard from "../../../component/BlogCard/BlogCard.jsx";
import Footer from "../../../component/Footer/Footer.jsx";
import Header from "../../../component/Header/Header.jsx";

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch dữ liệu blog từ API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
                // Sử dụng 10 bài viết đầu tiên
                const blogData = response.data.slice(0, 10).map((blog, index) => ({
                    id: blog.id,
                    title: blog.title,
                    description: blog.body.substring(0, 100) + "...",
                    image: `src/assets/img_blog/${index + 1}.jpg`,
                }));
                setBlogs(blogData);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi fetch dữ liệu:", error);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return (
            <div className="text-left">
                <Spin size="large" />
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <>
            <Header />

            <div className="container ">
                <h2 className="text-center-blog">Blog của chúng tôi</h2>
                <Row gutter={[16, 16]}>
                    {blogs.map((blog) => (
                        <Col key={blog.id} xs={24} sm={12} md={8} lg={6}>
                            <BlogCard title={blog.title} description={blog.description} image={blog.image} />
                        </Col>
                    ))}
                </Row>
            </div>

            <Footer />
        </>
    );
};

export default Blog;
