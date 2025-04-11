// // import React, { useEffect, useState } from "react";
// // import "./Skin.css";
// // import dahh1 from "../../../assets/da/dahh1.jpg";
// // import dahh2 from "../../../assets/da/dahh2.jpg";
// // import dahh3 from "../../../assets/da/dahh3.jpg";
// // import ruamat from "../../../assets/da/ruamat.jpg";
// // import toner from "../../../assets/da/toner.jpg";
// // import serum from "../../../assets/da/serum.jpg";
// // import kem from "../../../assets/da/kem.jpg";
// // import sun from "../../../assets/da/sun.jpg";
// // import { useNavigate } from "react-router-dom";
// // import ProductCard from "../../../component/productCard/ProductCard"; 
// // import api from "../../../config/api"; 
// // import { Modal, Table, Button } from "antd";

// // export default function Honhop() {
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedStep, setSelectedStep] = useState(null);
// //   const [filteredProducts, setFilteredProducts] = useState([]); 

// //   const skinCareSteps = {
// //     cleanser: {
// //       title: "Sữa Rửa Mặt Dịu Nhẹ Cho Da Hỗn Hợp",
// //       description:
// //         "Sữa rửa mặt là bước đầu tiên và quan trọng trong quy trình chăm sóc da",
// //       keyPoints: [
// //         "Làm sạch bụi bẩn, dầu thừa mà không gây khô da",
// //         "Cân bằng độ pH cho da",
// //         "Không chứa sulfate và các chất tẩy rửa mạnh",
// //       ],
// //       recommendations: [
// //         {
// //           name: "Sữa Rửa Mặt La Roche-Posay Effaclar",
// //           description: "Phù hợp cho da hỗn hợp thiên dầu",
// //           image: ruamat,
// //         },
// //         {
// //           name: "Sữa Rửa Mặt CeraVe Hydrating",
// //           description: "Phù hợp cho da hỗn hợp thiên khô",
// //           image: ruamat,
// //         },
// //       ],
// //       usage:
// //         "Sử dụng 2 lần/ngày vào buổi sáng và tối. Massage nhẹ nhàng trên da ướt trong 60 giây rồi rửa sạch với nước.",
// //     },
// //     toner: {
// //       title: "Toner Cân Bằng Độ pH",
// //       description:
// //         "Toner giúp cân bằng độ pH và chuẩn bị da cho các bước dưỡng tiếp theo",
// //       keyPoints: [
// //         "Cân bằng độ pH sau khi rửa mặt",
// //         "Làm sạch sâu và se khít lỗ chân lông",
// //         "Cung cấp độ ẩm cho da",
// //       ],
// //       recommendations: [
// //         {
// //           name: "Toner Klairs Supple Preparation",
// //           description: "Toner dịu nhẹ không cồn",
// //           image: toner,
// //         },
// //         {
// //           name: "Toner Paula's Choice BHA",
// //           description: "Toner có chứa BHA giúp kiểm soát dầu",
// //           image: toner,
// //         },
// //       ],
// //       usage:
// //         "Thấm toner vào bông cotton và thoa đều lên da. Vỗ nhẹ để toner thẩm thấu.",
// //     },
// //     serum: {
// //       title: "Serum Dưỡng Ẩm",
// //       description:
// //         "Serum chứa các hoạt chất đậm đặc giúp cải thiện tình trạng da",
// //       keyPoints: [
// //         "Cung cấp dưỡng chất đậm đặc",
// //         "Cải thiện các vấn đề về da",
// //         "Tăng cường độ ẩm",
// //       ],
// //       recommendations: [
// //         {
// //           name: "The Ordinary Niacinamide 10% + Zinc 1%",
// //           description: "Kiểm soát dầu và se khít lỗ chân lông",
// //           image: serum,
// //         },
// //         {
// //           name: "La Roche-Posay Hyalu B5 Serum",
// //           description: "Cấp ẩm sâu với Hyaluronic Acid",
// //           image: serum,
// //         },
// //       ],
// //       usage: "Sử dụng 2-3 giọt, thoa đều lên da và vỗ nhẹ để thẩm thấu.",
// //     },
// //     moisturizer: {
// //       title: "Kem Dưỡng Ẩm Không Dầu",
// //       description: "Kem dưỡng ẩm giúp khóa ẩm và bảo vệ da",
// //       keyPoints: [
// //         "Cung cấp và duy trì độ ẩm",
// //         "Không gây bít tắc lỗ chân lông",
// //         "Phù hợp cho da hỗn hợp",
// //       ],
// //       recommendations: [
// //         {
// //           name: "Neutrogena Hydro Boost Water Gel",
// //           description: "Kem dưỡng dạng gel không dầu",
// //           image: kem,
// //         },
// //         {
// //           name: "CeraVe PM Facial Moisturizing Lotion",
// //           description: "Kem dưỡng nhẹ với Ceramides",
// //           image: kem,
// //         },
// //       ],
// //       usage:
// //         "Thoa một lượng vừa đủ lên da và massage nhẹ nhàng theo chuyển động tròn.",
// //     },
// //     sunscreen: {
// //       title: "Kem Chống Nắng",
// //       description: "Bảo vệ da khỏi tác hại của tia UV",
// //       keyPoints: [
// //         "Bảo vệ da khỏi UVA/UVB",
// //         "Ngăn ngừa lão hóa sớm",
// //         "Không gây bóng nhờn",
// //       ],
// //       recommendations: [
// //         {
// //           name: "La Roche-Posay Anthelios",
// //           description: "Kem chống nắng không gây nhờn rít",
// //           image: sun,
// //         },
// //         {
// //           name: "Bioré UV Aqua Rich Watery Essence",
// //           description: "Kem chống nắng dạng gel mát nhẹ",
// //           image: sun,
// //         },
// //       ],
// //       usage:
// //         "Thoa đều lên da mỗi sáng và thoa lại sau mỗi 2 giờ khi ở ngoài trời.",
// //     },
// //     cleansingOil: {
// //       title: "Tẩy Trang",
// //       description:
// //         "Bước đầu tiên và quan trọng nhất trong quy trình chăm sóc da ban đêm",
// //       keyPoints: [
// //         "Loại bỏ lớp trang điểm và kem chống nắng",
// //         "Làm sạch bụi bẩn và dầu thừa",
// //         "Không gây kích ứng da",
// //       ],
// //       recommendations: [
// //         {
// //           name: "Dầu Tẩy Trang DHC Deep Cleansing Oil",
// //           description: "Dầu tẩy trang lành tính, làm sạch sâu",
// //           image: ruamat,
// //         },
// //         {
// //           name: "Nước Tẩy Trang Bioderma Sensibio H2O",
// //           description: "Nước tẩy trang dịu nhẹ cho da nhạy cảm",
// //           image: ruamat,
// //         },
// //       ],
// //       usage:
// //         "Massage nhẹ nhàng sản phẩm lên da khô trong 1-2 phút, sau đó rửa sạch với nước ấm.",
// //     },
// //     nightCleanser: {
// //       title: "Sữa Rửa Mặt Ban Đêm",
// //       description: "Làm sạch sâu sau bước tẩy trang",
// //       keyPoints: [
// //         "Loại bỏ hoàn toàn cặn tẩy trang",
// //         "Làm sạch sâu lỗ chân lông",
// //         "Không làm khô da",
// //       ],
// //       recommendations: [
// //         {
// //           name: "CeraVe Foaming Facial Cleanser",
// //           description: "Sữa rửa mặt dạng bọt nhẹ nhàng",
// //           image: ruamat,
// //         },
// //         {
// //           name: "La Roche-Posay Toleriane Cleanser",
// //           description: "Sữa rửa mặt cho da nhạy cảm",
// //           image: ruamat,
// //         },
// //       ],
// //       usage: "Tạo bọt với nước ấm, massage nhẹ nhàng lên da và rửa sạch.",
// //     },
// //     nightToner: {
// //       title: "Toner Ban Đêm",
// //       description: "Cân bằng độ pH và chuẩn bị da cho các bước dưỡng tiếp theo",
// //       keyPoints: [
// //         "Cân bằng độ pH sau khi rửa mặt",
// //         "Loại bỏ cặn bẩn còn sót lại",
// //         "Cung cấp độ ẩm ban đầu",
// //       ],
// //       recommendations: [
// //         {
// //           name: "Some By Mi AHA-BHA-PHA Toner",
// //           description: "Toner tẩy da chết nhẹ nhàng",
// //           image: toner,
// //         },
// //         {
// //           name: "Thayers Witch Hazel Toner",
// //           description: "Toner không cồn, làm dịu da",
// //           image: toner,
// //         },
// //       ],
// //       usage:
// //         "Thấm toner vào bông cotton và thoa đều lên da, vỗ nhẹ để thẩm thấu.",
// //     },
// //     nightSerum: {
// //       title: "Serum Đặc Trị Ban Đêm",
// //       description: "Cung cấp dưỡng chất đậm đặc để phục hồi da ban đêm",
// //       keyPoints: [
// //         "Chứa hoạt chất đặc trị cho từng vấn đề da",
// //         "Tái tạo và phục hồi da",
// //         "Làm việc hiệu quả trong giấc ngủ",
// //       ],
// //       recommendations: [
// //         {
// //           name: "The Ordinary Retinol 0.5%",
// //           description: "Serum chống lão hóa ban đêm",
// //           image: serum,
// //         },
// //         {
// //           name: "Paula's Choice 2% BHA",
// //           description: "Serum điều trị mụn và se khít lỗ chân lông",
// //           image: serum,
// //         },
// //       ],
// //       usage: "Sử dụng 2-3 giọt, thoa đều và vỗ nhẹ để serum thẩm thấu.",
// //     },
// //     nightMoisturizer: {
// //       title: "Kem Dưỡng Ẩm Ban Đêm",
// //       description: "Khóa ẩm và nuôi dưỡng da suốt đêm",
// //       keyPoints: [
// //         "Dưỡng ẩm chuyên sâu",
// //         "Phục hồi hàng rào bảo vệ da",
// //         "Tăng cường tái tạo da ban đêm",
// //       ],
// //       recommendations: [
// //         {
// //           name: "CeraVe Night Cream",
// //           description: "Kem dưỡng phục hồi ban đêm",
// //           image: kem,
// //         },
// //         {
// //           name: "La Roche-Posay Cicaplast Baume B5",
// //           description: "Kem dưỡng phục hồi da tổn thương",
// //           image: kem,
// //         },
// //       ],
// //       usage:
// //         "Lấy một lượng vừa đủ, thoa đều và massage nhẹ nhàng theo hướng từ trong ra ngoài.",
// //     },
// //   };

// //   const [morningSteps, setMorningSteps] = useState([]);
// //   const [eveningSteps, setEveningSteps] = useState([]);
// //   const [loading, setLoading] = useState(true);
// // useEffect(() => {
// //     const fetchSkincareSteps = async () => {
// //       try {
// //         setLoading(true);
// //         const [morningRes, eveningRes] = await Promise.all([
// //           api.get("/mini-skin-cares/Lộ trình chăm sóc da Hỗn hợp vào buổi sáng"),
// //           api.get("/mini-skin-cares/Lộ trình chăm sóc da Hỗn hợp vào buổi chiều")
// //         ]);
        
// //         setMorningSteps(morningRes.data);
// //         setEveningSteps(eveningRes.data);
// //       } catch (error) {
// //         console.error("Error fetching skincare steps:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchSkincareSteps();
// //   }, []);


// //   const handleStepClick = async (step) => {
// //     setSelectedStep(step);
// //     setShowModal(true);


// //     let categoryName = "";
// //     switch (step) {
// //       case "cleanser":
// //       case "nightCleanser":
// //         categoryName = "Sữa rửa mặt";
// //         break;
// //       case "toner":
// //       case "nightToner":
// //         categoryName = "Toners";
// //         break;
// //       case "serum":
// //       case "nightSerum":
// //         categoryName = "Serums";
// //         break;
// //       case "moisturizer":
// //       case "nightMoisturizer":
// //         categoryName = "Kem dưỡng ẩm";
// //         break;
// //       case "sunscreen":
// //         categoryName = "Kem chống nắng";
// //         break;
// //       case "cleansingOil":
// //         categoryName = "Nước tẩy trang";
// //         break;
// //       default:
// //         categoryName = "";
// //     }

// //     if (categoryName) {
// //       const products = await fetchFilteredProducts(categoryName);
// //       setFilteredProducts(products);
// //     }
// //   };

// //   const getStepInfo = () => {
// //     return skinCareSteps[selectedStep];
// //   };

// //   const [discounts, setDiscounts] = useState({}); 
// //   const [brands, setBrands] = useState([]); 
// //   const [currentSlide, setCurrentSlide] = useState(0); 
// //   const navigate = useNavigate();
// //   const [combinationProducts, setCombinationProducts] = useState([]);
// //   const [categories, setCategories] = useState([]);
// //   const [skintypes, setSkintypes] = useState([]);
// //   const [suitableProducts, setSuitableProducts] = useState([]);
// //   const [combinationCurrentSlide, setCombinationCurrentSlide] = useState(0);

// //   const handleTopSearchNext = () => {
// //     setCombinationCurrentSlide((prevSlide) =>
// //       prevSlide + 3 < combinationProducts.length ? prevSlide + 3 : 0
// //     );
// //   };

// //   const handleTopSearchPrev = () => {
// //     setCombinationCurrentSlide((prevSlide) =>
// //       prevSlide - 3 >= 0
// //         ? prevSlide - 3
// //         : Math.max(0, combinationProducts.length - 3)
// //     );
// //   };


// //   const visibleTopSearchProducts = combinationProducts.slice(
// //     combinationCurrentSlide,
// //     combinationCurrentSlide + 3
// //   );


// //   useEffect(() => {
// //     const fetchSuitableProducts = async () => {
// //       try {
// //         const response = await api.get("/products");
// //         setSuitableProducts(response.data);
// //       } catch (error) {
// //         console.error("Error fetching suitable products:", error);
// //       }
// //     };

// //     fetchSuitableProducts();
// //   }, []);

// //   useEffect(() => {
// //     const fetchBrands = async () => {
// //       try {
// //         const response = await api.get("/brands");
// //         setBrands(response.data);
// //       } catch (error) {
// //         console.error("Error fetching brands:", error);
// //       }
// //     };

// //     fetchBrands();
// //   }, []);

// //   useEffect(() => {
// //     const fetchCategories = async () => {
// //       try {
// //         const response = await api.get("/categories");
// //         setCategories(response.data);
// //       } catch (error) {
// //         console.error("Error fetching categories:", error);
// //       }
// //     };

// //     fetchCategories();
// //   }, []);

 
// //   useEffect(() => {
// //     const fetchDiscounts = async () => {
// //       try {
// //         const response = await api.get("/discounts");
// //         const discountMap = response.data.reduce((acc, discount) => {
// //           acc[discount.discountId] = discount.discountPercent; 
// //           return acc;
// //         }, {});
// //         setDiscounts(discountMap);
// //       } catch (error) {
// //         console.error("Error fetching discounts:", error);
// //       }
// //     };

// //     fetchDiscounts();
// //   }, []);
// //   useEffect(() => {
// //     const fetchSkintypes = async () => {
// //       try {
// //         const response = await api.get("/skin-types");
// //         setSkintypes(response.data);
// //       } catch (error) {
// //         console.error("Error fetching skin-types:", error);
// //       }
// //     };

// //     fetchSkintypes();
// //   }, []);

// //   useEffect(() => {
// //     const fetchCombinationProducts = async () => {
// //       try {
// //         const response = await api.get("/products/skin-name/Hỗn hợp");

// //         console.log("Combination Response:", response);

// //         if (response.data) {
         
// //           const productsWithIds = response.data.map((product) => ({
// //             ...product,
// //             id: `combination-${product.productId}`,
// //           }));

// //           setCombinationProducts(productsWithIds);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching combination skin products:", error);
// //         setCombinationProducts([]);
// //       }
// //     };

// //     fetchCombinationProducts();
// //   }, []);


// //   const fetchFilteredProducts = async (categoryName) => {
// //     try {
// //       console.log("Fetching products for category:", categoryName);

 
// //       const categoryResponse = await api.get(
// //         `/products/category/${categoryName}`
// //       );
// //       console.log("Category products:", categoryResponse.data);


// //       const skinTypeResponse = await api.get(`/products/skin-name/Hỗn hợp`);
// //       console.log("Skin type products:", skinTypeResponse.data);

// //       if (!categoryResponse.data || !skinTypeResponse.data) {
// //         return [];
// //       }

// //       const filteredProducts = categoryResponse.data.filter((categoryProduct) =>
// //         skinTypeResponse.data.some(
// //           (skinProduct) => skinProduct.productId === categoryProduct.productId
// //         )
// //       );

// //       console.log("Filtered products:", filteredProducts);

 
// //       const productsWithIds = filteredProducts.map((product) => ({
// //         ...product,
// //         id: `filtered-${product.productId}`,
// //       }));

// //       return productsWithIds;
// //     } catch (error) {
// //       console.error("Error fetching filtered products:", error);
// //       return [];
// //     }
// //   };


// //   const [currentRecommendationSlide, setCurrentRecommendationSlide] =
// //     useState(0);


// //   const handleRecommendationNext = () => {
// //     const slider = document.querySelector(".recommendations-slider");
// //     if (slider) {
// //       slider.scrollLeft += slider.offsetWidth;
// //     }
// //   };

// //   const handleRecommendationPrev = () => {
// //     const slider = document.querySelector(".recommendations-slider");
// //     if (slider) {
// //       slider.scrollLeft -= slider.offsetWidth;
// //     }
// //   };

// //   const [compareProducts, setCompareProducts] = useState([]);
// //   const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);


// //   const handleCompareClick = (product) => {
// //     if (compareProducts.length < 2) {
// //       if (!compareProducts.find((p) => p.productId === product.productId)) {
// //         setCompareProducts([...compareProducts, product]);
// //         if (compareProducts.length === 1) {
// //           setIsCompareModalVisible(true);
// //         }
// //       }
// //     } else {
// //       alert("Chỉ có thể so sánh 2 sản phẩm!");
// //     }
// //   };

// //   const handleCloseCompare = () => {
// //     setIsCompareModalVisible(false);
// //     setCompareProducts([]);
// //   };


// //   const compareColumns = [
// //     {
// //       title: "Thông tin",
// //       dataIndex: "info",
// //       key: "info",
// //       width: "20%",
// //       className: "compare-info-column",
// //       render: (text) => (
// //         <div className="compare-info-cell">
// //           <strong>{text}</strong>
// //         </div>
// //       ),
// //     },
// //     {
// //       title: "Sản phẩm 1",
// //       dataIndex: "product1",
// //       key: "product1",
// //       width: "40%",
// //       className: "compare-product-column",
// //     },
// //     {
// //       title: "Sản phẩm 2",
// //       dataIndex: "product2",
// //       key: "product2",
// //       width: "40%",
// //       className: "compare-product-column",
// //     },
// //   ];

// //   const getCompareData = () => {
// //     const [p1, p2] = compareProducts;
// //     if (!p1 || !p2) return [];

// //     const brand1 = brands.find((b) => b.brandId === p1.brandId)?.brandName;
// //     const brand2 = brands.find((b) => b.brandId === p2.brandId)?.brandName;
// //     const category1 = categories.find(
// //       (c) => c.categoryId === p1.categoryId
// //     )?.categoryName;
// //     const category2 = categories.find(
// //       (c) => c.categoryId === p2.categoryId
// //     )?.categoryName;
// //     const skinType1 = skintypes.find(
// //       (s) => s.skinTypeId === p1.skinTypeId
// //     )?.skinName;
// //     const skinType2 = skintypes.find(
// //       (s) => s.skinTypeId === p2.skinTypeId
// //     )?.skinName;

// //     return [
// //       {
// //         key: "1",
// //         info: "Hình ảnh",
// //         product1: (
// //           <div className="compare-image-container">
// //             <img
// //               src={p1.productImages[0]?.imageURL}
// //               alt={p1.productName}
// //               className="compare-product-image"
// //             />
// //           </div>
// //         ),
// //         product2: (
// //           <div className="compare-image-container">
// //             <img
// //               src={p2.productImages[0]?.imageURL}
// //               alt={p2.productName}
// //               className="compare-product-image"
// //             />
// //           </div>
// //         ),
// //       },
// //       {
// //         key: "2",
// //         info: "Tên sản phẩm",
// //         product1: <div className="compare-product-name">{p1.productName}</div>,
// //         product2: <div className="compare-product-name">{p2.productName}</div>,
// //       },
// //       {
// //         key: "3",
// //         info: "Thương hiệu",
// //         product1: <div className="compare-brand">{brand1}</div>,
// //         product2: <div className="compare-brand">{brand2}</div>,
// //       },
// //       {
// //         key: "4",
// //         info: "Danh mục",
// //         product1: <div className="compare-category">{category1}</div>,
// //         product2: <div className="compare-category">{category2}</div>,
// //       },
// //       {
// //         key: "5",
// //         info: "Loại da phù hợp",
// //         product1: (
// //           <div className="compare-skin-type">
// //             {skinType1 || "Chưa có thông tin"}
// //           </div>
// //         ),
// //         product2: (
// //           <div className="compare-skin-type">
// //             {skinType2 || "Chưa có thông tin"}
// //           </div>
// //         ),
// //       },
// //       {
// //         key: "6",
// //         info: "Giá gốc",
// //         product1: (
// //           <div className="compare-original-price">
// //             {p1.unitPrice.toLocaleString()}đ
// //           </div>
// //         ),
// //         product2: (
// //           <div className="compare-original-price">
// //             {p2.unitPrice.toLocaleString()}đ
// //           </div>
// //         ),
// //       },
// //       {
// //         key: "7",
// //         info: "Giá khuyến mãi",
// //         product1: (
// //           <div className="compare-discount-price">
// //             {p1.discountPrice.toLocaleString()}đ
// //           </div>
// //         ),
// //         product2: (
// //           <div className="compare-discount-price">
// //             {p2.discountPrice.toLocaleString()}đ
// //           </div>
// //         ),
// //       },
// //       {
// //         key: "8",
// //         info: "Mô tả",
// //         product1: <div className="compare-description">{p1.description}</div>,
// //         product2: <div className="compare-description">{p2.description}</div>,
// //       },
// //       {
// //         key: "9",
// //         info: "Thành phần",
// //         product1: <div className="compare-ingredients">{p1.ingredients}</div>,
// //         product2: <div className="compare-ingredients">{p2.ingredients}</div>,
// //       },
// //     ];
// //   };

// //   return (
// //     <>
// //       <div className="container">
// //         <div className="row">
// //           <div className="col-12">
// //             <h1 className="page-title">Da hỗn hợp là gì?</h1>
// //             <div className="definition-box">
// //               <p>
// //                 Da hỗn hợp là loại da có sự kết hợp của nhiều vùng da khác nhau
// //                 trên cùng một khuôn mặt: - Vùng chữ T (trán, mũi, cằm) thường
// //                 tiết nhiều dầu - Vùng má thường khô hoặc bình thường
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="row characteristics-section">
// //           <h2>Đặc điểm nhận biết da hỗn hợp</h2>
// //           <div className="col-md-4">
// //             <div className="characteristic-card">
// //               <img src={dahh1} alt="Đặc điểm 1" />
// //               <h3>Vùng chữ T bóng nhờn</h3>
// //             </div>
// //           </div>
// //           <div className="col-md-4">
// //             <div className="characteristic-card">
// //               <img src={dahh2} alt="Đặc điểm 2" />
// //               <h3>Lỗ chân lông to vùng mũi</h3>
// //             </div>
// //           </div>
// //           <div className="col-md-4">
// //             <div className="characteristic-card">
// //               <img src={dahh3} alt="Đặc điểm 3" />
// //               <h3>Vùng má khô</h3>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="row skincare-routine">
// //           <h2>Quy trình chăm sóc da hỗn hợp</h2>

// //           <div className="col-md-6">
// //             <div className="routine-card morning">
// //               <h3>Ban ngày</h3>
// //               <ol>
// //                 <li
// //                   onClick={() => handleStepClick("cleanser")}
// //                   className="clickable-step"
// //                 >
// //                   Sữa rửa mặt dịu nhẹ
// //                 </li>
// //                 <li
// //                   onClick={() => handleStepClick("toner")}
// //                   className="clickable-step"
// //                 >
// //                   Toner cân bằng độ pH
// //                 </li>
// //                 <li
// //                   onClick={() => handleStepClick("serum")}
// //                   className="clickable-step"
// //                 >
// //                   Serum dưỡng ẩm
// //                 </li>
// //                 <li
// //                   onClick={() => handleStepClick("moisturizer")}
// //                   className="clickable-step"
// //                 >
// //                   Kem dưỡng ẩm không dầu
// //                 </li>
// //                 <li
// //                   onClick={() => handleStepClick("sunscreen")}
// //                   className="clickable-step"
// //                 >
// //                   Kem chống nắng
// //                 </li>
// //               </ol>
// //             </div>
// //           </div>

// //           <div className="col-md-6">
// //             <div className="routine-card evening">
// //               <h3>Ban đêm</h3>
// //               <ol>
// //                 <li
// //                   onClick={() => handleStepClick("cleansingOil")}
// //                   className="clickable-step"
// //                 >
// //                   Nước tẩy trang
// //                 </li>
// //                 <li
// //                   onClick={() => handleStepClick("nightCleanser")}
// //                   className="clickable-step"
// //                 >
// //                   Sữa rửa mặt
// //                 </li>
// //                 <li
// //                   onClick={() => handleStepClick("nightToner")}
// //                   className="clickable-step"
// //                 >
// //                   Toner
// //                 </li>
// //                 <li
// //                   onClick={() => handleStepClick("nightSerum")}
// //                   className="clickable-step"
// //                 >
// //                   Serum đặc trị
// //                 </li>
// //                 <li
// //                   onClick={() => handleStepClick("nightMoisturizer")}
// //                   className="clickable-step"
// //                 >
// //                   Kem dưỡng ẩm
// //                 </li>
// //               </ol>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="row tips-section" >
// //           <h2>Lời khuyên chăm sóc da</h2>
// //           <div className="tips-content">
// //             <ul>
// //               <li>Sử dụng sản phẩm không chứa dầu</li>
// //               <li>Tẩy tế bào chết đều đặn 1-2 lần/tuần</li>
// //               <li>Cân bằng độ ẩm cho da</li>
// //               <li>Chống nắng hàng ngày</li>
// //             </ul>
// //           </div>
// //         </div>

// //         <div className="row product-recommendations" >
// //           <h2>Sản phẩm gợi ý cho da hỗn hợp</h2>
// //           <div
// //             className="row"
// //             style={{
// //               justifyContent: "center",
// //               marginBottom: "50px",
// //               position: "relative",
// //             }}
// //           >
           
// //             <button
// //               onClick={handleTopSearchPrev}
// //               className="slider-control prev"
// //               style={{
// //                 position: "absolute",
// //                 left: "-50px",
// //                 top: "50%",
// //                 transform: "translateY(-50%)",
// //               }}
// //             >
// //               &lt;
// //             </button>

          
// //             <div className="row">
// //               {combinationProducts && combinationProducts.length > 0 ? (
// //                 visibleTopSearchProducts.map((product) => (
// //                   <div
// //                     key={`combination-${product.productId}`}
// //                     className="col-4"
// //                   >
// //                     <ProductCard
// //                       key={`card-${product.productId}`}
// //                       product={product}
// //                       discounts={discounts}
// //                       brands={brands}
// //                       categories={categories}
// //                       skintypes={skintypes}
// //                       onCompareClick={handleCompareClick}
// //                     />
// //                   </div>
// //                 ))
// //               ) : (
// //                 <div className="col-12 text-center">
// //                   <div className="alert alert-info">Không có sản phẩm nào.</div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Next Button */}
// //             <button
// //               onClick={handleTopSearchNext}
// //               className="slider-control next"
// //               style={{
// //                 position: "absolute",
// //                 right: "-50px",
// //                 top: "50%",
// //                 transform: "translateY(-50%)",
// //               }}
// //             >
// //               &gt;
// //             </button>
// //           </div>
// //         </div>

// //         {/* Modal */}
// //         {showModal && selectedStep && (
// //           <div className="modal-overlay">
// //             <div className="modal-content">
// //               <button className="close-btn" onClick={() => setShowModal(false)}>
// //                 ×
// //               </button>
// //               <h2>{getStepInfo().title}</h2>
// //               <p className="description">{getStepInfo().description}</p>

// //               <h3>Đặc điểm chính:</h3>
// //               <ul>
// //                 {getStepInfo().keyPoints.map((point, index) => (
// //                   <li key={index}>{point}</li>
// //                 ))}
// //               </ul>

// //               <h3>Cách sử dụng:</h3>
// //               <p>{getStepInfo().usage}</p>

// //               <h3>Sản phẩm gợi ý:</h3>
// //               <div className="recommendations">
// //                 <button
// //                   className="slider-control prev"
// //                   onClick={handleRecommendationPrev}
// //                 >
// //                   &lt;
// //                 </button>

// //                 <div className="recommendations-slider">
// //                   <div className="recommendations-row">
// //                     {filteredProducts.length > 0
// //                       ? filteredProducts.map((product) => (
// //                           <div
// //                             key={`filtered-${product.productId}`}
// //                             className="recommendation-item"
// //                           >
// //                             <ProductCard
// //                               product={product}
// //                               discounts={discounts}
// //                               brands={brands}
// //                               categories={categories}
// //                               skintypes={skintypes}
// //                               onCompareClick={handleCompareClick}
// //                             />
// //                           </div>
// //                         ))
// //                       : // Hiển thị sản phẩm mặc định
// //                         getStepInfo().recommendations.map((product, index) => (
// //                           <div
// //                             key={`default-${index}`}
// //                             className="recommendation-item"
// //                           >
// //                             <div className="product-card">
// //                               <img src={product.image} alt={product.name} />
// //                               <h4>{product.name}</h4>
// //                               <div className="description">
// //                                 {product.description}
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))}
// //                   </div>
// //                 </div>

// //                 <button
// //                   className="slider-control next"
// //                   onClick={handleRecommendationNext}
// //                 >
// //                   &gt;
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       <Modal
// //         title={
// //           <div className="compare-modal-title">
// //             <i
// //               className="fa-solid fa-scale-balanced"
// //               style={{ marginRight: "10px" }}
// //             ></i>
// //             So sánh sản phẩm
// //           </div>
// //         }
// //         open={isCompareModalVisible}
// //         onCancel={handleCloseCompare}
// //         width={1000}
// //         footer={[
// //           <Button key="close" onClick={handleCloseCompare}>
// //             <i className="fa-solid fa-xmark" style={{ marginRight: "8px" }}></i>
// //             Đóng
// //           </Button>,
// //         ]}
// //         className="compare-modal"
// //       >
// //         <Table
// //           columns={compareColumns}
// //           dataSource={getCompareData()}
// //           pagination={false}
// //           bordered
// //           className="compare-table"
// //         />
// //       </Modal>
// //     </>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import "./Skin.css";
// import { useNavigate } from "react-router-dom";
// import ProductCard from "../../../component/productCard/ProductCard";
// import api from "../../../config/api";
// import { Modal, Table, Button } from "antd";

// export default function Honhop() {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedStep, setSelectedStep] = useState(null);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [discounts, setDiscounts] = useState({});
//   const [brands, setBrands] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const navigate = useNavigate();
//   const [combinationProducts, setCombinationProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [skintypes, setSkintypes] = useState([]);
//   const [suitableProducts, setSuitableProducts] = useState([]);
//   const [combinationCurrentSlide, setCombinationCurrentSlide] = useState(0);
//   const [currentRecommendationSlide, setCurrentRecommendationSlide] = useState(0);
//   const [compareProducts, setCompareProducts] = useState([]);
//   const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
//   const [combinationSkinInfo, setCombinationSkinInfo] = useState(null);
//   const [loadingSkinInfo, setLoadingSkinInfo] = useState(true);
//   const [morningSteps, setMorningSteps] = useState([]);
//   const [eveningSteps, setEveningSteps] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stepDetails, setStepDetails] = useState({});

//   useEffect(() => {
//     const fetchCombinationSkinInfo = async () => {
//       try {
//         setLoadingSkinInfo(true);
//         const response = await api.get("/skin-types/info/Da Hỗn hợp");
//         setCombinationSkinInfo(response.data);
//       } catch (error) {
//         console.error("Error fetching combination skin info:", error);
//       } finally {
//         setLoadingSkinInfo(false);
//       }
//     };

//     const fetchSkincareSteps = async () => {
//       try {
//         setLoading(true);
//         // First fetch the skin type info
//         const skinTypeRes = await api.get("/skin-types/info/Da Hỗn hợp");
//         setCombinationSkinInfo(skinTypeRes.data);
        
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
//                   "Làm sạch da hiệu quả",
//                   "Cân bằng dầu và ẩm",
//                   "Không gây kích ứng"
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

//     fetchCombinationSkinInfo();
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
//         "Làm sạch da hiệu quả",
//         "Cân bằng dầu và ẩm",
//         "Không gây kích ứng"
//       ],
//       usage: "Sử dụng theo hướng dẫn trên bao bì sản phẩm",
//       recommendations: [
//         {
//           name: "Sản phẩm gợi ý 1",
//           description: "Mô tả sản phẩm gợi ý",
//           image: ""
//         },
//         {
//           name: "Sản phẩm gợi ý 2",
//           description: "Mô tả sản phẩm gợi ý",
//           image: ""
//         }
//       ]
//     };
//   };

//   const handleTopSearchNext = () => {
//     setCombinationCurrentSlide((prevSlide) =>
//       prevSlide + 3 < combinationProducts.length ? prevSlide + 3 : 0
//     );
//   };

//   const handleTopSearchPrev = () => {
//     setCombinationCurrentSlide((prevSlide) =>
//       prevSlide - 3 >= 0 ? prevSlide - 3 : Math.max(0, combinationProducts.length - 3)
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

//   const visibleTopSearchProducts = combinationProducts.slice(
//     combinationCurrentSlide,
//     combinationCurrentSlide + 3
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
//     const fetchCombinationProducts = async () => {
//       try {
//         const response = await api.get("/products/skin-name/Da Hỗn hợp");
//         if (response.data) {
//           const productsWithIds = response.data.map((product) => ({
//             ...product,
//             id: `combination-${product.productId}`,
//           }));
//           setCombinationProducts(productsWithIds);
//         }
//       } catch (error) {
//         console.error("Error fetching combination skin products:", error);
//         setCombinationProducts([]);
//       }
//     };
//     fetchCombinationProducts();
//   }, []);

//   const fetchFilteredProducts = async (categoryName) => {
//     try {
//       const categoryResponse = await api.get(
//         `/products/category/${categoryName}`
//       );
//       const skinTypeResponse = await api.get(`/products/skin-name/Da Hỗn hợp`);

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
//             <h1 className="page-title">Da hỗn hợp là gì?</h1>
//             <div className="definition-box">
//               <p>
//                 {combinationSkinInfo?.description || "Da hỗn hợp là loại da có sự kết hợp của nhiều vùng da khác nhau trên cùng một khuôn mặt: - Vùng chữ T (trán, mũi, cằm) thường tiết nhiều dầu - Vùng má thường khô hoặc bình thường"}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="row characteristics-section">
//           <h2>Đặc điểm nhận biết da hỗn hợp</h2>
//           {combinationSkinInfo && combinationSkinInfo.skinTypeImages ? (
//             combinationSkinInfo.skinTypeImages.slice(0, 3).map((image, index) => (
//               <div className="col-md-4" key={image.imageId}>
//                 <div className="characteristic-card">
//                   <img src={image.imageURL} alt={`Đặc điểm ${index + 1}`} />
//                   <h3>
//                     {index === 0 && "Vùng chữ T bóng nhờn"}
//                     {index === 1 && "Lỗ chân lông to vùng mũi"}
//                     {index === 2 && "Vùng má khô"}
//                   </h3>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-12 text-center">
//               <p>Không có dữ liệu hình ảnh về da hỗn hợp</p>
//             </div>
//           )}
//         </div>
        
//         <div className="row skincare-routine">
//           <h2>Quy trình chăm sóc da hỗn hợp</h2>
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
//           <h2>Lời khuyên chăm sóc da hỗn hợp</h2>
//           <div className="tips-content">
//             <ul>
//               {combinationSkinInfo?.tips?.map((tip, index) => (
//                 <li key={index}>{tip}</li>
//               )) || (
//                 <>
//                   <li>Sử dụng sản phẩm không chứa dầu</li>
//                   <li>Tẩy tế bào chết đều đặn 1-2 lần/tuần</li>
//                   <li>Cân bằng độ ẩm cho da</li>
//                   <li>Chống nắng hàng ngày</li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>

//         <div className="row product-recommendations">
//           <h2>Sản phẩm gợi ý cho da hỗn hợp</h2>
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
//               {combinationProducts && combinationProducts.length > 0 ? (
//                 visibleTopSearchProducts.map((product) => (
//                   <div key={`combination-${product.productId}`} className="col-4">
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
//                           image: ""
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
import { useNavigate } from "react-router-dom";
import ProductCard from "../../../component/productCard/ProductCard";
import api from "../../../config/api";
import { Modal, Table, Button } from "antd";

export default function Honhop() {
  const [showModal, setShowModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [discounts, setDiscounts] = useState({});
  const [brands, setBrands] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const [combinationProducts, setCombinationProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [skintypes, setSkintypes] = useState([]);
  const [suitableProducts, setSuitableProducts] = useState([]);
  const [combinationCurrentSlide, setCombinationCurrentSlide] = useState(0);
  const [currentRecommendationSlide, setCurrentRecommendationSlide] = useState(0);
  const [compareProducts, setCompareProducts] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [combinationSkinInfo, setCombinationSkinInfo] = useState(null);
  const [loadingSkinInfo, setLoadingSkinInfo] = useState(true);
  const [morningSteps, setMorningSteps] = useState([]);
  const [eveningSteps, setEveningSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stepDetails, setStepDetails] = useState({});

  useEffect(() => {
    const fetchCombinationSkinInfo = async () => {
      try {
        setLoadingSkinInfo(true);
        const response = await api.get("/skin-types/info/Da Hỗn hợp");
        setCombinationSkinInfo(response.data);
      } catch (error) {
        console.error("Error fetching combination skin info:", error);
      } finally {
        setLoadingSkinInfo(false);
      }
    };

    const fetchSkincareSteps = async () => {
      try {
        setLoading(true);
        // First fetch the skin type info
        const skinTypeRes = await api.get("/skin-types/info/Da Hỗn hợp");
        setCombinationSkinInfo(skinTypeRes.data);
        
        if (skinTypeRes.data && skinTypeRes.data.planSkinCare && skinTypeRes.data.planSkinCare.length > 0) {
          let morningStepsData = [];
          let eveningStepsData = [];
          
          // Try to fetch morning routine (with active status)
          if (skinTypeRes.data.planSkinCare[0]) {
            try {
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
                const detailRes = await api.get(`/mini-skin-cares/details/${step.miniSkinCarePlanId}`);
                stepDetailsObj[stepKey] = detailRes.data;
              } catch (error) {
                console.error(`Error fetching details for step ${stepKey}:`, error);
                stepDetailsObj[stepKey] = {
                  title: step.action,
                  description: "Thông tin chi tiết về bước chăm sóc da",
                  keyPoints: [
                    "Làm sạch da hiệu quả",
                    "Cân bằng dầu và ẩm",
                    "Không gây kích ứng"
                  ],
                  usage: "Sử dụng theo hướng dẫn trên bao bì sản phẩm"
                };
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

    fetchCombinationSkinInfo();
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
        "Làm sạch da hiệu quả",
        "Cân bằng dầu và ẩm",
        "Không gây kích ứng"
      ],
      usage: "Sử dụng theo hướng dẫn trên bao bì sản phẩm",
      recommendations: [
        {
          name: "Sản phẩm gợi ý 1",
          description: "Mô tả sản phẩm gợi ý",
          image: ""
        },
        {
          name: "Sản phẩm gợi ý 2",
          description: "Mô tả sản phẩm gợi ý",
          image: ""
        }
      ]
    };
  };

  const handleTopSearchNext = () => {
    setCombinationCurrentSlide((prevSlide) =>
      prevSlide + 3 < combinationProducts.length ? prevSlide + 3 : 0
    );
  };

  const handleTopSearchPrev = () => {
    setCombinationCurrentSlide((prevSlide) =>
      prevSlide - 3 >= 0 ? prevSlide - 3 : Math.max(0, combinationProducts.length - 3)
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

  const visibleTopSearchProducts = combinationProducts.slice(
    combinationCurrentSlide,
    combinationCurrentSlide + 3
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
    const fetchCombinationProducts = async () => {
      try {
        const response = await api.get("/products/skin-name/Da Hỗn hợp");
        if (response.data) {
          const productsWithIds = response.data.map((product) => ({
            ...product,
            id: `combination-${product.productId}`,
          }));
          setCombinationProducts(productsWithIds);
        }
      } catch (error) {
        console.error("Error fetching combination skin products:", error);
        setCombinationProducts([]);
      }
    };
    fetchCombinationProducts();
  }, []);

  const fetchFilteredProducts = async (categoryName) => {
    try {
      const categoryResponse = await api.get(
        `/products/category/${categoryName}`
      );
      const skinTypeResponse = await api.get(`/products/skin-name/Da Hỗn hợp`);

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
            <h1 className="page-title">Da hỗn hợp là gì?</h1>
            <div className="definition-box">
              {/* <p>
                {combinationSkinInfo?.description || "Da hỗn hợp là loại da có sự kết hợp của nhiều vùng da khác nhau trên cùng một khuôn mặt: - Vùng chữ T (trán, mũi, cằm) thường tiết nhiều dầu - Vùng má thường khô hoặc bình thường"}
              </p> */}
              <div
                dangerouslySetInnerHTML={{ __html: combinationSkinInfo.description }}
              />
            </div>
          </div>
        </div>

        <div className="row characteristics-section">
          <h2>Đặc điểm nhận biết da hỗn hợp</h2>
          {combinationSkinInfo && combinationSkinInfo.skinTypeImages ? (
            combinationSkinInfo.skinTypeImages.slice(0, 3).map((image, index) => (
              <div className="col-md-4" key={image.imageId}>
                <div className="characteristic-card">
                  <img src={image.imageURL} alt={`Đặc điểm ${index + 1}`} />
                  <h3>
                    {index === 0 && "Vùng chữ T bóng nhờn"}
                    {index === 1 && "Lỗ chân lông to vùng mũi"}
                    {index === 2 && "Vùng má khô"}
                  </h3>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>Không có dữ liệu hình ảnh về da hỗn hợp</p>
            </div>
          )}
        </div>
        
        <div className="row skincare-routine">
          <h2>Quy trình chăm sóc da hỗn hợp</h2>
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
          <h2>Lời khuyên chăm sóc da hỗn hợp</h2>
          <div className="tips-content">
            <ul>
              {combinationSkinInfo?.tips?.map((tip, index) => (
                <li key={index}>{tip}</li>
              )) || (
                <>
                  <li>Sử dụng sản phẩm không chứa dầu</li>
                  <li>Tẩy tế bào chết đều đặn 1-2 lần/tuần</li>
                  <li>Cân bằng độ ẩm cho da</li>
                  <li>Chống nắng hàng ngày</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="row product-recommendations">
          <h2>Sản phẩm gợi ý cho da hỗn hợp</h2>
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
              {combinationProducts && combinationProducts.length > 0 ? (
                visibleTopSearchProducts.map((product) => (
                  <div key={`combination-${product.productId}`} className="col-4">
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
                          image: ""
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