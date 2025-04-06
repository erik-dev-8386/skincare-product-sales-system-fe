import "./App.css";

import { Routes, Route } from "react-router-dom";
import HomePage from "../src/pages/users/homePage/HomePage";

import PrivacyPolicy from "../src/pages/users/privacyPolicy/PrivacyPolicy";
import TermsOfUse from "../src/pages/users/termsOfUse/TermsOfUse";
import Blog from "../src/pages/users/blog/Blog.jsx";


import BlogDetail from "./pages/users/blog/BlogDetail.jsx";
import Shopping from "./pages/users/shoppingCart/Shopping.jsx";
import Cart from "./pages/users/cart/Cart.jsx";
import Kho from "./pages/users/listskincare/Kho.jsx";
import Honhop from "./pages/users/listskincare/Honhop.jsx";
import Nhaycam from "./pages/users/listskincare/Nhaycam.jsx";
import Thuong from "./pages/users/listskincare/Thuong.jsx";
import Dau from "./pages/users/listskincare/Dau.jsx";
import DiscountManagement from "./pages/admin/DiscountManagement/DiscountManagement.jsx";
import CategoryManagement from "./pages/admin/CategoryManagement/CategoryManagement.jsx";
import BrandManagement from "./pages/admin/BrandManagement/BrandManagement.jsx";
import SkinTypeManagement from "./pages/admin/SkinTypesManagement/SkinTypeManagement.jsx";
import ListStaff from "./pages/admin/StaffManagement/ListStaff.jsx";

import LoginAndSignup from "./pages/users/login/loginAndSignup.jsx";
import Question from "./pages/users/question/Question.jsx";
import CustomerDiscounts from "./pages/users/discount/CustomerDiscounts.jsx";
import NotFound from "./pages/users/NotFound/NotFound.jsx";
import AboutMe from "./pages/users/aboutUs/AboutMe.jsx";
import Layout from "./component/Layout/Layout.jsx";

import DashBoard from "./pages/admin/DashBoard/DashBoard.jsx";
import AdminLayout from "./component/AdminLayout/AdminLayout.jsx";
import Products from "./pages/users/products/Products.jsx";
import ProductDetail from "./pages/users/products/ProductDetail.jsx";
import ProductManagement from "./pages/admin/ProductManagement/ProductManagement.jsx";
import QuestionManagement from "./pages/admin/QuestionManagement/QuestionManagement.jsx";
import AnswerManagement from "./pages/admin/AnswerManagement/AnswerManagement.jsx";
import Profile from "./pages/users/profile/Profile.jsx";
import ProfileLayout from "../src/component/ProfileLayout/ProfileLayout.jsx";
import History from "./pages/users/profile/History.jsx";
import OrderManagement from "./pages/admin/OrderManagement/OrderManagement.jsx";
import BlogManage from "./pages/admin/BlogManagement/Blogmanage.jsx";
import BlogHashtag from "./pages/admin/BlogManagement/Bloghastag.jsx";
import BlogCategory from "./pages/admin/BlogManagement/Blogcategory.jsx";
import CustomerManagement from "./pages/admin/UserManagement/UserManagement.jsx";
import Point from "./pages/users/profile/point.jsx";
import SuccessPayment from "./pages/users/cart/PaymentStatus.jsx";
import { ToastContainer } from "react-toastify";
import Setting from "./pages/users/profile/Setting.jsx";

import PlanSkincare from "./pages/admin/PlanSkincare/PlanSkincare.jsx";
import Miniplanskincare from "./pages/admin/Miniplanskincare/Miniplanskincare.jsx";
function App() {
  return (
    <>
    <ToastContainer />
    <Routes>
      {/* user */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
   
        <Route path="/about-us" element={<AboutMe />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        <Route path="/customer-discounts" element={<CustomerDiscounts />} />
        <Route path="/shopping-cart" element={<Shopping />} />
        <Route path="/shopping-cart/cart" element={<Cart />} />
        <Route path="/listskincare/Kho" element={<Kho />} />
        <Route path="/listskincare/Honhop" element={<Honhop />} />
        <Route path="/listskincare/Nhaycam" element={<Nhaycam />} />
        <Route path="/listskincare/Thuong" element={<Thuong />} />
        <Route path="/listskincare/Dau" element={<Dau />} />
        <Route path="/question" element={<Question />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/shopping-cart/cart/success-payment" element={<SuccessPayment />} />

      </Route>
   
 
      <Route path="/login-and-signup" element={<LoginAndSignup />} />

 
      <Route path="/user" element={<ProfileLayout />}>
        <Route index element={<Profile />} />
        <Route path="/user/history" element={<History />} />
        <Route path="/user/point" element={<Point />} />
        <Route path="/user/setting" element={<Setting />} />

        
      </Route>


      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashBoard />} />
        <Route
          path="/admin/discount-management"
          element={<DiscountManagement />}
        />
        <Route
          path="/admin/category-management"
          element={<CategoryManagement />}
        />
        <Route path="/admin/brand-management" element={<BrandManagement />} />
        <Route
          path="/admin/skin-type-management"
          element={<SkinTypeManagement />}
        />
        <Route path="/admin/staff-management" element={<ListStaff />} />

        <Route path="/admin/customer-management" element={<CustomerManagement />} />

        <Route
          path="/admin/product-management"
          element={<ProductManagement />}
        />

        <Route path="/admin/order-management" element={<OrderManagement />} />

        <Route
          path="/admin/question-management"
          element={<QuestionManagement />}
        />
        <Route path="/admin/answer-management" element={<AnswerManagement />} />
        <Route path="/admin/blog-management" element={<BlogManage />} />
        <Route path="/admin/blog-hastag" element={<BlogHashtag />} />
        <Route path="/admin/blog-category" element={<BlogCategory />} />
        <Route path="/admin/planskincare" element={<PlanSkincare />} />
        <Route path="/admin/miniplanskincare" element={<Miniplanskincare />} />
      </Route>


    </Routes>
    </>
  );
}

export default App;
