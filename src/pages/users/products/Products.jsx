import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Layout, Menu, Badge, Row, Col, Breadcrumb } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
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
  const [discounts, setDiscounts] = useState({});

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
    filterProducts(query, selectedCategory, selectedSkinType, sortOption);
  };

  const handleSort = (value) => {
    setSortOption(value);
    filterProducts(searchTerm, selectedCategory, selectedSkinType, value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category, selectedSkinType, sortOption);
  };

  const handleSkinTypeSelect = (skintype) => {
    setSelectedSkinType(skintype);
    filterProducts(searchTerm, selectedCategory, skintype, sortOption);
  };

  const filterProducts = (search, category, skintype, sort) => {
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
            { title: "Trang chủ", onClick: () => navigate("/"), style: { cursor: "pointer" } },
            { title: "Sản phẩm", onClick: () => navigate("/products"), style: { cursor: "pointer" } },
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
                { key: "", label: "All" },
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
                { key: "", label: "All" },
                ...skinTypes.map((skinType) => ({
                  key: skinType.skinTypeId,
                  label: skinType.skinName,
                })),
              ]}
            />
          </Sider>

          <Layout>
            <Content style={{ padding: "20px" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
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
                  <Option value="low-high">Price: Low to High</Option>
                  <Option value="high-low">Price: High to Low</Option>
                </Select>
              </div>

              <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product.productId} >
                    <ProductCard
                      product={product}
                      discounts={discounts}
                      brands={brands}
                    />
                  </Col>
                ))}
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}