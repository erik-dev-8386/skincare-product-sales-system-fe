import React from "react";
import "./Skin.css";
import dat1 from "../../../assets/da/dat1.jpg";
import dat2 from "../../../assets/da/dat2.jpg";
import dat3 from "../../../assets/da/dat3.jpg";
import sp1 from "../../../assets/da/sp1.jpg";
import sp2 from "../../../assets/da/sp2.jpg";
import sp3 from "../../../assets/da/sp3.jpg";
import sp4 from "../../../assets/da/sp4.jpg";
import sp5 from "../../../assets/da/sp5.jpg";
import sp6 from "../../../assets/da/sp6.jpg";
import Footer from "../../../component/Footer/Footer";
import Header from "../../../component/Header/Header";
export default function Kho() {
  {
    return (
      <>
        {/* <Header /> */}
        <div className="container">
          <div className="row">
            <h5 className="trang">
              {" "}
              Trang chủ {">"} Lộ trình chăm sóc da {">"} Da thường
            </h5>
          </div>
          <div className="row">
            <div className="col-12">
              <h3 className="san">Da thường</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <img src={dat1} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={dat2} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={dat3} alt="Da kho" className="da" />
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="row">
            <h5 className="dautrang"> Chăm sóc da thường</h5>
          </div>
          <br />
          <div className="row">
            <div className="col-6 list-container">
              <h5 className="skin">
                {" "}
                Các bước chăm sóc da thường dành cho ban ngày
              </h5>
              <br />
              <ul className="buoctaytrang">
                <li className="buoc">Bước 1: Tẩy trang</li>
                <br />
                <li className="buoc">Bước 2: Rửa mặt bằng sữa rửa mặt</li>
                <br />
                <li className="buoc">Bước 3: Sử dụng Toner cân bằng da</li>
                <br />
                <li className="buoc">Bước 4: Thoa sản phẩm đặc trị</li>
                <br />
                <li className="buoc">
                  Bước 5: Thoa Serum hoặc tinh chất dưỡng da
                </li>
                <br />
                <li className="buoc">Bước 6: Bôi kem dưỡng ẩm</li>
                <br />
                <li className="buoc">Bước 7: Bôi kem chống nắng</li>
                <br />
              </ul>
            </div>

            <div className="col-6 list-container">
              <h5 className="skin">
                Các bước chăm sóc da thường dành cho ban đêm
              </h5>
              <br />
              <ul className="buoctaytrang">
                <li className="buoc">Bước 1: Tẩy trang</li>
                <br />
                <li className="buoc">Bước 2: Rửa mặt bằng sữa rửa mặt</li>
                <br />
                <li className="buoc">Bước 3: Tẩy tế bào chết</li>
                <br />
                <li className="buoc">Bước 4: Dùng toner/ nước hoa hồng</li>
                <br />
                <li className="buoc">Bước 5: Đắp mặt nạ</li>
                <br />
                <li className="buoc">Bước 6: Dùng sản phẩm đặc trị</li>
                <br />
                <li className="buoc">
                  Bước 7: Thoa Serum hoặc tinh chất dưỡng da
                </li>
                <br />
                <li className="buoc">Bước 8: Thoa lotion</li>
                <br />
                <li className="buoc">Bước 9: Dùng kem dưỡng ẩm</li>
                <br />
                <li className="buoc">Bước 10: Bôi kem mắt</li>
                <br />
                <li className="buoc">Bước 11: Đắp mặt nạ</li>
                <br />
              </ul>
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col-12">
              <h3 className="san">Một số sản phẩm dành cho da thường</h3> <br />
              <br />
            </div>
          </div>
          <div className="row">
            <div className="col-4">
              <img src={sp1} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={sp2} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={sp3} alt="Da kho" className="da" />
            </div>
          </div>
          <br /> <br /> <br />
          <div className="row">
            <div className="col-4">
              <img src={sp4} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={sp5} alt="Da kho" className="da" />
            </div>
            <div className="col-4">
              <img src={sp6} alt="Da kho" className="da" />
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }
}
