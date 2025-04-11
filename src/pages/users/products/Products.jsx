
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Typography
} from "antd";
import { SearchOutlined } from '@ant-design/icons';
import api from "../../../config/api";
import { CartContext } from "../../../context/CartContext";
import ProductCard from "../../../component/productCard/ProductCard";
import "./Products.css";

const { Option } = Select;
const { Sider, Content, Header } = Layout;
const { Title } = Typography;

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
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [visibleCategories, setVisibleCategories] = useState(5);
  const [visibleBrands, setVisibleBrands] = useState(5);
  const [visibleSkinTypes, setVisibleSkinTypes] = useState(5);
  const [visibleDiscounts, setVisibleDiscounts] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [searchParams] = useSearchParams();

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
            {p1.unitPrice.toLocaleString()}₫
          </div>
        ),
        product2: (
          <div className="compare-original-price">
            {p2.unitPrice.toLocaleString()}₫
          </div>
        ),
      },
      {
        key: "7",
        info: "Giá khuyến mãi",
        product1: (
          <div className="compare-discount-price">
            {p1.discountPrice.toLocaleString()}₫
          </div>
        ),
        product2: (
          <div className="compare-discount-price">
            {p2.discountPrice.toLocaleString()}₫
          </div>
        ),
      },
      {
        key: "8",
        info: "Mô tả",
        product1: <div className="compare-description" dangerouslySetInnerHTML={{ __html: p1.description }} />,
        product2: <div className="compare-description" dangerouslySetInnerHTML={{ __html: p2.description }} />,
      },
      {
        key: "9",
        info: "Thành phần",
        product1: <div className="compare-ingredients" dangerouslySetInnerHTML={{ __html: p1.ingredients }}/>,
        product2: <div className="compare-ingredients" dangerouslySetInnerHTML={{ __html: p2.ingredients }}/>,
      },
    ];
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterProducts(value, selectedCategory, selectedSkinType, selectedBrand, selectedDiscount);
  };

  const handleSort = (value) => {
    setSortOption(value);
    filterProducts(searchTerm, selectedCategory, selectedSkinType, selectedBrand, selectedDiscount, value);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setVisibleProducts(12);
    filterProducts(searchTerm, categoryId, selectedSkinType, selectedBrand, selectedDiscount, sortOption);
  };

  const handleSkinTypeSelect = (skinTypeId) => {
    setSelectedSkinType(skinTypeId);
    setVisibleProducts(12);
    filterProducts(searchTerm, selectedCategory, skinTypeId, selectedBrand, selectedDiscount, sortOption);
  };

  const handleBrandSelect = (brandId) => {
    setSelectedBrand(brandId);
    setVisibleProducts(12);
    filterProducts(searchTerm, selectedCategory, selectedSkinType, brandId, selectedDiscount, sortOption);
  };

  const handleDiscountSelect = (discountId) => {
    setSelectedDiscount(discountId);
    setVisibleProducts(12);
    filterProducts(searchTerm, selectedCategory, selectedSkinType, selectedBrand, discountId, sortOption);
  };

  const filterProducts = (searchValue, categoryId, skinTypeId, brandId, discountId, sort) => {
    let filtered = [...products];

    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(product => {
        const productName = product.productName.toLowerCase();
        const productCategory = categories.find(cat => cat.categoryId === product.categoryId);
        const categoryName = productCategory ? productCategory.categoryName.toLowerCase() : '';
        return productName.includes(searchLower) || categoryName.includes(searchLower);
      });
    }

    if (categoryId) {
      filtered = filtered.filter(product => product.categoryId === categoryId);
    }

    if (skinTypeId) {
      filtered = filtered.filter(product => product.skinTypeId === skinTypeId);
    }

    if (brandId) {
      filtered = filtered.filter(product => product.brandId === brandId);
    }

    if (discountId) {
      filtered = filtered.filter(product => product.discountId === discountId);
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

  const handleCompareClick = (product) => {
    if (compareProducts.length < 2) {
      if (!compareProducts.find((p) => p.productId === product.productId)) {
        setCompareProducts([...compareProducts, product]);
        if (compareProducts.length === 1) {
          setIsCompareModalVisible(true);
        }
      }
    } else {
      Modal.warning({
        title: 'Giới hạn so sánh',
        content: 'Chỉ có thể so sánh tối đa 2 sản phẩm cùng lúc!',
      });
    }
  };

  const handleCloseCompare = () => {
    setIsCompareModalVisible(false);
    setCompareProducts([]);
  };

  const handleLoadMore = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 12);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes, skinTypesRes, discountsRes, brandsRes] = await Promise.all([
          api.get("/products/list-name-products"),
          api.get("/categories/list-name-categories"),
          api.get("/skin-types/list-name-skin-types"),
          api.get("/discounts/list-name-discounts"),
          api.get("/brands/list-name-brands")
        ]);

        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setSkinTypes(skinTypesRes.data);
        setBrands(brandsRes.data);

        const discountMap = discountsRes.data.reduce((acc, discount) => {
          acc[discount.discountId] = discount.discountPercent;
          return acc;
        }, {});
        setDiscounts(discountMap);
        setDiscountList(discountsRes.data);

        const searchFromUrl = searchParams.get("search");
        const categoryFromUrl = searchParams.get("category");

        if (searchFromUrl) setSearchTerm(searchFromUrl);
        if (categoryFromUrl) setSelectedCategory(categoryFromUrl);

        if (searchFromUrl || categoryFromUrl) {
          const filtered = productsRes.data.filter((product) => {
            let matchSearch = true;
            let matchCategory = true;

            if (searchFromUrl) {
              const productName = product.productName.toLowerCase();
              const searchValue = searchFromUrl.toLowerCase();
              const productCategory = categoriesRes.data.find(cat => cat.categoryId === product.categoryId);
              const categoryName = productCategory ? productCategory.categoryName.toLowerCase() : '';

              matchSearch = productName.includes(searchValue) || categoryName.includes(searchValue);
            }

            if (categoryFromUrl) {
              matchCategory = product.categoryId === categoryFromUrl;
            }

            return matchSearch && matchCategory;
          });

          setFilteredProducts(filtered);
        } else {
          setFilteredProducts(productsRes.data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setIsLoading(false);
      }
    };

    init();
  }, [searchParams]);

  return (
    
      <div className="product-page-container">
        <Layout style={{ background: 'transparent' }}>
         

          <Header className="product-header">
            <h1>
              Sản phẩm của Haven Skin
            </h1>
            {compareProducts.length > 0 && (
              <Button
                type="primary"
                onClick={() => setIsCompareModalVisible(true)}
                style={{ marginLeft: '20px' }}
              >
                So sánh ({compareProducts.length})
              </Button>
            )}
          </Header>

          <Layout className="product-layout">
            <Sider className="product-sider" width={280}>
              <Title level={4} className="filter-section-title">Danh mục</Title>
              <Menu
                className="product-menu"
                mode="inline"
                selectedKeys={[selectedCategory]}
                onClick={(e) => handleCategorySelect(e.key)}
                items={[
                  { key: "", label: "Tất cả" },
                  ...categories.slice(0, visibleCategories).map((category) => ({
                    key: category.categoryId,
                    label: category.categoryName,
                  })),
                ]}
              />
              {categories.length > 5 && (
                <Button
                  className="view-more-btn"
                  onClick={() => setVisibleCategories(visibleCategories === 5 ? categories.length : 5)}
                >
                  {visibleCategories === 5 ? "Xem thêm..." : "Thu gọn"}
                </Button>
              )}

              <Title level={4} className="filter-section-title">Loại da</Title>
              <Menu
                className="product-menu"
                mode="inline"
                selectedKeys={[selectedSkinType]}
                onClick={(e) => handleSkinTypeSelect(e.key)}
                items={[
                  { key: "", label: "Tất cả" },
                  ...skinTypes.slice(0, visibleSkinTypes).map((skinType) => ({
                    key: skinType.skinTypeId,
                    label: skinType.skinName,
                  })),
                ]}
              />
              {skinTypes.length > 5 && (
                <Button
                  className="view-more-btn"
                  onClick={() => setVisibleSkinTypes(visibleSkinTypes === 5 ? skinTypes.length : 5)}
                >
                  {visibleSkinTypes === 5 ? "Xem thêm..." : "Thu gọn"}
                </Button>
              )}

              <Title level={4} className="filter-section-title">Thương hiệu</Title>
              <Menu
                className="product-menu"
                mode="inline"
                selectedKeys={[selectedBrand]}
                onClick={(e) => handleBrandSelect(e.key)}
                items={[
                  { key: "", label: "Tất cả" },
                  ...brands.slice(0, visibleBrands).map((brand) => ({
                    key: brand.brandId,
                    label: brand.brandName,
                  })),
                ]}
              />
              {brands.length > 5 && (
                <Button
                  className="view-more-btn"
                  onClick={() => setVisibleBrands(visibleBrands === 5 ? brands.length : 5)}
                >
                  {visibleBrands === 5 ? "Xem thêm..." : "Thu gọn"}
                </Button>
              )}

              <Title level={4} className="filter-section-title">Giảm giá</Title>
              <Menu
                className="product-menu"
                mode="inline"
                selectedKeys={[selectedDiscount]}
                onClick={(e) => handleDiscountSelect(e.key)}
                items={[
                  { key: "", label: "Tất cả" },
                  ...discountList.slice(0, visibleDiscounts).map((discount) => ({
                    key: discount.discountId,
                    label: `Giảm ${discount.discountPercent}%`,
                  })),
                ]}
              />
              {discountList.length > 5 && (
                <Button
                  className="view-more-btn"
                  onClick={() => setVisibleDiscounts(visibleDiscounts === 5 ? discountList.length : 5)}
                >
                  {visibleDiscounts === 5 ? "Xem thêm..." : "Thu gọn"}
                </Button>
              )}
            </Sider>

            <Layout>
              <Content className="product-content">
                {isLoading ? (
                  <div className="loading-container">
                    Đang tải sản phẩm...
                  </div>
                ) : (
                  <>
                    <div className="search-filter-container">
                      <Input
                        className="search-input"
                        placeholder="Tìm sản phẩm..."
                        value={searchTerm}
                        onChange={handleSearch}
                        prefix={<SearchOutlined />}
                      />
                      <Select
                        className="filter-select"
                        placeholder="Lọc sản phẩm theo..."
                        onChange={handleSort}
                        value={sortOption || undefined}
                      >
                        <Option value="a-z">A-Z</Option>
                        <Option value="z-a">Z-A</Option>
                        <Option value="low-high">Giá: Thấp - cao</Option>
                        <Option value="high-low">Giá: Cao - thấp</Option>
                      </Select>
                    </div>

                    <Row className="product-grid" gutter={[20, 20]}>
                      {filteredProducts.slice(0, visibleProducts).map((product) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                          <ProductCard
                            product={product}
                            discounts={discounts}
                            brands={brands}
                            onCompareClick={handleCompareClick}
                            isComparing={compareProducts.some(p => p.productId === product.productId)}
                          />
                        </Col>
                      ))}
                    </Row>

                    {filteredProducts.length > visibleProducts && (
                      <div style={{ textAlign: "center", marginTop: "30px" }}>
                        <Button
                          className="load-more-btn"
                          onClick={handleLoadMore}
                        >
                          Xem thêm sản phẩm
                        </Button>
                      </div>
                    )}

                    <Modal
                      className="compare-modal"
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
                    >
                      <Table
                        className="compare-table"
                        columns={compareColumns}
                        dataSource={getCompareData()}
                        pagination={false}
                        bordered
                      />
                    </Modal>
                  </>
                )}
              </Content>
            </Layout>
          </Layout>
        </Layout>
      </div>
    
  );
}