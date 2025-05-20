import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  TeamOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Layout,
  Menu,
  theme,
  ConfigProvider,
  message,
} from "antd";
import StatisticsPage from "./StatisticsPage";
import VoucherManagement from "./VoucherManagement";
import logo from "../../../assets/images/Logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import NhanVienPage from "./NhanVienPage";
import KhachHangPage from "./KhachHangPage";
import ColorManager from "./ColorManager";
import ImageManagement from "./ImageManagement";
import SizeManagement from "./SizeManagement";
import MaterialManagement from "./MaterialManagement";
import InvoiceManagement from "./InvoiceManagement";
import CounterSale from "./CounterSale";
import EmployeeManagement from "./EmployeeManagement";
import OriginalManagement from "./OriginalManagement";
import CategoriesManagement from "./CategoriesManagement";
import Brandmanagement from "./Brandmanagement";
import ProductManagement from "./ProductManagement";
import AuthService from "../../../Service/AuthService";
import jwtDecode from "jwt-decode";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentContent, setCurrentContent] = useState(<StatisticsPage />);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (location.pathname === "/LoginAdmin" && localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
  }, [location]);

  const handleMenuClick = (key) => {
    switch (key) {
      case "1-1":
        setCurrentContent(<StatisticsPage />);
        break;
      case "2-1":
        setCurrentContent(<ProductManagement />);
        break;
      case "5-2":
        setCurrentContent(<VoucherManagement />);
        break;
      case "4-1":
        setCurrentContent(<NhanVienPage />);
        break;
      case "4-2":
        setCurrentContent(<KhachHangPage />);
        break;
      case "2-3-1":
        setCurrentContent(<ColorManager />);
        break;
      case "2-3-2":
        setCurrentContent(<SizeManagement />);
        break;
      case "2-3-3":
        setCurrentContent(<MaterialManagement />);
        break;
      case "2-3-4":
        setCurrentContent(<OriginalManagement />);
        break;
      case "2-3-5":
        setCurrentContent(<CategoriesManagement />);
        break;
      case "2-3-6":
        setCurrentContent(<Brandmanagement />);
        break;
      case "2-3-7":
        setCurrentContent(<ImageManagement />);
        break;
      case "3-1":
        setCurrentContent(<InvoiceManagement />);
        break;
      case "3-2":
        setCurrentContent(<CounterSale />);
        break;
      case "4-1":
        setCurrentContent(<EmployeeManagement />);
        break;
      default:
        break;
    }
  };

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      // Đăng xuất
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      message.info("Bạn đã đăng xuất.");
    } else {
      // Điều hướng đến trang đăng nhập
      navigate("/LoginAdmin");
    }
  };

  const renderLoginLogoutButton = () => {
    if (isAuthenticated) {
      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" onClick={handleLoginLogout}>
            Đăng xuất
          </Button>
        </div>
      );
    } else {
      return (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button type="primary" onClick={() => navigate("/LoginAdmin")}>
            Đăng nhập
          </Button>
        </div>
      );
    }
  };

  return (
    <Layout className="dashboard-layout">
      <ConfigProvider
        theme={{
          Layout: {
            siderBg: "red",
          },
        }}
      />
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Avatar src={logo} size={200} />
          <h2 style={{ textAlign: "center", margin: 0 }}>F5 Fashion</h2>
          <hr style={{ width: "100%", marginTop: "5px" }} />
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.ItemGroup
            key="g1"
            title="Tổng quan"
            icon={<AppstoreOutlined />}
          >
            <Menu.Item key="1-1" onClick={() => handleMenuClick("1-1")}>
              Thống kê
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup
            key="g2"
            title="Sản phẩm"
            icon={<ShoppingCartOutlined />}
          >
            <Menu.Item key="2-1" onClick={() => handleMenuClick("2-1")}>
              Quản lý sản phẩm
            </Menu.Item>
            <SubMenu key="sub1" title="Quản lý thuộc tính">
              <Menu.Item key="2-3-1" onClick={() => handleMenuClick("2-3-1")}>
                Quản lý màu sắc
              </Menu.Item>
              <Menu.Item key="2-3-2" onClick={() => handleMenuClick("2-3-2")}>
                Quản lý kích cỡ
              </Menu.Item>
              <Menu.Item key="2-3-3" onClick={() => handleMenuClick("2-3-3")}>
                Quản lý chất liệu
              </Menu.Item>
              <Menu.Item key="2-3-4" onClick={() => handleMenuClick("2-3-4")}>
                Quản lý xuất xứ
              </Menu.Item>
              <Menu.Item key="2-3-5" onClick={() => handleMenuClick("2-3-5")}>
                Quản lý danh mục
              </Menu.Item>
              <Menu.Item key="2-3-6" onClick={() => handleMenuClick("2-3-6")}>
                Quản lý thương hiệu
              </Menu.Item>
              <Menu.Item key="2-3-7" onClick={() => handleMenuClick("2-3-7")}>
                Quản lý hình ảnh
              </Menu.Item>
            </SubMenu>
          </Menu.ItemGroup>

          <Menu.ItemGroup key="g3" title="Hóa đơn" icon={<FileTextOutlined />}>
            <Menu.Item key="3-1" onClick={() => handleMenuClick("3-1")}>
              Quản lý hóa đơn
            </Menu.Item>
            <Menu.Item key="3-2" onClick={() => handleMenuClick("3-2")}>
              Bán tại quầy
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup key="g4" title="Tài khoản" icon={<TeamOutlined />}>
            <Menu.Item key="4-1" onClick={() => handleMenuClick("4-1")}>
              Nhân viên
            </Menu.Item>
            <Menu.Item key="4-2" onClick={() => handleMenuClick("4-2")}>
              Khách hàng
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup key="g5" title="Khuyến mại" icon={<TagsOutlined />}>
            {/* <Menu.Item key="5-1" onClick={() => handleMenuClick('5-1')}>
                            Quản lý sản phẩm giảm giá
                        </Menu.Item> */}
            <Menu.Item key="5-2" onClick={() => handleMenuClick("5-2")}>
              Quản lý voucher giảm giá
            </Menu.Item>
          </Menu.ItemGroup>
          {renderLoginLogoutButton()}
        </Menu>
      </Sider>
      <Layout>
        <ConfigProvider
          theme={{
            Layout: {
              siderBg: "red",
            },
          }}
        />
        {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
        </Header> */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {currentContent}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
