import React, { useState, useEffect } from "react";
import { Layout, theme } from "antd";
import StatisticsPage from "./StatisticsPage";
import VoucherManagement from "./VoucherManagement";
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

const { Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentContent, setCurrentContent] = useState(<StatisticsPage />);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [activeMenuItem, setActiveMenuItem] = useState("1-1");

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (location.pathname === "/LoginAdmin" && localStorage.getItem("token")) {
      setIsAuthenticated(true);
    }
    if (location.pathname === "/dashboard") {
      setActiveMenuItem("ThongKe");
      setCurrentContent(<StatisticsPage />);
    }
  }, [location]);

  const handleMenuClick = (key) => {
    setActiveMenuItem(key);
    switch (key) {
      case "ThongKe":
        setCurrentContent(<StatisticsPage />);
        break;
      case "SanPham":
        setCurrentContent(<ProductManagement />);
        break;
      case "Voucher":
        setCurrentContent(<VoucherManagement />);
        break;
      case "NhanVien":
        setCurrentContent(<NhanVienPage />);
        break;
      case "KhachHang":
        setCurrentContent(<KhachHangPage />);
        break;
      case "MauSac":
        setCurrentContent(<ColorManager />);
        break;
      case "KichCo":
        setCurrentContent(<SizeManagement />);
        break;
      case "ChatLieu":
        setCurrentContent(<MaterialManagement />);
        break;
      case "XuatXu":
        setCurrentContent(<OriginalManagement />);
        break;
      case "DanhMuc":
        setCurrentContent(<CategoriesManagement />);
        break;
      case "ThuongHieu":
        setCurrentContent(<Brandmanagement />);
        break;
      case "HinhAnh":
        setCurrentContent(<ImageManagement />);
        break;
      case "HoaDon":
        setCurrentContent(<InvoiceManagement />);
        break;
      case "3-2":
        setCurrentContent(<CounterSale />);
        break;
      case "NhanVien":
        setCurrentContent(<EmployeeManagement />);
        break;
      default:
        break;
    }
  };

  const handleLoginLogout = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      navigate("/LoginAdmin");
    } else {
      navigate("/LoginAdmin");
    }
  };

  return (
    <div className="flex gap-5 min-h-screen bg-[#f5f5f5] text-sm">
      <div className="bg-white flex flex-col gap-2 h-screen min-w-[240px] shadow-lg rounded-r-xl">
        <div className="flex justify-center gap-2 text-2xl font-bold py-4">
          <span className="text-orange-500">F5</span>
          <span>FASHION</span>
        </div>

        <div className="px-4">
          <div className="text-sm font-medium text-gray-600 mb-2">
            Tổng quan
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
              activeMenuItem === "ThongKe"
                ? "bg-gray-100 text-blue-600 font-semibold"
                : ""
            }`}
            onClick={() => handleMenuClick("ThongKe")}
          >
            <span className="text-base">📊</span>
            <span>Thống kê</span>
          </div>
        </div>

        <div className="px-4">
          <div className="text-sm font-medium text-gray-600 mb-2">Sản phẩm</div>
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
                activeMenuItem === "SanPham"
                  ? "bg-gray-100 text-blue-600 font-semibold"
                  : ""
              }`}
              onClick={() => handleMenuClick("SanPham")}
            >
              <span className="text-base">📦</span>
              <span>Quản lý sản phẩm</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
                activeMenuItem === "MauSac"
                  ? "bg-gray-100 text-blue-600 font-semibold"
                  : ""
              }`}
              onClick={() => handleMenuClick("MauSac")}
            >
              <span className="text-base">🎨</span>
              <span>Quản lý màu sắc</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
                activeMenuItem === "KichCo"
                  ? "bg-gray-100 text-blue-600 font-semibold"
                  : ""
              }`}
              onClick={() => handleMenuClick("KichCo")}
            >
              <span className="text-base">📏</span>
              <span>Quản lý kích cỡ</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
                activeMenuItem === "ChatLieu"
                  ? "bg-gray-100 text-blue-600 font-semibold"
                  : ""
              }`}
              onClick={() => handleMenuClick("ChatLieu")}
            >
              <span className="text-base">🧵</span>
              <span>Quản lý chất liệu</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
                activeMenuItem === "DanhMuc"
                  ? "bg-gray-100 text-blue-600 font-semibold"
                  : ""
              }`}
              onClick={() => handleMenuClick("DanhMuc")}
            >
              <span className="text-base">🗂️</span>
              <span>Quản lý danh mục</span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
                activeMenuItem === "HinhAnh"
                  ? "bg-gray-100 text-blue-600 font-semibold"
                  : ""
              }`}
              onClick={() => handleMenuClick("HinhAnh")}
            >
              <span className="text-base">🖼️</span>
              <span>Quản lý hình ảnh</span>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="text-sm font-medium text-gray-600 mb-2">Hóa đơn</div>
          <div
            className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
              activeMenuItem === "HoaDon"
                ? "bg-gray-100 text-blue-600 font-semibold"
                : ""
            }`}
            onClick={() => handleMenuClick("HoaDon")}
          >
            <span className="text-base">📄</span>
            <span>Quản lý hóa đơn</span>
          </div>
        </div>

        <div className="px-4">
          <div className="text-sm font-medium text-gray-600 mb-2">
            Khách hàng
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
              activeMenuItem === "KhachHang"
                ? "bg-gray-100 text-blue-600 font-semibold"
                : ""
            }`}
            onClick={() => handleMenuClick("KhachHang")}
          >
            <span className="text-base">👥</span>
            <span>Quản lý khách hàng</span>
          </div>
        </div>

        <div className="px-4">
          <div className="text-sm font-medium text-gray-600 mb-2">
            Khuyến mại
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer ${
              activeMenuItem === "Voucher"
                ? "bg-gray-100 text-blue-600 font-semibold"
                : ""
            }`}
            onClick={() => handleMenuClick("Voucher")}
          >
            <span className="text-base">🏷️</span>
            <span>Quản lý Voucher</span>
          </div>
        </div>

        <div
          className="mx-4 mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-center cursor-pointer"
          onClick={handleLoginLogout}
        >
          {isAuthenticated ? "Đăng xuất" : "Đăng nhập"}
        </div>
      </div>

      <div className="w-full bg-[#f5f5f5] text-sm">
        <div className="p-6 bg-white rounded-l-xl">{currentContent}</div>
      </div>
    </div>
  );
};

export default Dashboard;
