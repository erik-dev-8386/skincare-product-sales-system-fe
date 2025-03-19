// import React, { useEffect } from "react";
// import { Card, Button } from "antd";
// import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import './ProductCard.css'

// const { Meta } = Card;

// const formatPrice = (price) => {
//   return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
// };

// const ProductCard = ({
//   product,
//   discounts = {},
//   brands = [],
//   onCompareClick,
// }) => {
//   const navigate = useNavigate();

//   // Kiểm tra xem product có tồn tại không
//   if (!product) {
//     return null;
//   }

//   // Đảm bảo các giá trị cần thiết tồn tại
//   const brand = brands?.find((b) => b.brandId === product.brandId);
//   const discount = discounts?.[product.discountId];

//   // Kiểm tra và sử dụng giá trị mặc định nếu discountId không tồn tại
//   const discountPercent = discount || 0;

//   // Hàm tìm brandName dựa trên brandId
//   const findBrandNameById = (brandId) => {
//     const brand = brands.find((brand) => brand.brandId === brandId);
//     return brand ? brand.brandName : "Unknown Brand";
//   };

//   return (
//     <Card
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         flexDirection: "column",
//         alignItems: "center",
//         textAlign: "center",
//         border: "1px solid lightgray",
//       }}
//       hoverable
//       cover={[
//         <p
//           key="discount-badge"
//           style={{
//             padding: 2,
//             marginLeft: "79%",
//             // backgroundColor: "gold",

//             background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(255,226,0,1) 0%, rgba(255,149,0,1) 100%, rgba(253,29,29,1) 100%)",
//             color: "black",
//             width: 50,
//             borderRadius: "5px",
//           }}
//         >
//           <i className="fa-solid fa-down-long"></i> {discountPercent}%
//         </p>,
//         <img
//           key="product-image"
//           alt={product.productName}
//           src={product.productImages[0]?.imageURL}
//           style={{
//             height: "150px",
//             width: "100%",
//             objectFit: "contain",
//             padding: 2,
//           }}
//         />,
//       ]}
//       onClick={() => navigate(`/products/${product.productId}`)}
//     >
//       <Meta
//         title={<p>{product.productName}</p>}
//         description={
//           <div>
//             <p>{findBrandNameById(product.brandId)}</p>
//             {/* Hiển thị brandName thay vì brandId */}
//             <strong style={{ color: "green" }}>
//               {formatPrice(product.discountPrice)}
//               <span style={{ textDecoration: "underline" }}>đ</span>
//             </strong>
//             <br />
//             <p
//               style={{
//                 textDecoration: "line-through",
//                 color: "red",
//               }}
//             >
//               {formatPrice(product.unitPrice)}
//               <span style={{ textDecoration: "underline" }}>đ</span>
//             </p>
//           </div>
//         }
//       />
//       <div>
//         <Button
//           className="button-compare"
//           type="primary"
//           onClick={(e) => {
//             e.stopPropagation(); // Ngăn chặn sự kiện click từ Card
//             onCompareClick(product);
//           }}
//           style={{
//             backgroundColor: "#900001",
//             color: "white",
//             border: "2px solid #900001"
//           }}
//         >
//           So sánh
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default ProductCard;
import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import './ProductCard.css';

const { Meta } = Card;

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const ProductCard = ({
  product,
  discounts = {},
  brands = [],
  onCompareClick,
}) => {
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
      className="product-card" // Thêm class để áp dụng CSS
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        border: "1px solid lightgray",
        position: "relative", // Thêm position relative để badge có thể đè lên
      }}
      hoverable
      cover={
        <div style={{ position: "relative" }}>
          {discountPercent > 0 && (
            <div
              className="discount-badge"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1, // Đảm bảo badge nằm trên cùng
                padding: "2px 8px",
                background: "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(255,226,0,1) 0%, rgba(255,149,0,1) 100%, rgba(253,29,29,1) 100%)",
                color: "black",
                borderRadius: "0 5px 0 5px", // Bo tròn góc dưới bên trái
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              <i className="fa-solid fa-down-long"></i> {discountPercent}%
            </div>
          )}
          <img
            key="product-image"
            alt={product.productName}
            src={product.productImages[0]?.imageURL}
            style={{
              height: "150px",
              width: "250px",
              objectFit: "contain",
              borderRadius: "10px 10px 0 0"
             
            }}
          />
        </div>
      }
      onClick={() => navigate(`/products/${product.productId}`)}
    >
      <Meta
        title={<p>{product.productName}</p>}
        description={
          <div style={{height: 100}}>
            <p>{findBrandNameById(product.brandId)}</p>
            <strong style={{ color: "green" }}>
              {formatPrice(product.discountPrice)}
              <span style={{ textDecoration: "underline" }}>đ</span>
            </strong>
            <br />
            {discountPercent > 0 ? (
              <p
                style={{
                  textDecoration: "line-through",
                  color: "red",
                }}
              >
                {formatPrice(product.unitPrice)}
                <span style={{ textDecoration: "underline" }}>đ</span>
              </p>
            ) : (
              <p style={{ visibility: "hidden" }}>Placeholder</p> // Thêm placeholder để giữ nguyên chiều cao
            )}
          </div>
        }
      />
      <div>
        <Button
          className="button-compare"
          type="primary"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện click từ Card
            onCompareClick(product);
          }}
          style={{
            backgroundColor: "#900001",
            color: "white",
            border: "2px solid #900001",
          }}
        >
          So sánh
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;