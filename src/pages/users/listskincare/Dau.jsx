import React, { useState, useEffect } from "react";
import "./Skin.css";
import danc1 from "../../../assets/da/danc1.jpg";
import danc2 from "../../../assets/da/danc2.jpg";
import danc3 from "../../../assets/da/danc3.jpg";
import ruamat from "../../../assets/da/ruamat.jpg";
import toner from "../../../assets/da/toner.jpg";
import serum from "../../../assets/da/serum.jpg";
import kem from "../../../assets/da/kem.jpg";
import sun from "../../../assets/da/sun.jpg";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../component/productCard/ProductCard";
import api from "../../../config/api";
import { Modal, Table } from "antd";

export default function Dau() {
  const [showModal, setShowModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [brands, setBrands] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [oilyProducts, setOilyProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [suitableProducts, setSuitableProducts] = useState([]);
  const [oilyCurrentSlide, setOilyCurrentSlide] = useState(0);
  const [currentRecommendationSlide, setCurrentRecommendationSlide] =
    useState(0);
  const [compareProducts, setCompareProducts] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);

  const skinCareSteps = {
    cleanser: {
      title: "Sữa Rửa Mặt Cho Da Dầu",
      description: "Làm sạch sâu và kiểm soát dầu hiệu quả",
      keyPoints: [
        "Chứa Salicylic Acid giúp làm sạch sâu",
        "Kiểm soát bã nhờn",
        "Không gây khô căng da",
      ],
      recommendations: [
        {
          name: "La Roche-Posay Effaclar Gel",
          description: "Gel rửa mặt kiểm soát dầu",
          image: ruamat,
        },
        {
          name: "Cerave Foaming Facial Cleanser",
          description: "Sữa rửa mặt tạo bọt cho da dầu",
          image: ruamat,
        },
      ],
      usage: "Massage nhẹ nhàng với nước ấm, tập trung vào vùng chữ T.",
    },
    toner: {
      title: "Toner Cân Bằng Da Dầu",
      description: "Cân bằng độ pH và kiểm soát dầu",
      keyPoints: [
        "Chứa BHA/AHA nhẹ nhàng",
        "Làm sạch sâu lỗ chân lông",
        "Kiểm soát dầu thừa",
      ],
      recommendations: [
        {
          name: "Paula's Choice 2% BHA",
          description: "Toner loại bỏ tế bào chết",
          image: toner,
        },
        {
          name: "Some By Mi AHA-BHA-PHA Toner",
          description: "Toner đa tác động",
          image: toner,
        },
      ],
      usage: "Thấm nhẹ lên da bằng bông cotton.",
    },
    serum: {
      title: "Serum Điều Trị Cho Da Dầu",
      description: "Cung cấp dưỡng chất và kiểm soát dầu",
      keyPoints: [
        "Chứa Niacinamide giúp kiểm soát dầu",
        "Làm giảm mụn và thâm",
        "Không gây bít tắc lỗ chân lông",
      ],
      recommendations: [
        {
          name: "The Ordinary Niacinamide 10% + Zinc 1%",
          description: "Serum kiểm soát dầu và mụn",
          image: serum,
        },
        {
          name: "Paula's Choice 10% Niacinamide Booster",
          description: "Serum làm giảm lỗ chân lông",
          image: serum,
        },
      ],
      usage: "Sử dụng 2-3 giọt, vỗ nhẹ lên da.",
    },
    moisturizer: {
      title: "Kem Dưỡng Ẩm Cho Da Dầu",
      description: "Cung cấp độ ẩm mà không gây bóng nhờn",
      keyPoints: [
        "Kết cấu nhẹ, không dầu",
        "Kiểm soát bã nhờn",
        "Cấp ẩm phù hợp",
      ],
      recommendations: [
        {
          name: "Neutrogena Hydro Boost Gel",
          description: "Gel dưỡng ẩm không dầu",
          image: kem,
        },
        {
          name: "La Roche-Posay Effaclar Mat",
          description: "Kem dưỡng kiểm soát dầu",
          image: kem,
        },
      ],
      usage: "Thoa một lớp mỏng lên da sau serum.",
    },
    sunscreen: {
      title: "Kem Chống Nắng Cho Da Dầu",
      description: "Bảo vệ da khỏi tác hại của tia UV",
      keyPoints: [
        "Kết cấu nhẹ, không gây bít tắc",
        "Kiểm soát dầu suốt ngày",
        "Bảo vệ toàn diện",
      ],
      recommendations: [
        {
          name: "La Roche-Posay Anthelios Anti-Shine",
          description: "Kem chống nắng kiểm soát dầu",
          image: sun,
        },
        {
          name: "Bioré UV Perfect Milk",
          description: "Sữa chống nắng cho da dầu",
          image: sun,
        },
      ],
      usage: "Thoa đều lên da 15-30 phút trước khi ra nắng.",
    },
    nightCleansing: {
      title: "Tẩy Trang Cho Da Dầu",
      description: "Làm sạch sâu lớp trang điểm và bã nhờn",
      keyPoints: [
        "Làm sạch sâu không gây kích ứng",
        "Loại bỏ dầu thừa hiệu quả",
        "Không để lại cảm giác nhờn rít",
      ],
      recommendations: [
        {
          name: "Bioderma Sébium H2O",
          description: "Nước tẩy trang cho da dầu",
          image: ruamat,
        },
        {
          name: "La Roche-Posay Effaclar Micellar Water",
          description: "Nước tẩy trang kiểm soát dầu",
          image: ruamat,
        },
      ],
      usage: "Thấm đều lên da bằng bông cotton, lau nhẹ nhàng.",
    },
  };

  const handleStepClick = async (step) => {
    setSelectedStep(step);
    setShowModal(true);

    let categoryName = "";
    switch (step) {
      case "cleanser":
        categoryName = "Sữa rửa mặt";
        break;
      case "toner":
        categoryName = "Toners";
        break;
      case "serum":
        categoryName = "Serums";
        break;
      case "moisturizer":
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
    setOilyCurrentSlide((prevSlide) =>
      prevSlide + 3 < oilyProducts.length ? prevSlide + 3 : 0
    );
  };

  const handleTopSearchPrev = () => {
    setOilyCurrentSlide((prevSlide) =>
      prevSlide - 3 >= 0 ? prevSlide - 3 : Math.max(0, oilyProducts.length - 3)
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

  const visibleTopSearchProducts = oilyProducts.slice(
    oilyCurrentSlide,
    oilyCurrentSlide + 3
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
    const fetchOilyProducts = async () => {
      try {
        const response = await api.get("/products/skin-name/Dầu");
        if (response.data) {
          const productsWithIds = response.data.map((product) => ({
            ...product,
            id: `oily-${product.productId}`,
          }));
          setOilyProducts(productsWithIds);
        }
      } catch (error) {
        console.error("Error fetching oily skin products:", error);
        setOilyProducts([]);
      }
    };
    fetchOilyProducts();
  }, []);

  const fetchFilteredProducts = async (categoryName) => {
    try {
      console.log("Fetching products for category:", categoryName);
      const categoryResponse = await api.get(
        `/products/category/${categoryName}`
      );
      const skinTypeResponse = await api.get(`/products/skin-name/Dầu`);

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

  const compareColumns = [
    {
      title: "Thông tin",
      dataIndex: "info",
      key: "info",
      width: "20%",
    },
    {
      title: "Sản phẩm 1",
      dataIndex: "product1",
      key: "product1",
      width: "40%",
    },
    {
      title: "Sản phẩm 2",
      dataIndex: "product2",
      key: "product2",
      width: "40%",
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
    const skinType1 = skintypes.find(
      (s) => s.skinTypeId === p1.skinTypeId
    )?.skinName;
    const skinType2 = skintypes.find(
      (s) => s.skinTypeId === p2.skinTypeId
    )?.skinName;

    return [
      {
        key: "1",
        info: "Hình ảnh",
        product1: (
          <img
            src={p1.productImages[0]?.imageURL}
            alt={p1.productName}
            style={{ width: "100px" }}
          />
        ),
        product2: (
          <img
            src={p2.productImages[0]?.imageURL}
            alt={p2.productName}
            style={{ width: "100px" }}
          />
        ),
      },
      {
        key: "2",
        info: "Tên sản phẩm",
        product1: p1.productName,
        product2: p2.productName,
      },
      {
        key: "3",
        info: "Thương hiệu",
        product1: brand1,
        product2: brand2,
      },
      {
        key: "4",
        info: "Danh mục",
        product1: category1,
        product2: category2,
      },
      {
        key: "5",
        info: "Loại da phù hợp",
        product1: skinType1 || "Chưa có thông tin",
        product2: skinType2 || "Chưa có thông tin",
      },
      {
        key: "6",
        info: "Giá gốc",
        product1: `${p1.unitPrice.toLocaleString()}đ`,
        product2: `${p2.unitPrice.toLocaleString()}đ`,
      },
      {
        key: "7",
        info: "Giá khuyến mãi",
        product1: `${p1.discountPrice.toLocaleString()}đ`,
        product2: `${p2.discountPrice.toLocaleString()}đ`,
      },
      {
        key: "8",
        info: "Mô tả",
        product1: p1.description,
        product2: p2.description,
      },
      {
        key: "9",
        info: "Thành phần",
        product1: p1.ingredients,
        product2: p2.ingredients,
      },
    ];
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="page-title">Da dầu là gì?</h1>
            <div className="definition-box">
              <p>
                Da dầu là loại da có đặc điểm tiết nhiều bã nhờn, dễ bị mụn và
                lỗ chân lông to. Loại da này cần được chăm sóc đặc biệt với các
                sản phẩm kiểm soát dầu và không gây bít tắc lỗ chân lông.
              </p>
            </div>
          </div>
        </div>

        <div className="row characteristics-section">
          <h2>Đặc điểm nhận biết da dầu</h2>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={danc1} alt="Đặc điểm 1" />
              <h3>Da bóng dầu</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={danc2} alt="Đặc điểm 2" />
              <h3>Lỗ chân lông to</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={danc3} alt="Đặc điểm 3" />
              <h3>Dễ nổi mụn</h3>
            </div>
          </div>
        </div>

        <div className="row skincare-routine">
          <h2>Quy trình chăm sóc da dầu</h2>
          <div className="col-md-6">
            <div className="routine-card morning">
              <h3>Ban ngày</h3>
              <ol>
                <li
                  onClick={() => handleStepClick("cleanser")}
                  className="clickable-step"
                >
                  Sữa rửa mặt kiểm soát dầu
                </li>
                <li
                  onClick={() => handleStepClick("toner")}
                  className="clickable-step"
                >
                  Toner cân bằng da
                </li>
                <li
                  onClick={() => handleStepClick("serum")}
                  className="clickable-step"
                >
                  Serum điều trị
                </li>
                <li
                  onClick={() => handleStepClick("moisturizer")}
                  className="clickable-step"
                >
                  Kem dưỡng ẩm nhẹ
                </li>
                <li
                  onClick={() => handleStepClick("sunscreen")}
                  className="clickable-step"
                >
                  Kem chống nắng kiểm soát dầu
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
                  Tẩy trang kỹ
                </li>
                <li
                  onClick={() => handleStepClick("cleanser")}
                  className="clickable-step"
                >
                  Sữa rửa mặt làm sạch sâu
                </li>
                <li
                  onClick={() => handleStepClick("toner")}
                  className="clickable-step"
                >
                  Toner cân bằng
                </li>
                <li
                  onClick={() => handleStepClick("serum")}
                  className="clickable-step"
                >
                  Serum trị mụn
                </li>
                <li
                  onClick={() => handleStepClick("moisturizer")}
                  className="clickable-step"
                >
                  Kem dưỡng ẩm nhẹ
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row tips-section">
          <h2>Lời khuyên chăm sóc da dầu</h2>
          <div className="tips-content">
            <ul>
              <li>Rửa mặt không quá 2-3 lần một ngày</li>
              <li>Sử dụng sản phẩm không chứa dầu (oil-free)</li>
              <li>Tránh chạm tay lên mặt thường xuyên</li>
              <li>Thay vỏ gối thường xuyên</li>
              <li>Uống đủ nước mỗi ngày</li>
              <li>Hạn chế ăn đồ cay nóng và nhiều dầu mỡ</li>
              <li>Tẩy tế bào chết đều đặn 1-2 lần/tuần</li>
            </ul>
          </div>
        </div>

        <div className="row product-recommendations">
          <h2>Sản phẩm gợi ý cho da dầu</h2>
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
              {oilyProducts && oilyProducts.length > 0 ? (
                visibleTopSearchProducts.map((product) => (
                  <div key={`oily-${product.productId}`} className="col-4">
                    <ProductCard
                      key={`card-${product.productId}`}
                      product={product}
                      discounts={discounts}
                      brands={brands}
                      categories={categories}
                      skintypes={skintypes}
                      onCompareClick={handleCompareClick}
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
                              onCompareClick={handleCompareClick}
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

        <Modal
          title="So sánh sản phẩm"
          open={isCompareModalVisible}
          onCancel={handleCloseCompare}
          width={1000}
          footer={null}
        >
          <Table
            columns={compareColumns}
            dataSource={getCompareData()}
            pagination={false}
            bordered
          />
        </Modal>
      </div>
    </>
  );
}
