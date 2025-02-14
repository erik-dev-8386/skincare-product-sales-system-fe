import React from 'react'
import './Skin.css'
import dakho1 from '../../../assets/da/dakho1.jpg';
import dakho2 from '../../../assets/da/dakho2.jpg';
import dakho3 from '../../../assets/da/dakho3.jpg';
import Footer from "../../../component/Footer/Footer";
import Header from '../../../component/Header/Header'
export default function Kho() {
  {
    return (
      <>
        <Header />
        <div className='container'>
          <div className="row">
            < h5 className='trang'> Trang chủ {'>'} Lộ trình chăm sóc da {'>'} Da khô</h5>
          </div>
          <div className="row">
            <div className="col-12">
              <h3 className="san">Da khô</h3>
            </div>
          </div>

          <div className='row'>
            <div className='col-4'>
              <img src={dakho1} alt="Da kho" className='da' />
            </div>
            <div className='col-4'>
              <img src={dakho2} alt="Da kho" className='da' />
            </div>
            <div className='col-4'>
              <img src={dakho3} alt="Da kho" className='da' />
            </div>
          </div>
          <br /><br /><br/><br /><br/>
          <div className="row">
            < h5 className='dautrang'> Chăm sóc da khô</h5>
          </div>
          <br/>
          <div className="row">
            <div className='col-6 list-container'>
              < h5 className='skin'> Các bước chăm sóc da khô dành cho ban ngày</h5><br/>
              <ul>
                <li>Bước 1: Tẩy trang</li><br/>
                <li>Bước 2: Rửa mặt bằng sữa rửa mặt</li><br/>
                <li>Bước 3: Sử dụng Toner cân bằng da</li><br/>
                <li>Bước 4: Thoa sản phẩm đặc trị</li><br/>
                <li>Bước 5: Thoa Serum hoặc tinh chất dưỡng da</li><br/>
                <li>Bước 6: Bôi kem dưỡng ẩm</li><br/>
                <li>Bước 7: Bôi kem chống nắng</li><br/>
              </ul>

            </div>

            <div className='col-6 list-container'>
              <h5 className='skin'>Các bước chăm sóc da khô dành cho ban đêm</h5><br/>
              <ul>
                <li>Bước 1: Tẩy trang</li><br/>
                <li>Bước 2: Rửa mặt bằng sữa rửa mặt</li><br/>
                <li>Bước 3: Tẩy tế bào chết</li><br/>
                <li>Bước 4: Dùng toner/ nước hoa hồng</li><br/>
                <li>Bước 5: Đắp mặt nạ</li><br/>
                <li>Bước 6: Dùng sản phẩm đặc trị</li><br/>
                <li>Bước 7: Thoa Serum hoặc tinh chất dưỡng da</li><br/>
                <li>Bước 8: Thoa lotion</li><br/>
                <li>Bước 9: Dùng kem dưỡng ẩm</li><br/>
                <li>Bước 10: Bôi kem mắt</li><br/>
                <li>Bước 11: Đắp mặt nạ</li><br/>
              </ul>
            </div>
          </div>
          <br/><br/>
          <div className="row">
            <div className="col-12">
              <h3 className="san">Một số sản phẩm dành cho da khô</h3> <br/><br/>
            </div>
          </div>
          <div className='row'>
            <div className='col-4'>
              <img src={dakho1} alt="Da kho" className='da' />
            </div>
            <div className='col-4'>
              <img src={dakho2} alt="Da kho" className='da' />
            </div>
            <div className='col-4'>
              <img src={dakho3} alt="Da kho" className='da' />
            </div>
          </div>
          <br/> <br/> <br/>
          <div className='row'>
            <div className='col-4'>
              <img src={dakho1} alt="Da kho" className='da' />
            </div>
            <div className='col-4'>
              <img src={dakho2} alt="Da kho" className='da' />
            </div>
            <div className='col-4'>
              <img src={dakho3} alt="Da kho" className='da' />
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }
}
