import React, { useState, useEffect } from "react";
import { Card, Statistic, Row, Col, DatePicker } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";
import StatisticsService from "../../../Service/StatisticsService";

const { RangePicker } = DatePicker;

const StatisticsPage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [orderStatusCounts, setOrderStatusCounts] = useState({});
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [customers, setCustomers] = useState(0);

  const startDate = dateRange[0]
    ? dateRange[0].format("YYYY-MM-DD")
    : "2025-01-01";
  const endDate = dateRange[1]
    ? dateRange[1].format("YYYY-MM-DD")
    : "2025-12-31";
  const year = 2025;

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Lấy tổng doanh thu
        const revenue = await StatisticsService.getTotalRevenue(
          startDate,
          endDate
        );
        setTotalRevenue(revenue);
        console.log(revenue);

        // Lấy tổng số đơn hàng
        const orders = await StatisticsService.getTotalOrders(
          startDate,
          endDate
        );
        setTotalOrders(orders);
        console.log(orders);

        // Lấy tổng số sản phẩm đã bán
        const productsSold = await StatisticsService.getTotalProductsSold(
          startDate,
          endDate
        );
        setTotalProductsSold(productsSold);
        console.log(productsSold);

        // Lấy số lượng đơn hàng theo trạng thái
        const statusCounts = await StatisticsService.getOrderStatusCounts(
          startDate,
          endDate
        );
        setOrderStatusCounts(statusCounts);
        console.log(statusCounts);
        // Lấy doanh thu theo tháng
        const monthlyRevenueData = await StatisticsService.getMonthlyRevenue(
          year
        );

        // Thêm các tháng không có dữ liệu
        const allMonths = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          revenue: 0,
        }));

        const completeMonthlyRevenue = allMonths.map((monthData) => {
          const existingData = monthlyRevenueData.find(
            (item) => item.month === monthData.month
          );
          return {
            month: monthData.month,
            revenue: existingData ? existingData.revenue : 0,
          };
        });

        setMonthlyRevenue(completeMonthlyRevenue);

        // Lấy số lượng khách hàng
        const customers = await StatisticsService.getTotalCustomers();
        setCustomers(customers);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError(err.response?.data || "Lỗi không xác định");
      }
    };

    fetchStatistics();
  }, [startDate, endDate, year]);

  const monthColors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F0A500",
    "#F05454",
    "#A7C7E7",
    "#C70039",
    "#900C3F",
    "#FFC300",
    "#581845",
    "#DAF7A6",
    "#FF8C42",
  ];
  const columnConfig = {
    data: monthlyRevenue.map((item) => ({
      ...item,
      monthLabel: `Tháng ${item.month}`, // Nhãn tháng
    })),
    xField: "monthLabel", // Trục X
    yField: "revenue", // Trục Y
    colorField: "monthLabel", // Trường dùng để phân biệt màu sắc
    color: (month) => {
      const colors = [
        "#FF5733",
        "#33FF57",
        "#3357FF",
        "#FFC300",
        "#581845",
        "#DAF7A6",
        "#C70039",
        "#900C3F",
        "#FF8C42",
        "#A7C7E7",
        "#FF33F6",
        "#33FFF6",
      ]; // Mảng màu cho 12 tháng
      return colors[month - 1]; // Gán màu tương ứng với tháng
    },
    tooltip: {
      customContent: (title, items) => {
        if (items.length > 0) {
          const { data } = items[0];
          return `<div style="padding: 8px;">
                    <strong>${data.monthLabel}</strong><br />
                    Doanh thu: ${data.revenue.toLocaleString()} VNĐ
                  </div>`;
        }
        return null;
      },
    },
    meta: {
      monthLabel: {
        alias: "Tháng",
      },

      revenue: {
        alias: "Doanh thu (VNĐ)",
      },
    },
    label: false, // Tắt hiển thị giá trị trên đỉnh cột
  };

  const orderStatusInVietnamese = {
    Pending: "Chờ xử lý",
    Shipped: "Đã giao",
    Delivered: "Đã nhận",
    Cancelled: "Đã hủy",
    Confirmed: "Đã xác nhận",
    Shipping: "Đang giao",
  };

  const pieConfig = {
    appendPadding: 10,
    data: Object.entries(orderStatusCounts).map(([status, count]) => ({
      type: orderStatusInVietnamese[status] || status,
      value: count,
    })),
    angleField: "value",
    colorField: "type",
    radius: 0.8,
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card style={{ backgroundColor: "#e6f7ff" }}>
            <Statistic
              title="Tổng sản phẩm đã bán"
              value={totalProductsSold || 0}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="Sản phẩm"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#f6ffed" }}>
            <Statistic
              title="Doanh thu"
              value={totalRevenue || 0}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="VNĐ"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#fffbe6" }}>
            <Statistic
              title="Số đơn hàng"
              value={totalOrders || 0}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ backgroundColor: "#fff2f0" }}>
            <Statistic
              title="Số lượng khách hàng"
              value={customers || 0}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowDownOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: "20px" }}>
        <Col span={9}>
          <Row gutter={16}>
            <Col span={24}>
              <Card title="Thống kê doanh thu theo tháng" bordered={false}>
                <RangePicker
                  value={dateRange}
                  onChange={handleDateChange}
                  style={{ marginBottom: "20px" }}
                />
              </Card>
            </Col>
          </Row>
          <Card title="Trạng thái đơn hàng" bordered={false}>
            <Pie {...pieConfig} />
          </Card>
        </Col>

        <Col span={15}>
          <Card title="Thống kê doanh thu theo năm" bordered={false}>
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>

      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default StatisticsPage;
