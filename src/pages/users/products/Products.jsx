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
} from "antd";
import api from "../../../config/api";
import { CartContext } from "../../../context/CartContext";
import ProductCard from "../../../component/productCard/ProductCard";
import "./Products.css"

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
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [visibleCategories, setVisibleCategories] = useState(5);
  const [visibleBrands, setVisibleBrands] = useState(5);
  const [visibleSkinTypes, setVisibleSkinTypes] = useState(5);
  const [visibleDiscounts, setVisibleDiscounts] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { cart } = useContext(CartContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        // Fetch tất cả data cần thiết
        const [productsRes, categoriesRes, skinTypesRes, discountsRes, brandsRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/skin-types"),
          api.get("/discounts"),
          api.get("/brands")
        ]);

        // Set state cho tất cả data
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setSkinTypes(skinTypesRes.data);
        setBrands(brandsRes.data);
        
        // Xử lý discounts
        const discountMap = discountsRes.data.reduce((acc, discount) => {
          acc[discount.discountId] = discount.discountPercent;
          return acc;
        }, {});
        setDiscounts(discountMap);
        setDiscountList(discountsRes.data);

        // Lấy params từ URL
        const searchFromUrl = searchParams.get("search");
        const categoryFromUrl = searchParams.get("category");

        // Set state cho search và category nếu có
        if (searchFromUrl) {
          setSearchTerm(searchFromUrl);
        }
        if (categoryFromUrl) {
          setSelectedCategory(categoryFromUrl);
        }

        // Nếu có search hoặc category, filter products
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
          // Nếu không có search params, hiển thị tất cả sản phẩm
          setFilteredProducts(productsRes.data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setIsLoading(false);
      }
    };

    init();
  }, [searchParams]); // Chỉ phụ thuộc vào searchParams

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    if (searchParams.get("search")) {
      filterProducts(
        query,
        selectedCategory,
        selectedSkinType,
        selectedBrand,
        sortOption,
        selectedDiscount
      );
    }
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

  const handleLoadMore = () => {
    setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 12);
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
        product1: <div className="compare-description"  dangerouslySetInnerHTML={{ __html: p1.description }}/>,
        
        product2: <div className="compare-description" dangerouslySetInnerHTML={{ __html: p2.description }}/>,
      },
      {
        key: "9",
        info: "Thành phần",
        product1: <div className="compare-ingredients">{p1.ingredients}</div>,
        product2: <div className="compare-ingredients">{p2.ingredients}</div>,
      },
    ];
  };

  const filterProducts = (search, category, skintype, brand, sort, discount) => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((product) => {
        const productName = product.productName.toLowerCase();
        const searchValue = search.toLowerCase();
        
        const matchName = productName.includes(searchValue);
        
        const productCategory = categories.find(cat => cat.categoryId === product.categoryId);
        const matchCategory = productCategory && 
          productCategory.categoryName.toLowerCase().includes(searchValue);
        
        return matchName || matchCategory;
      });
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
    setVisibleProducts(12);
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
                ...categories.slice(0, visibleCategories).map((category) => ({
                  key: category.categoryId,
                  label: category.categoryName,
                })),
              ]}
            />
            {categories.length > 5 && (
              <Button
                type="link"
                block
                onClick={() =>
                  setVisibleCategories(
                    visibleCategories === 5 ? categories.length : 5
                  )
                }
                style={{ marginTop: 8 }}
              >
                {visibleCategories === 5 ? "Xem thêm..." : "Thu gọn"}
              </Button>
            )}

            <h5 style={{ textAlign: "center", margin: 3 }}>Loại da</h5>
            <Menu
              style={{ border: "1px solid lightgray" }}
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
                type="link"
                block
                onClick={() =>
                  setVisibleSkinTypes(
                    visibleSkinTypes === 5 ? skinTypes.length : 5
                  )
                }
                style={{ marginTop: 8 }}
              >
                {visibleSkinTypes === 5 ? "Xem thêm..." : "Thu gọn"}
              </Button>
            )}

            <h5 style={{ textAlign: "center", margin: 3 }}>Thương hiệu</h5>
            <Menu
              style={{ border: "1px solid lightgray" }}
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
                type="link"
                block
                onClick={() =>
                  setVisibleBrands(visibleBrands === 5 ? brands.length : 5)
                }
                style={{ marginTop: 8 }}
              >
                {visibleBrands === 5 ? "Xem thêm..." : "Thu gọn"}
              </Button>
            )}

            <h5 style={{ textAlign: "center", margin: 3 }}>Giảm giá</h5>
            <Menu
              style={{ border: "1px solid lightgray" }}
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
                type="link"
                block
                onClick={() =>
                  setVisibleDiscounts(
                    visibleDiscounts === 5 ? discountList.length : 5
                  )
                }
                style={{ marginTop: 8 }}
              >
                {visibleDiscounts === 5 ? "Xem thêm..." : "Thu gọn"}
              </Button>
            )}
          </Sider>

          <Layout>
            <Content style={{ padding: "20px" }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  Đang tải sản phẩm...
                </div>
              ) : (
                <>
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
                      value={sortOption || undefined}
                    >
                      <Option value="a-z">A-Z</Option>
                      <Option value="z-a">Z-A</Option>
                      <Option value="low-high">Giá: Thấp - cao</Option>
                      <Option value="high-low">Giá: Cao - thấp</Option>
                    </Select>
                  </div>

                  <Row gutter={[16, 16]}>
                    {filteredProducts.slice(0, visibleProducts).map((product) => (
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

                  {filteredProducts.length > visibleProducts && (
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <Button type="primary" onClick={handleLoadMore}>
                        Xem thêm
                      </Button>
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
                </>
              )}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
