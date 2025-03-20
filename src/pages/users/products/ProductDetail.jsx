import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Breadcrumb, Row, Col, Typography, Divider, InputNumber, Tabs, } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import api from "../../../config/api";
import "./ProductDetail.css";
import { MapInteractionCSS } from "react-map-interaction";
import { CartContext } from "../../../context/CartContext";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom"; // Import Link
import { jwtDecode } from "jwt-decode"; // Sửa cách import jwt-decode

const { Title } = Typography;

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
  const { addToCart } = useContext(CartContext);
  const [showAllSimilar, setShowAllSimilar] = useState(false);
  const [showAllSkinType, setShowAllSkinType] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [displayCountReviews, setDisplayCountReviews] = useState(4);

  // Số lượng sản phẩm hiển thị ban đầu

  const [displayCountSimilar, setDisplayCountSimilar] = useState(4); // Số lượng sản phẩm tương tự hiển thị ban đầu
  const [displayCountSkinType, setDisplayCountSkinType] = useState(4); // Số lượng sản phẩm cùng loại da hiển thị ban đầu

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Fetch chi tiết sản phẩm
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setMainImage(response.data.productImages[0]?.imageURL);

        // Fetch tất cả sản phẩm
        const allProductsResponse = await api.get("/products");
        const allProducts = allProductsResponse.data;

        // Lọc sản phẩm tương tự (cùng categoryId)
        const similarProducts = allProducts.filter(
          (p) => p.categoryId === response.data.categoryId && p.productId !== id
        );
        setSimilarProducts(similarProducts);

        // Lọc sản phẩm cùng loại da (cùng skinTypeId)
        const sameSkinTypeProducts = allProducts.filter(
          (p) => p.skinTypeId === response.data.skinTypeId && p.productId !== id
        );
        setSameSkinTypeProducts(sameSkinTypeProducts);
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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/product/${id}`);
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  const findNameById = (id, data) => {
    const item = data.find(
      (item) =>
        item.brandId === id ||
        item.skinTypeId === id ||
        item.categoryId === id ||
        item.discountId === id
    );
    return item
      ? item.brandName ||
      item.skinName ||
      item.categoryName ||
      item.discountPercent
      : "Loading...";
  };

  const handleAddToCart = () => {
    console.log("Đang thêm sản phẩm vào giỏ hàng:", product);

    // Kiểm tra token trước khi thêm vào giỏ hàng
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    // Thêm sản phẩm vào giỏ hàng
    addToCart({
      ...product,
      quantity,
    });

    // Lưu trực tiếp vào localStorage để đảm bảo dữ liệu được lưu
    try {
      const decoded = jwtDecode(token);
      const email = decoded.sub;
      if (email) {
        const cartKey = `cart_${email}`;
        const savedCart = localStorage.getItem(cartKey);
        let updatedCart = [];

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          const existingProduct = parsedCart.find(
            (item) => item.productId === product.productId
          );

          if (existingProduct) {
            updatedCart = parsedCart.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            updatedCart = [...parsedCart, { ...product, quantity }];
          }
        } else {
          updatedCart = [{ ...product, quantity }];
        }

        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        console.log("Đã lưu giỏ hàng trực tiếp vào localStorage:", updatedCart);
      }
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng vào localStorage:", error);
    }

    toast.success(`Đã thêm ${product.productName} vào giỏ hàng thành công!`);
  };

  const handleAddToCartAndNavigate = () => {
    console.log("Đang thêm sản phẩm vào giỏ hàng và chuyển hướng:", product);

    // Kiểm tra token trước khi thêm vào giỏ hàng
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      // navigate("/login-and-signup")
      setTimeout(() => {
        navigate("/login-and-signup");
      }, 3000);
      return;
    }

    // Thêm sản phẩm vào giỏ hàng
    addToCart({
      ...product,
      quantity,
    });

    // Lưu trực tiếp vào localStorage để đảm bảo dữ liệu được lưu
    try {
      const decoded = jwtDecode(token);
      const email = decoded.sub;
      if (email) {
        const cartKey = `cart_${email}`;
        const savedCart = localStorage.getItem(cartKey);
        let updatedCart = [];

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          const existingProduct = parsedCart.find(
            (item) => item.productId === product.productId
          );

          if (existingProduct) {
            updatedCart = parsedCart.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            updatedCart = [...parsedCart, { ...product, quantity }];
          }
        } else {
          updatedCart = [{ ...product, quantity }];
        }

        localStorage.setItem(cartKey, JSON.stringify(updatedCart));
        console.log("Đã lưu giỏ hàng trực tiếp vào localStorage:", updatedCart);
      }
    } catch (error) {
      console.error("Lỗi khi lưu giỏ hàng vào localStorage:", error);
    }

    navigate("/shopping-cart");

  };

  const handleThumbnailClick = (imageURL) => {
    setMainImage(imageURL);
  };

  const resetZoom = () => {
    setValue({ scale: 1, translation: { x: 0, y: 0 } }); // Reset zoom and translation
  };

  if (loading || !product) return <p>Loading...</p>;

  // Define breadcrumb items
  const breadcrumbItems = [
    {
      title: "Trang chủ",
      onClick: () => navigate("/"),
      style: { cursor: "pointer" },
    },
    {
      title: "Sản phẩm",
      onClick: () => navigate("/products"),
      style: { cursor: "pointer" },
    },
    {
      title: product.productName,
    },
  ];

  // Define tabs using the `items` prop
  const tabItems = [
    {
      key: "1",
      label: "Mô tả",
      children: (
        <div className="tabContentStyle">
          <p dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Thông số",
      children: (
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
      ),
    },
    {
      key: "3",
      label: "Thành phần",
      children: (
        <div className="tabContentStyle">
          <p>{product.ingredients}</p>
        </div>
      ),
    },
    {
      key: "4",
      label: "Cách dùng",
      children: (
        <div className="tabContentStyle">
          <p dangerouslySetInnerHTML={{ __html: product.usageInstruction }} />
        </div>
      ),
    },
    {
      key: "5",
      label: "Đánh giá",
      children: (
        <div className="tabContentStyle">
          {/* Thêm phần đánh giá sản phẩm */}
          <div className="mt-4">
                    <h3>Đánh giá sản phẩm</h3>
                    <div className="d-flex align-items-center mb-3">
                      <span className="h2 me-2">4.9</span>
                      <div className="d-flex flex-column">
                        <div className="d-flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-warning">★</span>
                          ))}
                        </div>
                        <span className="text-muted">80 nhận xét</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center">
                        <span className="me-2">5 sao</span>
                        <progress className="flex-grow-1" value="73" max="80"></progress>
                        <span className="ms-2">73</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="me-2">4 sao</span>
                        <progress className="flex-grow-1" value="7" max="80"></progress>
                        <span className="ms-2">7</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="me-2">3 sao</span>
                        <progress className="flex-grow-1" value="0" max="80"></progress>
                        <span className="ms-2">0</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="me-2">2 sao</span>
                        <progress className="flex-grow-1" value="0" max="80"></progress>
                        <span className="ms-2">0</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="me-2">1 sao</span>
                        <progress className="flex-grow-1" value="0" max="80"></progress>
                        <span className="ms-2">0</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <Button type="primary" onClick={() => setShowAllReviews(!showAllReviews)}>
                        {showAllReviews ? "Ẩn bớt" : "Xem tất cả"}
                      </Button>
                    </div>
                    {reviews.slice(0, showAllReviews ? reviews.length : displayCountReviews).map((review, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex align-items-center">
                          <span className="me-2">{review.rating} sao</span>
                          <span className="text-muted">{review.date}</span>
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))}
                    {reviews.length > displayCountReviews && !showAllReviews && (
                      <Button
                        type="link"
                        onClick={() => setDisplayCountReviews(displayCountReviews + 4)}
                        style={{ width: '100%', marginTop: '10px' }}
                      >
                        Xem thêm
                      </Button>
                    )}
                  </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <ToastContainer />
      <div className="container">
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
          {/* Breadcrumb with `items` prop */}
          <Breadcrumb
            style={{ marginBottom: "20px" }}
            items={breadcrumbItems}
          />

          <Row gutter={32}>
            {/* Product Image */}
            <Col xs={24} md={12}>
              <div className="border rounded-4 mb-3 d-flex justify-content-center">
                <MapInteractionCSS value={value} onChange={setValue}>
                  <img
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100vh",
                      margin: "auto",
                      width: "800px",
                      height: "400px",
                    }}
                    className="rounded-4 fit"
                    src={mainImage}
                    alt={product.productName}
                  />
                </MapInteractionCSS>
              </div>
              <Button onClick={resetZoom} style={{ marginBottom: "20px" }}>
                Đặt lại hình ảnh
              </Button>
              <div className="d-flex justify-content-center mb-3">
                {product.productImages.map((image, index) => (
                  <div
                    key={index}
                    className={`border mx-1 rounded-2 ${mainImage === image.imageURL ? "thumbnail-active" : ""
                      }`}
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
                <p style={{ color: "red" }}>
                  <strong style={{ color: "black" }}>Đã bán: </strong>
                  {product.soldQuantity}
                </p>
                <div className="mb-3">
                  <span className="h5">
                    {formatPrice(product.discountPrice)}
                    <span style={{ textDecoration: "underline" }}>đ</span>
                  </span>
                  <span className="text-muted"> /mỗi hộp</span>
                </div>
                {product.discountId && ( // Chỉ hiển thị unitPrice khi có discount
                  <p style={{ textDecoration: "line-through", color: "gray" }}>
                    {formatPrice(product.unitPrice)}
                    <span style={{ textDecoration: "underline" }}>đ</span>
                  </p>
                )}

                <div className="row" style={{ color: "black" }}>
                  <div className="row" style={{ fontSize: 25, color: "red" }}>
                    <dt className="col-3">Giảm giá:</dt>
                    <dd className="col-9">
                      {product.discountId ? `${findNameById(product.discountId, discounts)} %` : "Không có giảm giá"}
                    </dd>
                  </div>

                  <dt className="col-3">Thương hiệu:</dt>
                  <dd className="col-9">
                    {findNameById(product.brandId, brands)}
                  </dd>
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
                <Button

                  className="button-buy"
                  onClick={handleAddToCartAndNavigate}

                  icon={<DollarOutlined />}
                >

                  Mua ngay
                </Button>
                <Button

                  className="button-add-to-card"
                  onClick={handleAddToCart}
                  style={{ padding: 5 }}
                  icon={<ShoppingCartOutlined />}
                >

                  Thêm vào giỏ hàng
                </Button>
                <Button
                  className="button-like"
                  style={{ padding: 5 }}
                  icon={<HeartOutlined />}
                >

                  Yêu thích
                </Button>
              </div>
            </Col>
          </Row>

          {/* Additional Information */}
          <section className="bg-light border-top py-4">
            <div className="container">
              <div className="row gx-4">
                <div className="col-lg-8 mb-4">
                  <div className="tabStyle">
                    <Tabs defaultActiveKey="1" items={tabItems} />
                  </div>
                  
                </div>
                <div className="col-lg-4">
                  <div className="px-0 border rounded-2 shadow-0">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Các sản phẩm tương tự</h5>
                        {similarProducts.slice(0, displayCountSimilar).map((product) => (
                          <div className="d-flex mb-3" key={product.productId}>
                            <Link
                              to={`/products/${product.productId}`}
                              className="me-3"
                            >
                              <img
                                src={product.productImages[0]?.imageURL}
                                style={{ width: 150, height: 100 }}
                                className="img-md img-thumbnail"
                                alt={product.productName}
                              />
                            </Link>
                            <div className="info">
                              <Link
                                to={`/products/${product.productId}`}
                                className="nav-link mb-1"
                              >
                                {product.productName}
                              </Link>
                              <strong className="text-dark">
                                {product.discountPrice}
                                <span style={{ textDecoration: "underline" }}>
                                  đ
                                </span>
                              </strong>
                            </div>
                          </div>
                        ))}
                        {similarProducts.length > displayCountSimilar && (
                          <Button
                            type="link"
                            onClick={() => setDisplayCountSimilar(displayCountSimilar + 4)} // Tăng số lượng hiển thị lên 4
                            style={{ width: '100%', marginTop: '10px' }}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-0 border rounded-2 shadow-0 mt-4">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">Gợi ý sản phẩm cùng loại da</h5>
                        {sameSkinTypeProducts.slice(0, displayCountSkinType).map((product) => (
                          <div className="d-flex mb-3" key={product.productId}>
                            <Link
                              to={`/products/${product.productId}`}
                              className="me-3"
                            >
                              <img
                                src={product.productImages[0]?.imageURL}
                                style={{ width: 150, height: 100 }}
                                className="img-md img-thumbnail"
                                alt={product.productName}
                              />
                            </Link>
                            <div className="info">
                              <Link
                                to={`/products/${product.productId}`}
                                className="nav-link mb-1"
                              >
                                {product.productName}
                              </Link>
                              <strong className="text-dark">
                                {product.discountPrice}
                                <span style={{ textDecoration: "underline" }}>
                                  đ
                                </span>
                              </strong>
                            </div>
                          </div>
                        ))}
                        {sameSkinTypeProducts.length > displayCountSkinType && (
                          <Button
                            type="link"
                            onClick={() => setDisplayCountSkinType(displayCountSkinType + 4)}
                            style={{ width: '100%', marginTop: '10px' }}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
