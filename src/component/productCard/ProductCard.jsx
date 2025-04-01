import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

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


  if (!product) {
    return null;
  }


  const brand = brands?.find((b) => b.brandId === product.brandId);
  const discount = discounts?.[product.discountId];

  const discountPercent = discount || 0;


  const findBrandNameById = (brandId) => {
    const brand = brands.find((brand) => brand.brandId === brandId);
    return brand ? brand.brandName : "Unknown Brand";
  };

  return (
    <Card
      className="product-card"
      style={{
        width: "250px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        border: "1px solid lightgray",
        position: "relative",
      }}
      hoverable
      cover={
        <div
          style={{ position: "relative", width: "100%", overflow: "hidden" }}
        >
          {discountPercent > 0 && (
            <div
              className="discount-badge"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1,
                padding: "2px 8px",
                background:
                  "linear-gradient(90deg, rgba(255,226,0,1) 0%, rgba(255,149,0,1) 100%)",
                color: "black",
                borderRadius: "0 5px 0 5px",
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
              paddingTop: 2,
            }}
          />
        </div>
      }
      onClick={() => navigate(`/products/${product.productId}`)}
    >
      <Meta
        title={
          <div
            style={{
              maxWidth: "230px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {product.productName}
          </div>
        }
        description={
          <div style={{ height: 100 }}>
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
              <p style={{ visibility: "hidden" }}>Placeholder</p>
            )}
          </div>
        }
      />
      <div>
        <Button
          className="button-compare"
          type="primary"
          onClick={(e) => {
            e.stopPropagation();
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