import React from "react";
import "./AboutMe.css"; // Import CSS để tạo hiệu ứng giống ảnh mẫu
import Header from "../../../component/Header/Header";
import Footer from "../../../component/Footer/Footer";
import { Link } from "react-router-dom";

export default function AboutMe() {
    return (
        <>
            {/* <Header /> */}
            <section className="about-us-section">
                <div className="overlay">
                    <div className="content">
                        <h1 className="title" style={{color: "white"}}>Giới thiệu về chúng tôi</h1>
                        <p className="description">
                            Tại Haven Skin, chúng tôi tin rằng làn da của bạn không chỉ xứng đáng được chăm sóc
                            mà còn cần một chế độ nuôi dưỡng chuyên sâu để luôn duy trì sự rạng rỡ. Được xây dựng
                            trên ba giá trị cốt lõi: chất lượng, minh bạch và bền vững, chúng tôi mang đến những
                            sản phẩm chăm sóc da được nghiên cứu kỹ lưỡng, đảm bảo vừa an toàn, vừa hiệu quả,
                            giúp bạn tự tin với vẻ đẹp tự nhiên của chính mình.

                        </p>
                        <br />
                        <p className="description">
                            Hành trình của Haven Skin bắt đầu từ niềm đam mê với những tinh túy từ thiên nhiên
                            và mong muốn mang đến các giải pháp chăm sóc da thực sự phù hợp với mọi loại da.
                            Chúng tôi không chỉ chọn lọc các thành phần tinh khiết và lành tính nhất,
                            mà còn kết hợp công nghệ tiên tiến để tạo ra những sản phẩm vừa có khả năng phục hồi,
                            vừa bảo vệ làn da khỏi các tác nhân gây hại từ môi trường. Mỗi sản phẩm trong bộ sưu tập
                            đều được phát triển dựa trên sự thấu hiểu sâu sắc về nhu cầu của từng làn da.

                        </p>
                        <br />
                        <p className="description">
                            Với sứ mệnh trở thành người bạn đồng hành đáng tin cậy trong hành trình làm đẹp của bạn,
                            Haven Skin cam kết không chỉ cung cấp các sản phẩm chất lượng cao mà còn mang đến
                            những lời khuyên chuyên sâu, giúp bạn xây dựng một chu trình dưỡng da phù hợp và khoa học.
                            Chúng tôi tin rằng, chăm sóc da không chỉ đơn thuần là một thói quen, mà còn là một hành trình yêu thương
                            và trân trọng chính bản thân mình.

                        </p>
                        <br />
                        <p className="description">
                            Cảm ơn bạn đã lựa chọn Haven Skin! Hãy để chúng tôi đồng hành cùng bạn trên con đường
                            chinh phục làn da khỏe mạnh, rạng rỡ và tràn đầy sức sống. Chúng tôi mong rằng mỗi sản phẩm
                            bạn sử dụng sẽ không chỉ là một bước dưỡng da, mà còn là một khoảnh khắc thư giãn,
                            giúp bạn kết nối với bản thân và tận hưởng sự chăm sóc tinh tế mà Haven Skin mang đến.

                        </p>
                        <br />
                        <h1 className="title" style={{color: "white"}}>Liên hệ với chúng tôi</h1>
                        <div className="contact-container">
                            <p>
                                <i className="fa-brands fa-facebook"></i>
                                <Link to="https://www.facebook.com/profile.php?id=100084565232953&locale=vi_VN"
                                style={{color: "white", textDecoration: "none", fontSize: 20}}> Haven Skin</Link>
                            </p>
                            <p>
                                <i className="fa-solid fa-phone ph"></i><span className="phone-number">0966340303</span>
                            </p>
                            <p>
                                <i className="fa-solid fa-envelope"></i>
                                <Link to="mailto: havenskin032025@gmail.com"
                                style={{color: "white", textDecoration: "none", fontSize: 20}}> havenskin032025@gmail.com</Link>
                            </p>
                            <p>
                                <i className="fa-solid fa-location-dot"></i>
                                <Link to="https://www.google.com/maps/place/Nh%C3%A0+V%C4%83n+h%C3%B3a+Sinh+vi%C3%AAn+TP.HCM"
                                 style={{color: "white", textDecoration: "none", fontSize: 20}}> Nhà Văn hóa Sinh viên TP.HCM</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* <Footer /> */}
        </>
    );
}
