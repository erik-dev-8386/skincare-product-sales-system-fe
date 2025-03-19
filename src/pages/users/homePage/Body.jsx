import React, { useEffect, useState } from "react";
import "./Body.css";
import hot from "../../../assets/home/hotdeal.jpg";
import slider01 from "../../../assets/home/slider_1.webp";
import slider02 from "../../../assets/home/Slider.jpg";
import Slider from "./Slider";
import s1 from "../../../assets/home/s1.jpg";
import s3 from "../../../assets/home/s3.jpg";
import s4 from "../../../assets/home/s4.jpg";
import s5 from "../../../assets/home/s5.jpg";

import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../component/productCard/ProductCard"; // Import ProductCard component
import api from "../../../config/api"; // Import API config
import { Modal, Table, Button } from "antd";

export default function Body() {
  const [suitableProducts, setSuitableProducts] = useState([]); // State to store suitable products
  const [discounts, setDiscounts] = useState({}); // State to store discounts
  const [brands, setBrands] = useState([]); // Thêm state brands
  const [currentSlide, setCurrentSlide] = useState(0); // State to track current slide index
  const navigate = useNavigate();

  const [topSearchedProducts, setTopSearchedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const hotDealSlides = [
    { src: hot, title: "Hot Deal 1" },
    { src: slider01, title: "Hot Deal 2" },
    { src: slider02, title: "Hot Deal 3" },
  ];

  // Thêm state để track slide của top searched products
  const [topSearchCurrentSlide, setTopSearchCurrentSlide] = useState(0);

  // Thêm các state mới để xử lý so sánh sản phẩm
  const [compareProducts, setCompareProducts] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);

  const [skinTypes, setSkinTypes] = useState([]);

  // Thêm state mới cho best seller products
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [bestSellerCurrentSlide, setBestSellerCurrentSlide] = useState(0);

  // Thêm state cho blogs
  const [blogs, setBlogs] = useState([]);
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0);

  // Thêm handlers cho top searched products slides
  const handleTopSearchNext = () => {
    setTopSearchCurrentSlide((prevSlide) =>
      prevSlide + 5 < topSearchedProducts.length ? prevSlide + 5 : 0
    );
  };

  const handleTopSearchPrev = () => {
    setTopSearchCurrentSlide((prevSlide) =>
      prevSlide - 5 >= 0
        ? prevSlide - 5
        : Math.max(0, topSearchedProducts.length - 5)
    );
  };

  // Thêm handlers cho best seller slides
  const handleBestSellerNext = () => {
    setBestSellerCurrentSlide((prevSlide) =>
      prevSlide + 5 < bestSellerProducts.length ? prevSlide + 5 : 0
    );
  };

  const handleBestSellerPrev = () => {
    setBestSellerCurrentSlide((prevSlide) =>
      prevSlide - 5 >= 0
        ? prevSlide - 5
        : Math.max(0, bestSellerProducts.length - 5)
    );
  };

  // Tính toán sản phẩm hiển thị cho top searched
  const visibleTopSearchProducts = topSearchedProducts.slice(
    topSearchCurrentSlide,
    topSearchCurrentSlide + 5
  );

  // Tính toán sản phẩm hiển thị cho best seller
  const visibleBestSellerProducts = bestSellerProducts.slice(
    bestSellerCurrentSlide,
    bestSellerCurrentSlide + 5
  );

  // Thêm handlers cho blog slides
  const handleBlogNext = () => {
    setCurrentBlogSlide((prevSlide) =>
      prevSlide + 3 < blogs.length ? prevSlide + 3 : 0
    );
  };

  const handleBlogPrev = () => {
    setCurrentBlogSlide((prevSlide) =>
      prevSlide - 3 >= 0 ? prevSlide - 3 : Math.max(0, blogs.length - 3)
    );
  };

  // Tính toán blogs hiển thị cho slide hiện tại
  const visibleBlogs = blogs.slice(currentBlogSlide, currentBlogSlide + 3);

  // Fetch suitable products from API
  useEffect(() => {
    const fetchSuitableProducts = async () => {
      try {
        const response = await api.get("/products");
        setSuitableProducts(response.data);
      } catch (error) {
        console.error("Error fetching suitable products:", error);
      }
    };

    fetchSuitableProducts();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/brands");
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch các sản phẩm được tìm kiếm nhiều nhất từ API
  useEffect(() => {
    const fetchTopSearchedProducts = async () => {
      try {
        // Sửa URL endpoint để khớp với backend
        const sunscreenResponse = await api.get(
          "/products/category/Kem chống nắng" // Thay đổi URL
        );
        const cleanserResponse = await api.get(
          "/products/category/Sữa rửa mặt" // Thay đổi URL
        );
        const waterResponse = await api.get(
          "/products/category/Nước tẩy trang" // Thay đổi URL
        );

        console.log("Sunscreen Response:", sunscreenResponse);
        console.log("Cleanser Response:", cleanserResponse);
        console.log("Water Response:", waterResponse);

        // Kiểm tra dữ liệu trả về
        const sunscreenProducts = sunscreenResponse.data || [];
        const cleanserProducts = cleanserResponse.data || [];
        const waterProducts = waterResponse.data || [];

        console.log("Sunscreen Products:", sunscreenProducts);
        console.log("Cleanser Products:", cleanserProducts);
        console.log("Water Products:", waterProducts);

        // Thêm một trường để phân biệt sản phẩm
        const combinedProducts = [
          ...sunscreenProducts.map((product) => ({
            ...product,
            id: `sunscreen-${product.productId}`,
          })),
          ...cleanserProducts.map((product) => ({
            ...product,
            id: `cleanser-${product.productId}`,
          })),
          ...waterProducts.map((product) => ({
            ...product,
            id: `water-${product.productId}`,
          })),
        ];

        console.log("Combined Products:", combinedProducts);
        setTopSearchedProducts(combinedProducts);
      } catch (error) {
        console.error("Error fetching top searched products:", error);
        console.error("Error details:", error.response);
        setTopSearchedProducts([]);
      }
    };

    fetchTopSearchedProducts();
  }, []);

  // Fetch discounts from API
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await api.get("/discounts");
        const discountMap = response.data.reduce((acc, discount) => {
          acc[discount.discountId] = discount.discountPercent; // Create map discountId -> discountPercent
          return acc;
        }, {});
        setDiscounts(discountMap);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };

    fetchDiscounts();
  }, []);

  // Thêm useEffect để fetch skinTypes
  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        const response = await api.get("/skin-types");
        setSkinTypes(response.data);
      } catch (error) {
        console.error("Error fetching skin types:", error);
      }
    };

    fetchSkinTypes();
  }, []);

  // Thêm useEffect để fetch best seller products
  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      try {
        const response = await api.get("/products/best-seller");
        setBestSellerProducts(response.data);
      } catch (error) {
        console.error("Error fetching best seller products:", error);
        setBestSellerProducts([]);
      }
    };

    fetchBestSellerProducts();
  }, []);

  // Thêm useEffect để fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    // Logic to add product to cart
    alert(`${product.productName} added to cart!`);
  };

  // Handle "Next" button click
  const handleNext = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide + 5 < suitableProducts.length ? prevSlide + 5 : 0
    );
  };
  // Handle "Prev" button click
  const handlePrev = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide - 5 >= 0
        ? prevSlide - 5
        : Math.max(0, suitableProducts.length - 5)
    );
  };

  // Calculate the visible products for the current slide
  const visibleProducts = suitableProducts.slice(
    currentSlide,
    currentSlide + 5
  );

  // Define breadcrumb items
  const breadcrumbItems = [
    {
      title: "Trang chủ",
      onClick: () => navigate("/"),
      className: "breadcrumb-item",
    },
  ];

  // Thêm hàm xử lý so sánh sản phẩm
  const handleCompareClick = (product) => {
    if (compareProducts.length < 2) {
      if (!compareProducts.find((p) => p.productId === product.productId)) {
        setCompareProducts([...compareProducts, product]);
        if (compareProducts.length === 1) {
          setIsCompareModalVisible(true);
        }
      }
    } else {
      alert("Chỉ có thể so sánh 2 sản phẩm!");
    }
  };

  const handleCloseCompare = () => {
    setIsCompareModalVisible(false);
    setCompareProducts([]);
  };

  // Thêm cấu hình cho bảng so sánh
  const compareColumns = [
    {
      title: "Thông tin",
      dataIndex: "info",
      key: "info",
      width: "20%",
      className: "compare-info-column",
      render: (text) => (
        <div className="compare-info-cell">
          <strong>{text}</strong>
        </div>
      ),
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
  ];

  const getCompareData = () => {
    const [p1, p2] = compareProducts;
    if (!p1 || !p2) return [];

    const brand1 = brands.find((b) => b.brandId === p1.brandId)?.brandName;
    const brand2 = brands.find((b) => b.brandId === p2.brandId)?.brandName;
    const category1 = categories.find(
      (c) => c.categoryId === p1.categoryId
    )?.categoryName;
    const category2 = categories.find(
      (c) => c.categoryId === p2.categoryId
    )?.categoryName;
    const skinType1 = skinTypes.find(
      (s) => s.skinTypeId === p1.skinTypeId
    )?.skinName;
    const skinType2 = skinTypes.find(
      (s) => s.skinTypeId === p2.skinTypeId
    )?.skinName;

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
        product1: (
          <div className="compare-skin-type">
            {skinType1 || "Chưa có thông tin"}
          </div>
        ),
        product2: (
          <div className="compare-skin-type">
            {skinType2 || "Chưa có thông tin"}
          </div>
        ),
      },
      {
        key: "6",
        info: "Giá gốc",
        product1: (
          <div className="compare-original-price">
            {p1.unitPrice.toLocaleString()}đ
          </div>
        ),
        product2: (
          <div className="compare-original-price">
            {p2.unitPrice.toLocaleString()}đ
          </div>
        ),
      },
      {
        key: "7",
        info: "Giá khuyến mãi",
        product1: (
          <div className="compare-discount-price">
            {p1.discountPrice.toLocaleString()}đ
          </div>
        ),
        product2: (
          <div className="compare-discount-price">
            {p2.discountPrice.toLocaleString()}đ
          </div>
        ),
      },
      {
        key: "8",
        info: "Mô tả",
        product1: <div className="compare-description">{p1.description}</div>,
        product2: <div className="compare-description">{p2.description}</div>,
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
    <>
      <div className="container home-page">
        <Breadcrumb style={{ marginBottom: "20px" }} items={breadcrumbItems} />
        <div className="row">
          <div className="col-12">
            <h3 className="hot">Hot deal</h3>
          </div>
          <div className="col-12">
            <Slider slides={hotDealSlides} /> {/* Pass data to Slider */}
          </div>

          <div className="col-12">
            <h3 className="san">Dòng sản phẩm</h3>
          </div>

          {/* Display suitable products */}
          <div
            className="row "
            style={{

              justifyContent: "center",
              marginBottom: "50px",
              position: "relative",
            }}
          >
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="slider-control prev"
              style={{
                position: "absolute",
                left: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "gray",
              }}
            >
              &lt;
            </button>

            {/* Visible Products */}
            {visibleProducts.map((product) => (
              <div className="col-2"
                style={{ margin: 20 }}
                key={product.productId}>
                <ProductCard
                  product={product}
                  discounts={discounts}
                  brands={brands}
                  onCompareClick={handleCompareClick}
                />
              </div>
            ))}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="slider-control next"
              style={{
                position: "absolute",
                right: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "gray",
              }}
            >
              &gt;
            </button>
          </div>

          <div className="col-12">
            <h3 className="san">Top dòng sản phẩm được tìm kiếm</h3>
          </div>

          <div
            className="row"
            style={{
              justifyContent: "center",
              marginBottom: "50px",
              position: "relative",
            }}
          >
            {/* Prev Button */}
            <button
              onClick={handleTopSearchPrev}
              className="slider-control prev"
              style={{
                position: "absolute",
                left: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "gray",
              }}
            >
              &lt;
            </button>

            {/* Top Searched Products */}
            {topSearchedProducts && topSearchedProducts.length > 0 ? (
              visibleTopSearchProducts.map((product) => (
                <div
                  className="col-4"
                  key={product.id || `product-${product.productId}`}
                >
                  {product && (
                    <ProductCard
                      product={product}
                      discounts={discounts}
                      brands={brands}
                      categories={categories}
                      onCompareClick={handleCompareClick}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Không có sản phẩm nào.</p>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleTopSearchNext}
              className="slider-control next"
              style={{
                position: "absolute",
                right: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "gray",
              }}
            >
              &gt;
            </button>
          </div>

          {/* ============================================ */}
          <div className="col-12">
            <h3 className="san">Top Best Seller</h3>
          </div>

          <div
            className="row"
            style={{
              justifyContent: "center",
              marginBottom: "50px",
              position: "relative",
            }}
          >
            {/* Prev Button */}
            <button
              onClick={handleBestSellerPrev}
              className="slider-control prev"
              style={{
                position: "absolute",
                left: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "gray",
              }}
            >
              &lt;
            </button>

            {/* Best Seller Products */}
            {bestSellerProducts && bestSellerProducts.length > 0 ? (
              visibleBestSellerProducts.map((product) => (
                <div className="col-2" style={{ margin: 20 }} key={`bestseller-${product.productId}`}>
                  <ProductCard
                    product={product}
                    discounts={discounts}
                    brands={brands}
                    categories={categories}
                    onCompareClick={handleCompareClick}
                  />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>Không có sản phẩm nào.</p>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleBestSellerNext}
              className="slider-control next"
              style={{
                position: "absolute",
                right: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "gray",
              }}
            >
              &gt;
            </button>
          </div>

          {/* ==================================================== */}

          <div className="col-12">
            <h3 className="san">Blog</h3>
          </div>

          <div
            className="row"
            style={{ 
              justifyContent: "center", 
              marginBottom: "50px",
              position: "relative" 
            }}
          >
            {/* Prev Button */}
            <button
              onClick={handleBlogPrev}
              className="slider-control prev"
              style={{
                position: "absolute",
                left: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "gray",
              }}
            >
              &lt;
            </button>

            {/* Blog Slides */}
            {visibleBlogs.map((blog) => (
              <div className="col-4" key={blog.blogId}>
                <div 
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    height: '100%',
                    backgroundColor: '#fff'
                  }}
                  onClick={() => navigate(`/blog/${blog.blogId}`)}
                >
                  <div style={{
                    width: '100%',
                    height: '250px',
                    position: 'relative',
                    backgroundColor: '#f8f9fa',
                  }}>
                    <img
                      src={blog.blogImages?.[0]?.imageURL || s1}
                      alt={blog.blogTitle}
                      className="ss"
                      style={{ 
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                      }}
                    />
                  </div>
                  <div style={{ padding: '15px' }}>
                    <h5 style={{ 
                      fontSize: '16px',
                      fontWeight: '500',
                      minHeight: '48px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '2',
                      WebkitBoxOrient: 'vertical',
                      margin: '0'
                    }}>
                      {blog.blogTitle}
                    </h5>
                  </div>
                </div>
              </div>
            ))}

            {/* Next Button */}
            <button
              onClick={handleBlogNext}
              className="slider-control next"
              style={{
                position: "absolute",
                right: "-50px",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "gray",
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Thêm Modal so sánh */}
      <Modal
        title={
          <div className="compare-modal-title">
            <i
              className="fa-solid fa-scale-balanced"
              style={{ marginRight: "10px" }}
            ></i>
            So sánh sản phẩm
          </div>
        }
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
          columns={compareColumns}
          dataSource={getCompareData()}
          pagination={false}
          bordered
          className="compare-table"
        />
      </Modal>
    </>
  );
}
