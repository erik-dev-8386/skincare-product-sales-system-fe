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
} from "antd";
// import { ShoppingCartOutlined } from "@ant-design/icons";
import api from "../../../config/api";
import { CartContext } from "../../../context/CartContext";
import ProductCard from "../../../component/productCard/ProductCard";

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
        info: "Giá gốc",
        product1: `${p1.unitPrice.toLocaleString()}đ`,
        product2: `${p2.unitPrice.toLocaleString()}đ`,
      },
      {
        key: "6",
        info: "Giá khuyến mãi",
        product1: `${p1.discountPrice.toLocaleString()}đ`,
        product2: `${p2.discountPrice.toLocaleString()}đ`,
      },
      {
        key: "7",
        info: "Mô tả",
        product1: p1.description,
        product2: p2.description,
      },
      {
        key: "8",
        info: "Thành phần",
        product1: p1.ingredients,
        product2: p2.ingredients,
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
          <h1 style={{ color: "#333" }}>Sản phẩm của Haven Skin</h1>
          {/* <Badge count={cart.length}>
            <ShoppingCartOutlined
              style={{ fontSize: "24px", cursor: "pointer" }}
              onClick={() => navigate("/shopping-cart")}
            />
          </Badge> */}
        </Header>

        <Layout>
          <Sider width={250} style={{ background: "#fff", padding: "20px" }}>
            <h4>Danh mục</h4>
            <Menu
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
            <h4>Loại da</h4>
            <Menu
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
            <h4>Thương hiệu</h4>
            <Menu
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
            <h4>Giảm giá</h4>
            <Menu
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
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ width: "300px" }}
                />
                <Select
                  placeholder="Sort by"
                  style={{ width: "200px" }}
                  onChange={handleSort}
                  value={sortOption}
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
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
