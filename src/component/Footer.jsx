import logo from "../assets/Logo_01.jpg"
import vnpay from "../assets/VNPAY.jpg"

function Footer() {
    const b = new Date().getFullYear()
    return (
        <div className="footer ">
            <div className="address col-4">
                <small>&copy; {b} Copyright by HavenSkin. All rights reserved.</small>
                <p>Liên hệ với chúng tôi</p>
                <p><i class="fa-brands fa-facebook"></i> FaceBook: ...</p>
                <p><i class="fa-solid fa-phone"></i> Số điện thoại: ...</p>
                <p><i class="fa-solid fa-envelope"></i> Gmail: ...</p>
                <p><i class="fa-solid fa-location-dot"></i> Địa chỉ: ...</p>
            </div>
           <a href="/"> <img className="logo col-4" src={logo} alt="" /></a>
            <div className="payment col-4">
                <p>Phương thức thanh toán</p>
                <div className="icon">
                    <div className="cod">COD</div>
                    <img className="vnpay" src={vnpay} alt="" />
                </div>

            </div>
        </div>
    );
}

export default Footer