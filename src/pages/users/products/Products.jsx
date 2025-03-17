import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Select,
  Layout,
  Menu,
  Row,
  Col,
  Breadcrumb,
  Modal,
  Table,
  Button,
} from "antd";
// import { ShoppingCartOutlined } from "@ant-design/icons";
import api from "../../../config/api";
import { CartContext } from "../../../context/CartContext";
import ProductCard from "../../../component/productCard/ProductCard";
import { SpaceContext } from "antd/es/space";

const { Option } = Select;
const { Sider, Content, Header } = Layout;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [discounts, setDiscounts] = useState({});
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [discountList, setDiscountList] = useState([]);
  const [compareProducts, setCompareProducts] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);

  const navigate = useNavigate();
  const { cart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSkinTypes();
    fetchDiscounts();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Could not load products. Please try again later.");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSkinTypes = async () => {
    try {
      const response = await api.get("/skin-types");
      setSkinTypes(response.data);
    } catch (error) {
      console.error("Error fetching skin types:", error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await api.get("/discounts");
      const discountMap = response.data.reduce((acc, discount) => {
        acc[discount.discountId] = discount.discountPercent;
        return acc;
      }, {});
      setDiscounts(discountMap);
      setDiscountList(response.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await api.get("/brands");
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    filterProducts(
      query,
      selectedCategory,
      selectedSkinType,
      selectedBrand,
      sortOption,
      selectedDiscount
    );
  };

  const handleSort = (value) => {
    setSortOption(value);
    filterProducts(
      searchTerm,
      selectedCategory,
      selectedSkinType,
      selectedBrand,
      value,
      selectedDiscount
    );
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterProducts(
      searchTerm,
      category,
      selectedSkinType,
      selectedBrand,
      sortOption,
      selectedDiscount
    );
  };

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
    filterProducts(
      searchTerm,
      selectedCategory,
      selectedSkinType,
      brand,
      sortOption,
      selectedDiscount
    );
  };

  const handleSkinTypeSelect = (skintype) => {
    setSelectedSkinType(skintype);
    filterProducts(
      searchTerm,
      selectedCategory,
      skintype,
      selectedBrand,
      sortOption,
      selectedDiscount
    );
  };

  const handleDiscountSelect = (discount) => {
    setSelectedDiscount(discount);
    filterProducts(
      searchTerm,
      selectedCategory,
      selectedSkinType,
      selectedBrand,
      sortOption,
      discount
    );
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
    const skinType1 = skinTypes.find(
      (s) => s.skinTypeId === p1.skinTypeId
    )?.skinName;
    const skinType2 = skinTypes.find(
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

  const filterProducts = (
    search,
    category,
    skintype,
    brand,
    sort,
    discount
  ) => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(search)
      );
    }

    if (category) {
      filtered = filtered.filter((product) => product.categoryId === category);
    }

    if (skintype) {
      filtered = filtered.filter((product) => product.skinTypeId === skintype);
    }

    if (brand) {
      filtered = filtered.filter((product) => product.brandId === brand);
    }

    if (discount) {
      filtered = filtered.filter((product) => product.discountId === discount);
    }

    switch (sort) {
      case "a-z":
        filtered.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "z-a":
        filtered.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case "low-high":
        filtered.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case "high-low":
        filtered.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="container">
      <Layout style={{ minHeight: "100vh" }}>
        <Breadcrumb
          style={{ marginBottom: "20px" }}
          items={[
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
          ]}
        />

        <Header
          style={{
            background: "#fff",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h1>Sản phẩm của Haven Skin</h1>
          {/* <Badge count={cart.length}>
            <ShoppingCartOutlined
              style={{ fontSize: "24px", cursor: "pointer" }}
              onClick={() => navigate("/shopping-cart")}
            />
          </Badge> */}
        </Header>

        <Layout>
          <Sider
            width={250}
            style={{
              background: "#fff",
              padding: "20px",
              border: "1px solid lightgray",
              paddingBottom: 50,
            }}
          >
            <h5 style={{ textAlign: "center", margin: 3 }}>Danh mục</h5>
            <Menu
              style={{ border: "1px solid lightgray" }}
              mode="inline"
              selectedKeys={[selectedCategory]}
              onClick={(e) => handleCategorySelect(e.key)}
              items={[
                { key: "", label: "Tất cả" },
                ...categories.map((category) => ({
                  key: category.categoryId,
                  label: category.categoryName,
                })),
              ]}
            />
            <h5 style={{ textAlign: "center", margin: 3 }}>Loại da</h5>
            <Menu
              style={{ border: "1px solid lightgray" }}
              mode="inline"
              selectedKeys={[selectedSkinType]}
              onClick={(e) => handleSkinTypeSelect(e.key)}
              items={[
                { key: "", label: "Tất cả" },
                ...skinTypes.map((skinType) => ({
                  key: skinType.skinTypeId,
                  label: skinType.skinName,
                })),
              ]}
            />
            <h5 style={{ textAlign: "center", margin: 3 }}>Thương hiệu</h5>
            <Menu
              style={{ border: "1px solid lightgray" }}
              mode="inline"
              selectedKeys={[selectedBrand]}
              onClick={(e) => handleBrandSelect(e.key)}
              items={[
                { key: "", label: "Tất cả" },
                ...brands.map((brand) => ({
                  key: brand.brandId,
                  label: brand.brandName,
                })),
              ]}
            />
            <h5 style={{ textAlign: "center", margin: 3 }}>Giảm giá</h5>
            <Menu
              style={{ border: "1px solid lightgray" }}
              mode="inline"
              selectedKeys={[selectedDiscount]}
              onClick={(e) => handleDiscountSelect(e.key)}
              items={[
                { key: "", label: "Tất cả" },
                ...discountList.map((discount) => ({
                  key: discount.discountId,
                  label: `Giảm ${discount.discountPercent}%`,
                })),
              ]}
            />
          </Sider>

          <Layout>
            <Content style={{ padding: "20px" }}>
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
              >
                <Input
                  placeholder="Tìm sản phẩm..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: "300px" }}
                  suffix={<i className="fa-solid fa-magnifying-glass"></i>}
                />
                <Select
                  placeholder={
                    <span>
                      <i className="fa-solid fa-filter"></i> Lọc sản phẩm
                      theo...
                    </span>
                  }
                  style={{ width: "200px" }}
                  onChange={handleSort}
                  value={sortOption || undefined} // Đảm bảo value là undefined nếu sortOption rỗng
                >
                  <Option value="a-z">A-Z</Option>
                  <Option value="z-a">Z-A</Option>
                  <Option value="low-high">Giá: Thấp - cao</Option>
                  <Option value="high-low">Giá: Cao - thấp</Option>
                </Select>
              </div>

              <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                    <ProductCard
                      product={product}
                      discounts={discounts}
                      brands={brands}
                      onCompareClick={handleCompareClick}
                    />
                  </Col>
                ))}
              </Row>

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
                    Đóng
                  </Button>,
                ]}
                className="compare-modal"
              >
                <style jsx="true">{`
                  .compare-modal .ant-modal-content {
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                  }

                  .compare-modal .ant-modal-header {
                    background: linear-gradient(135deg, #a3d9ff, #7ec2ff);
                    border-bottom: none;
                    padding: 16px 24px;
                  }

                  .compare-modal .ant-modal-title {
                    color: white !important;
                  }

                  .compare-modal .ant-modal-body {
                    padding: 24px;
                    background-color: #fafcff;
                  }

                  .compare-modal .ant-modal-footer {
                    border-top: none;
                    padding: 16px 24px;
                    background-color: #fafcff;
                  }

                  .compare-modal-title {
                    font-size: 22px;
                    font-weight: bold;
                    color: white !important;
                    display: flex;
                    align-items: center;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                  }

                  .compare-info-column {
                    background: linear-gradient(to right, #f0f7ff, #e6f4ff);
                  }

                  .compare-info-cell {
                    font-weight: bold;
                    color: #1a5fb4;
                    padding: 12px 8px;
                    font-size: 15px;
                  }

                  .compare-image-container {
                    display: flex;
                    justify-content: center;
                    padding: 16px;
                    background-color: white;
                    border-radius: 12px;
                    margin: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                    transition: all 0.3s ease;
                  }

                  .compare-image-container:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                  }

                  .compare-product-image {
                    width: 180px;
                    height: 180px;
                    object-fit: contain;
                    border-radius: 8px;
                    transition: transform 0.5s ease;
                  }

                  .compare-product-image:hover {
                    transform: scale(1.08);
                  }

                  .compare-product-name {
                    font-weight: bold;
                    color: #1890ff;
                    font-size: 18px;
                    padding: 10px 0;
                    text-align: center;
                    border-bottom: 2px solid #e6f7ff;
                    margin-bottom: 8px;
                  }

                  .compare-brand,
                  .compare-category,
                  .compare-skin-type {
                    padding: 8px 0;
                    font-size: 15px;
                    color: #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }

                  .compare-brand::before {
                    content: "🏷️";
                    margin-right: 8px;
                  }

                  .compare-category::before {
                    content: "📂";
                    margin-right: 8px;
                  }

                  .compare-skin-type::before {
                    content: "👤";
                    margin-right: 8px;
                  }

                  .compare-original-price {
                    text-decoration: line-through;
                    color: #999;
                    font-size: 14px;
                    text-align: center;
                    padding: 4px 0;
                  }

                  .compare-discount-price {
                    color: #f5222d;
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                    padding: 8px 0;
                    background: linear-gradient(to right, #fff0f0, #fff9f9);
                    border-radius: 8px;
                    margin: 8px 0;
                    box-shadow: 0 2px 6px rgba(245, 34, 45, 0.1);
                  }

                  .compare-description,
                  .compare-ingredients {
                    max-height: 150px;
                    overflow-y: auto;
                    padding: 12px;
                    text-align: justify;
                    line-height: 1.6;
                    background-color: white;
                    border-radius: 8px;
                    margin: 8px 0;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    font-size: 14px;
                    color: #444;
                    border-left: 3px solid #1890ff;
                  }

                  .compare-description::-webkit-scrollbar,
                  .compare-ingredients::-webkit-scrollbar {
                    width: 6px;
                  }

                  .compare-description::-webkit-scrollbar-thumb,
                  .compare-ingredients::-webkit-scrollbar-thumb {
                    background-color: #d9d9d9;
                    border-radius: 3px;
                  }

                  .compare-description::-webkit-scrollbar-track,
                  .compare-ingredients::-webkit-scrollbar-track {
                    background-color: #f5f5f5;
                    border-radius: 3px;
                  }

                  /* Tùy chỉnh bảng */
                  .compare-table {
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                  }

                  .ant-table-thead > tr > th {
                    background: linear-gradient(135deg, #e6f7ff, #bae7ff);
                    color: #0050b3;
                    font-weight: bold;
                    padding: 16px 12px;
                    border-bottom: 2px solid #91caff;
                  }

                  .ant-table-tbody > tr > td {
                    padding: 16px 12px;
                    transition: all 0.3s ease;
                  }

                  .ant-table-tbody > tr:hover > td {
                    background-color: #f0f9ff;
                    transform: translateY(-2px);
                  }

                  .ant-table-tbody > tr:nth-child(even) > td {
                    background-color: #fafcff;
                  }

                  .ant-table-tbody > tr:nth-child(odd) > td {
                    background-color: #ffffff;
                  }

                  /* Button styling */
                  .compare-modal .ant-btn {
                    border-radius: 8px;
                    height: 40px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
                    border: none;
                    background: linear-gradient(135deg, #40a9ff, #1890ff);
                    color: white;
                  }

                  .compare-modal .ant-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
                    background: linear-gradient(135deg, #69c0ff, #40a9ff);
                  }
                `}</style>

                <Table
                  columns={compareColumns}
                  dataSource={getCompareData()}
                  pagination={false}
                  bordered
                  className="compare-table"
                />
              </Modal>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
