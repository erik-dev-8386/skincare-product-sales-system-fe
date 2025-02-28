// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Card, Button, Breadcrumb, Row, Col, Typography, Rate, Divider } from "antd";
// import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;

// export default function ProductDetail() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`https://fakestoreapi.com/products/${id}`)
//       .then((response) => setProduct(response.data))
//       .catch((error) => console.error("Error fetching product:", error));
//   }, [id]);

//   const handleAddToCart = () => {
//     alert(`${product.title} added to cart!`);
//   };

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="container">
//     <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
//       <Breadcrumb style={{ marginBottom: "20px" }}>
//         <Breadcrumb.Item onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</Breadcrumb.Item>
//         <Breadcrumb.Item>Products</Breadcrumb.Item>
//         <Breadcrumb.Item>{product.title}</Breadcrumb.Item>
//       </Breadcrumb>

//       <Row gutter={32}>
//         {/* Product Image */}
//         <Col xs={24} md={10}>
//           <Card hoverable cover={<img alt={product.title} src={product.image} style={{ width: "100%", objectFit: "contain" }} />} />
//         </Col>

//         {/* Product Details */}
//         <Col xs={24} md={14}>
//           <Title level={2}>{product.title}</Title>
//           <Rate allowHalf defaultValue={Math.random() * (5 - 3) + 3} />
//           <Divider />
//           <Title level={4} style={{ color: "#ff4d4f" }}>
//             ${product.price} <Text delete style={{ color: "gray", marginLeft: "10px" }}>${(product.price * 1.2).toFixed(2)}</Text>
//           </Title>
//           <p>{product.description}</p>
//           <Divider />
//           <Row gutter={16}>
//             <Col>
//               <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
//                 Add to Cart
//               </Button>
//             </Col>
//             <Col>
//               <Button type="danger" size="large">Buy Now</Button>
//             </Col>
//           </Row>
//           <Divider />
//           <Button type="link" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>Back</Button>
//         </Col>
//       </Row>
//     </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Breadcrumb, Row, Col, Typography, Rate, Divider } from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import api from "../../../config/api"

const { Title, Text } = Typography;

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`); // Update this URL
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    alert(`${product.productName} added to cart!`); // Updated to use productName
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="container">
      <div style={{ maxWidth: "1200px", margin: "auto", padding: "20px" }}>
        <Breadcrumb style={{ marginBottom: "20px" }}>
          <Breadcrumb.Item onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Products</Breadcrumb.Item>
          <Breadcrumb.Item>{product.productName}</Breadcrumb.Item> {/* Updated to use productName */}
        </Breadcrumb>

        <Row gutter={32}>
          {/* Product Image */}
          <Col xs={24} md={10}>
            <Card hoverable cover={<img alt={product.productName} src={product.productImages[0]?.imageURL} style={{ width: "100%", objectFit: "contain" }} />} />
          </Col>

          {/* Product Details */}
          <Col xs={24} md={14}>
            <Title level={2}>{product.productName}</Title> {/* Updated to use productName */}
            <Rate allowHalf defaultValue={Math.random() * (5 - 3) + 3} />
            <Divider />
            <Title level={4} style={{ color: "#ff4d4f" }}>
              ${product.unitPrice.toFixed(2)} {/* Updated to use unitPrice */}
              <Text delete style={{ color: "gray", marginLeft: "10px" }}>
                ${(product.discountPrice * 1.2).toFixed(2)} {/* Assuming discountPrice is the original price */}
              </Text>
            </Title>
            <p dangerouslySetInnerHTML={{ __html: product.description }} /> {/* Render HTML description */}
            <Divider />
            <Row gutter={16}>
              <Col>
                <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </Col>
              <Col>
                <Button type="danger" size="large">Buy Now</Button>
              </Col>
            </Row>
            <Divider />
            <Button type="link" onClick={() => navigate(-1)} icon={<ArrowLeftOutlined />}>Back</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
