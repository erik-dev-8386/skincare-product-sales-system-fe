
import Footer from "../../../component/Footer/Footer";
import { logout } from '../../../auth';
import Header from '../../../component/Header/Header'
import Body from "./Body";
import { Link } from 'react-router-dom';
function HomePage(){
    return(
        <>
       
        {/* <Header /> */}
        <Body />
        {/* <Footer/> */}
        </>
    );
}

export default HomePage