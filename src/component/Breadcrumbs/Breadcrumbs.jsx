// import { Link, useLocation } from "react-router-dom"
// import "./Breadcrumbs.css"
// import { HomeOutlined, ShoppingOutlined, PercentageOutlined, QuestionCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons"

// export default function Breadcrumbs() {
//     const location = useLocation()

//     let currentLink = ''

//     const crumbs = location.pathname.split('/')
//         .filter(crumb => crumb !== '')
//         .map(crumb => {
//             currentLink += `/${crumb}`

//             // Check if current crumb is 'products'
//             if (crumb === 'products') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             <ShoppingOutlined /> Sản phẩm
//                         </Link>
//                     </div>
//                 )
//             }

//             // Check if current crumb is 'customer-discounts'
//             if (crumb === 'customer-discounts') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             <PercentageOutlined /> Giảm giá
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'blog') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             <i className="fa-solid fa-newspaper"></i> Blog
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'question') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             <QuestionCircleOutlined /> Bài kiểm tra
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'about-me') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             <i className="fa-regular fa-bell"></i> Về chúng tôi
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'listskincare') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             <i className="fa-solid fa-notes-medical"></i> Danh sách chăm sóc da
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'Thuong') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             Thường
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'Nhaycam') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             Nhạy cảm
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'Honhop') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             Hỗn hợp
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'Kho') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             Khô
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'Dau') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                             Dầu
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'shopping-cart') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                         <ShoppingCartOutlined />  Giỏ hàng
//                         </Link>
//                     </div>
//                 )
//             }

//             if (crumb === 'cart') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                         <i className="fa-solid fa-money-bill-transfer"></i>  Thanh toán
//                         </Link>
//                     </div>
//                 )
//             }

            

//             if (crumb === 'success-payment') {
//                 return (
//                     <div className="crumb" key={crumb}>
//                         <Link to={currentLink}>
//                         <i className="fa-solid fa-circle-check"></i>  Trạng thái thanh toán
//                         </Link>
//                     </div>
//                 )
//             }



//             return (
//                 <div className="crumb" key={crumb}>
//                     <Link to={currentLink}>{crumb}</Link>
//                 </div>
//             )
//         })

//     return (
//         <div className="breadcrumbs">
//             {/* Home link with icon */}
//             <div className="crumb">
//                 <Link to="/">
//                     <HomeOutlined /> Trang chủ
//                 </Link>
//             </div>
//             {crumbs}
//         </div>
//     )
// }
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";
import {
  HomeOutlined,
  ShoppingOutlined,
  PercentageOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../config/api";

export default function Breadcrumbs() {
  const location = useLocation();
  const [dynamicTitles, setDynamicTitles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  // Function to check if a string is a UUID
  const isUUID = (str) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Fetch all blogs data once when component mounts
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Function to fetch product title by ID
  const fetchProductTitle = async (id) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/products/${id}`);
      return response.data.productName;
    } catch (error) {
      console.error("Error fetching product title:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get blog title from local blogs data
  const getBlogTitle = (id) => {
    const blog = blogs.find((b) => b.blogId === id);
    return blog ? blog.blogTitle : "Loading...";
  };

  useEffect(() => {
    const pathParts = location.pathname.split("/").filter((part) => part !== "");

    if (pathParts.length >= 2) {
      const parentPath = pathParts[pathParts.length - 2];
      const id = pathParts[pathParts.length - 1];

      if (isUUID(id)) {
        if (parentPath === "blog") {
          const title = getBlogTitle(id);
          if (title && !dynamicTitles[id]) {
            setDynamicTitles((prev) => ({
              ...prev,
              [id]: title,
            }));
          }
        } else if (parentPath === "products" && !dynamicTitles[id]) {
          fetchProductTitle(id).then((title) => {
            if (title) {
              setDynamicTitles((prev) => ({
                ...prev,
                [id]: title,
              }));
            }
          });
        }
      }
    }
  }, [location.pathname, blogs]);

  let currentLink = "";

  const crumbs = location.pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb, index, array) => {
      currentLink += `/${crumb}`;

      // Check if this is a UUID that follows 'blog' or 'products'
      if (index > 0 && isUUID(crumb)) {
        const parentPath = array[index - 1];
        const title =
          dynamicTitles[crumb] ||
          (parentPath === "blog" ? getBlogTitle(crumb) : "Loading...");

        if (parentPath === "blog") {
          return (
            <div className="crumb" key={crumb}>
              <Link to={currentLink}>{title}</Link>
            </div>
          );
        }

        if (parentPath === "products") {
          return (
            <div className="crumb" key={crumb}>
              <Link to={currentLink}>{dynamicTitles[crumb] || "Loading..."}</Link>
            </div>
          );
        }
      }

      // Existing checks for static paths
      if (crumb === "products") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <ShoppingOutlined /> Sản phẩm
            </Link>
          </div>
        );
      }

      if (crumb === "customer-discounts") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <PercentageOutlined /> Giảm giá
            </Link>
          </div>
        );
      }

      if (crumb === "blog") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <i className="fa-solid fa-newspaper"></i> Blog
            </Link>
          </div>
        );
      }

      if (crumb === "question") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <QuestionCircleOutlined /> Bài kiểm tra
            </Link>
          </div>
        );
      }

      if (crumb === "about-me") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <i className="fa-regular fa-bell"></i> Về chúng tôi
            </Link>
          </div>
        );
      }

      if (crumb === "listskincare") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <i className="fa-solid fa-notes-medical"></i> Danh sách chăm sóc da
            </Link>
          </div>
        );
      }

      if (crumb === "Thuong") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>Thường</Link>
          </div>
        );
      }

      if (crumb === "Nhaycam") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>Nhạy cảm</Link>
          </div>
        );
      }

      if (crumb === "Honhop") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>Hỗn hợp</Link>
          </div>
        );
      }

      if (crumb === "Kho") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>Khô</Link>
          </div>
        );
      }

      if (crumb === "Dau") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>Dầu</Link>
          </div>
        );
      }

      if (crumb === "shopping-cart") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <ShoppingCartOutlined /> Giỏ hàng
            </Link>
          </div>
        );
      }

      if (crumb === "cart") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <i className="fa-solid fa-money-bill-transfer"></i> Thanh toán
            </Link>
          </div>
        );
      }

      if (crumb === "success-payment") {
        return (
          <div className="crumb" key={crumb}>
            <Link to={currentLink}>
              <i className="fa-solid fa-circle-check"></i> Trạng thái thanh toán
            </Link>
          </div>
        );
      }

      return (
        <div className="crumb" key={crumb}>
          <Link to={currentLink}>{crumb}</Link>
        </div>
      );
    });

  return (
    <div className="breadcrumbs">
      <div className="crumb">
        <Link to="/">
          <HomeOutlined /> Trang chủ
        </Link>
      </div>
      {crumbs}
    </div>
  );
}