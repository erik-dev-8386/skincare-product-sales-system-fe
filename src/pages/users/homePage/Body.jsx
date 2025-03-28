
import React, { useEffect, useState } from "react";
import "./Bo.css";
import hot from "../../../assets/home/hotdeal.jpg";
import slider01 from "../../../assets/home/slider_1.webp";
import slider02 from "../../../assets/home/Slider.jpg";
import Slider from "./Slider";
import s1 from "../../../assets/home/s1.jpg";

import { Breadcrumb, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../component/productCard/ProductCard";
import api from "../../../config/api";
import { Modal, Table, Button } from "antd";
import {  LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function Body() {
  const [suitableProducts, setSuitableProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [brands, setBrands] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const hotDealSlides = [
    { src: hot, title: "Hot Deal 1" },
    { src: slider01, title: "Hot Deal 2" },
    { src: slider02, title: "Hot Deal 3" },
  ];

  const [compareProducts, setCompareProducts] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [skinTypes, setSkinTypes] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [blogs, setBlogs] = useState([]);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productsRes,
          brandsRes,
          categoriesRes,
          discountsRes,
          skinTypesRes,
          bestSellerRes,
          blogsRes
        ] = await Promise.all([
          api.get("/products"),
          api.get("/brands"),
          api.get("/categories"),
          api.get("/discounts"),
          api.get("/skin-types"),
          api.get("/products/best-seller"),
          api.get("/blogs")
        ]);
        
        setSuitableProducts(productsRes.data);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
        setSkinTypes(skinTypesRes.data);
        setBestSellerProducts(bestSellerRes.data);
        setBlogs(blogsRes.data);
        
        const discountMap = discountsRes.data.reduce((acc, discount) => {
          acc[discount.discountId] = discount.discountPercent;
          return acc;
        }, {});
        setDiscounts(discountMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Navigation handlers
  const handleNext = () => {
    setCurrentSlide(prev => (prev + 4 < suitableProducts.length ? prev + 4 : 0));
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 4 >= 0 ? prev - 4 : Math.max(0, suitableProducts.length - 4)));
  };

  // Product comparison handlers
  const handleCompareClick = (product) => {
    if (compareProducts.length < 2) {
      if (!compareProducts.find(p => p.productId === product.productId)) {
        setCompareProducts([...compareProducts, product]);
        if (compareProducts.length === 1) setIsCompareModalVisible(true);
      }
    } else {
      alert("Chỉ có thể so sánh 2 sản phẩm!");
    }
  };

  const handleCloseCompare = () => {
    setIsCompareModalVisible(false);
    setCompareProducts([]);
  };

  // Data calculations
  const visibleProducts = suitableProducts.slice(currentSlide, currentSlide + 4);
  const visibleBlogs = blogs.slice(0, 4);

  const breadcrumbItems = [
    {
      title: "Trang chủ",
      onClick: () => navigate("/"),
      className: "breadcrumb-item",
    },
  ];

  const getCompareData = () => {
    const [p1, p2] = compareProducts;
    if (!p1 || !p2) return [];

    const brand1 = brands.find(b => b.brandId === p1.brandId)?.brandName;
    const brand2 = brands.find(b => b.brandId === p2.brandId)?.brandName;
    const category1 = categories.find(c => c.categoryId === p1.categoryId)?.categoryName;
    const category2 = categories.find(c => c.categoryId === p2.categoryId)?.categoryName;
    const skinType1 = skinTypes.find(s => s.skinTypeId === p1.skinTypeId)?.skinName;
    const skinType2 = skinTypes.find(s => s.skinTypeId === p2.skinTypeId)?.skinName;

    return [
      {
        key: "1",
        info: "Hình ảnh",
        product1: (
          <div className="compare-image-container">
            <img
              src={p1.productImages[0]?.imageURL}
              alt={p1.productName}
              className="compare-product-image"
            />
          </div>
        ),
        product2: (
          <div className="compare-image-container">
            <img
              src={p2.productImages[0]?.imageURL}
              alt={p2.productName}
              className="compare-product-image"
            />
          </div>
        ),
      },
      {
        key: "2",
        info: "Tên sản phẩm",
        product1: <div className="compare-product-name">{p1.productName}</div>,
        product2: <div className="compare-product-name">{p2.productName}</div>,
      },
      {
        key: "3",
        info: "Thương hiệu",
        product1: <div className="compare-brand">{brand1}</div>,
        product2: <div className="compare-brand">{brand2}</div>,
      },
      {
        key: "4",
        info: "Danh mục",
        product1: <div className="compare-category">{category1}</div>,
        product2: <div className="compare-category">{category2}</div>,
      },
      {
        key: "5",
        info: "Loại da phù hợp",
        product1: <div className="compare-skin-type">{skinType1 || "Chưa có thông tin"}</div>,
        product2: <div className="compare-skin-type">{skinType2 || "Chưa có thông tin"}</div>,
      },
      {
        key: "6",
        info: "Giá gốc",
        product1: <div className="compare-original-price">{p1.unitPrice.toLocaleString()}đ</div>,
        product2: <div className="compare-original-price">{p2.unitPrice.toLocaleString()}đ</div>,
      },
      {
        key: "7",
        info: "Giá khuyến mãi",
        product1: <div className="compare-discount-price">{p1.discountPrice.toLocaleString()}đ</div>,
        product2: <div className="compare-discount-price">{p2.discountPrice.toLocaleString()}đ</div>,
      },
      {
        key: "8",
        info: "Mô tả",
        product1: <div className="compare-description" dangerouslySetInnerHTML={{ __html: p1.description }} />,
        product2: <div className="compare-description" dangerouslySetInnerHTML={{ __html: p2.description }} />,
      },
      {
        key: "9",
        info: "Thành phần",
        product1: <div className="compare-ingredients">{p1.ingredients}</div>,
        product2: <div className="compare-ingredients">{p2.ingredients}</div>,
      },
    ];
  };

  return (
    <div className="home-container">
      <Breadcrumb items={breadcrumbItems} className="breadcrumb" />
      <section className="section hot-deals-section">
  <h2 className="section-title" style={{ 
    marginTop: "5px", 
    textAlign: "center",
    width: "100%"
  }}>HOT DEAL</h2>
  <Slider slides={hotDealSlides} />
</section>
      {/* Products Section - 4 items in a single row */}
      <section className="section products-section">
        <div className="section-header">
          <h2 className="section-title">DÒNG SẢN PHẨM</h2>
          <button className="view-all-btn" onClick={() => navigate("/products")}>XEM TẤT CẢ</button>
        </div>
        <div className="product-slider-container">
          <button className="slider-nav-btn prev-btn" onClick={handlePrev}>
            <LeftOutlined />
          </button>
          
          <div className="single-row-product-grid">
            {visibleProducts.map(product => (
              <ProductCard
                key={product.productId}
                product={product}
                discounts={discounts}
                brands={brands}
                onCompareClick={handleCompareClick}
              />
            ))}
          </div>
          
          <button className="slider-nav-btn next-btn" onClick={handleNext}>
            <RightOutlined />
          </button>
        </div>
      </section>
      
      {/* Best Sellers Section - 5 items */}
      <section className="section best-sellers-section">
        <div className="section-header">
          <h2 className="section-title">TOP 5 SẢN PHẨM BÁN CHẠY</h2>
          {/* <button className="view-all-btn" onClick={() => navigate("/products?sort=best-seller")}>XEM TẤT CẢ</button> */}
        </div>
        <div className="best-seller-grid">
  {bestSellerProducts.slice(0, 5).map(product => (
    <ProductCard
      key={`bestseller-${product.productId}`}
      product={product}
      discounts={discounts}
      brands={brands}
      categories={categories}
      onCompareClick={handleCompareClick}
      className="product-card" // Thêm class này
      style={{ margin: '5px' }} // Hoặc thêm style trực tiếp
    />
  ))}
</div>
      </section>
      
      {/* Blog Section */}
      <section className="section blog-section">
        <div className="section-header">
          <h2 className="section-title">BLOG LÀM ĐẸP</h2>
          <button className="view-all-btn" onClick={() => navigate("/blog")}>XEM TẤT CẢ</button>
        </div>
        <div className="blog-grid">
          {visibleBlogs.map(blog => (
            <div 
              className="blog-card" 
              key={blog.blogId}
              onClick={() => navigate(`/blog/${blog.blogId}`)}
            >
              <div className="blog-image-container">
                <img
                  src={blog.blogImages?.[0]?.imageURL || s1}
                  alt={blog.blogTitle}
                  className="blog-image"
                />
              </div>
              <div className="blog-content">
                <h3 className="blog-title">{blog.blogTitle}</h3>
                <p className="blog-excerpt">{blog.excerpt || "Xem thêm..."}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Comparison Modal */}
      <Modal
        title={(
          <div className="compare-modal-title">
            <i className="fa-solid fa-scale-balanced" style={{ marginRight: "10px" }}></i>
            So sánh sản phẩm
          </div>
        )}
        open={isCompareModalVisible}
        onCancel={handleCloseCompare}
        width={1000}
        footer={[
          <Button key="close" onClick={handleCloseCompare}>
            <i className="fa-solid fa-xmark" style={{ marginRight: "8px" }}></i>
            Đóng
          </Button>,
        ]}
        className="compare-modal"
      >
        <Table
          columns={[
            {
              title: "Thông tin",
              dataIndex: "info",
              key: "info",
              width: "20%",
              className: "compare-info-column",
              render: text => <div className="compare-info-cell"><strong>{text}</strong></div>,
            },
            {
              title: "Sản phẩm 1",
              dataIndex: "product1",
              key: "product1",
              width: "40%",
              className: "compare-product-column",
            },
            {
              title: "Sản phẩm 2",
              dataIndex: "product2",
              key: "product2",
              width: "40%",
              className: "compare-product-column",
            },
          ]}
          dataSource={getCompareData()}
          pagination={false}
          bordered
          className="compare-table"
        />
      </Modal>
    </div>
  );
}