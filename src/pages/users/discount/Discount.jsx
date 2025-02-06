import { Link } from "react-router-dom";
import Footer from "../../../component/Footer/Footer";
import Header from "../../../component/Header/Header";
import "./Discount.css";

// Create an array for discount banners and values
const discountBanners = [
  {
    id: 30,
    imgSrc:
      "https://api.watsons.com.sg/medias/P1-B1G1-Skincare-Header-Banner-GIF.gif?context=bWFzdGVyfGltYWdlc3wzMjcwNzd8aW1hZ2UvZ2lmfGFERTBMMmhsWXk4eU9UY3lNVEkyT0RneE16ZzFOQzlRTVNCQ01VY3hJRk5yYVc1allYSmxJRWhsWVdSbGNpQkNZVzV1WlhJZ1IwbEdMbWRwWmd8ZjVmNWFhZjgzNDNjYmExOGFjMzcyZjM1MTBlOWRkMTc2MTI4YmMwNmE5NmVmNDIyYjRjNzAxN2E0MDMzOWM2NQ",
    alt: "30% Discount",
    style: { width: 1425 },
  },
  {
    id: 50,
    imgSrc:
      "https://img.freepik.com/free-vector/hand-drawn-beauty-sale-banner-design_23-2149667222.jpg",
    alt: "50% Discount",
    style: { width: 1425 },
  },
];

function Discount() {
  return (
    <>
      <Header />
      {discountBanners.map((banner) => (
        <div key={banner.id} className={`discount-${banner.id}`}>
          <Link to={`/discount/${banner.id}`}>
            <img
              className={`discount-${banner.id}`}
              src={banner.imgSrc}
              alt={banner.alt}
              style={banner.style}
            />
          </Link>
        </div>
      ))}
      <Footer />
    </>
  );
}

export default Discount;
