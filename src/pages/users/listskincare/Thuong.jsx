import React, { useState, useEffect } from "react";
import "./Skin.css";
import dat1 from "../../../assets/da/dat1.jpg";
import dat2 from "../../../assets/da/dat2.jpg";
import dat3 from "../../../assets/da/dat3.jpg";
import ruamat from "../../../assets/da/ruamat.jpg";
import toner from "../../../assets/da/toner.jpg";
import serum from "../../../assets/da/serum.jpg";
import kem from "../../../assets/da/kem.jpg";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../component/productCard/ProductCard";
import api from "../../../config/api";
import { Modal, Table } from "antd";

export default function Thuong() {
  const [showModal, setShowModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [brands, setBrands] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [normalProducts, setNormalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [suitableProducts, setSuitableProducts] = useState([]);
  const [normalCurrentSlide, setNormalCurrentSlide] = useState(0);
  const [currentRecommendationSlide, setCurrentRecommendationSlide] =
    useState(0);
  const [compareProducts, setCompareProducts] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);

  const skinCareSteps = {
    cleanser: {
      title: "Sữa Rửa Mặt Cho Da Thường",
      description: "Làm sạch da nhẹ nhàng, không gây khô căng",
      keyPoints: [
        "Làm sạch bụi bẩn và bã nhờn",
        "Duy trì độ ẩm tự nhiên",
        "Không gây khô da",
      ],
      recommendations: [
        {
          name: "Cerave Hydrating Cleanser",
          description: "Sữa rửa mặt dịu nhẹ cho da thường",
          image: ruamat,
        },
        {
          name: "Simple Kind To Skin Cleanser",
          description: "Sữa rửa mặt không xà phòng",
          image: ruamat,
        },
      ],
      usage: "Massage nhẹ nhàng với nước ấm, rửa sạch với nước.",
    },
    toner: {
      title: "Toner Cân Bằng Da",
      description: "Cân bằng độ pH và chuẩn bị da cho các bước tiếp theo",
      keyPoints: ["Cân bằng độ pH", "Cấp ẩm nhẹ nhàng", "Làm sạch sâu"],
      recommendations: [
        {
          name: "Thayers Witch Hazel Toner",
          description: "Toner không cồn, dịu nhẹ",
          image: toner,
        },
        {
          name: "Laneige Cream Skin Toner",
          description: "Toner dưỡng ẩm 2 trong 1",
          image: toner,
        },
      ],
      usage: "Thấm đều lên da bằng bông cotton hoặc tay.",
    },
    nightCleansing: {
      title: "Tẩy Trang Cho Da Thường",
      description: "Làm sạch lớp trang điểm và bụi bẩn tích tụ trong ngày",
      keyPoints: [
        "Làm sạch sâu nhưng nhẹ nhàng",
        "Không gây khô da",
        "Loại bỏ hoàn toàn lớp trang điểm",
      ],
      recommendations: [
        {
          name: "Bioderma Sensibio H2O",
          description: "Nước tẩy trang dịu nhẹ cho mọi loại da",
          image: ruamat,
        },
        {
          name: "Simple Micellar Water",
          description: "Nước tẩy trang không gây kích ứng",
          image: ruamat,
        },
      ],
      usage: "Thấm dung dịch lên bông cotton và lau nhẹ nhàng trên da.",
    },
    nightCleanser: {
      title: "Sữa Rửa Mặt Ban Đêm Cho Da Thường",
      description: "Làm sạch sâu sau bước tẩy trang",
      keyPoints: [
        "Làm sạch sâu lỗ chân lông",
        "Loại bỏ bã nhờn và tế bào chết",
        "Không làm mất đi độ ẩm tự nhiên",
      ],
      recommendations: [
        {
          name: "La Roche-Posay Toleriane",
          description: "Sữa rửa mặt dịu nhẹ cho da thường",
          image: ruamat,
        },
        {
          name: "Cetaphil Gentle Cleanser",
          description: "Sữa rửa mặt không xà phòng",
          image: ruamat,
        },
      ],
      usage: "Massage nhẹ nhàng với nước ấm, rửa sạch với nước.",
    },
    nightToner: {
      title: "Toner Ban Đêm Cho Da Thường",
      description: "Cân bằng độ pH và chuẩn bị da cho các bước dưỡng tiếp theo",
      keyPoints: [
        "Cân bằng độ pH sau khi rửa mặt",
        "Cung cấp độ ẩm ban đầu",
        "Giúp các bước dưỡng sau thẩm thấu tốt hơn",
      ],
      recommendations: [
        {
          name: "Klairs Supple Preparation Toner",
          description: "Toner dưỡng ẩm không cồn",
          image: toner,
        },
        {
          name: "Paula's Choice Skin Balancing Toner",
          description: "Toner cân bằng độ ẩm",
          image: toner,
        },
      ],
      usage: "Thấm đều lên da bằng bông cotton hoặc vỗ nhẹ bằng tay.",
    },
    nightSerum: {
      title: "Serum Ban Đêm Cho Da Thường",
      description: "Cung cấp dưỡng chất đậm đặc cho da trong giấc ngủ",
      keyPoints: [
        "Chứa các thành phần dưỡng ẩm chuyên sâu",
        "Hỗ trợ quá trình tái tạo da ban đêm",
        "Cải thiện kết cấu da",
      ],
      recommendations: [
        {
          name: "The Ordinary Niacinamide 10%",
          description: "Serum cân bằng và làm đều màu da",
          image: serum,
        },
        {
          name: "Paula's Choice 10% Niacinamide Booster",
          description: "Serum làm sáng và thu nhỏ lỗ chân lông",
          image: serum,
        },
      ],
      usage: "Thoa 2-3 giọt lên da và vỗ nhẹ để thẩm thấu.",
    },
    nightMoisturizer: {
      title: "Kem Dưỡng Ẩm Ban Đêm Cho Da Thường",
      description: "Khóa ẩm và nuôi dưỡng da trong suốt đêm",
      keyPoints: [
        "Dưỡng ẩm chuyên sâu",
        "Hỗ trợ phục hồi da",
        "Tăng cường hàng rào bảo vệ da",
      ],
      recommendations: [
        {
          name: "CeraVe PM Facial Moisturizing Lotion",
          description: "Kem dưỡng ẩm ban đêm không gây bít tắc",
          image: kem,
        },
        {
          name: "La Roche-Posay Toleriane Double Repair",
          description: "Kem dưỡng phục hồi da ban đêm",
          image: kem,
        },
      ],
      usage:
        "Thoa một lớp mỏng đều lên da, massage nhẹ nhàng theo chuyển động tròn.",
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
    setNormalCurrentSlide((prevSlide) =>
      prevSlide + 3 < normalProducts.length ? prevSlide + 3 : 0
    );
  };

  const handleTopSearchPrev = () => {
    setNormalCurrentSlide((prevSlide) =>
      prevSlide - 3 >= 0
        ? prevSlide - 3
        : Math.max(0, normalProducts.length - 3)
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

  const visibleTopSearchProducts = normalProducts.slice(
    normalCurrentSlide,
    normalCurrentSlide + 3
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
    const fetchNormalProducts = async () => {
      try {
        const response = await api.get("/products/skin-name/Thường");
        if (response.data) {
          const productsWithIds = response.data.map((product) => ({
            ...product,
            id: `normal-${product.productId}`,
          }));
          setNormalProducts(productsWithIds);
        }
      } catch (error) {
        console.error("Error fetching normal skin products:", error);
        setNormalProducts([]);
      }
    };
    fetchNormalProducts();
  }, []);

  const fetchFilteredProducts = async (categoryName) => {
    try {
      console.log("Fetching products for category:", categoryName);
      const categoryResponse = await api.get(
        `/products/category/${categoryName}`
      );
      const skinTypeResponse = await api.get(`/products/skin-name/Thường`);

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
      {/* <Header /> */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="page-title">Da thường là gì?</h1>
            <div className="definition-box">
              <p>
                Da thường là loại da cân bằng, không quá khô hay quá nhờn. Da có
                độ ẩm vừa phải, ít gặp các vấn đề về mụn hay kích ứng.
              </p>
            </div>
          </div>
        </div>

        <div className="row characteristics-section">
          <h2>Đặc điểm nhận biết da thường</h2>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={dat1} alt="Đặc điểm 1" />
              <h3>Độ ẩm cân bằng</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={dat2} alt="Đặc điểm 2" />
              <h3>Lỗ chân lông nhỏ</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div className="characteristic-card">
              <img src={dat3} alt="Đặc điểm 3" />
              <h3>Ít khuyết điểm</h3>
            </div>
          </div>
        </div>

        <div className="row skincare-routine">
          <h2>Quy trình chăm sóc da thường</h2>
          <div className="col-md-6">
            <div className="routine-card morning">
              <h3>Ban ngày</h3>
              <ol>
                <li
                  onClick={() => handleStepClick("cleanser")}
                  className="clickable-step"
                >
                  Sữa rửa mặt
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
                  Serum dưỡng da
                </li>
                <li
                  onClick={() => handleStepClick("moisturizer")}
                  className="clickable-step"
                >
                  Kem dưỡng ẩm
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
                  Serum
                </li>
                <li
                  onClick={() => handleStepClick("nightMoisturizer")}
                  className="clickable-step"
                >
                  Kem dưỡng ẩm
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="row tips-section">
          <h2>Lời khuyên chăm sóc da thường</h2>
          <div className="tips-content">
            <ul>
              <li>Duy trì độ ẩm cân bằng cho da</li>
              <li>Làm sạch da đều đặn</li>
              <li>Bảo vệ da khỏi ánh nắng</li>
              <li>Chọn sản phẩm phù hợp với da</li>
            </ul>
          </div>
        </div>

        <div className="row product-recommendations">
          <h2>Sản phẩm gợi ý cho da thường</h2>
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
              {normalProducts && normalProducts.length > 0 ? (
                visibleTopSearchProducts.map((product) => (
                  <div key={`normal-${product.productId}`} className="col-4">
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
      </div>
      {/* <Footer /> */}

      {/* Modal so sánh sản phẩm */}
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
    </>
  );
}
