
import './App.css'


import { Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/users/homePage/HomePage';
import Login from '../src/pages/users/login/Login';
import Callback from '../src/pages/users/callBack/Callback';
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
import Thuong from './pages/users/listskincare/Thuong.jsx'; 
import DiscountManagement from './pages/admin/DiscountManagement/DiscountManagement.jsx';
import CategoryManagement from './pages/admin/CategoryManagement/CategoryManagement.jsx';
import BrandManagement from './pages/admin/BrandManagement/BrandManagement.jsx';
import SkinTypeManagement from './pages/admin/SkinTypesManagement/SkinTypeManagement.jsx'
import AdminDashboard from './component/AdminDashboard/AdminDashboard.jsx'
import ListStaff from './pages/admin/StaffManagement/ListStaff.jsx';
import CreateStaff from './pages/admin/StaffManagement/CreateStaff.jsx';
import UserManagement from './pages/admin/UserManagement/UserManagement.jsx'
function App() {


  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/auth/callback" element={<Callback />} /> */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-use" element={<TermsOfUse />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/register" element={<Register />} />
      <Route path="/discount" element={<Discount />} />
      <Route path="/discount/:discountPercentage" element={<DiscountDetail />} /> 
      <Route path='/about-us' element={<AboutUs />} />
      <Route path='/shopping-cart' element={<Shopping />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/listskincare/Kho' element={<Kho />} />
      <Route path='/listskincare/ThuongThuong' element={<Thuong />} />
      <Route path='/discount-management' element={<DiscountManagement/>} />
      <Route path='/category-management' element={<CategoryManagement/>} />
      <Route path='/brand-management' element={<BrandManagement/>} />
      <Route path='/skin-type-management' element={<SkinTypeManagement/>} />
      <Route path='/admin-dashboard' element={<AdminDashboard/>} />
      <Route path='/list-staff' element={<ListStaff/>} />
      <Route path='/create-staff' element={<CreateStaff/>} />
      <Route path='/list-user' element={<UserManagement/>} />

    </Routes>
  );
}

export default App;

