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
import s7 from "../../../assets/home/s7.jpg";
import s8 from "../../../assets/home/s8.jpg";
import s6 from "../../../assets/home/s6.jpg";
import { Breadcrumb } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../component/productCard/ProductCard"; // Import ProductCard component
import api from "../../../config/api"; // Import API config

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

  // Thêm handlers cho top searched products slides
  const handleTopSearchNext = () => {
    setTopSearchCurrentSlide((prevSlide) =>
      prevSlide + 3 < topSearchedProducts.length ? prevSlide + 3 : 0
    );
  };

  const handleTopSearchPrev = () => {
    setTopSearchCurrentSlide((prevSlide) =>
      prevSlide - 3 >= 0
        ? prevSlide - 3
        : Math.max(0, topSearchedProducts.length - 3)
    );
  };

  // Tính toán sản phẩm hiển thị cho top searched
  const visibleTopSearchProducts = topSearchedProducts.slice(
    topSearchCurrentSlide,
    topSearchCurrentSlide + 3
  );

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

    fetchCategories;
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

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    // Logic to add product to cart
    alert(`${product.productName} added to cart!`);
  };

  // Handle "Next" button click
  const handleNext = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide + 4 < suitableProducts.length ? prevSlide + 4 : 0
    );
  };
  // Handle "Prev" button click
  const handlePrev = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide - 4 >= 0
        ? prevSlide - 4
        : Math.max(0, suitableProducts.length - 4)
    );
  };

  // Calculate the visible products for the current slide
  const visibleProducts = suitableProducts.slice(
    currentSlide,
    currentSlide + 4
  );

  // Calculate the visible products for the current slide
  const visibleProductss = suitableProducts.slice(
    currentSlide,
    currentSlide + 3
  );

  // Define breadcrumb items
  const breadcrumbItems = [
    {
      title: "Trang chủ",
      onClick: () => navigate("/"),
      className: "breadcrumb-item",
    },
  ];

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
            <h3 className="san">Sản phẩm phù hợp với da</h3>
          </div>

          {/* Display suitable products */}
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
              <div className="col-3" key={product.productId}>
                <ProductCard
                  product={product}
                  discounts={discounts} // Pass discounts to ProductCard
                  brands={brands} // Truyền brands vào ProductCard
                  // handleAddToCart={handleAddToCart}
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

          <div className="col-12">
            <h3 className="san">Blog</h3>
          </div>

          <div
            className="row"
            style={{ justifyContent: "center", marginBottom: "50px" }}
          >
            <div className="col-4">
              <img src={s3} alt="Haven SkinLogo" className="ss" />
              <br />
              <br />
              Tại Sao Triệt Lông Xong Lại Thấy Lông Mọc Nhiều Hơn?
            </div>
            <div className="col-4">
              <img src={s4} alt="Haven SkinLogo" className="ss" />
              <br />
              <br />7 Cách Sử Dụng Toner 12% Emmié Bạn Đã Biết Chưa?
            </div>
            <div className="col-4">
              <img src={s5} alt="Haven SkinLogo" className="ss" />
              <br />
              <br />
              Tại Sao Triệt Lông Xong Lại Thấy Lông Mọc Nhiều Hơn?
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
