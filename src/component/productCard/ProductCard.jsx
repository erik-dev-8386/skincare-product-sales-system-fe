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
//           <i className="fa-solid fa-down-long"></i>{" "}
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
//             <strong>{product.discountPrice}VND</strong>
//             <br />
//             <p
//               style={{
//                 textDecoration: "line-through",
//                 color: "red",
//               }}
//             >
//               {product.unitPrice}VND
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

const ProductCard = ({ product, discounts = {}, handleAddToCart }) => {
  const navigate = useNavigate();

  // Kiểm tra và sử dụng giá trị mặc định nếu discountId không tồn tại
  const discountPercent = discounts[product.discountId] || 0;

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
            height: "200px",
            objectFit: "contain",
            padding: 2,
          }}
        />,
      ]}
      onClick={() => navigate(`/products/${product.productId}`)}
    >
      <Meta
        title={product.productName}
        description={
          <>
            <strong>{product.discountPrice}VND</strong>
            <br />
            <p
              style={{
                textDecoration: "line-through",
                color: "red",
              }}
            >
              {product.unitPrice}VND
            </p>
          </>
        }
      />
      <Button
        type="primary"
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(product);
        }}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;