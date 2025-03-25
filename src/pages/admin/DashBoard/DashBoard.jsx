// // // import React, { useEffect, useState } from "react";
// // // import { Card, Statistic, Row, Col, Layout, Alert, Button } from "antd";
// // // import {
// // //   TeamOutlined, // Người dùng
// // //   UsergroupAddOutlined, // Nhân viên
// // //   ShoppingOutlined, // Sản phẩm
// // //   TagOutlined, // Thương hiệu
// // //   FolderOutlined, // Danh mục
// // //   GiftOutlined, // Khuyến mãi
// // //   SkinOutlined, // Loại da
// // //   QuestionCircleOutlined, // Câu hỏi
// // //   MessageOutlined, // Câu trả lời
// // //   FileTextOutlined,
// // // } from "@ant-design/icons";
// // // import ReactApexChart from "react-apexcharts";
// // // import api from "../../../config/api";
// // // import "./DashBoard.css";
// // // import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
// // // import { webSocketService, fetchMonthlySales } from "../../../config/websocket.service";

// // // // Component Biểu Đồ Doanh Thu Hàng Tháng
// // // const MonthlyRevenueChart = () => {
// // //   const [chartData, setChartData] = useState({
// // //     series: [
// // //       {
// // //         name: "Doanh Thu",
// // //         data: [],
// // //       },
// // //     ],
// // //     options: {
// // //       chart: { type: "area", height: 350, zoom: { enabled: false } },
// // //       dataLabels: { enabled: false },
// // //       stroke: { curve: "smooth" },
// // //       title: { text: "Doanh Thu Hàng Tháng", align: "left" },
// // //       xaxis: {
// // //         type: "category",
// // //         categories: [],
// // //       },
// // //       yaxis: {
// // //         labels: {
// // //           formatter: (value) => `${value.toLocaleString()}₫`,
// // //         },
// // //       },
// // //       tooltip: {
// // //         x: { format: "MM/yyyy" },
// // //         y: { formatter: (value) => `${value.toLocaleString()}₫` },
// // //       },
// // //       fill: {
// // //         type: "gradient",
// // //         gradient: {
// // //           shadeIntensity: 1,
// // //           opacityFrom: 0.7,
// // //           opacityTo: 0.9,
// // //           stops: [0, 100],
// // //         },
// // //       },
// // //     },
// // //   });

// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   const fetchMonthlyRevenue = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const response = await api.get("orders/revenue/monthly");
// // //       const monthlyRevenue = response.data;

// // //       // Kiểm tra và xử lý dữ liệu
// // //       if (!monthlyRevenue || monthlyRevenue.length === 0) {
// // //         throw new Error("Không có dữ liệu doanh thu");
// // //       }

// // //       // Sắp xếp dữ liệu
// // //       const sortedData = monthlyRevenue.sort((a, b) =>
// // //         a.year !== b.year ? a.year - b.year : a.month - b.month
// // //       );

// // //       // Tạo categories và series
// // //       const categories = sortedData.map(
// // //         (item) => `Tháng ${item.month}/${item.year}`
// // //       );

// // //       const series = [
// // //         {
// // //           name: "Doanh Thu",
// // //           data: sortedData.map((item) => item.totalRevenue),
// // //         },
// // //       ];

// // //       // Cập nhật state
// // //       setChartData((prevState) => ({
// // //         ...prevState,
// // //         series: series,
// // //         options: {
// // //           ...prevState.options,
// // //           xaxis: {
// // //             ...prevState.options.xaxis,
// // //             categories: categories,
// // //           },
// // //         },
// // //       }));

// // //       setLoading(false);
// // //     } catch (error) {
// // //       console.error("Lỗi tải dữ liệu doanh thu:", error);
// // //       setError(error);
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Gọi fetch dữ liệu khi component mount
// // //   useEffect(() => {
// // //     fetchMonthlyRevenue();
// // //   }, []);

// // //   // Xử lý trạng thái loading
// // //   if (loading) {
// // //     return <Card loading={true}>Đang tải biểu đồ doanh thu...</Card>;
// // //   }

// // //   // Xử lý lỗi
// // //   if (error) {
// // //     return (
// // //       <Card title="Lỗi Doanh Thu">
// // //         <Alert
// // //           message="Không thể tải dữ liệu doanh thu"
// // //           description={error.message || "Lỗi không xác định"}
// // //           type="warning"
// // //           showIcon
// // //           action={
// // //             <Button size="small" type="text" onClick={fetchMonthlyRevenue}>
// // //               Thử lại
// // //             </Button>
// // //           }
// // //         />
// // //       </Card>
// // //     );
// // //   }

// // //   // Render biểu đồ
// // //   return (
// // //     <Card title="Biểu Đồ Doanh Thu Hàng Tháng">
// // //       <ReactApexChart
// // //         options={chartData.options}
// // //         series={chartData.series}
// // //         type="area"
// // //         height={350}
// // //       />
// // //     </Card>
// // //   );
// // // };

// // // // Component Dashboard Chính
// // // export default function DashBoard() {
// // //   // State cho các dữ liệu dashboard
// // //   const [dashboardData, setDashboardData] = useState({
// // //     users: [],
// // //     staff: [],
// // //     products: [],
// // //     brands: [],
// // //     categories: [],
// // //     discounts: [],
// // //     skinTypes: [],
// // //     questions: [],
// // //     answers: [],
// // //     blogs: [],
// // //   });

// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);

// // //   // Hàm fetch dữ liệu chung
// // //   const fetchData = async () => {
// // //     setLoading(true);
// // //     try {
// // //       const endpoints = [
// // //         { key: "users", path: "/users/customers" },
// // //         { key: "staff", path: "/users/admin-staff" },
// // //         { key: "products", path: "/products" },
// // //         { key: "brands", path: "/brands" },
// // //         { key: "categories", path: "/categories" },
// // //         { key: "discounts", path: "/discounts" },
// // //         { key: "skinTypes", path: "/skin-types" },
// // //         { key: "questions", path: "/questions" },
// // //         { key: "answers", path: "/answers" },
// // //         { key: "blogs", path: "/blogs" },
// // //       ];

// // //       const requests = endpoints.map(async (endpoint) => {
// // //         try {
// // //           const response = await api.get(endpoint.path);
// // //           return { [endpoint.key]: response.data };
// // //         } catch (error) {
// // //           console.warn(`Lỗi tải ${endpoint.key}:`, error);
// // //           return { [endpoint.key]: [] };
// // //         }
// // //       });

// // //       const results = await Promise.all(requests);
// // //       const combinedData = results.reduce(
// // //         (acc, curr) => ({ ...acc, ...curr }),
// // //         {}
// // //       );

// // //       setDashboardData(combinedData);
// // //       setLoading(false);
// // //     } catch (error) {
// // //       console.error("Lỗi tổng quát:", error);
// // //       setError(error);
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // Gọi fetch dữ liệu khi component mount
// // //   useEffect(() => {
// // //     fetchData();
// // //   }, []);

// // //   // Render các thẻ thống kê
// // //   const renderStatisticCards = () => {
// // //     const statisticData = [
// // //       {
// // //         title: "Tổng Người Dùng",
// // //         value: dashboardData.users.length,
// // //         icon: <TeamOutlined style={{ color: "#1890ff" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Nhân Viên",
// // //         value: dashboardData.staff.length,
// // //         icon: <UsergroupAddOutlined style={{ color: "#52c41a" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Sản Phẩm",
// // //         value: dashboardData.products.length,
// // //         icon: <ShoppingOutlined style={{ color: "#faad14" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Thương Hiệu",
// // //         value: dashboardData.brands.length,
// // //         icon: <TagOutlined style={{ color: "#eb2f96" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Danh Mục",
// // //         value: dashboardData.categories.length,
// // //         icon: <FolderOutlined style={{ color: "#722ed1" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Khuyến Mãi",
// // //         value: dashboardData.discounts.length,
// // //         icon: <GiftOutlined style={{ color: "#13c2c2" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Loại Da",
// // //         value: dashboardData.skinTypes.length,
// // //         icon: <SkinOutlined style={{ color: "#ff4d4f" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Câu Hỏi",
// // //         value: dashboardData.questions.length,
// // //         icon: <QuestionCircleOutlined style={{ color: "#2f54eb" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Câu Trả Lời",
// // //         value: dashboardData.answers.length,
// // //         icon: <MessageOutlined style={{ color: "#722ed1" }} />,
// // //       },
// // //       {
// // //         title: "Tổng Bài Viết",
// // //         value: dashboardData.blogs.length,
// // //         icon: <FileTextOutlined style={{ color: "#fa8c16" }} />,
// // //       },
// // //     ];

// // //     return (
// // //       <Row gutter={[16, 16]}>
// // //         {statisticData.map((stat, index) => (
// // //           <Col key={index} xs={24} sm={12} md={6}>
// // //             <Card>
// // //               <Statistic
// // //                 title={stat.title}
// // //                 value={stat.value}
// // //                 prefix={stat.icon}
// // //                 valueStyle={{ color: "#3f8600" }}
// // //               />
// // //             </Card>
// // //           </Col>
// // //         ))}
// // //       </Row>
// // //     );
// // //   };

// // //   // Xử lý trạng thái loading
// // //   if (loading) {
// // //     return <Card loading={true}>Đang tải dữ liệu...</Card>;
// // //   }

// // //   // Xử lý lỗi
// // //   if (error) {
// // //     return (
// // //       <Card title="Lỗi Tải Dữ Liệu">
// // //         <Alert
// // //           message="Không thể tải dữ liệu dashboard"
// // //           description={error.message || "Lỗi không xác định"}
// // //           type="error"
// // //           showIcon
// // //           action={
// // //             <Button size="small" type="text" onClick={fetchData}>
// // //               Thử lại
// // //             </Button>
// // //           }
// // //         />
// // //       </Card>
// // //     );
// // //   }

// // //   return (
// // //     <Layout className="dashboard-container">
// // //       {/* Các thẻ thống kê */}
// // //       {renderStatisticCards()}

// // //       {/* Biểu đồ doanh thu */}
// // //       <Row className="mt-4">
// // //         <Col span={24}>
// // //           <MonthlyRevenueChart />
// // //         </Col>
// // //       </Row>
// // //     </Layout>
// // //   );
// // // }


// // import React, { useEffect, useState } from "react";
// // import { Card, Statistic, Row, Col, Layout, Alert, Button } from "antd";
// // import {
// //   TeamOutlined,
// //   UsergroupAddOutlined,
// //   ShoppingOutlined,
// //   TagOutlined,
// //   FolderOutlined,
// //   GiftOutlined,
// //   SkinOutlined,
// //   QuestionCircleOutlined,
// //   MessageOutlined,
// //   FileTextOutlined,
// // } from "@ant-design/icons";
// // import ReactApexChart from "react-apexcharts";
// // import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
// // import api from "../../../config/api";
// // import "./DashBoard.css";
// // import { webSocketService, fetchMonthlySales } from "../../../config/websocket.service";

// // // Component Biểu Đồ Doanh Thu Hàng Tháng
// // const MonthlyRevenueChart = () => {
// //   const [chartData, setChartData] = useState({
// //     series: [{ name: "Doanh Thu", data: [] }],
// //     options: {
// //       chart: { type: "area", height: 350, zoom: { enabled: false } },
// //       dataLabels: { enabled: false },
// //       stroke: { curve: "smooth" },
// //       title: { text: "Doanh Thu Hàng Tháng", align: "left" },
// //       xaxis: { type: "category", categories: [] },
// //       yaxis: {
// //         labels: { formatter: (value) => `${value.toLocaleString()}₫` },
// //       },
// //       tooltip: {
// //         x: { format: "MM/yyyy" },
// //         y: { formatter: (value) => `${value.toLocaleString()}₫` },
// //       },
// //       fill: {
// //         type: "gradient",
// //         gradient: {
// //           shadeIntensity: 1,
// //           opacityFrom: 0.7,
// //           opacityTo: 0.9,
// //           stops: [0, 100],
// //         },
// //       },
// //     },
// //   });

// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const fetchMonthlyRevenue = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await api.get("orders/revenue/monthly");
// //       const monthlyRevenue = response.data;

// //       if (!monthlyRevenue || monthlyRevenue.length === 0) {
// //         throw new Error("Không có dữ liệu doanh thu");
// //       }

// //       const sortedData = monthlyRevenue.sort((a, b) =>
// //         a.year !== b.year ? a.year - b.year : a.month - b.month
// //       );

// //       const categories = sortedData.map(
// //         (item) => `Tháng ${item.month}/${item.year}`
// //       );

// //       const series = [{
// //         name: "Doanh Thu",
// //         data: sortedData.map((item) => item.totalRevenue),
// //       }];

// //       setChartData((prevState) => ({
// //         ...prevState,
// //         series: series,
// //         options: {
// //           ...prevState.options,
// //           xaxis: {
// //             ...prevState.options.xaxis,
// //             categories: categories,
// //           },
// //         },
// //       }));

// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Lỗi tải dữ liệu doanh thu:", error);
// //       setError(error);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchMonthlyRevenue();
// //   }, []);

// //   if (loading) {
// //     return <Card loading={true}>Đang tải biểu đồ doanh thu...</Card>;
// //   }

// //   if (error) {
// //     return (
// //       <Card title="Lỗi Doanh Thu">
// //         <Alert
// //           message="Không thể tải dữ liệu doanh thu"
// //           description={error.message || "Lỗi không xác định"}
// //           type="warning"
// //           showIcon
// //           action={
// //             <Button size="small" type="text" onClick={fetchMonthlyRevenue}>
// //               Thử lại
// //             </Button>
// //           }
// //         />
// //       </Card>
// //     );
// //   }

// //   return (
// //     <Card title="Biểu Đồ Doanh Thu Hàng Tháng">
// //       <ReactApexChart
// //         options={chartData.options}
// //         series={chartData.series}
// //         type="area"
// //         height={350}
// //       />
// //     </Card>
// //   );
// // };

// // // Component Biểu Đồ Bán Hàng Theo Sản Phẩm
// // const ProductSalesChart = () => {
// //   const [salesData, setSalesData] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const fetchProductSales = async () => {
// //     setLoading(true);
// //     try {
// //       const salesRes = await fetchMonthlySales();
      
// //       // Xử lý dữ liệu bán hàng để phù hợp với biểu đồ
// //       const processedData = salesRes.map(item => ({
// //         name: item.productName,
// //         sales: item.totalSales,
// //         monthYear: `Tháng ${item.month}/${item.year}`,
// //         ...item
// //       }));

// //       setSalesData(processedData);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Lỗi tải dữ liệu bán hàng:", error);
// //       setError(error);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchProductSales();

// //     // Setup WebSocket connection for real-time updates
// //     const handleNewSalesData = (newData) => {
// //       const processedData = newData.map(item => ({
// //         name: item.productName,
// //         sales: item.totalSales,
// //         monthYear: `Tháng ${item.month}/${item.year}`,
// //         ...item
// //       }));
// //       setSalesData(processedData);
// //     };

// //     webSocketService.connect(handleNewSalesData, (error) => {
// //       console.error("WebSocket error:", error);
// //     });

// //     return () => {
// //       webSocketService.disconnect();
// //     };
// //   }, []);

// //   if (loading) {
// //     return <Card loading={true}>Đang tải biểu đồ bán hàng...</Card>;
// //   }

// //   if (error) {
// //     return (
// //       <Card title="Lỗi Bán Hàng">
// //         <Alert
// //           message="Không thể tải dữ liệu bán hàng"
// //           description={error.message || "Lỗi không xác định"}
// //           type="warning"
// //           showIcon
// //           action={
// //             <Button size="small" type="text" onClick={fetchProductSales}>
// //               Thử lại
// //             </Button>
// //           }
// //         />
// //       </Card>
// //     );
// //   }

// //   return (
// //     <Card title="Thống Kê Bán Hàng Theo Sản Phẩm">
// //       {salesData.length > 0 ? (
// //         <ResponsiveContainer width="100%" height={400}>
// //           <LineChart
// //             data={salesData}
// //             margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
// //           >
// //             <CartesianGrid strokeDasharray="3 3" />
// //             <XAxis 
// //               dataKey="name"
// //               label={{ value: 'Tên Sản Phẩm', position: 'insideBottomRight', offset: -10 }}
// //               tick={{ angle: -45, textAnchor: 'end' }}
// //             />
// //             <YAxis 
// //               label={{ value: 'Số Lượng Bán', angle: -90, position: 'insideLeft' }}
// //             />
// //             <Tooltip 
// //               formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
// //               labelFormatter={(label) => `Sản phẩm: ${label}`}
// //             />
// //             <Legend />
// //             <Line 
// //               type="monotone" 
// //               dataKey="sales" 
// //               name="Doanh số"
// //               stroke="#8884d8"
// //               strokeWidth={2}
// //               activeDot={{ r: 8 }}
// //               animationDuration={1000}
// //             />
// //           </LineChart>
// //         </ResponsiveContainer>
// //       ) : (
// //         <div className="text-center py-4">Không có dữ liệu bán hàng</div>
// //       )}
// //     </Card>
// //   );
// // };

// // // Component Dashboard Chính
// // export default function DashBoard() {
// //   const [dashboardData, setDashboardData] = useState({
// //     users: [],
// //     staff: [],
// //     products: [],
// //     brands: [],
// //     categories: [],
// //     discounts: [],
// //     skinTypes: [],
// //     questions: [],
// //     answers: [],
// //     blogs: [],
// //   });

// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const endpoints = [
// //         { key: "users", path: "/users/customers" },
// //         { key: "staff", path: "/users/admin-staff" },
// //         { key: "products", path: "/products" },
// //         { key: "brands", path: "/brands" },
// //         { key: "categories", path: "/categories" },
// //         { key: "discounts", path: "/discounts" },
// //         { key: "skinTypes", path: "/skin-types" },
// //         { key: "questions", path: "/questions" },
// //         { key: "answers", path: "/answers" },
// //         { key: "blogs", path: "/blogs" },
// //       ];

// //       const requests = endpoints.map(async (endpoint) => {
// //         try {
// //           const response = await api.get(endpoint.path);
// //           return { [endpoint.key]: response.data };
// //         } catch (error) {
// //           console.warn(`Lỗi tải ${endpoint.key}:`, error);
// //           return { [endpoint.key]: [] };
// //         }
// //       });

// //       const results = await Promise.all(requests);
// //       const combinedData = results.reduce(
// //         (acc, curr) => ({ ...acc, ...curr }),
// //         {}
// //       );

// //       setDashboardData(combinedData);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Lỗi tổng quát:", error);
// //       setError(error);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   const renderStatisticCards = () => {
// //     const statisticData = [
// //       {
// //         title: "Tổng Người Dùng",
// //         value: dashboardData.users.length,
// //         icon: <TeamOutlined style={{ color: "#1890ff" }} />,
// //       },
// //       {
// //         title: "Tổng Nhân Viên",
// //         value: dashboardData.staff.length,
// //         icon: <UsergroupAddOutlined style={{ color: "#52c41a" }} />,
// //       },
// //       {
// //         title: "Tổng Sản Phẩm",
// //         value: dashboardData.products.length,
// //         icon: <ShoppingOutlined style={{ color: "#faad14" }} />,
// //       },
// //       {
// //         title: "Tổng Thương Hiệu",
// //         value: dashboardData.brands.length,
// //         icon: <TagOutlined style={{ color: "#eb2f96" }} />,
// //       },
// //       {
// //         title: "Tổng Danh Mục",
// //         value: dashboardData.categories.length,
// //         icon: <FolderOutlined style={{ color: "#722ed1" }} />,
// //       },
// //       {
// //         title: "Tổng Khuyến Mãi",
// //         value: dashboardData.discounts.length,
// //         icon: <GiftOutlined style={{ color: "#13c2c2" }} />,
// //       },
// //       {
// //         title: "Tổng Loại Da",
// //         value: dashboardData.skinTypes.length,
// //         icon: <SkinOutlined style={{ color: "#ff4d4f" }} />,
// //       },
// //       {
// //         title: "Tổng Câu Hỏi",
// //         value: dashboardData.questions.length,
// //         icon: <QuestionCircleOutlined style={{ color: "#2f54eb" }} />,
// //       },
// //       {
// //         title: "Tổng Câu Trả Lời",
// //         value: dashboardData.answers.length,
// //         icon: <MessageOutlined style={{ color: "#722ed1" }} />,
// //       },
// //       {
// //         title: "Tổng Bài Viết",
// //         value: dashboardData.blogs.length,
// //         icon: <FileTextOutlined style={{ color: "#fa8c16" }} />,
// //       },
// //     ];

// //     return (
// //       <Row gutter={[16, 16]}>
// //         {statisticData.map((stat, index) => (
// //           <Col key={index} xs={24} sm={12} md={6}>
// //             <Card>
// //               <Statistic
// //                 title={stat.title}
// //                 value={stat.value}
// //                 prefix={stat.icon}
// //                 valueStyle={{ color: "#3f8600" }}
// //               />
// //             </Card>
// //           </Col>
// //         ))}
// //       </Row>
// //     );
// //   };

// //   if (loading) {
// //     return <Card loading={true}>Đang tải dữ liệu...</Card>;
// //   }

// //   if (error) {
// //     return (
// //       <Card title="Lỗi Tải Dữ Liệu">
// //         <Alert
// //           message="Không thể tải dữ liệu dashboard"
// //           description={error.message || "Lỗi không xác định"}
// //           type="error"
// //           showIcon
// //           action={
// //             <Button size="small" type="text" onClick={fetchData}>
// //               Thử lại
// //             </Button>
// //           }
// //         />
// //       </Card>
// //     );
// //   }

// //   return (
// //     <Layout className="dashboard-container">
// //       {/* Các thẻ thống kê */}
// //       {renderStatisticCards()}

// //       {/* Biểu đồ doanh thu và bán hàng */}
// //       <Row gutter={[16, 16]} className="mt-4">
// //         <Col span={12}>
// //           <MonthlyRevenueChart />
// //         </Col>
// //         <Col span={12}>
// //           <ProductSalesChart />
// //         </Col>
// //       </Row>
// //     </Layout>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { Card, Statistic, Row, Col, Layout, Alert, Button } from "antd";
// import {
//   TeamOutlined,
//   UsergroupAddOutlined,
//   ShoppingOutlined,
//   TagOutlined,
//   FolderOutlined,
//   GiftOutlined,
//   SkinOutlined,
//   QuestionCircleOutlined,
//   MessageOutlined,
//   FileTextOutlined,
// } from "@ant-design/icons";
// import ReactApexChart from "react-apexcharts";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
// import api from "../../../config/api";
// import "./DashBoard.css";
// import { webSocketService, fetchMonthlySales } from "../../../config/websocket.service";

// // Component Biểu Đồ Doanh Thu Hàng Tháng
// const MonthlyRevenueChart = () => {
//   const [chartData, setChartData] = useState({
//     series: [{ name: "Doanh Thu", data: [] }],
//     options: {
//       chart: { type: "area", height: 350, zoom: { enabled: false } },
//       dataLabels: { enabled: false },
//       stroke: { curve: "smooth" },
//       title: { text: "Doanh Thu Hàng Tháng", align: "left" },
//       xaxis: { type: "category", categories: [] },
//       yaxis: {
//         labels: { formatter: (value) => `${value.toLocaleString()}₫` },
//       },
//       tooltip: {
//         x: { format: "MM/yyyy" },
//         y: { formatter: (value) => `${value.toLocaleString()}₫` },
//       },
//       fill: {
//         type: "gradient",
//         gradient: {
//           shadeIntensity: 1,
//           opacityFrom: 0.7,
//           opacityTo: 0.9,
//           stops: [0, 100],
//         },
//       },
//     },
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchMonthlyRevenue = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get("orders/revenue/monthly");
//       const monthlyRevenue = response.data;

//       if (!monthlyRevenue || monthlyRevenue.length === 0) {
//         throw new Error("Không có dữ liệu doanh thu");
//       }

//       const sortedData = monthlyRevenue.sort((a, b) =>
//         a.year !== b.year ? a.year - b.year : a.month - b.month
//       );

//       const categories = sortedData.map(
//         (item) => `Tháng ${item.month}/${item.year}`
//       );

//       const series = [{
//         name: "Doanh Thu",
//         data: sortedData.map((item) => item.totalRevenue),
//       }];

//       setChartData((prevState) => ({
//         ...prevState,
//         series: series,
//         options: {
//           ...prevState.options,
//           xaxis: {
//             ...prevState.options.xaxis,
//             categories: categories,
//           },
//         },
//       }));

//       setLoading(false);
//     } catch (error) {
//       console.error("Lỗi tải dữ liệu doanh thu:", error);
//       setError(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMonthlyRevenue();
//   }, []);

//   if (loading) {
//     return <Card loading={true}>Đang tải biểu đồ doanh thu...</Card>;
//   }

//   if (error) {
//     return (
//       <Card title="Lỗi Doanh Thu">
//         <Alert
//           message="Không thể tải dữ liệu doanh thu"
//           description={error.message || "Lỗi không xác định"}
//           type="warning"
//           showIcon
//           action={
//             <Button size="small" type="text" onClick={fetchMonthlyRevenue}>
//               Thử lại
//             </Button>
//           }
//         />
//       </Card>
//     );
//   }

//   return (
//     <Card title="Biểu Đồ Doanh Thu Hàng Tháng">
//       <ReactApexChart
//         options={chartData.options}
//         series={chartData.series}
//         type="area"
//         height={350}
//       />
//     </Card>
//   );
// };

// // Component Biểu Đồ Bán Hàng Theo Sản Phẩm
// const ProductSalesChart = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchProductSales = async () => {
//     setLoading(true);
//     try {
//       const salesRes = await fetchMonthlySales();
      
//       // Xử lý dữ liệu bán hàng để phù hợp với biểu đồ
//       const processedData = salesRes.map(item => ({
//         name: item.productName,
//         sales: item.totalSales,
//         monthYear: `Tháng ${item.month}/${item.year}`,
//         ...item
//       }));

//       setSalesData(processedData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Lỗi tải dữ liệu bán hàng:", error);
//       setError(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProductSales();

//     // Setup WebSocket connection for real-time updates
//     const handleNewSalesData = (newData) => {
//       const processedData = newData.map(item => ({
//         name: item.productName,
//         sales: item.totalSales,
//         monthYear: `Tháng ${item.month}/${item.year}`,
//         ...item
//       }));
//       setSalesData(processedData);
//     };

//     webSocketService.connect(handleNewSalesData, (error) => {
//       console.error("WebSocket error:", error);
//     });

//     return () => {
//       webSocketService.disconnect();
//     };
//   }, []);

//   if (loading) {
//     return <Card loading={true}>Đang tải biểu đồ bán hàng...</Card>;
//   }

//   if (error) {
//     return (
//       <Card title="Lỗi Bán Hàng">
//         <Alert
//           message="Không thể tải dữ liệu bán hàng"
//           description={error.message || "Lỗi không xác định"}
//           type="warning"
//           showIcon
//           action={
//             <Button size="small" type="text" onClick={fetchProductSales}>
//               Thử lại
//             </Button>
//           }
//         />
//       </Card>
//     );
//   }

//   return (
//     <Card title="Thống Kê Bán Hàng Theo Sản Phẩm">
//       {salesData.length > 0 ? (
//         <ResponsiveContainer width="100%" height={400}>
//           <LineChart
//             data={salesData}
//             margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis 
//               dataKey="name"
//               label={{ value: 'Tên Sản Phẩm', position: 'insideBottomRight', offset: -10 }}
//               tick={{ angle: -45, textAnchor: 'end' }}
//             />
//             <YAxis 
//               label={{ value: 'Số Lượng Bán', angle: -90, position: 'insideLeft' }}
//             />
//             <Tooltip 
//               formatter={(value) => [`${value} sản phẩm`, 'Số lượng']}
//               labelFormatter={(label) => `Sản phẩm: ${label}`}
//             />
//             <Legend />
//             <Line 
//               type="monotone" 
//               dataKey="sales" 
//               name="Doanh số"
//               stroke="#8884d8"
//               strokeWidth={2}
//               activeDot={{ r: 8 }}
//               animationDuration={1000}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       ) : (
//         <div className="text-center py-4">Không có dữ liệu bán hàng</div>
//       )}
//     </Card>
//   );
// };

// // Component Dashboard Chính
// export default function DashBoard() {
//   const [dashboardData, setDashboardData] = useState({
//     users: [],
//     staff: [],
//     products: [],
//     brands: [],
//     categories: [],
//     discounts: [],
//     skinTypes: [],
//     questions: [],
//     answers: [],
//     blogs: [],
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const endpoints = [
//         { key: "users", path: "/users/customers" },
//         { key: "staff", path: "/users/admin-staff" },
//         { key: "products", path: "/products" },
//         { key: "brands", path: "/brands" },
//         { key: "categories", path: "/categories" },
//         { key: "discounts", path: "/discounts" },
//         { key: "skinTypes", path: "/skin-types" },
//         { key: "questions", path: "/questions" },
//         { key: "answers", path: "/answers" },
//         { key: "blogs", path: "/blogs" },
//       ];

//       const requests = endpoints.map(async (endpoint) => {
//         try {
//           const response = await api.get(endpoint.path);
//           return { [endpoint.key]: response.data };
//         } catch (error) {
//           console.warn(`Lỗi tải ${endpoint.key}:`, error);
//           return { [endpoint.key]: [] };
//         }
//       });

//       const results = await Promise.all(requests);
//       const combinedData = results.reduce(
//         (acc, curr) => ({ ...acc, ...curr }),
//         {}
//       );

//       setDashboardData(combinedData);
//       setLoading(false);
//     } catch (error) {
//       console.error("Lỗi tổng quát:", error);
//       setError(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const renderStatisticCards = () => {
//     const statisticData = [
//       {
//         title: "Tổng Người Dùng",
//         value: dashboardData.users.length,
//         icon: <TeamOutlined style={{ color: "#1890ff" }} />,
//       },
//       {
//         title: "Tổng Nhân Viên",
//         value: dashboardData.staff.length,
//         icon: <UsergroupAddOutlined style={{ color: "#52c41a" }} />,
//       },
//       {
//         title: "Tổng Sản Phẩm",
//         value: dashboardData.products.length,
//         icon: <ShoppingOutlined style={{ color: "#faad14" }} />,
//       },
//       {
//         title: "Tổng Thương Hiệu",
//         value: dashboardData.brands.length,
//         icon: <TagOutlined style={{ color: "#eb2f96" }} />,
//       },
//       {
//         title: "Tổng Danh Mục",
//         value: dashboardData.categories.length,
//         icon: <FolderOutlined style={{ color: "#722ed1" }} />,
//       },
//       {
//         title: "Tổng Khuyến Mãi",
//         value: dashboardData.discounts.length,
//         icon: <GiftOutlined style={{ color: "#13c2c2" }} />,
//       },
//       {
//         title: "Tổng Loại Da",
//         value: dashboardData.skinTypes.length,
//         icon: <SkinOutlined style={{ color: "#ff4d4f" }} />,
//       },
//       {
//         title: "Tổng Câu Hỏi",
//         value: dashboardData.questions.length,
//         icon: <QuestionCircleOutlined style={{ color: "#2f54eb" }} />,
//       },
//       {
//         title: "Tổng Câu Trả Lời",
//         value: dashboardData.answers.length,
//         icon: <MessageOutlined style={{ color: "#722ed1" }} />,
//       },
//       {
//         title: "Tổng Bài Viết",
//         value: dashboardData.blogs.length,
//         icon: <FileTextOutlined style={{ color: "#fa8c16" }} />,
//       },
//     ];

//     return (
//       <Row gutter={[16, 16]}>
//         {statisticData.map((stat, index) => (
//           <Col key={index} xs={24} sm={12} md={6}>
//             <Card>
//               <Statistic
//                 title={stat.title}
//                 value={stat.value}
//                 prefix={stat.icon}
//                 valueStyle={{ color: "#3f8600" }}
//               />
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     );
//   };

//   if (loading) {
//     return <Card loading={true}>Đang tải dữ liệu...</Card>;
//   }

//   if (error) {
//     return (
//       <Card title="Lỗi Tải Dữ Liệu">
//         <Alert
//           message="Không thể tải dữ liệu dashboard"
//           description={error.message || "Lỗi không xác định"}
//           type="error"
//           showIcon
//           action={
//             <Button size="small" type="text" onClick={fetchData}>
//               Thử lại
//             </Button>
//           }
//         />
//       </Card>
//     );
//   }

//   return (
//     <Layout className="dashboard-container">
//       {/* Các thẻ thống kê */}
//       {renderStatisticCards()}

//       {/* Biểu đồ doanh thu và bán hàng */}
//       <Row gutter={[16, 16]} className="mt-4">
//         <Col span={12}>
//           <MonthlyRevenueChart />
//         </Col>
//         <Col span={12}>
//           <ProductSalesChart />
//         </Col>
//       </Row>
//     </Layout>
//   );
// }

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
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import api from "../../../config/api";
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

// Component Biểu Đồ Bán Hàng Theo Sản Phẩm
const ProductSalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductSales = useCallback(async () => {
    setLoading(true);
    try {
      const salesRes = await fetchMonthlySales();
      
      // Xử lý dữ liệu bán hàng để phù hợp với biểu đồ
      const processedData = salesRes.map(item => ({
        name: item.productName,
        sales: item.totalSales,
        monthYear: `Tháng ${item.month}/${item.year}`,
        ...item
      }));
      setSalesData(processedData);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải dữ liệu bán hàng:", error);
      setError(error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductSales();

    // Setup WebSocket connection for real-time updates
    const handleNewSalesData = (newData) => {
      const processedData = newData.map(item => ({
        name: item.productName,
        sales: item.totalSales,
        monthYear: `Tháng ${item.month}/${item.year}`,
        ...item
      }));
      setSalesData(processedData);
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

  return (
    <Card title="Thống Kê Bán Hàng Theo Sản Phẩm">
      {salesData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={salesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name"
              label={{ 
                value: 'Tên Sản Phẩm', 
                position: 'insideBottomRight', 
                offset: 0 
              }}
              interval="preserveStartEnd"
              tick={{ 
                angle: -45, 
                textAnchor: 'end',
                fontSize: 10
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
              formatter={(value) => [`${value.toLocaleString()} sản phẩm`, 'Số lượng']}
              labelFormatter={(label) => `Sản phẩm: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sales" 
              name="Doanh số"
              stroke="#8884d8"
              strokeWidth={2}
              activeDot={{ r: 8 }}
              animationDuration={1000}
            />
          </LineChart>
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