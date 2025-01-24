
import Footer from "../../../component/Footer/Footer";
import { logout } from '../../../auth';
import Header from '../../../component/Header/Header'
import Body from "./Body";
function HomePage(){
    return(
        <>
        {/* <div>
      <h1>Chào mừng bạn!</h1>
      <button><a href="/Login">Đăng nhập</a></button>

      <button onClick={logout}>Đăng xuất</button>
    </div> */}
        <Header />
        <Body />
        <Footer/>
        </>
    );
}

export default HomePage