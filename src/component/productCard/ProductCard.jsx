import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
      hoverable
      cover={[
        <p
          key="discount-badge"
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
          key="product-image"
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
        title={<p>{product.productName}</p>}
        description={
          <div>
            <p>{findBrandNameById(product.brandId)}</p>
            {/* Hiển thị brandName thay vì brandId */}
            <strong style={{ color: "green" }}>
              {formatPrice(product.discountPrice)}
              <span style={{ textDecoration: "underline" }}>đ</span>
            </strong>
            <br />
            <p
              style={{
                textDecoration: "line-through",
                color: "red",
              }}
            >
              {formatPrice(product.unitPrice)}
              <span style={{ textDecoration: "underline" }}>đ</span>
            </p>
          </div>
        }
      />
      <div>
        <Button
          type="primary"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện click từ Card
            onCompareClick(product);
          }}
          style={{
            backgroundColor: "#1890ff",
            color: "white",
          }}
        >
          So sánh
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;
