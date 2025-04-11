// import React, { useState, useEffect } from "react";
// import "./Skin.css";
// import danc1 from "../../../assets/da/danc1.jpg";
// import danc2 from "../../../assets/da/danc2.jpg";
// import danc3 from "../../../assets/da/danc3.jpg";
// import ruamat from "../../../assets/da/ruamat.jpg";
// import toner from "../../../assets/da/toner.jpg";
// import serum from "../../../assets/da/serum.jpg";
// import kem from "../../../assets/da/kem.jpg";
// import sun from "../../../assets/da/sun.jpg";
// import { useNavigate } from "react-router-dom";
// import ProductCard from "../../../component/productCard/ProductCard";
// import api from "../../../config/api";
// import { Modal, Table, Button } from "antd";

// export default function Nhaycam() {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedStep, setSelectedStep] = useState(null);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [discounts, setDiscounts] = useState({});
//   const [brands, setBrands] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();
//   const [sensitiveProducts, setSensitiveProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [skintypes, setSkintypes] = useState([]);
//   const [suitableProducts, setSuitableProducts] = useState([]);
//   const [sensitiveCurrentSlide, setSensitiveCurrentSlide] = useState(0);
//   const [currentRecommendationSlide, setCurrentRecommendationSlide] =
//     useState(0);
//   const [compareProducts, setCompareProducts] = useState([]);
//   const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);

//   const skinCareSteps = {
//     cleanser: {
//       title: "Sữa Rửa Mặt Dịu Nhẹ Cho Da Nhạy Cảm",
//       description:
//         "Sữa rửa mặt là bước quan trọng nhất để làm sạch da nhẹ nhàng",
//       keyPoints: [
//         "Không chứa xà phòng và chất tẩy rửa mạnh",
//         "Không chứa hương liệu và chất kích ứng",
//         "Duy trì độ ẩm tự nhiên của da",
//       ],
//       recommendations: [
//         {
//           name: "La Roche-Posay Toleriane Gentle Cleanser",
//           description: "Sữa rửa mặt dành riêng cho da nhạy cảm",
//           image: ruamat,
//         },
//         {
//           name: "Avène Extremely Gentle Cleanser",
//           description: "Sữa rửa mặt cực kỳ dịu nhẹ",
//           image: ruamat,
//         },
//       ],
//       usage: "Massage nhẹ nhàng với nước ấm, tránh chà xát mạnh.",
//     },
//     toner: {
//       title: "Toner Làm Dịu Da Nhạy Cảm",
//       description: "Cân bằng độ pH và làm dịu da sau khi rửa mặt",
//       keyPoints: [
//         "Không cồn, không chất kích ứng",
//         "Làm dịu và giảm đỏ",
//         "Tăng cường hàng rào bảo vệ da",
//       ],
//       recommendations: [
//         {
//           name: "Klairs Unscented Preparation Toner",
//           description: "Toner không mùi cho da nhạy cảm",
//           image: toner,
//         },
//         {
//           name: "Avène Thermal Spring Water",
//           description: "Xịt khoáng làm dịu da",
//           image: toner,
//         },
//       ],
//       usage: "Thấm nhẹ lên da bằng bông cotton hoặc xịt trực tiếp.",
//     },
//     serum: {
//       title: "Serum Phục Hồi Da Nhạy Cảm",
//       description: "Cung cấp dưỡng chất và làm dịu da",
//       keyPoints: [
//         "Chứa các thành phần làm dịu như Cica",
//         "Phục hồi hàng rào bảo vệ da",
//         "Giảm thiểu kích ứng",
//       ],
//       recommendations: [
//         {
//           name: "La Roche-Posay Cicaplast Serum",
//           description: "Serum phục hồi da kích ứng",
//           image: serum,
//         },
//         {
//           name: "Dr.Jart+ Cicapair Serum",
//           description: "Serum làm dịu và giảm đỏ",
//           image: serum,
//         },
//       ],
//       usage: "Sử dụng 2-3 giọt, vỗ nhẹ lên da.",
//     },
//     moisturizer: {
//       title: "Kem Dưỡng Ẩm Cho Da Nhạy Cảm",
//       description: "Dưỡng ẩm và bảo vệ da nhạy cảm",
//       keyPoints: [
//         "Không chứa hương liệu",
//         "Tăng cường hàng rào bảo vệ",
//         "Giữ ẩm lâu dài",
//       ],
//       recommendations: [
//         {
//           name: "Avène Tolerance Extreme Cream",
//           description: "Kem dưỡng cho da cực kỳ nhạy cảm",
//           image: kem,
//         },
//         {
//           name: "La Roche-Posay Toleriane Ultra",
//           description: "Kem dưỡng không gây kích ứng",
//           image: kem,
//         },
//       ],
//       usage: "Thoa một lớp mỏng, massage nhẹ nhàng.",
//     },
//     sunscreen: {
//       title: "Kem Chống Nắng Cho Da Nhạy Cảm",
//       description: "Bảo vệ da khỏi tác hại của tia UV",
//       keyPoints: [
//         "Chỉ chứa màng lọc vật lý",
//         "Không gây kích ứng",
//         "Bảo vệ toàn diện",
//       ],
//       recommendations: [
//         {
//           name: "La Roche-Posay Anthelios Mineral",
//           description: "Kem chống nắng khoáng chất",
//           image: sun,
//         },
//         {
//           name: "Avène Mineral Sunscreen",
//           description: "Kem chống nắng dịu nhẹ",
//           image: sun,
//         },
//       ],
//       usage: "Thoa đều lên da 15-30 phút trước khi ra nắng.",
//     },
//     nightCleansing: {
//       title: "Tẩy Trang Cho Da Nhạy Cảm",
//       description: "Làm sạch nhẹ nhàng, không gây kích ứng",
//       keyPoints: [
//         "Loại bỏ nhẹ nhàng lớp trang điểm",
//         "Không cần chà xát mạnh",
//         "Duy trì độ ẩm",
//       ],
//       recommendations: [
//         {
//           name: "Bioderma Sensibio H2O",
//           description: "Nước tẩy trang micellar dịu nhẹ",
//           image: ruamat,
//         },
//         {
//           name: "Avène Extremely Gentle Cleanser Lotion",
//           description: "Sữa tẩy trang dịu nhẹ",
//           image: ruamat,
//         },
//       ],
//       usage: "Thấm nhẹ lên da bằng bông cotton, không chà xát.",
//     },
//     nightCleanser: {
//       title: "Sữa Rửa Mặt Ban Đêm Cho Da Nhạy Cảm",
//       description: "Làm sạch da một cách nhẹ nhàng sau bước tẩy trang",
//       keyPoints: [
//         "Làm sạch sâu nhẹ nhàng",
//         "Không gây kích ứng",
//         "Duy trì độ ẩm tự nhiên",
//       ],
//       recommendations: [
//         {
//           name: "Cetaphil Gentle Skin Cleanser",
//           description: "Sữa rửa mặt dịu nhẹ cho da nhạy cảm",
//           image: ruamat,
//         },
//         {
//           name: "Avène Cleansing Foam",
//           description: "Sữa rửa mặt dạng bọt không xà phòng",
//           image: ruamat,
//         },
//       ],
//       usage: "Massage nhẹ nhàng với nước ấm, tránh chà xát mạnh.",
//     },
//     nightToner: {
//       title: "Toner Ban Đêm Cho Da Nhạy Cảm",
//       description: "Cân bằng và làm dịu da sau khi rửa mặt",
//       keyPoints: [
//         "Không chứa cồn",
//         "Làm dịu da kích ứng",
//         "Chuẩn bị da cho các bước dưỡng tiếp theo",
//       ],
//       recommendations: [
//         {
//           name: "Pyunkang Yul Essence Toner",
//           description: "Toner dưỡng ẩm không kích ứng",
//           image: toner,
//         },
//         {
//           name: "Hada Labo Gokujyun Premium Lotion",
//           description: "Toner cấp ẩm chuyên sâu",
//           image: toner,
//         },
//       ],
//       usage: "Thấm nhẹ lên da bằng bông cotton hoặc dùng tay vỗ nhẹ.",
//     },
//     nightSerum: {
//       title: "Serum Đặc Trị Ban Đêm Cho Da Nhạy Cảm",
//       description: "Phục hồi và làm dịu da trong suốt đêm",
//       keyPoints: [
//         "Chứa thành phần làm dịu và phục hồi",
//         "Không chứa chất kích ứng",
//         "Tăng cường hàng rào bảo vệ da",
//       ],
//       recommendations: [
//         {
//           name: "La Roche-Posay Cicaplast B5 Serum",
//           description: "Serum phục hồi da ban đêm",
//           image: serum,
//         },
//         {
//           name: "Avène Hydrance Intense Serum",
//           description: "Serum dưỡng ẩm chuyên sâu",
//           image: serum,
//         },
//       ],
//       usage: "Sử dụng 2-3 giọt, vỗ nhẹ lên da để thẩm thấu.",
//     },
//     nightMoisturizer: {
//       title: "Kem Dưỡng Ẩm Ban Đêm Cho Da Nhạy Cảm",
//       description: "Nuôi dưỡng và phục hồi da trong giấc ngủ",
//       keyPoints: [
//         "Dưỡng ẩm chuyên sâu",
//         "Phục hồi da ban đêm",
//         "Làm dịu da kích ứng",
//       ],
//       recommendations: [
//         {
//           name: "La Roche-Posay Cicaplast Baume B5",
//           description: "Kem dưỡng phục hồi da ban đêm",
//           image: kem,
//         },
//         {
//           name: "Avène Cicalfate+ Restorative Protective Cream",
//           description: "Kem dưỡng phục hồi da nhạy cảm",
//           image: kem,
//         },
//       ],
//       usage:
//         "Thoa một lớp vừa đủ lên da, massage nhẹ nhàng theo chuyển động tròn.",
//     },
//   };

//   const handleStepClick = async (step) => {
//     setSelectedStep(step);
//     setShowModal(true);

//     let categoryName = "";
//     switch (step) {
//       case "cleanser":
//       case "nightCleanser":
//         categoryName = "Sữa rửa mặt";
//         break;
//       case "toner":
//       case "nightToner":
//         categoryName = "Toners";
//         break;
//       case "serum":
//       case "nightSerum":
//         categoryName = "Serums";
//         break;
//       case "moisturizer":
//       case "nightMoisturizer":
//         categoryName = "Kem dưỡng ẩm";
//         break;
//       case "sunscreen":
//         categoryName = "Kem chống nắng";
//         break;
//         case "nightCleansing":
//           case "cleansingOil":
//             categoryName = "Nước tẩy trang";
//             break;
//       default:
//         categoryName = "";
//     }

//     if (categoryName) {
//       const products = await fetchFilteredProducts(categoryName);
//       setFilteredProducts(products);
//     }
//   };

//   const getStepInfo = () => {
//     return skinCareSteps[selectedStep];
//   };

//   const handleTopSearchNext = () => {
//     setSensitiveCurrentSlide((prevSlide) =>
//       prevSlide + 3 < sensitiveProducts.length ? prevSlide + 3 : 0
//     );
//   };

//   const handleTopSearchPrev = () => {
//     setSensitiveCurrentSlide((prevSlide) =>
//       prevSlide - 3 >= 0
//         ? prevSlide - 3
//         : Math.max(0, sensitiveProducts.length - 3)
//     );
//   };

//   const handleRecommendationNext = () => {
//     const slider = document.querySelector(".recommendations-slider");
//     if (slider) {
//       slider.scrollLeft += slider.offsetWidth;
//     }
//   };

//   const handleRecommendationPrev = () => {
//     const slider = document.querySelector(".recommendations-slider");
//     if (slider) {
//       slider.scrollLeft -= slider.offsetWidth;
//     }
//   };

//   const visibleTopSearchProducts = sensitiveProducts.slice(
//     sensitiveCurrentSlide,
//     sensitiveCurrentSlide + 3
//   );

//   useEffect(() => {
//     const fetchSuitableProducts = async () => {
//       try {
//         const response = await api.get("/products");
//         setSuitableProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching suitable products:", error);
//       }
//     };
//     fetchSuitableProducts();
//   }, []);

//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const response = await api.get("/brands");
//         setBrands(response.data);
//       } catch (error) {
//         console.error("Error fetching brands:", error);
//       }
//     };
//     fetchBrands();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("/categories");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchDiscounts = async () => {
//       try {
//         const response = await api.get("/discounts");
//         const discountMap = response.data.reduce((acc, discount) => {
//           acc[discount.discountId] = discount.discountPercent;
//           return acc;
//         }, {});
//         setDiscounts(discountMap);
//       } catch (error) {
//         console.error("Error fetching discounts:", error);
//       }
//     };
//     fetchDiscounts();
//   }, []);

//   useEffect(() => {
//     const fetchSkintypes = async () => {
//       try {
//         const response = await api.get("/skin-types");
//         setSkintypes(response.data);
//       } catch (error) {
//         console.error("Error fetching skin-types:", error);
//       }
//     };
//     fetchSkintypes();
//   }, []);

//   useEffect(() => {
//     const fetchSensitiveProducts = async () => {
//       try {
//         const response = await api.get("/products/skin-name/Nhạy cảm");
//         if (response.data) {
//           const productsWithIds = response.data.map((product) => ({
//             ...product,
//             id: `sensitive-${product.productId}`,
//           }));
//           setSensitiveProducts(productsWithIds);
//         }
//       } catch (error) {
//         console.error("Error fetching sensitive skin products:", error);
//         setSensitiveProducts([]);
//       }
//     };
//     fetchSensitiveProducts();
//   }, []);

//   const fetchFilteredProducts = async (categoryName) => {
//     try {
//       console.log("Fetching products for category:", categoryName);
//       const categoryResponse = await api.get(
//         `/products/category/${categoryName}`
//       );
//       const skinTypeResponse = await api.get(`/products/skin-name/Nhạy cảm`);

//       if (!categoryResponse.data || !skinTypeResponse.data) {
//         return [];
//       }

//       const filteredProducts = categoryResponse.data.filter((categoryProduct) =>
//         skinTypeResponse.data.some(
//           (skinProduct) => skinProduct.productId === categoryProduct.productId
//         )
//       );

//       const productsWithIds = filteredProducts.map((product) => ({
//         ...product,
//         id: `filtered-${product.productId}`,
//       }));

//       return productsWithIds;
//     } catch (error) {
//       console.error("Error fetching filtered products:", error);
//       return [];
//     }
//   };

//   const handleCompareClick = (product) => {
//     if (compareProducts.length < 2) {
//       if (!compareProducts.find((p) => p.productId === product.productId)) {
//         setCompareProducts([...compareProducts, product]);
//         if (compareProducts.length === 1) {
//           setIsCompareModalVisible(true);
//         }
//       }
//     } else {
//       alert("Chỉ có thể so sánh 2 sản phẩm!");
//     }
//   };

//   const handleCloseCompare = () => {
//     setIsCompareModalVisible(false);
//     setCompareProducts([]);
//   };

//   const compareColumns = [
//     {
//       title: "Thông tin",
//       dataIndex: "info",
//       key: "info",
//       width: "20%",
//       className: "compare-info-column",
//       render: (text) => (
//         <div className="compare-info-cell">
//           <strong>{text}</strong>
//         </div>
//       ),
//     },
//     {
//       title: "Sản phẩm 1",
//       dataIndex: "product1",
//       key: "product1",
//       width: "40%",
//       className: "compare-product-column",
//     },
//     {
//       title: "Sản phẩm 2",
//       dataIndex: "product2",
//       key: "product2",
//       width: "40%",
//       className: "compare-product-column",
//     },
//   ];

//   const getCompareData = () => {
//     const [p1, p2] = compareProducts;
//     if (!p1 || !p2) return [];

//     const brand1 = brands.find((b) => b.brandId === p1.brandId)?.brandName;
//     const brand2 = brands.find((b) => b.brandId === p2.brandId)?.brandName;
//     const category1 = categories.find(
//       (c) => c.categoryId === p1.categoryId
//     )?.categoryName;
//     const category2 = categories.find(
//       (c) => c.categoryId === p2.categoryId
//     )?.categoryName;
//     const skinType1 = skintypes.find(
//       (s) => s.skinTypeId === p1.skinTypeId
//     )?.skinName;
//     const skinType2 = skintypes.find(
//       (s) => s.skinTypeId === p2.skinTypeId
//     )?.skinName;

//     return [
//       {
//         key: "1",
//         info: "Hình ảnh",
//         product1: (
//           <div className="compare-image-container">
//             <img
//               src={p1.productImages[0]?.imageURL}
//               alt={p1.productName}
//               className="compare-product-image"
//             />
//           </div>
//         ),
//         product2: (
//           <div className="compare-image-container">
//             <img
//               src={p2.productImages[0]?.imageURL}
//               alt={p2.productName}
//               className="compare-product-image"
//             />
//           </div>
//         ),
//       },
//       {
//         key: "2",
//         info: "Tên sản phẩm",
//         product1: <div className="compare-product-name">{p1.productName}</div>,
//         product2: <div className="compare-product-name">{p2.productName}</div>,
//       },
//       {
//         key: "3",
//         info: "Thương hiệu",
//         product1: <div className="compare-brand">{brand1}</div>,
//         product2: <div className="compare-brand">{brand2}</div>,
//       },
//       {
//         key: "4",
//         info: "Danh mục",
//         product1: <div className="compare-category">{category1}</div>,
//         product2: <div className="compare-category">{category2}</div>,
//       },
//       {
//         key: "5",
//         info: "Loại da phù hợp",
//         product1: (
//           <div className="compare-skin-type">
//             {skinType1 || "Chưa có thông tin"}
//           </div>
//         ),
//         product2: (
//           <div className="compare-skin-type">
//             {skinType2 || "Chưa có thông tin"}
//           </div>
//         ),
//       },
//       {
//         key: "6",
//         info: "Giá gốc",
//         product1: (
//           <div className="compare-original-price">
//             {p1.unitPrice.toLocaleString()}đ
//           </div>
//         ),
//         product2: (
//           <div className="compare-original-price">
//             {p2.unitPrice.toLocaleString()}đ
//           </div>
//         ),
//       },
//       {
//         key: "7",
//         info: "Giá khuyến mãi",
//         product1: (
//           <div className="compare-discount-price">
//             {p1.discountPrice.toLocaleString()}đ
//           </div>
//         ),
//         product2: (
//           <div className="compare-discount-price">
//             {p2.discountPrice.toLocaleString()}đ
//           </div>
//         ),
//       },
//       {
//         key: "8",
//         info: "Mô tả",
//         product1: <div className="compare-description">{p1.description}</div>,
//         product2: <div className="compare-description">{p2.description}</div>,
//       },
//       {
//         key: "9",
//         info: "Thành phần",
//         product1: <div className="compare-ingredients">{p1.ingredients}</div>,
//         product2: <div className="compare-ingredients">{p2.ingredients}</div>,
//       },
//     ];
//   };

//   return (
//     <>
//       <div className="container">
//         <div className="row">
//           <div className="col-12">
//             <h1 className="page-title">Da nhạy cảm là gì?</h1>
//             <div className="definition-box">
//               <p>
//                 Da nhạy cảm là loại da dễ bị kích ứng, đỏ và khó chịu khi tiếp
//                 xúc với các yếu tố môi trường hoặc mỹ phẩm. Loại da này cần được
//                 chăm sóc đặc biệt với các sản phẩm dịu nhẹ và phù hợp.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="row characteristics-section">
//           <h2>Đặc điểm nhận biết da nhạy cảm</h2>
//           <div className="col-md-4">
//             <div className="characteristic-card">
//               <img src={danc1} alt="Đặc điểm 1" />
//               <h3>Dễ bị đỏ và kích ứng</h3>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div className="characteristic-card">
//               <img src={danc2} alt="Đặc điểm 2" />
//               <h3>Cảm giác châm chích</h3>
//             </div>
//           </div>
//           <div className="col-md-4">
//             <div className="characteristic-card">
//               <img src={danc3} alt="Đặc điểm 3" />
//               <h3>Da mỏng và nhạy cảm</h3>
//             </div>
//           </div>
//         </div>

//         <div className="row skincare-routine">
//           <h2>Quy trình chăm sóc da nhạy cảm</h2>
//           <div className="col-md-6">
//             <div className="routine-card morning">
//               <h3>Ban ngày</h3>
//               <ol>
//                 <li
//                   onClick={() => handleStepClick("cleanser")}
//                   className="clickable-step"
//                 >
//                   Sữa rửa mặt dịu nhẹ
//                 </li>
//                 <li
//                   onClick={() => handleStepClick("toner")}
//                   className="clickable-step"
//                 >
//                   Toner làm dịu da
//                 </li>
//                 <li
//                   onClick={() => handleStepClick("serum")}
//                   className="clickable-step"
//                 >
//                   Serum phục hồi
//                 </li>
//                 <li
//                   onClick={() => handleStepClick("moisturizer")}
//                   className="clickable-step"
//                 >
//                   Kem dưỡng ẩm
//                 </li>
//                 <li
//                   onClick={() => handleStepClick("sunscreen")}
//                   className="clickable-step"
//                 >
//                   Kem chống nắng
//                 </li>
//               </ol>
//             </div>
//           </div>

//           <div className="col-md-6">
//             <div className="routine-card evening">
//               <h3>Ban đêm</h3>
//               <ol>
//                 <li
//                   onClick={() => handleStepClick("nightCleansing")}
//                   className="clickable-step"
//                 >
//                   Tẩy trang
//                 </li>
//                 <li
//                   onClick={() => handleStepClick("nightCleanser")}
//                   className="clickable-step"
//                 >
//                   Sữa rửa mặt
//                 </li>
//                 <li
//                   onClick={() => handleStepClick("nightToner")}
//                   className="clickable-step"
//                 >
//                   Toner
//                 </li>
//                 <li
//                   onClick={() => handleStepClick("nightSerum")}
//                   className="clickable-step"
//                 >
//                   Serum đặc trị
//                 </li>
//                 <li
//                   onClick={() => handleStepClick("nightMoisturizer")}
//                   className="clickable-step"
//                 >
//                   Kem dưỡng ẩm
//                 </li>
//               </ol>
//             </div>
//           </div>
//         </div>

//         <div className="row tips-section">
//           <h2>Lời khuyên chăm sóc da nhạy cảm</h2>
//           <div className="tips-content">
//             <ul>
//               <li>Luôn test sản phẩm mới trước khi sử dụng</li>
//               <li>Tránh các sản phẩm chứa cồn và hương liệu</li>
//               <li>Bảo vệ da khỏi ánh nắng mặt trời</li>
//               <li>Sử dụng sản phẩm càng đơn giản càng tốt</li>
//             </ul>
//           </div>
//         </div>

//         <div className="row product-recommendations">
//           <h2>Sản phẩm gợi ý cho da nhạy cảm</h2>
//           <div
//             className="row"
//             style={{
//               justifyContent: "center",
//               marginBottom: "50px",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={handleTopSearchPrev}
//               className="slider-control prev"
//             >
//               &lt;
//             </button>

//             <div className="row">
//               {sensitiveProducts && sensitiveProducts.length > 0 ? (
//                 visibleTopSearchProducts.map((product) => (
//                   <div key={`sensitive-${product.productId}`} className="col-4">
//                     <ProductCard
//                       key={`card-${product.productId}`}
//                       product={product}
//                       discounts={discounts}
//                       brands={brands}
//                       categories={categories}
//                       skintypes={skintypes}
//                       onCompareClick={handleCompareClick}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-12 text-center">
//                   <div className="alert alert-info">Không có sản phẩm nào.</div>
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={handleTopSearchNext}
//               className="slider-control next"
//             >
//               &gt;
//             </button>
//           </div>
//         </div>

//         {showModal && selectedStep && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <button className="close-btn" onClick={() => setShowModal(false)}>
//                 ×
//               </button>
//               <h2>{getStepInfo().title}</h2>
//               <p className="description">{getStepInfo().description}</p>

//               <h3>Đặc điểm chính:</h3>
//               <ul>
//                 {getStepInfo().keyPoints.map((point, index) => (
//                   <li key={index}>{point}</li>
//                 ))}
//               </ul>

//               <h3>Cách sử dụng:</h3>
//               <p>{getStepInfo().usage}</p>

//               <h3>Sản phẩm gợi ý:</h3>
//               <div className="recommendations">
//                 <button
//                   className="slider-control prev"
//                   onClick={handleRecommendationPrev}
//                 >
//                   &lt;
//                 </button>

//                 <div className="recommendations-slider">
//                   <div className="recommendations-row">
//                     {filteredProducts.length > 0
//                       ? filteredProducts.map((product) => (
//                           <div
//                             key={`filtered-${product.productId}`}
//                             className="recommendation-item"
//                           >
//                             <ProductCard
//                               product={product}
//                               discounts={discounts}
//                               brands={brands}
//                               categories={categories}
//                               skintypes={skintypes}
//                               onCompareClick={handleCompareClick}
//                             />
//                           </div>
//                         ))
//                       : getStepInfo().recommendations.map((product, index) => (
//                           <div
//                             key={`default-${index}`}
//                             className="recommendation-item"
//                           >
//                             <div className="product-card">
//                               <img src={product.image} alt={product.name} />
//                               <h4>{product.name}</h4>
//                               <div className="description">
//                                 {product.description}
//                               </div>
//                             </div>
//                           </div>
//                         ))}
//                   </div>
//                 </div>

//                 <button
//                   className="slider-control next"
//                   onClick={handleRecommendationNext}
//                 >
//                   &gt;
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <Modal
//         title={
//           <div className="compare-modal-title">
//             <i
//               className="fa-solid fa-scale-balanced"
//               style={{ marginRight: "10px" }}
//             ></i>
//             So sánh sản phẩm
//           </div>
//         }
//         open={isCompareModalVisible}
//         onCancel={handleCloseCompare}
//         width={1000}
//         footer={[
//           <Button key="close" onClick={handleCloseCompare}>
//             <i className="fa-solid fa-xmark" style={{ marginRight: "8px" }}></i>
//             Đóng
//           </Button>,
//         ]}
//         className="compare-modal"
//       >
//         <Table
//           columns={compareColumns}
//           dataSource={getCompareData()}
//           pagination={false}
//           bordered
//           className="compare-table"
//         />
//       </Modal>
//     </>
//   );
// }


// import React, { useState, useEffect } from "react";
// import "./Skin.css";
// import danc1 from "../../../assets/da/danc1.jpg";
// import danc2 from "../../../assets/da/danc2.jpg";
// import danc3 from "../../../assets/da/danc3.jpg";
// import ruamat from "../../../assets/da/ruamat.jpg";
// import toner from "../../../assets/da/toner.jpg";
// import serum from "../../../assets/da/serum.jpg";
// import kem from "../../../assets/da/kem.jpg";
// import sun from "../../../assets/da/sun.jpg";
// import { useNavigate } from "react-router-dom";
// import ProductCard from "../../../component/productCard/ProductCard";
// import api from "../../../config/api";
// import { Modal, Table, Button } from "antd";

// export default function Nhaycam() {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedStep, setSelectedStep] = useState(null);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [discounts, setDiscounts] = useState({});
//   const [brands, setBrands] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();
//   const [sensitiveProducts, setSensitiveProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [skintypes, setSkintypes] = useState([]);
//   const [suitableProducts, setSuitableProducts] = useState([]);
//   const [sensitiveCurrentSlide, setSensitiveCurrentSlide] = useState(0);
//   const [currentRecommendationSlide, setCurrentRecommendationSlide] =
//     useState(0);
//   const [compareProducts, setCompareProducts] = useState([]);
//   const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
//   const [sensitiveSkinInfo, setSensitiveSkinInfo] = useState(null);
//   const [loadingSkinInfo, setLoadingSkinInfo] = useState(true);
//   const [morningSteps, setMorningSteps] = useState([]);
//   const [eveningSteps, setEveningSteps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stepDetails, setStepDetails] = useState({});

//   useEffect(() => {
//     const fetchSensitiveSkinInfo = async () => {
//       try {
//         setLoadingSkinInfo(true);
//         const response = await api.get("/skin-types/info/Da Nhạy cảm");
//         setSensitiveSkinInfo(response.data);
//       } catch (error) {
//         console.error("Error fetching sensitive skin info:", error);
//       } finally {
//         setLoadingSkinInfo(false);
//       }
//     };

//     const fetchSkincareSteps = async () => {
//       try {
//         setLoading(true);
//         // First fetch the skin type info
//         const skinTypeRes = await api.get("/skin-types/info/Da Nhạy cảm");
//         setSensitiveSkinInfo(skinTypeRes.data);

//         if (skinTypeRes.data && skinTypeRes.data.planSkinCare) {
//           // Fetch morning routine (first item in planSkinCare array)
//           const morningRes = await api.get(`/mini-skin-cares/${skinTypeRes.data.planSkinCare[0].description}`);
//           setMorningSteps(morningRes.data);

//           // Fetch evening routine (second item in planSkinCare array)
//           const eveningRes = await api.get(`/mini-skin-cares/${skinTypeRes.data.planSkinCare[1].description}`);
//           setEveningSteps(eveningRes.data);

//           // Fetch details for each step
//           const steps = [...morningRes.data, ...eveningRes.data];
//           const stepDetailsObj = {};
//           for (const step of steps) {
//             const stepKey = step.action.toLowerCase().replace(/\s+/g, '');
//             try {
//               const detailRes = await api.get(`/mini-skin-cares/details/${step.miniSkinCarePlanId}`);
//               stepDetailsObj[stepKey] = detailRes.data;
//             } catch (error) {
//               console.error(`Error fetching details for step ${stepKey}:`, error);
//               stepDetailsObj[stepKey] = {
//                 title: step.action,
//                 description: "Thông tin chi tiết về bước chăm sóc da",
//                 keyPoints: [
//                   "Làm sạch da nhẹ nhàng",
//                   "Không gây kích ứng",
//                   "Duy trì độ ẩm tự nhiên"
//                 ],
//                 usage: "Sử dụng theo hướng dẫn trên bao bì sản phẩm"
//               };
//             }
//           }
//           setStepDetails(stepDetailsObj);
//         }
//       } catch (error) {
//         console.error("Error fetching skincare steps:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSensitiveSkinInfo();
//     fetchSkincareSteps();
//   }, []);

//   const handleStepClick = async (stepKey) => {
//     setSelectedStep(stepKey);
//     setShowModal(true);

//     let categoryName = "";
//     switch (stepKey) {
//       case "sữarửamặt":
//       case "tẩytrang":
//         categoryName = "Sữa rửa mặt";
//         break;
//       case "toner":
//         categoryName = "Toners";
//         break;
//       case "serum":
//         categoryName = "Serums";
//         break;
//       case "kemdưỡngẩm":
//         categoryName = "Kem dưỡng ẩm";
//         break;
//       case "kemchốngnắng":
//         categoryName = "Kem chống nắng";
//         break;
//       default:
//         categoryName = "";
//     }

//     if (categoryName) {
//       const products = await fetchFilteredProducts(categoryName);
//       setFilteredProducts(products);
//     }
//   };

//   const getStepInfo = () => {
//     if (selectedStep && stepDetails[selectedStep]) {
//       return stepDetails[selectedStep];
//     }

//     // Fallback data if API fails
//     return {
//       title: selectedStep ? selectedStep.replace(/([A-Z])/g, ' $1') : "Bước chăm sóc da",
//       description: "Thông tin chi tiết về bước chăm sóc da",
//       keyPoints: [
//         "Làm sạch da nhẹ nhàng",
//         "Không gây kích ứng",
//         "Duy trì độ ẩm tự nhiên"
//       ],
//       usage: "Sử dụng theo hướng dẫn trên bao bì sản phẩm",
//       recommendations: [
//         {
//           name: "Sản phẩm gợi ý 1",
//           description: "Mô tả sản phẩm gợi ý",
//           image: ruamat
//         },
//         {
//           name: "Sản phẩm gợi ý 2",
//           description: "Mô tả sản phẩm gợi ý",
//           image: toner
//         }
//       ]
//     };
//   };

//   const handleTopSearchNext = () => {
//     setSensitiveCurrentSlide((prevSlide) =>
//       prevSlide + 3 < sensitiveProducts.length ? prevSlide + 3 : 0
//     );
//   };

//   const handleTopSearchPrev = () => {
//     setSensitiveCurrentSlide((prevSlide) =>
//       prevSlide - 3 >= 0 ? prevSlide - 3 : Math.max(0, sensitiveProducts.length - 3)
//     );
//   };

//   const handleRecommendationNext = () => {
//     const slider = document.querySelector(".recommendations-slider");
//     if (slider) {
//       slider.scrollLeft += slider.offsetWidth;
//     }
//   };

//   const handleRecommendationPrev = () => {
//     const slider = document.querySelector(".recommendations-slider");
//     if (slider) {
//       slider.scrollLeft -= slider.offsetWidth;
//     }
//   };

//   const visibleTopSearchProducts = sensitiveProducts.slice(
//     sensitiveCurrentSlide,
//     sensitiveCurrentSlide + 3
//   );

//   useEffect(() => {
//     const fetchSuitableProducts = async () => {
//       try {
//         const response = await api.get("/products");
//         setSuitableProducts(response.data);
//       } catch (error) {
//         console.error("Error fetching suitable products:", error);
//       }
//     };
//     fetchSuitableProducts();
//   }, []);

//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const response = await api.get("/brands");
//         setBrands(response.data);
//       } catch (error) {
//         console.error("Error fetching brands:", error);
//       }
//     };
//     fetchBrands();
//   }, []);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await api.get("/categories");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const fetchDiscounts = async () => {
//       try {
//         const response = await api.get("/discounts");
//         const discountMap = response.data.reduce((acc, discount) => {
//           acc[discount.discountId] = discount.discountPercent;
//           return acc;
//         }, {});
//         setDiscounts(discountMap);
//       } catch (error) {
//         console.error("Error fetching discounts:", error);
//       }
//     };
//     fetchDiscounts();
//   }, []);

//   useEffect(() => {
//     const fetchSkintypes = async () => {
//       try {
//         const response = await api.get("/skin-types");
//         setSkintypes(response.data);
//       } catch (error) {
//         console.error("Error fetching skin-types:", error);
//       }
//     };
//     fetchSkintypes();
//   }, []);

//   useEffect(() => {
//     const fetchSensitiveProducts = async () => {
//       try {
//         const response = await api.get("/products/skin-name/Da Nhạy cảm");
//         if (response.data) {
//           const productsWithIds = response.data.map((product) => ({
//             ...product,
//             id: `sensitive-${product.productId}`,
//           }));
//           setSensitiveProducts(productsWithIds);
//         }
//       } catch (error) {
//         console.error("Error fetching sensitive skin products:", error);
//         setSensitiveProducts([]);
//       }
//     };
//     fetchSensitiveProducts();
//   }, []);

//   const fetchFilteredProducts = async (categoryName) => {
//     try {
//       console.log("Fetching products for category:", categoryName);
//       const categoryResponse = await api.get(
//         `/products/category/${categoryName}`
//       );
//       const skinTypeResponse = await api.get(`/products/skin-name/Da Nhạy cảm`);

//       if (!categoryResponse.data || !skinTypeResponse.data) {
//         return [];
//       }

//       const filteredProducts = categoryResponse.data.filter((categoryProduct) =>
//         skinTypeResponse.data.some(
//           (skinProduct) => skinProduct.productId === categoryProduct.productId
//         )
//       );

//       const productsWithIds = filteredProducts.map((product) => ({
//         ...product,
//         id: `filtered-${product.productId}`,
//       }));

//       return productsWithIds;
//     } catch (error) {
//       console.error("Error fetching filtered products:", error);
//       return [];
//     }
//   };

//   const handleCompareClick = (product) => {
//     if (compareProducts.length < 2) {
//       if (!compareProducts.find((p) => p.productId === product.productId)) {
//         setCompareProducts([...compareProducts, product]);
//         if (compareProducts.length === 1) {
//           setIsCompareModalVisible(true);
//         }
//       }
//     } else {
//       alert("Chỉ có thể so sánh 2 sản phẩm!");
//     }
//   };

//   const handleCloseCompare = () => {
//     setIsCompareModalVisible(false);
//     setCompareProducts([]);
//   };

//   const compareColumns = [
//     {
//       title: "Thông tin",
//       dataIndex: "info",
//       key: "info",
//       width: "20%",
//       className: "compare-info-column",
//       render: (text) => (
//         <div className="compare-info-cell">
//           <strong>{text}</strong>
//         </div>
//       ),
//     },
//     {
//       title: "Sản phẩm 1",
//       dataIndex: "product1",
//       key: "product1",
//       width: "40%",
//       className: "compare-product-column",
//     },
//     {
//       title: "Sản phẩm 2",
//       dataIndex: "product2",
//       key: "product2",
//       width: "40%",
//       className: "compare-product-column",
//     },
//   ];

//   const getCompareData = () => {
//     const [p1, p2] = compareProducts;
//     if (!p1 || !p2) return [];

//     const brand1 = brands.find((b) => b.brandId === p1.brandId)?.brandName;
//     const brand2 = brands.find((b) => b.brandId === p2.brandId)?.brandName;
//     const category1 = categories.find(
//       (c) => c.categoryId === p1.categoryId
//     )?.categoryName;
//     const category2 = categories.find(
//       (c) => c.categoryId === p2.categoryId
//     )?.categoryName;
//     const skinType1 = skintypes.find(
//       (s) => s.skinTypeId === p1.skinTypeId
//     )?.skinName;
//     const skinType2 = skintypes.find(
//       (s) => s.skinTypeId === p2.skinTypeId
//     )?.skinName;

//     return [
//       {
//         key: "1",
//         info: "Hình ảnh",
//         product1: (
//           <div className="compare-image-container">
//             <img
//               src={p1.productImages[0]?.imageURL}
//               alt={p1.productName}
//               className="compare-product-image"
//             />
//           </div>
//         ),
//         product2: (
//           <div className="compare-image-container">
//             <img
//               src={p2.productImages[0]?.imageURL}
//               alt={p2.productName}
//               className="compare-product-image"
//             />
//           </div>
//         ),
//       },
//       {
//         key: "2",
//         info: "Tên sản phẩm",
//         product1: <div className="compare-product-name">{p1.productName}</div>,
//         product2: <div className="compare-product-name">{p2.productName}</div>,
//       },
//       {
//         key: "3",
//         info: "Thương hiệu",
//         product1: <div className="compare-brand">{brand1}</div>,
//         product2: <div className="compare-brand">{brand2}</div>,
//       },
//       {
//         key: "4",
//         info: "Danh mục",
//         product1: <div className="compare-category">{category1}</div>,
//         product2: <div className="compare-category">{category2}</div>,
//       },
//       {
//         key: "5",
//         info: "Loại da phù hợp",
//         product1: (
//           <div className="compare-skin-type">
//             {skinType1 || "Chưa có thông tin"}
//           </div>
//         ),
//         product2: (
//           <div className="compare-skin-type">
//             {skinType2 || "Chưa có thông tin"}
//           </div>
//         ),
//       },
//       {
//         key: "6",
//         info: "Giá gốc",
//         product1: (
//           <div className="compare-original-price">
//             {p1.unitPrice.toLocaleString()}đ
//           </div>
//         ),
//         product2: (
//           <div className="compare-original-price">
//             {p2.unitPrice.toLocaleString()}đ
//           </div>
//         ),
//       },
//       {
//         key: "7",
//         info: "Giá khuyến mãi",
//         product1: (
//           <div className="compare-discount-price">
//             {p1.discountPrice.toLocaleString()}đ
//           </div>
//         ),
//         product2: (
//           <div className="compare-discount-price">
//             {p2.discountPrice.toLocaleString()}đ
//           </div>
//         ),
//       },
//       {
//         key: "8",
//         info: "Mô tả",
//         product1: <div className="compare-description">{p1.description}</div>,
//         product2: <div className="compare-description">{p2.description}</div>,
//       },
//       {
//         key: "9",
//         info: "Thành phần",
//         product1: <div className="compare-ingredients">{p1.ingredients}</div>,
//         product2: <div className="compare-ingredients">{p2.ingredients}</div>,
//       },
//     ];
//   };

//   if (loadingSkinInfo || loading) {
//     return <div className="text-center">Đang tải thông tin...</div>;
//   }

//   return (
//     <>
//       <div className="container">
//         <div className="row">
//           <div className="col-12">
//             <h1 className="page-title">Da nhạy cảm là gì?</h1>
//             <div className="definition-box">
//               <p>
//                 {sensitiveSkinInfo?.description || "Da nhạy cảm là loại da dễ bị kích ứng, đỏ và khó chịu khi tiếp xúc với các yếu tố môi trường hoặc mỹ phẩm. Loại da này cần được chăm sóc đặc biệt với các sản phẩm dịu nhẹ và phù hợp."}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="row characteristics-section">
//           <h2>Đặc điểm nhận biết da nhạy cảm</h2>
//           {sensitiveSkinInfo && sensitiveSkinInfo.skinTypeImages ? (
//             sensitiveSkinInfo.skinTypeImages.slice(0, 3).map((image, index) => (
//               <div className="col-md-4" key={image.imageId}>
//                 <div className="characteristic-card">
//                   <img src={image.imageURL} alt={`Đặc điểm ${index + 1}`} />
//                   <h3>
//                     {index === 0 && "Dễ bị đỏ và kích ứng"}
//                     {index === 1 && "Cảm giác châm chích"}
//                     {index === 2 && "Da mỏng và nhạy cảm"}
//                   </h3>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <>
//               <div className="col-md-4">
//                 <div className="characteristic-card">
//                   <img src={danc1} alt="Đặc điểm 1" />
//                   <h3>Dễ bị đỏ và kích ứng</h3>
//                 </div>
//               </div>
//               <div className="col-md-4">
//                 <div className="characteristic-card">
//                   <img src={danc2} alt="Đặc điểm 2" />
//                   <h3>Cảm giác châm chích</h3>
//                 </div>
//               </div>
//               <div className="col-md-4">
//                 <div className="characteristic-card">
//                   <img src={danc3} alt="Đặc điểm 3" />
//                   <h3>Da mỏng và nhạy cảm</h3>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//         <div className="row skincare-routine">
//           <h2>Quy trình chăm sóc da nhạy cảm</h2>
//           <div className="col-md-6">
//             <div className="routine-card morning">
//               <h3>Ban ngày</h3>
//               <ol>
//                 {morningSteps
//                   .sort((a, b) => a.stepNumber - b.stepNumber)
//                   .map(step => {
//                     const stepKey = step.action.toLowerCase().replace(/\s+/g, '');
//                     return (
//                       <li
//                         key={step.miniSkinCarePlanId}
//                         onClick={() => handleStepClick(stepKey)}
//                         className="clickable-step"
//                       >
//                         {step.action}
//                       </li>
//                     );
//                   })}
//               </ol>
//             </div>
//           </div>

//           <div className="col-md-6">
//             <div className="routine-card evening">
//               <h3>Ban đêm</h3>
//               <ol>
//                 {eveningSteps
//                   .sort((a, b) => a.stepNumber - b.stepNumber)
//                   .map(step => {
//                     const stepKey = step.action.toLowerCase().replace(/\s+/g, '');
//                     return (
//                       <li
//                         key={step.miniSkinCarePlanId}
//                         onClick={() => handleStepClick(stepKey)}
//                         className="clickable-step"
//                       >
//                         {step.action}
//                       </li>
//                     );
//                   })}
//               </ol>
//             </div>
//           </div>
//         </div>

//         <div className="row tips-section">
//           <h2>Lời khuyên chăm sóc da nhạy cảm</h2>
//           <div className="tips-content">
//             <ul>
//               <li>Luôn test sản phẩm mới trước khi sử dụng</li>
//               <li>Tránh các sản phẩm chứa cồn và hương liệu</li>
//               <li>Bảo vệ da khỏi ánh nắng mặt trời</li>
//               <li>Sử dụng sản phẩm càng đơn giản càng tốt</li>
//             </ul>
//           </div>
//         </div>

//         <div className="row product-recommendations">
//           <h2>Sản phẩm gợi ý cho da nhạy cảm</h2>
//           <div
//             className="row"
//             style={{
//               justifyContent: "center",
//               marginBottom: "50px",
//               position: "relative",
//             }}
//           >
//             <button
//               onClick={handleTopSearchPrev}
//               className="slider-control prev"
//             >
//               &lt;
//             </button>

//             <div className="row">
//               {sensitiveProducts && sensitiveProducts.length > 0 ? (
//                 visibleTopSearchProducts.map((product) => (
//                   <div key={`sensitive-${product.productId}`} className="col-4">
//                     <ProductCard
//                       key={`card-${product.productId}`}
//                       product={product}
//                       discounts={discounts}
//                       brands={brands}
//                       categories={categories}
//                       skintypes={skintypes}
//                       onCompareClick={handleCompareClick}
//                     />
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-12 text-center">
//                   <div className="alert alert-info">Không có sản phẩm nào.</div>
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={handleTopSearchNext}
//               className="slider-control next"
//             >
//               &gt;
//             </button>
//           </div>
//         </div>

//         {showModal && selectedStep && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <button className="close-btn" onClick={() => setShowModal(false)}>
//                 ×
//               </button>
//               <h2>{getStepInfo().title}</h2>
//               <p className="description">{getStepInfo().description}</p>

//               <h3>Đặc điểm chính:</h3>
//               <ul>
//                 {getStepInfo().keyPoints?.map((point, index) => (
//                   <li key={index}>{point}</li>
//                 ))}
//               </ul>

//               <h3>Cách sử dụng:</h3>
//               <p>{getStepInfo().usage}</p>

//               <h3>Sản phẩm gợi ý:</h3>
//               <div className="recommendations">
//                 <button
//                   className="slider-control prev"
//                   onClick={handleRecommendationPrev}
//                 >
//                   &lt;
//                 </button>

//                 <div className="recommendations-slider">
//                   <div className="recommendations-row">
//                     {filteredProducts.length > 0
//                       ? filteredProducts.map((product) => (
//                         <div
//                           key={`filtered-${product.productId}`}
//                           className="recommendation-item"
//                         >
//                           <ProductCard
//                             product={product}
//                             discounts={discounts}
//                             brands={brands}
//                             categories={categories}
//                             skintypes={skintypes}
//                             onCompareClick={handleCompareClick}
//                           />
//                         </div>
//                       ))
//                       : (getStepInfo().recommendations || [
//                         {
//                           name: "Không có sản phẩm gợi ý",
//                           description: "Vui lòng thử lại sau",
//                           image: ruamat
//                         }
//                       ]).map((product, index) => (
//                         <div
//                           key={`default-${index}`}
//                           className="recommendation-item"
//                         >
//                           <div className="product-card">
//                             <img src={product.image} alt={product.name} />
//                             <h4>{product.name}</h4>
//                             <div className="description">
//                               {product.description}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                   </div>
//                 </div>

//                 <button
//                   className="slider-control next"
//                   onClick={handleRecommendationNext}
//                 >
//                   &gt;
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <Modal
//           title={
//             <div className="compare-modal-title">
//               <i
//                 className="fa-solid fa-scale-balanced"
//                 style={{ marginRight: "10px" }}
//               ></i>
//               So sánh sản phẩm
//             </div>
//           }
//           open={isCompareModalVisible}
//           onCancel={handleCloseCompare}
//           width={1000}
//           footer={[
//             <Button key="close" onClick={handleCloseCompare}>
//               <i
//                 className="fa-solid fa-xmark"
//                 style={{ marginRight: "8px" }}
//               ></i>
//               Đóng
//             </Button>,
//           ]}
//           className="compare-modal"
//         >
//           <Table
//             columns={compareColumns}
//             dataSource={getCompareData()}
//             pagination={false}
//             bordered
//             className="compare-table"
//           />
//         </Modal>
//       </div>
//     </>
//   );
// }

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
import { Modal, Table, Button } from "antd";

export default function Nhaycam() {
  const [showModal, setShowModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [brands, setBrands] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [sensitiveProducts, setSensitiveProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [suitableProducts, setSuitableProducts] = useState([]);
  const [sensitiveCurrentSlide, setSensitiveCurrentSlide] = useState(0);
  const [currentRecommendationSlide, setCurrentRecommendationSlide] =
    useState(0);
  const [compareProducts, setCompareProducts] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [sensitiveSkinInfo, setSensitiveSkinInfo] = useState(null);
  const [loadingSkinInfo, setLoadingSkinInfo] = useState(true);
  const [morningSteps, setMorningSteps] = useState([]);
  const [eveningSteps, setEveningSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stepDetails, setStepDetails] = useState({});

  useEffect(() => {
    const fetchSensitiveSkinInfo = async () => {
      try {
        setLoadingSkinInfo(true);
        const response = await api.get("/skin-types/info/Da Nhạy cảm");
        setSensitiveSkinInfo(response.data);
      } catch (error) {
        console.error("Error fetching sensitive skin info:", error);
      } finally {
        setLoadingSkinInfo(false);
      }
    };

    const fetchSkincareSteps = async () => {
      try {
        setLoading(true);
        // First fetch the skin type info
        const skinTypeRes = await api.get("/skin-types/info/Da Nhạy cảm");
        setSensitiveSkinInfo(skinTypeRes.data);

        if (skinTypeRes.data && skinTypeRes.data.planSkinCare && skinTypeRes.data.planSkinCare.length > 0) {
          let morningStepsData = [];
          let eveningStepsData = [];

          // Try to fetch morning routine (with active status)
          if (skinTypeRes.data.planSkinCare[0]) {
            try {
              // Using the endpoint from your controller that filters by status
              const morningRes = await api.get(`/mini-skin-cares/${skinTypeRes.data.planSkinCare[0].description}`);
              if (morningRes && morningRes.data) {
                // This endpoint already returns only active plans (status = 1)
                morningStepsData = morningRes.data;
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
                // This endpoint already returns only active plans (status = 1)
                eveningStepsData = eveningRes.data;
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
            // Only process steps with status = 1 (ACTIVE)
            if (step && step.status === 1) {
              const stepKey = step.action.toLowerCase().replace(/\s+/g, '');
              try {
                // You might need to adjust this endpoint based on your API
                const detailRes = await api.get(`/mini-skin-cares/info/${step.action}`);
                if (detailRes && detailRes.data && detailRes.data.length > 0) {
                  // Taking the first item since your endpoint returns a list
                  stepDetailsObj[stepKey] = {
                    title: step.action,
                    description: detailRes.data[0].description || "Bước quan trọng trong quy trình chăm sóc da nhạy cảm",
                    keyPoints: [
                      "Phù hợp với da nhạy cảm",
                      "Dịu nhẹ, không gây kích ứng",
                      "Giúp da khỏe mạnh hơn"
                    ],
                    usage: detailRes.data[0].usage || "Sử dụng theo hướng dẫn trên sản phẩm"
                  };
                } else {
                  stepDetailsObj[stepKey] = createFallbackStepData(step.action);
                }
              } catch (error) {
                console.error(`Error fetching details for step ${stepKey}:`, error);
                stepDetailsObj[stepKey] = createFallbackStepData(step.action);
              }
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

    // Helper function to create fallback step data
    const createFallbackStepData = (actionName) => {
      return {
        title: actionName,
        description: "Thông tin chi tiết về bước chăm sóc da nhạy cảm",
        keyPoints: [
          "Sử dụng sản phẩm dịu nhẹ",
          "Không gây kích ứng",
          "Phù hợp với da nhạy cảm"
        ],
        usage: "Sử dụng theo hướng dẫn trên bao bì sản phẩm"
      };
    };

    fetchSensitiveSkinInfo();
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
        "Làm sạch da nhẹ nhàng",
        "Không gây kích ứng",
        "Duy trì độ ẩm tự nhiên"
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
    setSensitiveCurrentSlide((prevSlide) =>
      prevSlide + 3 < sensitiveProducts.length ? prevSlide + 3 : 0
    );
  };

  const handleTopSearchPrev = () => {
    setSensitiveCurrentSlide((prevSlide) =>
      prevSlide - 3 >= 0 ? prevSlide - 3 : Math.max(0, sensitiveProducts.length - 3)
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

  const visibleTopSearchProducts = sensitiveProducts.slice(
    sensitiveCurrentSlide,
    sensitiveCurrentSlide + 3
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
    const fetchSensitiveProducts = async () => {
      try {
        const response = await api.get("/products/skin-name/Da Nhạy cảm");
        if (response.data) {
          const productsWithIds = response.data.map((product) => ({
            ...product,
            id: `sensitive-${product.productId}`,
          }));
          setSensitiveProducts(productsWithIds);
        }
      } catch (error) {
        console.error("Error fetching sensitive skin products:", error);
        setSensitiveProducts([]);
      }
    };
    fetchSensitiveProducts();
  }, []);

  const fetchFilteredProducts = async (categoryName) => {
    try {
      console.log("Fetching products for category:", categoryName);
      const categoryResponse = await api.get(
        `/products/category/${categoryName}`
      );
      const skinTypeResponse = await api.get(`/products/skin-name/Da Nhạy cảm`);

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
            <h1 className="page-title">Da nhạy cảm là gì?</h1>
            <div className="definition-box">
              {/* <p>
                {sensitiveSkinInfo?.description || "Da nhạy cảm là loại da dễ bị kích ứng, đỏ và khó chịu khi tiếp xúc với các yếu tố môi trường hoặc mỹ phẩm. Loại da này cần được chăm sóc đặc biệt với các sản phẩm dịu nhẹ và phù hợp."}
              </p> */}

              <div
                dangerouslySetInnerHTML={{ __html: sensitiveSkinInfo.description }}
              />
            </div>
          </div>
        </div>

        <div className="row characteristics-section">
          <h2>Đặc điểm nhận biết da nhạy cảm</h2>
          {sensitiveSkinInfo && sensitiveSkinInfo.skinTypeImages ? (
            sensitiveSkinInfo.skinTypeImages.slice(0, 3).map((image, index) => (
              <div className="col-md-4" key={image.imageId}>
                <div className="characteristic-card">
                  <img src={image.imageURL} alt={`Đặc điểm ${index + 1}`} />
                  <h3>
                    {index === 0 && "Dễ bị đỏ và kích ứng"}
                    {index === 1 && "Cảm giác châm chích"}
                    {index === 2 && "Da mỏng và nhạy cảm"}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="col-md-4">
                <div className="characteristic-card">
                  <img src={danc1} alt="Đặc điểm 1" />
                  <h3>Dễ bị đỏ và kích ứng</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="characteristic-card">
                  <img src={danc2} alt="Đặc điểm 2" />
                  <h3>Cảm giác châm chích</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="characteristic-card">
                  <img src={danc3} alt="Đặc điểm 3" />
                  <h3>Da mỏng và nhạy cảm</h3>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="row skincare-routine">
          <h2>Quy trình chăm sóc da nhạy cảm</h2>

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
          <h2>Lời khuyên chăm sóc da nhạy cảm</h2>
          <div className="tips-content">
            <ul>
              <li>Luôn test sản phẩm mới trước khi sử dụng</li>
              <li>Tránh các sản phẩm chứa cồn và hương liệu</li>
              <li>Bảo vệ da khỏi ánh nắng mặt trời</li>
              <li>Sử dụng sản phẩm càng đơn giản càng tốt</li>
            </ul>
          </div>
        </div>

        <div className="row product-recommendations">
          <h2>Sản phẩm gợi ý cho da nhạy cảm</h2>
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
              {sensitiveProducts && sensitiveProducts.length > 0 ? (
                visibleTopSearchProducts.map((product) => (
                  <div key={`sensitive-${product.productId}`} className="col-4">
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