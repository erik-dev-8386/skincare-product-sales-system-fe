import { Link } from "react-router-dom";
import Footer from "../../../component/Footer/Footer";
import Header from "../../../component/Header/Header";
import "./Discount.css";

// Create an array for discount banners and values
const discountBanners = [
  {
    id: 30,
    imgSrc:
      "src/assets/img_discount/30.webp",
    alt: "30% Discount",
    style: { width: 600 },
  },
  {
    id: 50,
    imgSrc:
      "src/assets/img_discount/50.webp",
    alt: "50% Discount",
    style: { width: 600 },
  },
];

function Discount() {
  return (
    <>
      {/* <Header /> */}
      <div className="discount-banner" style={{display: "flex", marginLeft: 50, marginRight: 50, marginTop: 50, paddingTop: 60,
         paddingLeft: 60, paddingRight: 60, paddingBottom: 30, justifyContent: "space-between"}}>
      {discountBanners.map((banner) => (
        <div  key={banner.id} className={`discount-${banner.id}`}>
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
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default Discount;
