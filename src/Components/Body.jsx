import React from 'react'
import './Body.css'
export default function Body() {
  return (
    <>
     
      <div className='container'>
        <div className="row">
        <h5 className='trang'>Trang chủ</h5>
        </div>
        <div className="row">
          <div className="col-12">
            <h3 className='hot'>Hot deal</h3>
          </div>
          <div className="col-12">
            <img src="/images/hotdeal.jpg" alt="hot deal" className="hotdeal" />
          </div>
          <div className="col-12">
            <h3 className="san">Sản phẩm phù hợp với da</h3>
          </div>

          <div className="row" style={{ justifyContent: "center", marginBottom: "50px" }}>
            <div className="col-3">
              <img src="/images/s1.jpg" alt="Haven SkinLogo" className="s1" />
            </div>
            <div className="col-3">
              <img src="/images/s1.jpg" alt="Haven SkinLogo" className="s1" />
            </div>
            <div className="col-3">
              <img src="/images/s1.jpg" alt="Haven SkinLogo" className="s1" />
            </div>
            <div className="col-3">
              <img src="/images/s1.jpg" alt="Haven SkinLogo" className="s1" />
            </div>
          </div>



        </div>
      </div>
    </>
  )
}
