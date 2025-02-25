import { Table, Card, Typography, Tag } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import Header from "../../../component/Header/Header";
import Footer from "../../../component/Footer/Footer";
import "./CustomerDiscounts.css"

const { Title, Text } = Typography;

// const statusMapping = {
//     0: { label: "EXPIRED", color: "red" },
//     1: { label: "UPCOMING", color: "blue" },
//     2: { label: "ACTIVE", color: "green" },
//     3: { label: "DISABLED", color: "gray" },
// };

const CustomerDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await api.get("/discounts");
                const activeDiscounts = response.data.filter(discount => discount.status === 2);
                setDiscounts(activeDiscounts);
            } catch (error) {
                console.error("Error fetching discount data:", error.response?.data || error.message);
            }
        };
        fetchDiscounts();
    }, []);

    const columns = [
        {
            title: "Mã giảm giá",
            dataIndex: "discountCode",
            key: "discountCode",
            render: (code) => <Tag color="gold">{code}</Tag>,
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Phần trăm giảm giá",
            dataIndex: "discountPercent",
            key: "discountPercent",
            render: (percent) => `${percent}%`,
        },
        {
            title: "Ngày áp dụng",
            dataIndex: "actualStartTime",
            key: "actualStartTime",
        },
        {
            title: "Ngày hết hạn",
            dataIndex: "actualEndTime",
            key: "actualEndTime",
        },
        // {
        //     title: "Status",
        //     dataIndex: "status",
        //     key: "status",
        //     render: (status) => {
        //         const { label, color } = statusMapping[status] || { label: "UNKNOWN", color: "default" };
        //         return <Tag color={color}>{label}</Tag>;
        //     },
        // },
    ];

    return (
        <>
        {/* <Header/> */}
        <div className="container">
        <Card>
            <Title className="discount-title" style={{color: "white"}} level={2}>Danh sách mã giảm giá</Title>
            <Text>Khám phá các chương trình giảm giá và ưu đãi mới nhất dành cho bạn.</Text>
            <Table dataSource={discounts} columns={columns} rowKey="discountId" style={{ marginTop: 16 }} />
        </Card>
        </div>
        {/* <Footer/> */}
        </>
    );
};

export default CustomerDiscounts;