

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
import { Modal, Table, Button } from "antd";

export default function Thuong() {
  const [showModal, setShowModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const [normalProducts, setNormalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [normalCurrentSlide, setNormalCurrentSlide] = useState(0);
  const [compareProducts, setCompareProducts] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [normalSkinInfo, setNormalSkinInfo] = useState(null);
  const [loadingSkinInfo, setLoadingSkinInfo] = useState(true);
  const [morningSteps, setMorningSteps] = useState([]);
  const [eveningSteps, setEveningSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stepDetails, setStepDetails] = useState({});

  useEffect(() => {
    const fetchNormalSkinInfo = async () => {
      try {
        setLoadingSkinInfo(true);
        const response = await api.get("/skin-types/info/Da thường");
        setNormalSkinInfo(response.data);
      } catch (error) {
        console.error("Error fetching normal skin info:", error);
      } finally {
        setLoadingSkinInfo(false);
      }
    };

    const fetchSkincareSteps = async () => {
      try {
        setLoading(true);
        // First fetch the skin type info
        const skinTypeRes = await api.get("/skin-types/info/Da thường");
        setNormalSkinInfo(skinTypeRes.data);

        if (skinTypeRes.data && skinTypeRes.data.planSkinCare && skinTypeRes.data.planSkinCare.length > 0) {
          let morningStepsData = [];
          let eveningStepsData = [];

          // Try to fetch morning routine (with active status)
          if (skinTypeRes.data.planSkinCare[0]) {
            try {
              const morningRes = await api.get(`/mini-skin-cares/${skinTypeRes.data.planSkinCare[0].description}`);
              if (morningRes && morningRes.data) {
                // Filter only active steps (status = 1)
                morningStepsData = morningRes.data.filter(step => step.status === 1);
                setMorningSteps(morningStepsData);
              }
            } catch (morningError) {
              console.error("Error fetching morning routine:", morningError);
              setMorningSteps([]);
            }
          }

          // Try to fetch evening routine (with active status)
          if (skinTypeRes.data.planSkinCare[1]) {
            try {
              const eveningRes = await api.get(`/mini-skin-cares/${skinTypeRes.data.planSkinCare[1].description}`);
              if (eveningRes && eveningRes.data) {
                // Filter only active steps (status = 1)
                eveningStepsData = eveningRes.data.filter(step => step.status === 1);
                setEveningSteps(eveningStepsData);
              }
            } catch (eveningError) {
              console.error("Error fetching evening routine:", eveningError);
              setEveningSteps([]);
            }
          }

          // Process step details only for successfully fetched steps with active status
          const steps = [...morningStepsData, ...eveningStepsData];
          const stepDetailsObj = {};

          for (const step of steps) {
            const stepKey = step.action.toLowerCase().replace(/\s+/g, '');
            try {
              const detailRes = await api.get(`/mini-skin-cares/details/${step.miniSkinCarePlanId}`);
              stepDetailsObj[stepKey] = {
                title: step.action,
                description: detailRes.data.description || "Bước quan trọng trong quy trình chăm sóc da thường",
                keyPoints: [
                  "Duy trì độ ẩm tự nhiên",
                  "Làm sạch nhẹ nhàng",
                  "Bảo vệ da khỏi tác hại môi trường"
                ],
                usage: detailRes.data.usage || "Sử dụng theo hướng dẫn trên sản phẩm"
              };
            } catch (error) {
              console.error(`Error fetching details for step ${stepKey}:`, error);
              stepDetailsObj[stepKey] = {
                title: step.action,
                description: "Thông tin chi tiết về bước chăm sóc da",
                keyPoints: [
                  "Duy trì độ ẩm tự nhiên",
                  "Làm sạch nhẹ nhàng",
                  "Bảo vệ da khỏi tác hại môi trường"
                ],
                usage: "Sử dụng theo hướng dẫn trên bao bì sản phẩm"
              };
            }
          }

          setStepDetails(stepDetailsObj);
        }
      } catch (error) {
        console.error("Error fetching skincare steps:", error);
        setMorningSteps([]);
        setEveningSteps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNormalSkinInfo();
    fetchSkincareSteps();
  }, []);

  const handleStepClick = async (stepKey) => {
    setSelectedStep(stepKey);
    setShowModal(true);

    let categoryName = "";
    switch (stepKey) {
      case "sữarửamặt":
      case "tẩytrang":
        categoryName = "Sữa rửa mặt";
        break;
      case "toner":
        categoryName = "Toners";
        break;
      case "serum":
        categoryName = "Serums";
        break;
      case "kemdưỡngẩm":
        categoryName = "Kem dưỡng ẩm";
        break;
      case "kemchốngnắng":
        categoryName = "Kem chống nắng";
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
    if (selectedStep && stepDetails[selectedStep]) {
      return stepDetails[selectedStep];
    }

    // Fallback data if API fails
    return {
      title: selectedStep ? selectedStep.replace(/([A-Z])/g, ' $1') : "Bước chăm sóc da",
      description: "Thông tin chi tiết về bước chăm sóc da",
      keyPoints: [
        "Duy trì độ ẩm tự nhiên",
        "Làm sạch nhẹ nhàng",
        "Bảo vệ da khỏi tác hại môi trường"
      ],
      usage: "Sử dụng theo hướng dẫn trên bao bì sản phẩm",
      recommendations: [
        {
          name: "Sản phẩm gợi ý 1",
          description: "Mô tả sản phẩm gợi ý",
          image: ruamat
        },
        {
          name: "Sản phẩm gợi ý 2",
          description: "Mô tả sản phẩm gợi ý",
          image: toner
        }
      ]
    };
  };

  const handleTopSearchNext = () => {
    setNormalCurrentSlide((prevSlide) =>
      prevSlide + 3 < normalProducts.length ? prevSlide + 3 : 0
    );
  };

  const handleTopSearchPrev = () => {
    setNormalCurrentSlide((prevSlide) =>
      prevSlide - 3 >= 0 ? prevSlide - 3 : Math.max(0, normalProducts.length - 3)
    );
  };

  const visibleTopSearchProducts = normalProducts.slice(
    normalCurrentSlide,
    normalCurrentSlide + 3
  );

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
        const response = await api.get("/products/skin-name/Da thường");
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
      const categoryResponse = await api.get(
        `/products/category/${categoryName}`
      );
      const skinTypeResponse = await api.get(`/products/skin-name/Da thường`);

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

  if (loadingSkinInfo || loading) {
    return <div className="text-center">Đang tải thông tin...</div>;
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="page-title">Da thường là gì?</h1>
            <div className="definition-box">
             

              <div
                dangerouslySetInnerHTML={{ __html: normalSkinInfo.description }}
              />
            </div>
          </div>
        </div>

        <div className="row characteristics-section">
          <h2>Đặc điểm nhận biết da thường</h2>
          {normalSkinInfo && normalSkinInfo.skinTypeImages ? (
            normalSkinInfo.skinTypeImages.slice(0, 3).map((image, index) => (
              <div className="col-md-4" key={image.imageId}>
                <div className="characteristic-card">
                  <img src={image.imageURL} alt={`Đặc điểm ${index + 1}`} />
                  <h3>
                    {index === 0 && "Độ ẩm cân bằng"}
                    {index === 1 && "Lỗ chân lông nhỏ"}
                    {index === 2 && "Ít khuyết điểm"}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <>
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
            </>
          )}
        </div>

        <div className="row skincare-routine">
          <h2>Quy trình chăm sóc da thường</h2>
          <div className="col-md-6">
            <div className="routine-card morning">
              <h3>☀️ Ban ngày</h3>
              {morningSteps && morningSteps.length > 0 ? (
                <ol>
                  {morningSteps
                    .sort((a, b) => a.stepNumber - b.stepNumber)
                    .map(step => {
                      const stepKey = step.action.toLowerCase().replace(/\s+/g, '');
                      return (
                        <li
                          key={step.miniSkinCarePlanId}
                          onClick={() => handleStepClick(stepKey)}
                          className="clickable-step"
                        >
                          {step.action}
                        </li>
                      );
                    })}
                </ol>
              ) : (
                <div className="no-routine-info">
                  <p>Không có thông tin cho lộ trình này</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="routine-card evening">
              <h3>🌙 Ban đêm</h3>
              {eveningSteps && eveningSteps.length > 0 ? (
                <ol>
                  {eveningSteps
                    .sort((a, b) => a.stepNumber - b.stepNumber)
                    .map(step => {
                      const stepKey = step.action.toLowerCase().replace(/\s+/g, '');
                      return (
                        <li
                          key={step.miniSkinCarePlanId}
                          onClick={() => handleStepClick(stepKey)}
                          className="clickable-step"
                        >
                          {step.action}
                        </li>
                      );
                    })}
                </ol>
              ) : (
                <div className="no-routine-info">
                  <p>Không có thông tin cho lộ trình này</p>
                </div>
              )}
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
                {getStepInfo().keyPoints?.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <h3>Cách sử dụng:</h3>
              <p>{getStepInfo().usage}</p>

              <h3>Sản phẩm gợi ý:</h3>
              <div className="recommendations">
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
                      : (getStepInfo().recommendations || [
                        {
                          name: "Không có sản phẩm gợi ý",
                          description: "Vui lòng thử lại sau",
                          image: ruamat
                        }
                      ]).map((product, index) => (
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
              </div>
            </div>
          </div>
        )}

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
              <i
                className="fa-solid fa-xmark"
                style={{ marginRight: "8px" }}
              ></i>
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
      </div>
    </>
  );
}