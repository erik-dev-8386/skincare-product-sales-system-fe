import { useState, useEffect, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/Logo_01.jpg";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../../context/CartContext";
import { ShoppingCartOutlined, DashboardOutlined, MenuOutlined } from "@ant-design/icons";
import { Badge, } from "antd";
import Breadcrumbs from "../Breadcrumbs/Breadcrumbs";
import api from "../../config/api";

export default function Header() {
  const [role, setRole] = useState(null);
  const { cart } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
        setRole(null);
      }
    }
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchKeyword(value);

    if (value.trim()) {
      const matchingCategories = categories.filter(cat =>
        cat.categoryName.toLowerCase().includes(value.toLowerCase())
      );

      const matchingProducts = products.filter(product => {
        const productName = product.productName.toLowerCase();
        const searchValue = value.toLowerCase();

        const productCategory = categories.find(cat => cat.categoryId === product.categoryId);
        const categoryName = productCategory ? productCategory.categoryName.toLowerCase() : '';

        return productName.includes(searchValue) || categoryName.includes(searchValue);
      });

      const suggestions = [
        ...matchingCategories.map(cat => ({
          id: cat.categoryId,
          name: cat.categoryName,
          type: 'category'
        })),
        ...matchingProducts.map(prod => {
          const category = categories.find(cat => cat.categoryId === prod.categoryId);
          return {
            id: prod.productId,
            name: prod.productName,
            type: 'product',
            categoryId: prod.categoryId,
            categoryName: category ? category.categoryName : ''
          };
        })
      ];

      setSearchSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (item) => {
    if (item.type === 'category') {
      navigate(`/products?category=${item.id}`);
    } else {
      navigate(`/products?category=${item.categoryId}&search=${encodeURIComponent(item.name)}`);
    }
    setSearchKeyword("");
    setShowSuggestions(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      const matchingCategory = categories.find(cat =>
        cat.categoryName.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      if (matchingCategory) {
        navigate(`/products?category=${matchingCategory.categoryId}&search=${encodeURIComponent(searchKeyword.trim())}`);
      } else {
        navigate(`/products?search=${encodeURIComponent(searchKeyword.trim())}`);
      }
      setSearchKeyword("");
      setShowSuggestions(false);
    }
  };

  return (
    <>
      <div className="Header">
        <div className="header-content">
          <div className="col-1">
            <Link to="/">
              <img src={logo} alt="Haven Skin Logo" className="logo" />
            </Link>
          </div>

          <button className="mobile-menu-button" onClick={toggleMobileMenu}>
            <MenuOutlined />
          </button>

          <div className={`nav col-8 ${mobileMenuOpen ? 'active' : ''}`}>
            <ul>
              <li>
                <Link to="/" className="active">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="active">
                  Sản phẩm
                </Link>
              </li>
              {/* <li>
                <Link to="/customer-discounts" className="active">
                  Giảm giá
                </Link>
              </li> */}
              <li>
                <Link to="/blog" className="active">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/question" className="active">
                  Xác định da
                </Link>
              </li>
              <li>
                <Link to="#" className="active">
                  Lộ trình chăm sóc da
                </Link>
                <ul className="subnav">
                  <li>
                    <Link to="/listskincare/Thuong">Da thường</Link>
                  </li>
                  <li>
                    <Link to="/listskincare/Nhaycam">Da nhạy cảm</Link>
                  </li>
                  <li>
                    <Link to="/listskincare/Honhop">Da hỗn hợp</Link>
                  </li>
                  <li>
                    <Link to="/listskincare/Kho">Da khô</Link>
                  </li>
                  <li>
                    <Link to="/listskincare/Dau">Da dầu</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="/about-us">Giới thiệu & Liên hệ</Link>
              </li>
            </ul>
          </div>

          <div className="icon col-3">
            <div className="search-container" style={{ position: 'relative' }}>
              <form className="search" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="searchtt"
                  value={searchKeyword}
                  onChange={handleSearchInputChange}
                  onFocus={() => setShowSuggestions(true)}
                />
                <button type="submit" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                  <i className="fas fa-search search-icon"></i>
                </button>
              </form>

              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="search-suggestions">
                  {searchSuggestions.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <i className={item.type === 'category' ? 'fas fa-folder' : 'fas fa-box'}
                        style={{ marginRight: '8px' }} />
                      <div>
                        <div>{item.name}</div>
                        {item.type === 'product' && item.categoryName && (
                          <div className="suggestion-category">
                            Danh mục: {item.categoryName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/shopping-cart" className="cart">
              <Badge
                count={cart.length}
                style={{ backgroundColor: "yellow", color: "black" }}
              >
                <ShoppingCartOutlined
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "white",
                    borderRadius: "50%",
                    backgroundColor: "none",
                    padding: "7.5px",
                    border: "1px solid white",
                  }}
                />
              </Badge>
            </Link>

            <div className="user-container">
              <Link to="#" className="user">
                <i className="fas fa-user"></i>
              </Link>

              <ul className="subnav">
                {role ? (
                  <>
                    <li>
                      <Link to="/user">
                        <p>
                          <i className="fa-solid fa-address-card"></i> Hồ sơ
                        </p>
                      </Link>
                    </li>
                    {(role === 1 || role === 2) && (
                      <li>
                        <Link to="/admin">
                          <p>
                            <DashboardOutlined /> Bảng điều khiển
                          </p>
                        </Link>
                      </li>
                    )}
                    <li
                      onClick={handleLogout}
                      style={{ cursor: "pointer", color: "white" }}
                    >
                      <p>
                        <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                      </p>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login-and-signup">
                        <p>
                          <i className="fa-solid fa-right-to-bracket"></i> Đăng nhập/Đăng ký
                        </p>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        <Breadcrumbs />
      </div>
 

    </>
  );
}
