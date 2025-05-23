import { useState, useEffect } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { GoPerson } from "react-icons/go";
import { MdOutlineLogout } from "react-icons/md";
import { useNavigate, Link, useLocation } from "react-router-dom";
import SearchResults from "../../Pages/Shop/SearchResults";

const listMenus = [
  { path: "/", title: "Cửa hàng" },
  { path: "/Products", title: "Sản phẩm" },
  { path: "/contact", title: "Liên hệ" },
];

const HeaderF5 = ({ products = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState(null);
  const [activeMenu, setActiveMenu] = useState("/");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
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
      alert("Vui lòng đăng nhập để xem giỏ hàng");
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

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const filteredProducts = products.filter((product) =>
      product.tenSp.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filteredProducts);
    setShowResults(true);
  };

  useEffect(() => {
    setActiveMenu(location.pathname); // Cập nhật activeMenu theo path hiện tại
  }, [location.pathname]);

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="relative w-72 search-container">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowResults(true)}
            className="w-full pl-10 pr-4 rounded-full border-2 focus:outline-none focus:border-primary"
          />
          <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>
        <SearchResults
          products={searchResults}
          visible={showResults && searchTerm.trim() !== ""}
        />
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
            <div className="absolute top-full hidden group-hover:block rounded-lg overflow-hidden p-1 z-10 text-xs text-[#333] font-normal bg-white border border-[#cecece] drop-shadow-md">
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
