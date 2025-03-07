import React, { useState, useEffect } from "react";
import "./Skin.css";
import dakho1 from "../../../assets/da/dakho1.jpg";
import dakho2 from "../../../assets/da/dakho2.jpg";
import dakho3 from "../../../assets/da/dakho3.jpg";
import ruamat from "../../../assets/da/ruamat.jpg";
import toner from "../../../assets/da/toner.jpg";
import serum from "../../../assets/da/serum.jpg";
import kem from "../../../assets/da/kem.jpg";
import sun from "../../../assets/da/sun.jpg";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../component/productCard/ProductCard";
import api from "../../../config/api";

export default function Kho() {
  const [showModal, setShowModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [brands, setBrands] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [dryProducts, setDryProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [suitableProducts, setSuitableProducts] = useState([]);
  const [dryCurrentSlide, setDryCurrentSlide] = useState(0);
  const [currentRecommendationSlide, setCurrentRecommendationSlide] =
    useState(0);

  const skinCareSteps = {
    cleanser: {
      title: "Sữa Rửa Mặt Dịu Nhẹ Cho Da Khô",
      description:
        "Sữa rửa mặt là bước đầu tiên và quan trọng trong quy trình chăm sóc da",
      keyPoints: [
        "Làm sạch nhẹ nhàng không gây khô căng da",
        "Dưỡng ẩm ngay trong quá trình làm sạch",
        "Không chứa xà phòng và chất tẩy rửa mạnh",
      ],
      recommendations: [
        {
          name: "CeraVe Hydrating Cleanser",
          description: "Sữa rửa mặt dưỡng ẩm cho da khô",
          image: ruamat,
        },
        {
          name: "La Roche-Posay Toleriane Hydrating Cleanser",
          description: "Sữa rửa mặt dịu nhẹ cho da khô nhạy cảm",
          image: ruamat,
        },
      ],
      usage:
        "Sử dụng với nước ấm, massage nhẹ nhàng và rửa sạch. Tránh nước quá nóng.",
    },
    toner: {
      title: "Toner Dưỡng Ẩm",
      description: "Cân bằng độ pH và cung cấp độ ẩm ban đầu cho da",
      keyPoints: ["Không chứa cồn", "Cung cấp độ ẩm tức thì", "Làm dịu da"],
      recommendations: [
        {
          name: "Laneige Cream Skin Refiner",
          description: "Toner dưỡng ẩm cao cấp",
          image: toner,
        },
        {
          name: "Hada Labo Gokujyun Hyaluronic Lotion",
          description: "Toner cấp ẩm sâu",
          image: toner,
        },
      ],
      usage: "Thấm toner vào bông cotton hoặc lòng bàn tay, vỗ nhẹ lên da.",
    },
    serum: {
      title: "Serum Dưỡng Ẩm Chuyên Sâu",
      description: "Cung cấp dưỡng chất đậm đặc và độ ẩm sâu cho da",
      keyPoints: [
        "Chứa Hyaluronic Acid đa trọng lượng",
        "Phục hồi hàng rào bảo vệ da",
        "Giảm thiểu tình trạng khô căng",
      ],
      recommendations: [
        {
          name: "The Ordinary Hyaluronic Acid 2% + B5",
          description: "Serum cấp ẩm đa tầng",
          image: serum,
        },
        {
          name: "La Roche-Posay Hyalu B5 Serum",
          description: "Serum phục hồi và dưỡng ẩm",
          image: serum,
        },
      ],
      usage: "Dùng 3-4 giọt, vỗ nhẹ lên da ẩm để tăng hiệu quả thẩm thấu.",
    },
    moisturizer: {
      title: "Kem Dưỡng Ẩm Đậm Đặc",
      description: "Khóa ẩm và tăng cường hàng rào bảo vệ da",
      keyPoints: [
        "Chứa ceramides và các lipid thiết yếu",
        "Dưỡng ẩm lâu dài",
        "Phục hồi da khô",
      ],
      recommendations: [
        {
          name: "CeraVe Moisturizing Cream",
          description: "Kem dưỡng ẩm giàu ceramides",
          image: kem,
        },
        {
          name: "La Roche-Posay Cicaplast Baume B5",
          description: "Kem dưỡng phục hồi chuyên sâu",
          image: kem,
        },
      ],
      usage: "Thoa một lớp dày vừa phải, massage nhẹ nhàng để kem thẩm thấu.",
    },
    sunscreen: {
      title: "Kem Chống Nắng Cho Da Khô",
      description: "Bảo vệ da khỏi tác hại của tia UV đồng thời dưỡng ẩm",
      keyPoints: [
        "Chống nắng phổ rộng",
        "Công thức dưỡng ẩm",
        "Không gây khô da",
      ],
      recommendations: [
        {
          name: "La Roche-Posay Anthelios Hydrating Sunscreen",
          description: "Kem chống nắng dưỡng ẩm SPF50+",
          image: sun,
        },
        {
          name: "Anessa Perfect UV Sunscreen Skincare Milk",
          description: "Sữa chống nắng dưỡng ẩm cao cấp",
          image: sun,
        },
      ],
      usage:
        "Thoa đều lên da 15-30 phút trước khi ra nắng, thoa lại sau mỗi 2 giờ.",
    },
    nightCleansing: {
      title: "Tẩy Trang Cho Da Khô",
      description: "Bước đầu tiên để làm sạch da vào buổi tối",
      keyPoints: [
        "Loại bỏ lớp trang điểm và kem chống nắng",
        "Làm sạch nhẹ nhàng",
        "Dưỡng ẩm trong khi làm sạch",
      ],
      recommendations: [
        {
          name: "Bioderma Sensibio H2O",
          description: "Nước tẩy trang dịu nhẹ cho da khô",
          image: ruamat,
        },
        {
          name: "DHC Deep Cleansing Oil",
          description: "Dầu tẩy trang dưỡng ẩm",
          image: ruamat,
        },
      ],
      usage: "Thấm sản phẩm vào bông cotton và lau nhẹ nhàng trên da.",
    },
    nightCleanser: {
      title: "Sữa Rửa Mặt Ban Đêm Cho Da Khô",
      description: "Làm sạch sâu và dưỡng ẩm cho da",
      keyPoints: ["Làm sạch dịu nhẹ", "Duy trì độ ẩm", "Không gây căng da"],
      recommendations: [
        {
          name: "La Roche-Posay Toleriane Hydrating Cleanser",
          description: "Sữa rửa mặt dưỡng ẩm",
          image: ruamat,
        },
        {
          name: "CeraVe Hydrating Cleanser",
          description: "Sữa rửa mặt phục hồi độ ẩm",
          image: ruamat,
        },
      ],
      usage: "Massage nhẹ nhàng với nước ấm, tránh nước nóng.",
    },
    nightToner: {
      title: "Toner Ban Đêm Cho Da Khô",
      description: "Cân bằng và dưỡng ẩm cho da",
      keyPoints: [
        "Không chứa cồn",
        "Làm dịu da",
        "Chuẩn bị da cho các bước dưỡng tiếp theo",
      ],
      recommendations: [
        {
          name: "Klairs Supple Preparation Unscented Toner",
          description: "Toner không mùi cho da nhạy cảm",
          image: toner,
        },
        {
          name: "Fresh Rose Deep Hydration Toner",
          description: "Toner dưỡng ẩm sâu",
          image: toner,
        },
      ],
      usage: "Thấm toner vào bông cotton hoặc lòng bàn tay, vỗ nhẹ lên da.",
    },
    nightSerum: {
      title: "Serum Đặc Trị Ban Đêm Cho Da Khô",
      description: "Cung cấp dưỡng chất đậm đặc cho da",
      keyPoints: [
        "Phục hồi da ban đêm",
        "Tăng cường dưỡng ẩm",
        "Cải thiện kết cấu da",
      ],
      recommendations: [
        {
          name: "The Ordinary Hyaluronic Acid + B5",
          description: "Serum cấp ẩm chuyên sâu",
          image: serum,
        },
        {
          name: "La Roche-Posay Hyalu B5 Serum",
          description: "Serum phục hồi và tái tạo",
          image: serum,
        },
      ],
      usage: "Sử dụng 3-4 giọt, vỗ nhẹ lên da.",
    },
    nightMoisturizer: {
      title: "Kem Dưỡng Ẩm Ban Đêm Cho Da Khô",
      description: "Dưỡng ẩm và phục hồi da suốt đêm",
      keyPoints: [
        "Dưỡng ẩm chuyên sâu",
        "Phục hồi da qua đêm",
        "Tăng cường hàng rào bảo vệ da",
      ],
      recommendations: [
        {
          name: "CeraVe Moisturizing Cream",
          description: "Kem dưỡng ẩm đậm đặc",
          image: kem,
        },
        {
          name: "La Roche-Posay Cicaplast Baume B5",
          description: "Kem dưỡng phục hồi da",
          image: kem,
        },
      ],
      usage: "Thoa một lớp dày vừa phải lên da trước khi đi ngủ.",
    },
    nightMask: {
      title: "Mặt Nạ Dưỡng Ẩm Cho Da Khô",
      description: "Cung cấp độ ẩm chuyên sâu cho da",
      keyPoints: [
        "Dưỡng ẩm tối đa",
        "Phục hồi da qua đêm",
        "Làm dịu da khô và bong tróc",
      ],
      recommendations: [
        {
          name: "Laneige Water Sleeping Mask",
          description: "Mặt nạ ngủ dưỡng ẩm",
          image: kem,
        },
        {
          name: "Origins Drink Up Intensive Overnight Mask",
          description: "Mặt nạ ngủ phục hồi da",
          image: kem,
        },
      ],
      usage:
        "Sử dụng 2-3 lần/tuần, thoa một lớp dày vừa phải trước khi đi ngủ.",
    },
  };

  const handleStepClick = async (step) => {
    setSelectedStep(step);
    setShowModal(true);

    let categoryName = "";
    switch (step) {
      case "cleanser":
      case "nightCleanser":
        categoryName = "Sữa rửa mặt";
        break;
      case "toner":
      case "nightToner":
        categoryName = "Toners";
        break;
      case "serum":
      case "nightSerum":
        categoryName = "Serums";
        break;
      case "moisturizer":
      case "nightMoisturizer":
        categoryName = "Kem dưỡng ẩm";
        break;
      case "sunscreen":
        categoryName = "Kem chống nắng";
        break;
      case "nightCleansing":
        categoryName = "Nước tẩy trang";
        break;
      default:
        categoryName = "";
    }

    if (categoryName) {
      const products = await fetchFilteredProducts(categoryName);
      setFilteredProducts(products);
    }
  };

  const getStepInfo = () => {
    return skinCareSteps[selectedStep];
  };

  const handleTopSearchNext = () => {
    setDryCurrentSlide((prevSlide) =>
      prevSlide + 3 < dryProducts.length ? prevSlide + 3 : 0
    );
  };

  const handleTopSearchPrev = () => {
    setDryCurrentSlide((prevSlide) =>
      prevSlide - 3 >= 0 ? prevSlide - 3 : Math.max(0, dryProducts.length - 3)
    );
  };

  const handleRecommendationNext = () => {
    const slider = document.querySelector(".recommendations-slider");
    if (slider) {
      slider.scrollLeft += slider.offsetWidth;
    }
  };

  const handleRecommendationPrev = () => {
    const slider = document.querySelector(".recommendations-slider");
    if (slider) {
      slider.scrollLeft -= slider.offsetWidth;
    }
  };

  const visibleTopSearchProducts = dryProducts.slice(
    dryCurrentSlide,
    dryCurrentSlide + 3
  );

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

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const response = await api.get("/discounts");
        const discountMap = response.data.reduce((acc, discount) => {
          acc[discount.discountId] = discount.discountPercent;
          return acc;
        }, {});
        setDiscounts(discountMap);
      } catch (error) {
        console.error("Error fetching discounts:", error);
      }
    };
    fetchDiscounts();
  }, []);

  useEffect(() => {
    const fetchSkintypes = async () => {
      try {
        const response = await api.get("/skin-types");
        setSkintypes(response.data);
      } catch (error) {
        console.error("Error fetching skin-types:", error);
      }
    };
    fetchSkintypes();
  }, []);

  useEffect(() => {
    const fetchDryProducts = async () => {
      try {
        const response = await api.get("/products/skin-name/Khô");
        if (response.data) {
          const productsWithIds = response.data.map((product) => ({
            ...product,
            id: `dry-${product.productId}`,
          }));
          setDryProducts(productsWithIds);
        }
      } catch (error) {
        console.error("Error fetching dry skin products:", error);
        setDryProducts([]);
      }
    };
    fetchDryProducts();
  }, []);

  const fetchFilteredProducts = async (categoryName) => {
    try {
      console.log("Fetching products for category:", categoryName);
      const categoryResponse = await api.get(
        `/products/category/${categoryName}`
      );
      const skinTypeResponse = await api.get(`/products/skin-name/Khô`);

      if (!categoryResponse.data || !skinTypeResponse.data) {
        return [];
      }

      const filteredProducts = categoryResponse.data.filter((categoryProduct) =>
        skinTypeResponse.data.some(
          (skinProduct) => skinProduct.productId === categoryProduct.productId
        )
      );

      const productsWithIds = filteredProducts.map((product) => ({
        ...product,
        id: `filtered-${product.productId}`,
      }));

      return productsWithIds;
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      return [];
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="page-title">Da khô là gì?</h1>
            <div className="definition-box">
              <p>
                Da khô là tình trạng da thiếu độ ẩm và dầu tự nhiên, thường có
                cảm giác căng, bong tróc và thiếu độ đàn hồi. Da khô cần được
                chăm sóc đặc biệt với các sản phẩm dưỡng ẩm chuyên sâu.
              </p>
            </div>
          </div>
        </div>

        <div className="row characteristics-section">
          <h2>Đặc điểm nhận biết da khô</h2>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={dakho1} alt="Đặc điểm 1" />
              <h3>Da bong tróc, khô ráp</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={dakho2} alt="Đặc điểm 2" />
              <h3>Da thiếu độ đàn hồi</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={dakho3} alt="Đặc điểm 3" />
              <h3>Da căng và khó chịu</h3>
            </div>
          </div>
        </div>

        <div className="row skincare-routine">
          <h2>Quy trình chăm sóc da khô</h2>
          <div className="col-md-6">
            <div className="routine-card morning">
              <h3>Ban ngày</h3>
              <ol>
                <li
                  onClick={() => handleStepClick("cleanser")}
                  className="clickable-step"
                >
                  Sữa rửa mặt dịu nhẹ
                </li>
                <li
                  onClick={() => handleStepClick("toner")}
                  className="clickable-step"
                >
                  Toner dưỡng ẩm
                </li>
                <li
                  onClick={() => handleStepClick("serum")}
                  className="clickable-step"
                >
                  Serum dưỡng ẩm
                </li>
                <li
                  onClick={() => handleStepClick("moisturizer")}
                  className="clickable-step"
                >
                  Kem dưỡng ẩm đậm đặc
                </li>
                <li
                  onClick={() => handleStepClick("sunscreen")}
                  className="clickable-step"
                >
                  Kem chống nắng
                </li>
              </ol>
            </div>
          </div>

          <div className="col-md-6">
            <div className="routine-card evening">
              <h3>Ban đêm</h3>
              <ol>
                <li
                  onClick={() => handleStepClick("nightCleansing")}
                  className="clickable-step"
                >
                  Tẩy trang
                </li>
                <li
                  onClick={() => handleStepClick("nightCleanser")}
                  className="clickable-step"
                >
                  Sữa rửa mặt
                </li>
                <li
                  onClick={() => handleStepClick("nightToner")}
                  className="clickable-step"
                >
                  Toner
                </li>
                <li
                  onClick={() => handleStepClick("nightSerum")}
                  className="clickable-step"
                >
                  Serum đặc trị
                </li>
                <li
                  onClick={() => handleStepClick("nightMoisturizer")}
                  className="clickable-step"
                >
                  Kem dưỡng ẩm
                </li>
                <li
                  onClick={() => handleStepClick("nightMask")}
                  className="clickable-step"
                >
                  Mặt nạ dưỡng ẩm (2-3 lần/tuần)
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row tips-section">
          <h2>Lời khuyên chăm sóc da khô</h2>
          <div className="tips-content">
            <ul>
              <li>Tránh rửa mặt với nước quá nóng</li>
              <li>Sử dụng máy tạo độ ẩm trong phòng</li>
              <li>Uống đủ nước mỗi ngày</li>
              <li>Tránh các sản phẩm chứa cồn</li>
            </ul>
          </div>
        </div>

        <div className="row product-recommendations">
          <h2>Sản phẩm gợi ý cho da khô</h2>
          <div
            className="row"
            style={{
              justifyContent: "center",
              marginBottom: "50px",
              position: "relative",
            }}
          >
            <button
              onClick={handleTopSearchPrev}
              className="slider-control prev"
            >
              &lt;
            </button>

            <div className="row">
              {dryProducts && dryProducts.length > 0 ? (
                visibleTopSearchProducts.map((product) => (
                  <div key={`dry-${product.productId}`} className="col-4">
                    <ProductCard
                      key={`card-${product.productId}`}
                      product={product}
                      discounts={discounts}
                      brands={brands}
                      categories={categories}
                      skintypes={skintypes}
                    />
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <div className="alert alert-info">Không có sản phẩm nào.</div>
                </div>
              )}
            </div>

            <button
              onClick={handleTopSearchNext}
              className="slider-control next"
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedStep && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
              <h2>{getStepInfo().title}</h2>
              <p className="description">{getStepInfo().description}</p>

              <h3>Đặc điểm chính:</h3>
              <ul>
                {getStepInfo().keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <h3>Cách sử dụng:</h3>
              <p>{getStepInfo().usage}</p>

              <h3>Sản phẩm gợi ý:</h3>
              <div className="recommendations">
                <button
                  className="slider-control prev"
                  onClick={handleRecommendationPrev}
                >
                  &lt;
                </button>

                <div className="recommendations-slider">
                  <div className="recommendations-row">
                    {filteredProducts.length > 0
                      ? filteredProducts.map((product) => (
                          <div
                            key={`filtered-${product.productId}`}
                            className="recommendation-item"
                          >
                            <ProductCard
                              product={product}
                              discounts={discounts}
                              brands={brands}
                              categories={categories}
                              skintypes={skintypes}
                            />
                          </div>
                        ))
                      : getStepInfo().recommendations.map((product, index) => (
                          <div
                            key={`default-${index}`}
                            className="recommendation-item"
                          >
                            <div className="product-card">
                              <img src={product.image} alt={product.name} />
                              <h4>{product.name}</h4>
                              <div className="description">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>

                <button
                  className="slider-control next"
                  onClick={handleRecommendationNext}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
