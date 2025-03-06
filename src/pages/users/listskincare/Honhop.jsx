import React, { useEffect, useState } from "react";
import "./Skin.css";
import dahh1 from "../../../assets/da/dahh1.jpg";
import dahh2 from "../../../assets/da/dahh2.jpg";
import dahh3 from "../../../assets/da/dahh3.jpg";
import sp7 from "../../../assets/da/sp7.jpg";
import sp8 from "../../../assets/da/sp8.jpg";
import sp9 from "../../../assets/da/sp9.jpg";
import sp10 from "../../../assets/da/sp10.jpg";
import sp11 from "../../../assets/da/sp11.jpg";
import sp12 from "../../../assets/da/sp12.jpg";
import Footer from "../../../component/Footer/Footer";
import Header from "../../../component/Header/Header";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../component/productCard/ProductCard"; // Import ProductCard component
import api from "../../../config/api";
export default function Kho() {
  const [suitableProducts, setSuitableProducts] = useState([]); // State to store suitable products
  const [discounts, setDiscounts] = useState({}); // State to store discounts
  const [brands, setBrands] = useState([]); // Thêm state brands
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  // Calculate the visible products for the current slide
  const visibleProductss = suitableProducts.slice(
    currentSlide,
    currentSlide + 3
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

  {
    return (
      <>
        {/* <Header /> */}
        <div className="container">
          <div className="row">
            <h5 className="trang">
              {" "}
              Trang chủ {">"} Lộ trình chăm sóc da {">"} Da hỗn hợp
            </h5>
          </div>
          <div className="row">
            <div className="col-12">
              <h3 className="san">Da hỗn hợp</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <img src={dahh1} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={dahh2} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={dahh3} alt="Da kho" className="da" />
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="row">
            <h5 className="dautrang"> Chăm sóc da hỗn hợp</h5>
          </div>
          <br />
          <div className="row">
            <div className="col-6 list-container">
              <h5 className="skin">
                {" "}
                Các bước chăm sóc da hỗn hợp dành cho ban ngày
              </h5>
              <br />
              <ul className="buoctaytrang">
                <li className="buoc">Bước 1: Tẩy trang</li>
                <br />
                <li className="buoc">Bước 2: Rửa mặt bằng sữa rửa mặt</li>
                <br />
                <li className="buoc">Bước 3: Sử dụng Toner cân bằng da</li>
                <br />
                <li className="buoc">Bước 4: Thoa sản phẩm đặc trị</li>
                <br />
                <li className="buoc">
                  Bước 5: Thoa Serum hoặc tinh chất dưỡng da
                </li>
                <br />
                <li className="buoc">Bước 6: Bôi kem dưỡng ẩm</li>
                <br />
                <li className="buoc">Bước 7: Bôi kem chống nắng</li>
                <br />
              </ul>
            </div>

            <div className="col-6 list-container">
              <h5 className="skin">
                Các bước chăm sóc da hỗn hợp dành cho ban đêm
              </h5>
              <br />
              <ul className="buoctaytrang">
                <li className="buoc">Bước 1: Tẩy trang</li>
                <br />
                <li className="buoc">Bước 2: Rửa mặt bằng sữa rửa mặt</li>
                <br />
                <li className="buoc">Bước 3: Tẩy tế bào chết</li>
                <br />
                <li className="buoc">Bước 4: Dùng toner/ nước hoa hồng</li>
                <br />
                <li className="buoc">Bước 5: Đắp mặt nạ</li>
                <br />
                <li className="buoc">Bước 6: Dùng sản phẩm đặc trị</li>
                <br />
                <li className="buoc">
                  Bước 7: Thoa Serum hoặc tinh chất dưỡng da
                </li>
                <br />
                <li className="buoc">Bước 8: Thoa lotion</li>
                <br />
                <li className="buoc">Bước 9: Dùng kem dưỡng ẩm</li>
                <br />
                <li className="buoc">Bước 10: Bôi kem mắt</li>
                <br />
                <li className="buoc">Bước 11: Đắp mặt nạ</li>
                <br />
              </ul>
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col-12">
              <h3 className="san">Một số sản phẩm dành cho da hỗn hợp</h3>{" "}
              <br />
              <br />
            </div>
          </div>
          <div className="row">
            {/* <div className="col-4">
              <img src={sp7} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={sp8} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={sp9} alt="Da kho" className="da" />
            </div> */}
            {visibleProductss.map((product) => (
              <div className="col-4" key={product.productId}>
                <ProductCard
                  product={product}
                  discounts={discounts} // Pass discounts to ProductCard
                  brands={brands} // Truyền brands vào ProductCard
                  // handleAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
          <br /> <br /> <br />
          <div className="row">
            {/* <div className="col-4">
              <img src={sp10} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={sp11} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={sp12} alt="Da kho" className="da" />
            </div> */}
            {visibleProductss.map((product) => (
              <div className="col-4" key={product.productId}>
                <ProductCard
                  product={product}
                  discounts={discounts} // Pass discounts to ProductCard
                  brands={brands} // Truyền brands vào ProductCard
                  // handleAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }
}
