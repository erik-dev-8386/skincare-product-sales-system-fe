import React from 'react'
import './Body.css'
import hot from '../../../assets/home/hotdeal.jpg'
import Slider from './Slider'; 
import s1 from '../../../assets/home/s1.jpg'
import s3 from '../../../assets/home/s3.jpg'
import s4 from '../../../assets/home/s4.jpg'
import s5 from '../../../assets/home/s5.jpg'
import s7 from '../../../assets/home/s7.jpg'
import s8 from '../../../assets/home/s8.jpg'
import s6 from '../../../assets/home/s6.jpg'
export default function Body() {
  const hotDealSlides = [
    { src: hot, title: "Hot Deal 1"} ,
    { src: hot, title: "Hot Deal 2"},
    { src: hot, title: "Hot Deal 3"},
  ];
  return (
    <>
     
      <div className='container home-page'>
        <div className="row">
        <h5 className='trang'>Trang chủ</h5>
        </div>
        <div className="row">
          <div className="col-12">
            <h3 className='hot'>Hot deal</h3>
          </div>
          <div className="col-12">
          <Slider slides={hotDealSlides} /> {/* Truyền dữ liệu vào Slider */}
          </div>

          <div className="col-12">
            <h3 className="san">Sản phẩm phù hợp với da</h3>
          </div>

          <div className="row" style={{ justifyContent: "center", marginBottom: "50px" }}>
            <div className="col-3">
              <img src={s1} alt="Haven SkinLogo" className="s1" />
            </div>
            <div className="col-3">
              <img src={s1} alt="Haven SkinLogo" className="s1" />
            </div>
            <div className="col-3">
              <img src={s1} alt="Haven SkinLogo" className="s1" />
            </div>
            <div className="col-3">
              <img src={s1} alt="Haven SkinLogo" className="s1" />
            </div>
          </div>
          
          <div className="col-12">
            <h3 className="san">Top sản phẩm bán chạy</h3>
          </div>

          <div className="row" style={{ justifyContent: "center", marginBottom: "50px" }}>
            <div className="col-4">
              <img src={s6} alt="Haven SkinLogo" className="sv" />
            </div>
            <div className="col-4">
              <img src={s7} alt="Haven SkinLogo" className="sv" />
            </div>
            <div className="col-4">
              <img src={s8} alt="Haven SkinLogo" className="sv" />
            </div>
            {/* <div className="col-3">
              <img src={s1} alt="Haven SkinLogo" className="s1" />
            </div> */}
          </div>
   
          <div className="col-12">
            <h3 className="san">Blog</h3>
          </div>

          <div className="row" style={{ justifyContent: "center", marginBottom: "50px" }}>
            <div className="col-4">
              <img src={s3} alt="Haven SkinLogo" className="ss" />
              <br />
              <br />
              Tại Sao Triệt Lông Xong Lại Thấy Lông Mọc Nhiều Hơn?
            </div>
            <div className="col-4">
              <img src={s4} alt="Haven SkinLogo" className="ss" />
              <br />
              <br />
              7 Cách Sử Dụng Toner 12% Emmié Bạn Đã Biết Chưa?

            </div>
            <div className="col-4">
              <img src={s5} alt="Haven SkinLogo" className="ss" />
              <br />
              <br />
              Tại Sao Triệt Lông Xong Lại Thấy Lông Mọc Nhiều Hơn?
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
