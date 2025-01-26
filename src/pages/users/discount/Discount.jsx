import Footer from "../../../component/Footer/Footer";
import Header from "../../../component/Header/Header";
import "./Discount.css"


function Discount() {

    return (
        <>
            <Header />
            <div className="discount-1"><a href="/discount/30"><img className="discount-30" src="https://api.watsons.com.sg/medias/P1-B1G1-Skincare-Header-Banner-GIF.gif?context=bWFzdGVyfGltYWdlc3wzMjcwNzd8aW1hZ2UvZ2lmfGFERTBMMmhsWXk4eU9UY3lNVEkyT0RneE16ZzFOQzlRTVNCQ01VY3hJRk5yYVc1allYSmxJRWhsWVdSbGNpQkNZVzV1WlhJZ1IwbEdMbWRwWmd8ZjVmNWFhZjgzNDNjYmExOGFjMzcyZjM1MTBlOWRkMTc2MTI4YmMwNmE5NmVmNDIyYjRjNzAxN2E0MDMzOWM2NQ" alt="30%" style={{ width: 1425 }} /></a></div>

            <div className="discount-2"> <a href="/discount/50"><img className="discount-50" src="https://img.freepik.com/free-vector/hand-drawn-beauty-sale-banner-design_23-2149667222.jpg" alt="50%" width={1425} /></a> </div>
            <Footer />
        </>
    );

}

export default Discount