import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  Dropdown,
  Space,
  Input,
  Table,
  Modal,
  Form,
  Input as AntdInput,
  Select,
  Row,
  Col,
  message,
  Image,
  Typography,
  Card,
  Divider,
  Tag,
} from "antd";

import logo_v1 from "../../../assets/images/Logo.png"; // Đảm bảo đường dẫn hình ảnh đúng
import "./Home.css";
import HeaderF5 from "../../Layouts/Header/Header";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const items1 = [
  { key: "/", label: "Cửa hàng" },
  { key: "/Products", label: "Sản phẩm" },
  { key: "/contact", label: "Liên hệ" },
  { key: "/album", label: "Bộ sưu tập" },
];

const ViewOrderInformation = () => {
  const navigate = useNavigate();
  const [TaiKhoan, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [statusOptions] = useState([
    { value: 1, label: "Chờ xác nhận" },
    { value: 2, label: "Đã xác nhận" },
    { value: 3, label: "Chờ giao" },
    { value: 4, label: "Đang giao hàng" },
    { value: 5, label: "Đã hoàn tất" },
    { value: 6, label: "Đã hủy đơn" },
  ]);
  const [statusPay] = useState([
    { value: 0, label: "Chưa thanh toán" },
    { value: 1, label: "Đã thanh toán" },
  ]);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
      // Fetch orders based on the customer ID (MaKh)
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `https://localhost:7030/api/HoaDon/by-makh/${user.IdKhachhang}`
          );
          const data = await response.json();
          console.log(data);

          if (response.ok) {
            setCartItems(data); // Set the fetched order data
          } else {
            message.error("Lỗi khi tải dữ liệu đơn hàng");
          }
        } catch (error) {
          message.error("Không thể kết nối với server");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders(); // Call the fetch function when the component mounts
    }
  }, []);

  const handleOncartClick = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.TaiKhoan) {
      message.info("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/Login");
    } else {
      navigate(`/cart/${storedUser.TaiKhoan}`);
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("user");
    setUsername(null);
    navigate("/");
  };

  const handleProfileClick = () => {
    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);
    setUsername(user.MaKh);
    if (user.MaKh) {
      navigate(`/Profile/${user.MaKh}`);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="1" onClick={handleProfileClick}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Item
        key="2"
        danger
        onClick={handleLogoutClick}
        icon={<LogoutOutlined />}
      >
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const getTotalPrice = () =>
    cartItems.reduce((total, order) => total + order.tongTien, 0);

  const handleStatusChange = (key, value) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === key) {
          return { ...item, tinhTrangThanhToan: value };
        }
        return item;
      })
    );
    message.success("Trạng thái đơn hàng đã được thay đổi");
  };

  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "maHoaDon",
      key: "maHoaDon",
      align: "center", // Center the column title
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngayTao",
      key: "ngayTao",
      render: (date) => new Date(date).toLocaleString(),
      align: "center", // Center the column title
    },
    {
      title: "Tên người nhận",
      dataIndex: "tenNguoiNhan",
      key: "tenNguoiNhan",
      align: "center", // Center the column title
    },
    {
      title: "Tổng tiền",
      key: "thanhTien",
      render: (_, record) => `${record.thanhTien} VNĐ`,
      align: "center", // Center the column title
    },
    {
      title: "Trạng thái",
      key: "tinhTrangThanhToan",
      render: (_, record) => {
        const status = statusOptions.find(
          (option) => option.value === record.tinhTrangThanhToan
        );

        return (
          <Tag color={getStatusColor(record.tinhTrangThanhToan)}>
            {status ? status.label : "Chưa xác định"}
          </Tag>
        );
      },
      align: "center", // Center the column title
    },
    {
      title: "Trạng thái thanh toán",
      key: "trangThaiThanhToan",
      render: (_, record) => {
        const pay = statusPay.find(
          (option) => option.value === record.trangThaiThanhToan
        );
        return (
          <Tag color={getStatusColor(record.trangThaiThanhToan)}>
            {pay ? pay.label : "Chưa xác định"}
          </Tag>
        );
      },
      align: "center", // Center the column title
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "red";
      case 1:
        return "orange";
      case 2:
        return "green";
      case 3:
        return "blue";
      case 4:
        return "red";
      case 5:
        return "green";
      case 6:
        return "purple";
      default:
        return "grey";
    }
  };

  const handleOrderDetailsClose = () => {
    setOrderDetailsVisible(false);
    setSelectedOrder(null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderF5 />
      <Content>
        <div style={{ padding: "20px", margin: "24px 16px 0" }}>
          <Title level={3}>Danh sách đơn hàng</Title>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={cartItems}
            pagination={false}
            loading={loading}
            expandedRowRender={(record) => (
              <div>
                <Row gutter={24}>
                  <Col span={4}>
                    <Text strong>Hình ảnh</Text>
                  </Col>
                  <Col span={4}>
                    <Text strong>Sản phẩm</Text>
                  </Col>
                  <Col span={4}>
                    <Text strong>Size</Text>
                  </Col>
                  <Col span={4}>
                    <Text strong>Màu sắc</Text>
                  </Col>
                  <Col span={4}>
                    <Text strong>Số lượng và đơn giá</Text>
                  </Col>
                  <Col span={4}>
                    <Text strong>Tính</Text>
                  </Col>
                </Row>
                {record.hoaDonChiTiets.map((detail) => (
                  <Row key={detail.id} gutter={24}>
                    <Col span={4}>
                      <Image src={detail.sanPham.anh} width={50} height={50} />
                    </Col>
                    <Col span={4}>
                      <Text>{detail.sanPham.tenSanPham}</Text>
                    </Col>
                    <Col span={4}>
                      <Text>{detail.sanPham.size}</Text>
                    </Col>
                    <Col span={4}>
                      <Text>{detail.sanPham.mauSac}</Text>
                    </Col>
                    <Col span={4}>
                      <Text>
                        {detail.soLuong} x {detail.donGia}{" "}
                      </Text>
                    </Col>
                    <Col span={4}>
                      <Text>{detail.tongtien} VNĐ</Text>
                    </Col>
                  </Row>
                ))}
                <Row gutter={16}>
                  <Col span={16} />
                  <Col span={8}>
                    <Text strong>Số tiền giảm: -{record.giaTriGiam} VNĐ</Text>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={16} />
                  <Col span={8}>
                    <Text strong style={{ color: "red" }}>
                      Thành tiền: {record.thanhTien} VNĐ
                    </Text>
                  </Col>
                </Row>
              </div>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default ViewOrderInformation;
