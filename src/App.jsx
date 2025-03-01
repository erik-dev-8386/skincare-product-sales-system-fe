
import './App.css'


import { Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/users/homePage/HomePage';
import Login from '../src/pages/users/login/Login';
// import Callback from '../src/pages/users/callBack/Callback';
import PrivacyPolicy from '../src/pages/users/privacyPolicy/PrivacyPolicy';
import TermsOfUse from '../src/pages/users/termsOfUse/TermsOfUse';
import Blog from "../src/pages/users/blog/Blog.jsx";
import Register from "../src/pages/users/register/Register.jsx";
import Discount from './pages/users/discount/Discount.jsx';
import DiscountDetail from './pages/users/discount/DiscountDetail.jsx';
import AboutUs from './pages/users/aboutUs/AboutUs.jsx';
import BlogDetail from "./pages/users/blog/BlogDetail.jsx";
import Shopping from './pages/users/shoppingCart/Shopping.jsx'
import Cart from './pages/users/cart/Cart.jsx';
import Kho from './pages/users/listskincare/Kho.jsx';
import Honhop from './pages/users/listskincare/Honhop.jsx';
import Nhaycam from './pages/users/listskincare/Nhaycam.jsx';
import Thuong from './pages/users/listskincare/Thuong.jsx';
import DiscountManagement from './pages/admin/DiscountManagement/DiscountManagement.jsx';
import CategoryManagement from './pages/admin/CategoryManagement/CategoryManagement.jsx';
import BrandManagement from './pages/admin/BrandManagement/BrandManagement.jsx';
import SkinTypeManagement from './pages/admin/SkinTypesManagement/SkinTypeManagement.jsx'
import ListStaff from './pages/admin/StaffManagement/ListStaff.jsx';
import CreateStaff from './pages/admin/StaffManagement/CreateStaff.jsx';
import UserManagement from './pages/admin/UserManagement/UserManagement.jsx'
import LoginAndSignup from './pages/users/login/loginAndSignup.jsx';
import Question from './pages/users/question/Question.jsx';
import CustomerDiscounts from './pages/users/discount/CustomerDiscounts.jsx';
import NotFound from './pages/users/NotFound/NotFound.jsx';
import AboutMe from './pages/users/aboutUs/AboutMe.jsx';
import Layout from './component/Layout/Layout.jsx';
import ListProduct from './pages/admin/ProductManagement/ListProduct.jsx';
import DashBoard from './pages/admin/DashBoard/DashBoard.jsx';
import AdminLayout from './component/AdminLayout/AdminLayout.jsx';
import Products from './pages/users/products/Products.jsx';
import ProductDetail from './pages/users/products/ProductDetail.jsx';
import ProductManagement from './pages/admin/ProductManagement/ProductManagement.jsx';


function App() {


  return (
    <Routes>
      {/* user */}
      <Route path="/" element={<Layout />} >

        <Route index element={<HomePage />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/about-me' element={<AboutMe />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/discount" element={<Discount />} />
        <Route path="/discount/:discountPercentage" element={<DiscountDetail />} />
        <Route path='/customer-discounts' element={<CustomerDiscounts />} />
        <Route path='/shopping-cart' element={<Shopping />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/listskincare/Kho' element={<Kho />} />
        <Route path='/listskincare/Honhop' element={<Honhop />} />
        <Route path='/listskincare/Nhaycam' element={<Nhaycam />} />
        <Route path='/listskincare/Thuong' element={<Thuong />} />
        <Route path='/question' element={<Question />} />
        <Route path='/products' element={<Products/>} />
        <Route path='/products/:id' element={<ProductDetail/>} />
     

      </Route>
      {/* login */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path='/login-and-signup' element={<LoginAndSignup />} />

      {/* admin */}
      <Route path='/admin' element={<AdminLayout />} >
        <Route index  element={<DashBoard />} />
        <Route path='/admin/discount-management' element={<DiscountManagement />} />
        <Route path='/admin/category-management' element={<CategoryManagement />} />
        <Route path='/admin/brand-management' element={<BrandManagement />} />
        <Route path='/admin/skin-type-management' element={<SkinTypeManagement />} />
        <Route path='/admin/list-staff' element={<ListStaff />} />
        <Route path='/admin/create-staff' element={<CreateStaff />} />
        <Route path='/admin/list-user' element={<UserManagement />} />
        {/* <Route path='/admin/list-product' element={<ListProduct />} /> */}
        <Route path='/admin/product-management' element={<ProductManagement />} />
      </Route>

      <Route path='*' element={<NotFound />} />
      <Route path='/product-management' element={<ProductManagement />} />
     

    </Routes>
  );
}

export default App;

