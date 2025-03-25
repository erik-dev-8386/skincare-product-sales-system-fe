import React, { useEffect, useState } from "react";
import { Card, Statistic, Row, Col, Layout, Alert, Button } from "antd";
import {
  TeamOutlined, // Người dùng
  UsergroupAddOutlined, // Nhân viên
  ShoppingOutlined, // Sản phẩm
  TagOutlined, // Thương hiệu
  FolderOutlined, // Danh mục
  GiftOutlined, // Khuyến mãi
  SkinOutlined, // Loại da
  QuestionCircleOutlined, // Câu hỏi
  MessageOutlined, // Câu trả lời
  FileTextOutlined,
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import api from "../../../config/api";
import "./DashBoard.css";

// Component Biểu Đồ Doanh Thu Hàng Tháng
const MonthlyRevenueChart = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Doanh Thu",
        data: [],
      },
    ],
    options: {
      chart: { type: "area", height: 350, zoom: { enabled: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      title: { text: "Doanh Thu Hàng Tháng", align: "left" },
      xaxis: {
        type: "category",
        categories: [],
      },
      yaxis: {
        labels: {
          formatter: (value) => `${value.toLocaleString()}₫`,
        },
      },
      tooltip: {
        x: { format: "MM/yyyy" },
        y: { formatter: (value) => `${value.toLocaleString()}₫` },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100],
        },
      },
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonthlyRevenue = async () => {
    setLoading(true);
    try {
      const response = await api.get("orders/revenue/monthly");
      const monthlyRevenue = response.data;

      // Kiểm tra và xử lý dữ liệu
      if (!monthlyRevenue || monthlyRevenue.length === 0) {
        throw new Error("Không có dữ liệu doanh thu");
      }

      // Sắp xếp dữ liệu
      const sortedData = monthlyRevenue.sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.month - b.month
      );

      // Tạo categories và series
      const categories = sortedData.map(
        (item) => `Tháng ${item.month}/${item.year}`
      );

      const series = [
        {
          name: "Doanh Thu",
          data: sortedData.map((item) => item.totalRevenue),
        },
      ];

      // Cập nhật state
      setChartData((prevState) => ({
        ...prevState,
        series: series,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: categories,
          },
        },
      }));

      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải dữ liệu doanh thu:", error);
      setError(error);
      setLoading(false);
    }
  };

  // Gọi fetch dữ liệu khi component mount
  useEffect(() => {
    fetchMonthlyRevenue();
  }, []);

  // Xử lý trạng thái loading
  if (loading) {
    return <Card loading={true}>Đang tải biểu đồ doanh thu...</Card>;
  }

  // Xử lý lỗi
  if (error) {
    return (
      <Card title="Lỗi Doanh Thu">
        <Alert
          message="Không thể tải dữ liệu doanh thu"
          description={error.message || "Lỗi không xác định"}
          type="warning"
          showIcon
          action={
            <Button size="small" type="text" onClick={fetchMonthlyRevenue}>
              Thử lại
            </Button>
          }
        />
      </Card>
    );
  }

  // Render biểu đồ
  return (
    <Card title="Biểu Đồ Doanh Thu Hàng Tháng">
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height={350}
      />
    </Card>
  );
};

// Component Dashboard Chính
export default function DashBoard() {
  // State cho các dữ liệu dashboard
  const [dashboardData, setDashboardData] = useState({
    users: [],
    staff: [],
    products: [],
    brands: [],
    categories: [],
    discounts: [],
    skinTypes: [],
    questions: [],
    answers: [],
    blogs: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm fetch dữ liệu chung
  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints = [
        { key: "users", path: "/users/customers" },
        { key: "staff", path: "/users/admin-staff" },
        { key: "products", path: "/products" },
        { key: "brands", path: "/brands" },
        { key: "categories", path: "/categories" },
        { key: "discounts", path: "/discounts" },
        { key: "skinTypes", path: "/skin-types" },
        { key: "questions", path: "/questions" },
        { key: "answers", path: "/answers" },
        { key: "blogs", path: "/blogs" },
      ];

      const requests = endpoints.map(async (endpoint) => {
        try {
          const response = await api.get(endpoint.path);
          return { [endpoint.key]: response.data };
        } catch (error) {
          console.warn(`Lỗi tải ${endpoint.key}:`, error);
          return { [endpoint.key]: [] };
        }
      });

      const results = await Promise.all(requests);
      const combinedData = results.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );

      setDashboardData(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tổng quát:", error);
      setError(error);
      setLoading(false);
    }
  };

  // Gọi fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Render các thẻ thống kê
  const renderStatisticCards = () => {
    const statisticData = [
      {
        title: "Tổng Người Dùng",
        value: dashboardData.users.length,
        icon: <TeamOutlined style={{ color: "#1890ff" }} />,
      },
      {
        title: "Tổng Nhân Viên",
        value: dashboardData.staff.length,
        icon: <UsergroupAddOutlined style={{ color: "#52c41a" }} />,
      },
      {
        title: "Tổng Sản Phẩm",
        value: dashboardData.products.length,
        icon: <ShoppingOutlined style={{ color: "#faad14" }} />,
      },
      {
        title: "Tổng Thương Hiệu",
        value: dashboardData.brands.length,
        icon: <TagOutlined style={{ color: "#eb2f96" }} />,
      },
      {
        title: "Tổng Danh Mục",
        value: dashboardData.categories.length,
        icon: <FolderOutlined style={{ color: "#722ed1" }} />,
      },
      {
        title: "Tổng Khuyến Mãi",
        value: dashboardData.discounts.length,
        icon: <GiftOutlined style={{ color: "#13c2c2" }} />,
      },
      {
        title: "Tổng Loại Da",
        value: dashboardData.skinTypes.length,
        icon: <SkinOutlined style={{ color: "#ff4d4f" }} />,
      },
      {
        title: "Tổng Câu Hỏi",
        value: dashboardData.questions.length,
        icon: <QuestionCircleOutlined style={{ color: "#2f54eb" }} />,
      },
      {
        title: "Tổng Câu Trả Lời",
        value: dashboardData.answers.length,
        icon: <MessageOutlined style={{ color: "#722ed1" }} />,
      },
      {
        title: "Tổng Bài Viết",
        value: dashboardData.blogs.length,
        icon: <FileTextOutlined style={{ color: "#fa8c16" }} />,
      },
    ];

    return (
      <Row gutter={[16, 16]}>
        {statisticData.map((stat, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  // Xử lý trạng thái loading
  if (loading) {
    return <Card loading={true}>Đang tải dữ liệu...</Card>;
  }

  // Xử lý lỗi
  if (error) {
    return (
      <Card title="Lỗi Tải Dữ Liệu">
        <Alert
          message="Không thể tải dữ liệu dashboard"
          description={error.message || "Lỗi không xác định"}
          type="error"
          showIcon
          action={
            <Button size="small" type="text" onClick={fetchData}>
              Thử lại
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <Layout className="dashboard-container">
      {/* Các thẻ thống kê */}
      {renderStatisticCards()}

      {/* Biểu đồ doanh thu */}
      <Row className="mt-4">
        <Col span={24}>
          <MonthlyRevenueChart />
        </Col>
      </Row>
    </Layout>
  );
}
