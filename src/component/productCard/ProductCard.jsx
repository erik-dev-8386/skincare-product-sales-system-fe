// import React from "react";
// import { Card, Button, Badge } from "antd";
// import { ShoppingCartOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// const { Meta } = Card;

// const ProductCard = ({ product, discounts, handleAddToCart }) => {
//   const navigate = useNavigate();

//   return (
//     <Card
//       hoverable
//       cover={[
//         <p
//           style={{
//             padding: 2,
//             marginLeft: "79%",
//             backgroundColor: "red",
//             color: "white",
//             width: 50,
//             borderRadius: "5px",
//           }}
//         >
//           <i className="fa-solid fa-down-long"></i>
//           {discounts[product.discountId] || 0}%
//         </p>,
//         <img
//           alt={product.productName}
//           src={product.productImages[0]?.imageURL}
//           style={{
//             height: "200px",
//             objectFit: "contain",
//             padding: 2,
//           }}
//         />,
//       ]}
//       onClick={() => navigate(`/products/${product.productId}`)}
//     >
//       <Meta
//         title={product.productName}
//         description={
//           <>
//             <strong>{product.discountPrice}đ</strong>
//             <br />
//             <p
//               style={{
//                 textDecoration: "line-through",
//                 color: "red",
//               }}
//             >
//               {product.unitPrice}đ
//             </p>
//           </>
//         }
//       />
//       <Button
//         type="primary"
//         onClick={(e) => {
//           e.stopPropagation(); // Ngăn chặn sự kiện click từ Card
//           handleAddToCart(product);
//         }}
//       >
//         Add to Cart
//       </Button>
//     </Card>
//   );
// };

// export default ProductCard;

import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";

const { Meta } = Card;

// const ProductCard = ({ product, discounts = {}, brands = [], handleAddToCart }) => {
const ProductCard = ({ product, discounts = {}, brands = [] }) => {
  const navigate = useNavigate();

  // Kiểm tra xem product có tồn tại không
  if (!product) {
    return null;
  }

  // Đảm bảo các giá trị cần thiết tồn tại
  const brand = brands?.find((b) => b.brandId === product.brandId);
  const discount = discounts?.[product.discountId];

  // Kiểm tra và sử dụng giá trị mặc định nếu discountId không tồn tại
  const discountPercent = discount || 0;

  // Hàm tìm brandName dựa trên brandId
  const findBrandNameById = (brandId) => {
    const brand = brands.find((brand) => brand.brandId === brandId);
    return brand ? brand.brandName : "Unknown Brand";
  };

  return (
    <Card
      hoverable
      cover={[
        <p
          style={{
            padding: 2,
            marginLeft: "79%",
            backgroundColor: "red",
            color: "white",
            width: 50,
            borderRadius: "5px",
          }}
        >
          <i className="fa-solid fa-down-long"></i> {discountPercent}%
        </p>,
        <img
          alt={product.productName}
          src={product.productImages[0]?.imageURL}
          style={{
            height: "150px",
            width: "100%",
            objectFit: "contain",
            padding: 2,
          }}
        />,
      ]}
      onClick={() => navigate(`/products/${product.productId}`)}
    >
      <Meta
        
        title={
          <p style={{ display: "flex", justifyContent: "center" }} >
            {product.productName}
          </p>
        }
        description={
          <div style={{ display: "flex", justifyContent: "space-between", flexDirection: "column", alignItems: "center" }}>
            <p >
              {findBrandNameById(product.brandId)}
            </p>
            {/* Hiển thị brandName thay vì brandId */}
            <strong >
              {product.discountPrice}
              <span style={{ textDecoration: "underline" }}>đ</span>
            </strong>
            <br />
            <p
              style={{
                textDecoration: "line-through",
                color: "red",

              }}
            >
              {product.unitPrice}
              <span style={{ textDecoration: "underline" }}>đ</span>
            </p>
          </div>
        }
      />
      {/* <Button
        type="primary"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(product);
        }}
      >
        Add to Cart
      </Button> */}
    </Card>
  );
};

export default ProductCard;
