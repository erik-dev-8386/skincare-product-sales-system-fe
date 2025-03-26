import React, { useEffect, useState, useCallback } from "react";
import { Card, Statistic, Row, Col, Layout, Alert, Button } from "antd";
import {
  TeamOutlined,
  UsergroupAddOutlined,
  ShoppingOutlined,
  TagOutlined,
  FolderOutlined,
  GiftOutlined,
  SkinOutlined,
  QuestionCircleOutlined,
  MessageOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import ReactApexChart from "react-apexcharts";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';import api from "../../../config/api";
import "./DashBoard.css";
import { webSocketService, fetchMonthlySales } from "../../../config/websocket.service";

// Component Biểu Đồ Doanh Thu Hàng Tháng
const MonthlyRevenueChart = () => {
  const [chartData, setChartData] = useState({
    series: [{ name: "Doanh Thu", data: [] }],
    options: {
      chart: { type: "area", height: 350, zoom: { enabled: false } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      title: { text: "Doanh Thu Hàng Tháng", align: "left" },
      xaxis: { type: "category", categories: [] },
      yaxis: {
        labels: { 
          formatter: (value) => `${Number(value).toLocaleString()}₫`,
          title: { text: 'Doanh Thu (₫)' }
        },
      },
      tooltip: {
        x: { format: "MM/yyyy" },
        y: { formatter: (value) => `${Number(value).toLocaleString()}₫` },
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

  const fetchMonthlyRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("orders/revenue/monthly");
      const monthlyRevenue = response.data;

      if (!monthlyRevenue || monthlyRevenue.length === 0) {
        throw new Error("Không có dữ liệu doanh thu");
      }

      const sortedData = monthlyRevenue.sort((a, b) =>
        a.year !== b.year ? a.year - b.year : a.month - b.month
      );

      const categories = sortedData.map(
        (item) => `Tháng ${item.month}/${item.year}`
      );

      const series = [{
        name: "Doanh Thu",
        data: sortedData.map((item) => item.totalRevenue),
      }];

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
  }, []);

  useEffect(() => {
    fetchMonthlyRevenue();
  }, [fetchMonthlyRevenue]);

  if (loading) {
    return <Card loading={true}>Đang tải biểu đồ doanh thu...</Card>;
  }

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
// Biểu đồ bán hàng
const ProductSalesChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processData = (salesRes) => {
    // Nhóm dữ liệu theo tháng
    const monthlyData = {};
    
    salesRes.forEach(item => {
      const monthKey = `Tháng ${item.month}/${item.year}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      monthlyData[monthKey][item.productName] = item.totalSales;
    });

    // Chuyển đổi thành dạng phù hợp cho biểu đồ
    return Object.keys(monthlyData).map(month => ({
      name: month,
      ...monthlyData[month]
    }));
  };

  const fetchProductSales = useCallback(async () => {
    setLoading(true);
    try {
      const salesRes = await fetchMonthlySales();
      const processedData = processData(salesRes);
      setChartData(processedData);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải dữ liệu bán hàng:", error);
      setError(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductSales();

    const handleNewSalesData = (newData) => {
      const processedData = processData(newData);
      setChartData(processedData);
    };

    webSocketService.connect(handleNewSalesData, (error) => {
      console.error("WebSocket error:", error);
    });

    return () => {
      webSocketService.disconnect();
    };
  }, [fetchProductSales]);

  if (loading) {
    return <Card loading={true}>Đang tải biểu đồ bán hàng...</Card>;
  }

  if (error) {
    return (
      <Card title="Lỗi Bán Hàng">
        <Alert
          message="Không thể tải dữ liệu bán hàng"
          description={error.message || "Lỗi không xác định"}
          type="warning"
          showIcon
          action={
            <Button size="small" type="text" onClick={fetchProductSales}>
              Thử lại
            </Button>
          }
        />
      </Card>
    );
  }

  // Lấy danh sách sản phẩm để tạo các Bar
  const productNames = Array.from(new Set(
    chartData.flatMap(month => Object.keys(month).filter(key => key !== 'name'))
  ));

  // Màu sắc cho từng sản phẩm
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

  return (
    <Card title="Thống Kê Bán Hàng Theo Tháng">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              label={{ 
                value: 'Tháng', 
                position: 'insideBottomRight', 
                offset: 0 
              }}
            />
            <YAxis 
              label={{ 
                value: 'Số Lượng Bán', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip 
              formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
              labelFormatter={(label) => `Tháng: ${label}`}
            />
            <Legend />
            {productNames.map((product, index) => (
              <Bar 
                key={product}
                dataKey={product}
                name={product}
                fill={colors[index % colors.length]}
                animationDuration={1000}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-4">Không có dữ liệu bán hàng</div>
      )}
    </Card>
  );
};
// Component Dashboard Chính
export default function DashBoard() {
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

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  if (loading) {
    return <Card loading={true}>Đang tải dữ liệu...</Card>;
  }

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
      
      {/* Biểu đồ doanh thu và bán hàng */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={12}>
          <MonthlyRevenueChart />
        </Col>
        <Col span={12}>
          <ProductSalesChart />
        </Col>
      </Row>
    </Layout>
  );
}