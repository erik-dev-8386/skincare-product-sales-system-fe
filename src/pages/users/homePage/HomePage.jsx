
import Footer from "../../../component/Footer/Footer";
import { logout } from '../../../auth';


function HomePage(){
    return(
        <>
        {/* <div>
      <h1>Chào mừng bạn!</h1>
      <button><a href="/Login">Đăng nhập</a></button>

      <button onClick={logout}>Đăng xuất</button>
    </div> */}
        
        <Footer/>
        </>
    );
}

export default HomePage