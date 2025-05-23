import { Table, Card, Typography, Tag } from "antd";
import { useEffect, useState } from "react";
import api from "../../../config/api";
import Header from "../../../component/Header/Header";
import Footer from "../../../component/Footer/Footer";
import "./CustomerDiscounts.css"

const { Title, Text } = Typography;



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
            render: (text) => (
                <div dangerouslySetInnerHTML={{ __html: text && typeof text === "string" ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : "" }} />
              ),
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
     
    ];

    return (
        <>
        
        <Card>
            <Title className="discount-title" style={{color: "#900001"}} level={2}>Danh sách mã giảm giá</Title>
            <Text>Khám phá các chương trình giảm giá và ưu đãi mới nhất dành cho bạn.</Text>
            <Table dataSource={discounts} columns={columns} rowKey="discountId" style={{ marginTop: 16 }} />
        </Card>
      
        </>
    );
};

export default CustomerDiscounts;