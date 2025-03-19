import { useState, useEffect } from "react";
import {
  UserOutlined,
  ShoppingCartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { FiShoppingCart } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { Menu, Button, Dropdown, Space, Input, message } from "antd";
import { useNavigate, Link, useLocation } from "react-router-dom";

const listMenus = [
  { path: "/", title: "Cửa hàng" },
  { path: "/Products", title: "Sản phẩm" },
  { path: "/album", title: "Bộ sưu tập" },
  { path: "/contact", title: "Liên hệ" },
];

const HeaderF5 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState(null);
  const [activeMenu, setActiveMenu] = useState("/");
  const [userProfile, setUserProfile] = useState({});
  const [MaKh, setMaKhachHang] = useState(null);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);

  useEffect(() => {
    // Kiểm tra thông tin người dùng từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.userName);
    }
  }, []);

  // Xử lý đăng nhập
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleOncartClick = () => {
    // Kiểm tra nếu người dùng không đăng nhập
    const storedUser = JSON.parse(localStorage.getItem("user")); // Parse dữ liệu từ localStorage
    // Kiểm tra nếu người dùng không đăng nhập
    if (!storedUser || !storedUser.TaiKhoan) {
      message.info("Vui lòng đăng nhập để xem giỏ hàng");
      navigate("/Login");
    } else {
      // Điều hướng đến giỏ hàng của người dùng đã đăng nhập
      navigate(`/cart/${storedUser.TaiKhoan}`);
    }
  };
  const handleLogoutClick = () => {
    // Xử lý đăng xuất
    localStorage.removeItem("user");
    setUserName(null); // Reset lại state username
    navigate("/"); // Điều hướng tới trang chủ sau khi đăng xuất
  };
  const handleProfileClick = () => {
    const storedUser = localStorage.getItem("user");
    const user = JSON.parse(storedUser);
    setUserName(user.MaKh);
    if (user.MaKh) {
      navigate(`/Profile/${user.MaKh}`);
    }
  };

  const handleMenuClick = (path) => {
    navigate(path); // Điều hướng đến đường dẫn tương ứng với path
  };

  // Menu khi người dùng đã đăng nhập
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

  useEffect(() => {
    setActiveMenu(location.pathname); // Cập nhật activeMenu theo path hiện tại
  }, [location.pathname]);

  return (
    <div className="flex items-center bg-white justify-between px-12 h-[60px]">
      {/* Logo */}
      <Link to={"/"}>
        <div className="flex gap-2 text-2xl font-bold">
          <span className="text-orange-500">F5</span>
          <span>FASHION</span>
        </div>
      </Link>

      {/* Menu */}
      <div className="flex">
        {listMenus.map(({ path, title }) => {
          return (
            <div
              key={title}
              className={`text-base p-[18px] hover:bg-[#ffe4e1] hover:font-medium cursor-pointer ${
                activeMenu === path ? "bg-[#f89f95] font-semibold" : ""
              }`}
              onClick={() => handleMenuClick(path)}
            >
              {title}
            </div>
          );
        })}
      </div>

      {/* Thanh tìm kiếm */}
      <div>
        <Input placeholder="Search" />
      </div>

      {/* Phần giỏ hàng và thông tin tài khoản */}
      <div className="actions flex items-center gap-4">
        <div
          onClick={handleOncartClick}
          className="flex gap-2 cursor-pointer text-base items-center font-bold text-primary py-[18px] px-2"
        >
          <FiShoppingCart size={"1.2em"} /> Giỏ hàng
        </div>
        {user ? (
          <Dropdown overlay={userMenu} placement="bottomRight">
            <div className="text-base">Xin chào, {user.TaiKhoan}</div>
          </Dropdown>
        ) : (
          <div
            className="flex gap-2 cursor-pointer text-base items-center font-bold text-primary py-[18px] px-2"
            onClick={handleLoginClick}
          >
            <GoPerson size={"1.3em"} /> Đăng nhập
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderF5;
