import logo from "../../assets/Logo_01.jpg"
import vnpay from "../../assets/VNPAY.jpg"
import "../Footer/Footer.css"

function Footer() {
    const b = new Date().getFullYear()
    return (
        <div className="footer ">
            <div className="address col-4">
                <p>Liên hệ với chúng tôi</p>
                <p>
                    <i className="fa-brands fa-facebook"></i>
                    <a href="https://www.facebook.com/profile.php?id=100084565232953&locale=vi_VN"> Haven Skin</a>
                </p>
                <p>
                    <i className="fa-solid fa-phone"></i>
                    0966340303
                </p>
                <p>
                    <i className="fa-solid fa-envelope"></i>
                    <a href="mailto: havenskin032025@gmail.com">havenskin032025@gmail.com</a>
                </p>
                <p>
                    <i className="fa-solid fa-location-dot"></i>
                    <a href="https://www.google.com/maps/place/Nh%C3%A0+V%C4%83n+h%C3%B3a+Sinh+vi%C3%AAn+
                    // TP.HCM/@10.8751312,106.8007233,17z/data=!3m1!4b1!4m6!3m5!1s0x3174d8a6b19d6763:0x14
                    // 3c54525028b2e!8m2!3d10.8751312!4d106.8007233!16s%2Fg%2F11hd1pf9gj?entry=ttu&g_ep=
                    // EgoyMDI1MDExNS4wIKXMDSoASAFQAw%3D%3D">Nhà Văn hóa Sinh viên TP.HCM</a>
                </p>
            </div>
            <div className="footer-logo">
                <a href="/"> <img className="logo col-4" src={logo} alt="" /></a>
                <small>&copy; {b} Copyright by HavenSkin. All rights reserved.</small>
            </div>
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