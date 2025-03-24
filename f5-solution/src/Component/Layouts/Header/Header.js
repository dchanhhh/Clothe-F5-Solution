import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { GoPerson } from "react-icons/go";
import { MdOutlineLogout } from "react-icons/md";
import { message } from "antd";
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
        <input placeholder="Search" />
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
          <div className="relative group text-base font-bold text-primary cursor-pointer">
            Xin chào, {user.TaiKhoan}
            <div className="absolute top-full hidden group-hover:block rounded-lg overflow-hidden p-1 z-10 text-sm text-[#333] font-normal bg-white border border-[#cecece] drop-shadow-md">
              <div
                key="1"
                onClick={handleProfileClick}
                className="py-2 px-3 hover:bg-[#dcdcdc] rounded-lg"
              >
                Thông tin cá nhân
              </div>
              <div
                key="2"
                onClick={handleLogoutClick}
                className="flex items-center gap-1.5 py-2 px-3 hover:bg-[#FF4D4F] hover:text-white rounded-lg"
              >
                <MdOutlineLogout size={"1.2em"} />
                Đăng xuất
              </div>
            </div>
          </div>
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
