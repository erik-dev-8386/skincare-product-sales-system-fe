
import Footer from "../../../component/Footer/Footer";
import { logout } from '../../../auth';
import Header from '../../../component/Header/Header'
import Body from "./Body";
import { Link } from 'react-router-dom';
function HomePage(){
    return(
        <>
        {/* <div>
      <h1>Chào mừng bạn!</h1>
      <button><Link to="/Login">Đăng nhập</Link></button>

      <button onClick={logout}>Đăng xuất</button>
    </div> */}
        <Header />
        <Body />
        <Footer/>
        </>
    );
}

export default HomePage