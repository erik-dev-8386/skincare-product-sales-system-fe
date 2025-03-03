// import React, { useEffect, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {Card,Button,Input,Select,Layout,Menu,Badge,Row,Col,Breadcrumb} from "antd";
// import { ShoppingCartOutlined } from "@ant-design/icons";
// import api from "../../../config/api";
// import { CartContext } from "../../../context/CartContext"; // Import CartContext

// const { Meta } = Card;
// const { Option } = Select;
// const { Sider, Content, Header } = Layout;

// export default function Products() {
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [skinTypes, setSkinTypes] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedSkinType, setSelectedSkinType] = useState("");
//   const [discounts, setDiscounts] = useState({}); // Store discounts by discountId

//   const navigate = useNavigate();
//   const { cart, addToCart } = useContext(CartContext); // Use CartContext

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//     fetchSkinTypes();
//     fetchDiscounts(); // Fetch all discounts
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await api.get("/products");
//       setProducts(response.data);
//       setFilteredProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       alert("Could not load products. Please try again later.");
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await api.get("/categories");
//       setCategories(response.data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchSkinTypes = async () => {
//     try {
//       const response = await api.get("/skin-types");
//       setSkinTypes(response.data);
//     } catch (error) {
//       console.error("Error fetching skin types:", error);
//     }
//   };

//   const fetchDiscounts = async () => {
//     try {
//       const response = await api.get("/discounts");
//       const discountMap = response.data.reduce((acc, discount) => {
//         acc[discount.discountId] = discount.discountPercent; // Map discountId to discountPercent
//         return acc;
//       }, {});
//       setDiscounts(discountMap);
//     } catch (error) {
//       console.error("Error fetching discounts:", error);
//     }
//   };

//   const handleSearch = (event) => {
//     const query = event.target.value.toLowerCase();
//     setSearchTerm(query);
//     filterProducts(query, selectedCategory, selectedSkinType, sortOption);
//   };

//   const handleSort = (value) => {
//     setSortOption(value);
//     filterProducts(searchTerm, selectedCategory, selectedSkinType, value);
//   };

//   const handleCategorySelect = (category) => {
//     setSelectedCategory(category);
//     filterProducts(searchTerm, category, selectedSkinType, sortOption);
//   };

//   const handleSkinTypeSelect = (skintype) => {
//     setSelectedSkinType(skintype);
//     filterProducts(searchTerm, selectedCategory, skintype, sortOption);
//   };

//   const filterProducts = (search, category, skintype, sort) => {
//     let filtered = [...products];

//     if (search) {
//       filtered = filtered.filter((product) =>
//         product.productName.toLowerCase().includes(search)
//       );
//     }

//     if (category) {
//       filtered = filtered.filter((product) => product.categoryId === category);
//     }

//     if (skintype) {
//       filtered = filtered.filter((product) => product.skinTypeId === skintype);
//     }

//     switch (sort) {
//       case "a-z":
//         filtered.sort((a, b) => a.productName.localeCompare(b.productName));
//         break;
//       case "z-a":
//         filtered.sort((a, b) => b.productName.localeCompare(a.productName));
//         break;
//       case "low-high":
//         filtered.sort((a, b) => a.discountPrice - b.discountPrice);
//         break;
//       case "high-low":
//         filtered.sort((a, b) => b.discountPrice - a.discountPrice);
//         break;
//       default:
//         break;
//     }

//     setFilteredProducts(filtered);
//   };

//   // const handleAddToCart = (product) => {
//   //   addToCart(product); // Add product to cart
//   //   alert(`${product.productName} added to cart!`);
//   // };

//   const handleAddToCart = (product) => {
//     addToCart({
//       ...product,
//       quantity: 1, // Add initial quantity
//     });
//     alert(`${product.productName} added to cart!`);
//   };
//   return (
//     <div className="container">
//       <Layout style={{ minHeight: "100vh" }}>
//       <Breadcrumb style={{ marginBottom: "20px" }}>
//           <Breadcrumb.Item onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Trang chủ</Breadcrumb.Item>
//           <Breadcrumb.Item onClick={() => navigate("/products")} style={{ cursor: "pointer" }}>Sản phẩm</Breadcrumb.Item>

//         </Breadcrumb>
//         <Header
//           style={{
//             background: "#fff",
//             padding: "10px 20px",
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <h1 style={{ color: "#333" }}>Sản phẩm của Haven Skin</h1>
//           <Badge count={cart.length}>
//             <ShoppingCartOutlined
//               style={{ fontSize: "24px", cursor: "pointer" }}
//               onClick={() => navigate("/shopping-cart")}
//             />
//           </Badge>
//         </Header>

//         <Layout>
//           <Sider width={250} style={{ background: "#fff", padding: "20px" }}>
//             <h4>Danh mục</h4>
//             <Menu
//               mode="inline"
//               selectedKeys={[selectedCategory]}
//               onClick={(e) => handleCategorySelect(e.key)}
//             >
//               <Menu.Item key="">All</Menu.Item>
//               {categories.map((category) => (
//                 <Menu.Item key={category.categoryId}>
//                   {category.categoryName}
//                 </Menu.Item>
//               ))}
//             </Menu>
//             <h4>Loại da</h4>
//             <Menu
//               mode="inline"
//               selectedKeys={[selectedSkinType]}
//               onClick={(e) => handleSkinTypeSelect(e.key)}
//             >
//               <Menu.Item key="">All</Menu.Item>
//               {skinTypes.map((skinType) => (
//                 <Menu.Item key={skinType.skinTypeId}>
//                   {skinType.skinName}
//                 </Menu.Item>
//               ))}
//             </Menu>
//           </Sider>

//           <Layout>
//             <Content style={{ padding: "20px" }}>
//               <div
//                 style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
//               >
//                 <Input
//                   placeholder="Search for products..."
//                   value={searchTerm}
//                   onChange={handleSearch}
//                   style={{ width: "300px" }}
//                 />
//                 <Select
//                   placeholder="Sort by"
//                   style={{ width: "200px" }}
//                   onChange={handleSort}
//                   value={sortOption}
//                 >
//                   <Option value="a-z">A-Z</Option>
//                   <Option value="z-a">Z-A</Option>
//                   <Option value="low-high">Price: Low to High</Option>
//                   <Option value="high-low">Price: High to Low</Option>
//                 </Select>
//               </div>

//               <Row gutter={[16, 16]}>
//                 {filteredProducts.map((product) => (
//                   <Col xs={24} sm={12} md={8} lg={6} key={product.productId} onClick={() => navigate(`/products/${product.productId}`)}>
//                     <Card
//                       hoverable
//                       cover={[
//                         <p style={{padding: 2,marginLeft: "79%",
//                            backgroundColor: "red", color: "white", width: 50,
//                             borderRadius: "5px"}}><i class="fa-solid fa-down-long"></i> {discounts[product.discountId] || 0}%</p>,
//                         <img
//                           alt={product.productName}
//                           src={product.productImages[0]?.imageURL}
//                           style={{
//                             height: "200px",
//                             objectFit: "contain",
//                             padding: 2,
//                           }}
//                         />
//                       ]}
//                     >
//                       <Meta
//                         title={product.productName}
//                         description={
//                           <>
//                             <strong>{product.discountPrice}VND</strong>
//                             <br />
//                             <p
//                               style={{
//                                 textDecoration: "line-through",
//                                 color: "red",
//                               }}
//                             >
//                               {product.unitPrice}VND
//                             </p>
//                             {/* <br /> */}
//                             {/* <p>
//                               Giảm giá: {discounts[product.discountId] || 0}%
//                             </p>{" "} */}
//                           </>
//                         }
//                       />
//                       <Button
//                         type="primary"
//                         onClick={() => handleAddToCart(product)}
//                       >
//                         Add to Cart
//                       </Button>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             </Content>
//           </Layout>
//         </Layout>
//       </Layout>
//     </div>
//   );
// }

//=======================================================================================

import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Layout, Menu, Badge, Row, Col, Breadcrumb } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import api from "../../../config/api";
import { CartContext } from "../../../context/CartContext";
import ProductCard from "../../../component/productCard/ProductCard"; // Import ProductCard component

const { Option } = Select;
const { Sider, Content, Header } = Layout;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [brands, setBrands] = useState([]); // Thêm state brands
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [discounts, setDiscounts] = useState({});

  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSkinTypes();
    fetchDiscounts();
    fetchBrands(); // Thêm hàm fetchBrands
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

  // const handleAddToCart = (product) => {
  //   addToCart({
  //     ...product,
  //     quantity: 1,
  //   });
  //   alert(`${product.productName} added to cart!`);
  // };

  return (
    <div className="container">
      <Layout style={{ minHeight: "100vh" }}>
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => navigate("/products")}
            style={{ cursor: "pointer" }}
          >
            Sản phẩm
          </Breadcrumb.Item>
        </Breadcrumb>
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
            >
              <Menu.Item key="">All</Menu.Item>
              {categories.map((category) => (
                <Menu.Item key={category.categoryId}>
                  {category.categoryName}
                </Menu.Item>
              ))}
            </Menu>
            <h4>Loại da</h4>
            <Menu
              mode="inline"
              selectedKeys={[selectedSkinType]}
              onClick={(e) => handleSkinTypeSelect(e.key)}
            >
              <Menu.Item key="">All</Menu.Item>
              {skinTypes.map((skinType) => (
                <Menu.Item key={skinType.skinTypeId}>
                  {skinType.skinName}
                </Menu.Item>
              ))}
            </Menu>
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
                  <Option value="low-high">Price: Low to High</Option>
                  <Option value="high-low">Price: High to Low</Option>
                </Select>
              </div>

              <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                    <ProductCard
                      product={product}
                      discounts={discounts}
                      brands={brands} // Truyền brands vào ProductCard
                      // handleAddToCart={handleAddToCart}
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
