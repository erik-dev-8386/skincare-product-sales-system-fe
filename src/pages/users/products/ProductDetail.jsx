

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Card, Button, Breadcrumb, Row, Col, Typography, Rate, Divider } from "antd";
// import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
// import api from "../../../config/api"

// const { Title, Text } = Typography;

// export default function ProductDetail() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await api.get(`/products/${id}`); // Update this URL
//         setProduct(response.data);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   const handleAddToCart = () => {
//     alert(`${product.productName} added to cart!`); // Updated to use productName
//   };

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="container">
//       <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
//         <Breadcrumb style={{ marginBottom: "20px" }}>
//           <Breadcrumb.Item onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</Breadcrumb.Item>
//           <Breadcrumb.Item>Products</Breadcrumb.Item>
//           <Breadcrumb.Item>{product.productName}</Breadcrumb.Item> {/* Updated to use productName */}
//         </Breadcrumb>

//         <Row gutter={32}>
//           {/* Product Image */}
//           <Col xs={24} md={10}>
//             <Card hoverable cover={<img alt={product.productName} src={product.productImages[0]?.imageURL} style={{ width: "100%", objectFit: "contain" }} />} />
//           </Col>

//           {/* Product Details */}
//           <Col xs={24} md={14}>
//             <Title level={2}>{product.productName}</Title> {/* Updated to use productName */}
//             {/* <Rate allowHalf defaultValue={Math.random() * (5 - 3) + 3} /> */}
//             <Divider />
//             <Title level={4} style={{ color: "#ff4d4f" }}>
//               {product.discountPrice.toFixed(2)} VND{/* Updated to use unitPrice */}
//               <Text delete style={{ color: "gray", marginLeft: "10px" }}>
//                 {(product.unitPrice * 1.2).toFixed(2)} VND{/* Assuming discountPrice is the original price */}
//               </Text>
//             </Title>
//             <div style={{color: "black"}}>
//               <strong>Mô tả:</strong> <p dangerouslySetInnerHTML={{ __html: product.description }} />
//             </div> {/* Render HTML description */}
//             <Divider />
//             <Row gutter={16}>
//               <Col>
//                 <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
//                   Add to Cart
//                 </Button>
//               </Col>
//               <Col>
//                 <Button type="danger" size="large">Buy Now</Button>
//               </Col>
//             </Row>
//             <Divider />
//             <Button type="link" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>Back</Button>
//           </Col>
//         </Row>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Breadcrumb, Row, Col, Typography, Divider, InputNumber, Tabs } from "antd";
import { ShoppingCartOutlined, HeartOutlined, DollarOutlined } from "@ant-design/icons";
import api from "../../../config/api";
import "./ProductDetail.css";
import { MapInteractionCSS } from "react-map-interaction";

const { Title } = Typography;
const { TabPane } = Tabs;

export default function ProductDetail() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [sameSkinTypeProducts, setSameSkinTypeProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [value, setValue] = useState({ scale: 1, translation: { x: 0, y: 0 } }); // State for zoom and translation

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        console.log("Product Response:", response.data);
        setProduct(response.data);
        setMainImage(response.data.productImages[0]?.imageURL);

        const similarResponse = await api.get(`/products?categoryId=${response.data.categoryId}`);
        setSimilarProducts(similarResponse.data.filter(p => p.productId !== id));

        const sameSkinTypeResponse = await api.get(`/products?skinTypeId=${response.data.skinTypeId}`);
        setSameSkinTypeProducts(sameSkinTypeResponse.data.filter(p => p.productId !== id));
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const brandsResponse = await api.get("/brands");
        setBrands(brandsResponse.data);

        const skinTypesResponse = await api.get("/skin-types");
        setSkinTypes(skinTypesResponse.data);

        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data);

        const discountsResponse = await api.get("/discounts");
        setDiscounts(discountsResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const findNameById = (id, data) => {
    const item = data.find(item => item.brandId === id || item.skinTypeId === id || item.categoryId === id || item.discountId === id);
    return item ? item.brandName || item.skinName || item.categoryName || item.discountPercent : "Loading...";
  };

  const handleAddToCart = () => {
    alert(`${product.productName} added to cart!`);
  };

  const handleThumbnailClick = (imageURL) => {
    setMainImage(imageURL);
  };

  const resetZoom = () => {
    setValue({ scale: 1, translation: { x: 0, y: 0 } }); // Reset zoom and translation
  };

  if (loading || !product) return <p>Loading...</p>;

  return (
    <div className="container">
      <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item onClick={() => navigate("/products")} style={{ cursor: "pointer" }}>Sản phẩm</Breadcrumb.Item>
          <Breadcrumb.Item>{product.productName}</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={32}>
          {/* Product Image */}
          <Col xs={24} md={12}>
            <div className="border rounded-4 mb-3 d-flex justify-content-center">
              <MapInteractionCSS value={value} onChange={setValue}>
                <img
                  style={{ maxWidth: "100%", maxHeight: "100vh", margin: "auto", width: "800px", height: "400px" }}
                  className="rounded-4 fit"
                  src={mainImage}
                  alt={product.productName}
                />
              </MapInteractionCSS>
            </div>
            <Button onClick={resetZoom} style={{ marginBottom: "20px" }}>Đặt lại hình ảnh</Button>
            <div className="d-flex justify-content-center mb-3">
              {product.productImages.map((image, index) => (
                <div
                  key={index}
                  className={`border mx-1 rounded-2 ${mainImage === image.imageURL ? "thumbnail-active" : ""}`}
                  onClick={() => handleThumbnailClick(image.imageURL)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    width={60}
                    height={60}
                    className="rounded-2"
                    src={image.imageURL}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </Col>

          {/* Product Details */}
          <Col xs={24} md={12}>
            <div className="ps-lg-3" style={{ padding: 10 }}>
              <Title level={2} className="title text-dark">
                {product.productName}
              </Title>
              <div className="d-flex flex-row my-3">
                <span className="text-muted">
                  <i className="fas fa-shopping-basket fa-sm mx-1" />
                  {product.quantity}
                </span>
                <span className="text-success ms-2">Trong kho</span>
              </div>
              <div className="mb-3">
                <span className="h5">{product.discountPrice} VND</span>
                <span className="text-muted"> /mỗi hộp</span>
                <p style={{ textDecoration: "line-through", color: "gray" }}>
                  {product.unitPrice} VND
                </p>
              </div>
              {/* <strong>Mô tả:</strong>
              <p dangerouslySetInnerHTML={{ __html: product.description }} /> */}
              <div className="row" style={{ color: "black" }}>
                <div className="row" style={{ fontSize: 25, color: "red" }}>
                  <dt className="col-3">Giảm giá:</dt>
                  <dd className="col-9">{findNameById(product.discountId, discounts)} %</dd>
                </div>
                {/* 
                <dt className="col-3">Danh mục:</dt>
                <dd className="col-9">{findNameById(product.categoryId, categories)}</dd>

                <dt className="col-3">Thành phần:</dt>
                <dd className="col-9">{product.ingredients}</dd>

                <dt className="col-3">Dung tích:</dt>
                <dd className="col-9">{product.netWeight} ml</dd>

                <dt className="col-3">Loại da:</dt>
                <dd className="col-9">{findNameById(product.skinTypeId, skinTypes)}</dd> */}
                <dt className="col-3">Thương hiệu:</dt>
                <dd className="col-9">{findNameById(product.brandId, brands)}</dd>
              </div>
              <hr />
              <div className="row mb-4">
                <div className="col-md-4 col-6 mb-3">
                  <label className="mb-2 d-block">Số lượng</label>
                  <InputNumber
                    defaultValue={1}
                    onChange={(value) => setQuantity(value)}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <Button type="primary" className="btn btn-warning shadow-0" onClick={handleAddToCart} style={{ padding: 5 }} icon={<DollarOutlined />}> Mua ngay</Button>
              <Button type="default" className="btn btn-primary shadow-0 ms-2" onClick={handleAddToCart} style={{ padding: 5 }} icon={<ShoppingCartOutlined />}> Thêm vào giỏ hàng</Button>
              <Button type="default" className="btn btn-light border border-secondary py-2 icon-hover px-3 ms-2" style={{ padding: 5 }} icon={<HeartOutlined style={{ color: "red" }} />}> Yêu thích</Button>
            </div>
          </Col>
        </Row>

        {/* Additional Information */}

        <section className="bg-light border-top py-4">
          <div className="container">
            <div className="row gx-4">
              <div className="col-lg-8 mb-4">
                <div className="tabStyle">
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="Mô tả" key="1">
                      <div className="tabContentStyle">
                        <p dangerouslySetInnerHTML={{ __html: product.description }} />
                      </div>
                    </TabPane>
                    <TabPane tab="Thông số" key="2">
                      <div className="tabContentStyle">
                        <strong>Danh mục:</strong>
                        <p>{findNameById(product.categoryId, categories)}</p>

                        <strong>Dung tích:</strong>
                        <p>{product.netWeight} ml</p>

                        <strong>Thương hiệu:</strong>
                        <p>{findNameById(product.brandId, brands)}</p>

                        <strong>Loại da:</strong>
                        <p>{findNameById(product.skinTypeId, skinTypes)}</p>
                      </div>
                    </TabPane>
                    <TabPane tab="Thành phần" key="3">
                      <div className="tabContentStyle">
                        <p>{product.ingredients}</p>
                      </div>
                    </TabPane>
                    <TabPane tab="Cách dùng" key="4">
                      <div className="tabContentStyle">
                        <p>
                          Some other tab content or sample information now <br />
                          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                    </TabPane>
                  </Tabs>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="px-0 border rounded-2 shadow-0">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Các sản phẩm tương tự</h5>
                      {similarProducts.map((product) => (
                        <div className="d-flex mb-3" key={product.productId}>
                          <a href={`/products/${product.productId}`} className="me-3">
                            <img
                              src={product.productImages[0]?.imageURL}
                              style={{ minWidth: 96, height: 96 }}
                              className="img-md img-thumbnail"
                              alt={product.productName}
                            />
                          </a>
                          <div className="info">
                            <a href={`/products/${product.productId}`} className="nav-link mb-1">
                              {product.productName}
                            </a>
                            <strong className="text-dark"> {product.discountPrice} VND</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-0 border rounded-2 shadow-0 mt-4">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">Gợi ý sản phẩm cùng loại da</h5>
                      {sameSkinTypeProducts.map((product) => (
                        <div className="d-flex mb-3" key={product.productId}>
                          <a href={`/products/${product.productId}`} className="me-3">
                            <img
                              src={product.productImages[0]?.imageURL}
                              style={{ minWidth: 96, height: 96 }}
                              className="img-md img-thumbnail"
                              alt={product.productName}
                            />
                          </a>
                          <div className="info">
                            <a href={`/products/${product.productId}`} className="nav-link mb-1">
                              {product.productName}
                            </a>
                            <strong className="text-dark"> {product.discountPrice} VND</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}