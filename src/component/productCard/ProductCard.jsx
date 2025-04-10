import React, { useEffect, useState } from "react";
import { Card, Button, Rate } from "antd";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import api from "../../config/api";

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
  const [ratingData, setRatingData] = useState({
    averageRating: 0,
    ratingCount: 0
  });

  useEffect(() => {
    const fetchRatingData = async () => {
      if (!product?.productName) return;
      
      try {
        const [avgRes, countsRes] = await Promise.all([
          api.get(`/feedbacks/average-rating/${product.productName}`),
          api.get(`/feedbacks/get-star/by-customer/${product.productName}`)
        ]);

        setRatingData({
          averageRating: avgRes.data || 0,
          ratingCount: Object.values(countsRes.data || {}).reduce((sum, count) => sum + count, 0)
        });
      } catch (error) {
        console.error("Error fetching rating data:", error);
        setRatingData({
          averageRating: 0,
          ratingCount: 0
        });
      }
    };

    fetchRatingData();
  }, [product]);

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
        <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
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
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "4px"
            }}
          >
            {product.productName}
          </div>
        }
        description={
          <div style={{ height: 120 }}>
            <p style={{ 
              marginBottom: 8, 
              color: "#666",
              fontSize: "14px"
            }}>
              {findBrandNameById(product.brandId)}
            </p>
            
            <strong style={{ 
              color: "green",
              fontSize: "18px",
              display: "block",
              marginBottom: "8px"
            }}>
              {formatPrice(product.discountPrice)}
              <span style={{ textDecoration: "underline" }}>đ</span>
            </strong>

            <div style={{ 
              display: "flex", 
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "8px"
            }}>
              <Rate 
                disabled 
                allowHalf 
                value={ratingData.averageRating} 
                style={{ 
                  fontSize: 14,
                  color: "#FFD700",
                }} 
              />
              <span style={{ 
                fontSize: 12,
                color: "#666",
                marginLeft: 4
              }}>
                ({ratingData.ratingCount})
              </span>
            </div>

            {discountPercent > 0 && (
              <p
                style={{
                  textDecoration: "line-through",
                  color: "red",
                  fontSize: 14,
                  margin: 0
                }}
              >
                {formatPrice(product.unitPrice)}
                <span style={{ textDecoration: "underline" }}>đ</span>
              </p>
            )}
          </div>
        }
      />
      <div style={{ marginLeft:55 ,marginTop: 8, width: "50%" }}>
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
            width: "100%"
          }}
        >
          So sánh
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;