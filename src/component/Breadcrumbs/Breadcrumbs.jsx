import { Link, useLocation } from "react-router-dom"
import "./Breadcrumbs.css"
import { HomeOutlined, ShoppingOutlined, PercentageOutlined, QuestionCircleOutlined, ShoppingCartOutlined } from "@ant-design/icons"

export default function Breadcrumbs() {
    const location = useLocation()

    let currentLink = ''

    const crumbs = location.pathname.split('/')
        .filter(crumb => crumb !== '')
        .map(crumb => {
            currentLink += `/${crumb}`

            // Check if current crumb is 'products'
            if (crumb === 'products') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            <ShoppingOutlined /> Sản phẩm
                        </Link>
                    </div>
                )
            }

            // Check if current crumb is 'customer-discounts'
            if (crumb === 'customer-discounts') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            <PercentageOutlined /> Giảm giá
                        </Link>
                    </div>
                )
            }

            if (crumb === 'blog') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            <i className="fa-solid fa-newspaper"></i> Blog
                        </Link>
                    </div>
                )
            }

            if (crumb === 'question') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            <QuestionCircleOutlined /> Bài kiểm tra
                        </Link>
                    </div>
                )
            }

            if (crumb === 'about-me') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            <i className="fa-regular fa-bell"></i> Về chúng tôi
                        </Link>
                    </div>
                )
            }

            if (crumb === 'listskincare') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            <i className="fa-solid fa-notes-medical"></i> Danh sách chăm sóc da
                        </Link>
                    </div>
                )
            }

            if (crumb === 'Thuong') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            Thường
                        </Link>
                    </div>
                )
            }

            if (crumb === 'Nhaycam') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            Nhạy cảm
                        </Link>
                    </div>
                )
            }

            if (crumb === 'Honhop') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            Hỗn hợp
                        </Link>
                    </div>
                )
            }

            if (crumb === 'Kho') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            Khô
                        </Link>
                    </div>
                )
            }

            if (crumb === 'Dau') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                            Dầu
                        </Link>
                    </div>
                )
            }

            if (crumb === 'shopping-cart') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                        <ShoppingCartOutlined />  Giỏ hàng
                        </Link>
                    </div>
                )
            }

            if (crumb === 'cart') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                        <i className="fa-solid fa-money-bill-transfer"></i>  Thanh toán
                        </Link>
                    </div>
                )
            }

            

            if (crumb === 'success-payment') {
                return (
                    <div className="crumb" key={crumb}>
                        <Link to={currentLink}>
                        <i className="fa-solid fa-circle-check"></i>  Trạng thái thanh toán
                        </Link>
                    </div>
                )
            }



            return (
                <div className="crumb" key={crumb}>
                    <Link to={currentLink}>{crumb}</Link>
                </div>
            )
        })

    return (
        <div className="breadcrumbs">
            {/* Home link with icon */}
            <div className="crumb">
                <Link to="/">
                    <HomeOutlined /> Trang chủ
                </Link>
            </div>
            {crumbs}
        </div>
    )
}