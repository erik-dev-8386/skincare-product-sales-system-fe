import React, { useEffect, useState } from 'react';
import './Body.css';
import hot from '../../../assets/home/hotdeal.jpg';
import Slider from './Slider';
import s1 from '../../../assets/home/s1.jpg';
import s3 from '../../../assets/home/s3.jpg';
import s4 from '../../../assets/home/s4.jpg';
import s5 from '../../../assets/home/s5.jpg';
import s7 from '../../../assets/home/s7.jpg';
import s8 from '../../../assets/home/s8.jpg';
import s6 from '../../../assets/home/s6.jpg';
import { Breadcrumb } from 'antd';
import { useNavigate } from "react-router-dom";
import ProductCard from '../../../component/productCard/ProductCard'; // Import ProductCard component
import api from '../../../config/api'; // Import API config

export default function Body() {
  const [suitableProducts, setSuitableProducts] = useState([]); // State to store suitable products
  const [discounts, setDiscounts] = useState({}); // State to store discounts
  const [currentSlide, setCurrentSlide] = useState(0); // State to track current slide index
  const navigate = useNavigate();

  const hotDealSlides = [
    { src: hot, title: "Hot Deal 1" },
    { src: hot, title: "Hot Deal 2" },
    { src: hot, title: "Hot Deal 3" },
  ];

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
      prevSlide + 4 < suitableProducts.length ? prevSlide + 4 : 0 // Loop back to the start if at the end
    );
  };

  // Handle "Prev" button click
  const handlePrev = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide - 4 >= 0 ? prevSlide - 4 : Math.floor((suitableProducts.length - 1) / 4) * 4 // Loop to the last slide if at the start
    );
  };

  // Calculate the visible products for the current slide
  const visibleProducts = suitableProducts.slice(currentSlide, currentSlide + 4);

  return (
    <>
      <div className='container home-page'>
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</Breadcrumb.Item>
        </Breadcrumb>
        <div className="row">
          <div className="col-12">
            <h3 className='hot'>Hot deal</h3>
          </div>
          <div className="col-12">
            <Slider slides={hotDealSlides} /> {/* Pass data to Slider */}
          </div>

          <div className="col-12">
            <h3 className="san">Sản phẩm phù hợp với da</h3>
          </div>

          {/* Display suitable products */}
          <div className="row" style={{ justifyContent: "center", marginBottom: "50px", position: "relative" }}>
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="slider-control prev"
              style={{ position: "absolute", left: "-50px", top: "50%", transform: "translateY(-50%)" }}
            >
              &lt;
            </button>

            {/* Visible Products */}
            {visibleProducts.map((product) => (
              <div className="col-3" key={product.productId}>
                <ProductCard
                  product={product}
                  discounts={discounts} // Pass discounts to ProductCard
                  handleAddToCart={handleAddToCart}
                />
              </div>
            ))}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="slider-control next"
              style={{ position: "absolute", right: "-50px", top: "50%", transform: "translateY(-50%)" }}
            >
              &gt;
            </button>
          </div>

          <div className="col-12">
            <h3 className="san">Top sản phẩm bán chạy</h3>
          </div>

          <div className="row" style={{ justifyContent: "center", marginBottom: "50px" }}>
            <div className="col-4">
              <img src={s6} alt="Haven SkinLogo" className="sv" />
            </div>
            <div className="col-4">
              <img src={s7} alt="Haven SkinLogo" className="sv" />
            </div>
            <div className="col-4">
              <img src={s8} alt="Haven SkinLogo" className="sv" />
            </div>
          </div>

          <div className="col-12">
            <h3 className="san">Blog</h3>
          </div>

          <div className="row" style={{ justifyContent: "center", marginBottom: "50px" }}>
            <div className="col-4">
              <img src={s3} alt="Haven SkinLogo" className="ss" />
              <br />
              <br />
              Tại Sao Triệt Lông Xong Lại Thấy Lông Mọc Nhiều Hơn?
            </div>
            <div className="col-4">
              <img src={s4} alt="Haven SkinLogo" className="ss" />
              <br />
              <br />
              7 Cách Sử Dụng Toner 12% Emmié Bạn Đã Biết Chưa?
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