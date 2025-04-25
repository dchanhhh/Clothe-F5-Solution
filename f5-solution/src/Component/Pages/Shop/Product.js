import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Slider } from "antd";
import "./Home.css";
import "./Product.css";
import HomeView from "../../../Service/HomeService";
import HeaderF5 from "../../Layouts/Header/Header";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const ProductPage = () => {
  const navigate = useNavigate();
  const [TaiKhoan, setUsername] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState([0, 1000000]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [showSubMenu, setShowSubMenu] = useState();
  // const [selectedHomeView, setSelectedHome] = useState('all');
  const productsPerPage = 8;

  const handleShowSubMenu = (mainMenu) => {
    setShowSubMenu((prev) => (prev === mainMenu ? null : mainMenu));
  };

  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true);
      try {
        const data = await HomeView.ViewProductHome();
        setProducts(data);
        setCategories(getCategories(data));
      } catch (error) {
        alert(error || "Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewProducts();
  }, []);

  const getCategories = (products) => {
    const categoryGroups = {
      Áo: [],
      "Áo khoác": [],
      Quần: [],
      Váy: [],
      "Chân váy": [],
      Khác: [], // Để nhóm những sản phẩm không thuộc các danh mục trên
    };

    products.forEach((product) => {
      if (product.danhMuc && product.danhMuc.tenDanhMuc) {
        const categoryName = product.danhMuc.tenDanhMuc;
        // Gán sản phẩm vào đúng nhóm
        if (categoryName.includes("Áo khoác")) {
          categoryGroups["Áo khoác"].push(categoryName);
        } else if (categoryName.includes("Quần")) {
          categoryGroups["Quần"].push(categoryName);
        } else if (categoryName.includes("Áo")) {
          categoryGroups["Áo"].push(categoryName);
        } else if (categoryName.includes("Váy")) {
          categoryGroups["Váy"].push(categoryName);
        } else if (categoryName.includes("Chân váy")) {
          categoryGroups["Chân váy"].push(categoryName);
        } else {
          categoryGroups["Khác"].push(categoryName);
        }
      }
    });

    // Xử lý loại bỏ trùng lặp trong các nhóm danh mục
    Object.keys(categoryGroups).forEach((key) => {
      categoryGroups[key] = Array.from(new Set(categoryGroups[key]));
    });

    return categoryGroups;
  };

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.tenSp
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesColor =
        selectedColor === "all" ||
        product.sanPhamChiTiets?.some(
          (detail) => detail.mauSac?.tenMauSac === selectedColor
        );
      const matchesSize =
        selectedSize === "all" ||
        product.sanPhamChiTiets?.some(
          (detail) => detail.size?.tenSize === selectedSize
        );
      const matchesCategory =
        selectedCategory === "Tất cả" ||
        (product.danhMuc && product.danhMuc.tenDanhMuc === selectedCategory);
      const matchesPrice =
        product.giaBan >= selectedPrice[0] &&
        product.giaBan <= selectedPrice[1];

      return (
        matchesSearch &&
        matchesColor &&
        matchesSize &&
        matchesCategory &&
        matchesPrice
      );
    });

    setFilteredProducts(filtered);
  }, [
    searchTerm,
    selectedColor,
    selectedSize,
    selectedPrice,
    products,
    selectedCategory,
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
    }
  }, []);

  const extractFilters = (products) => {
    const colors = new Set();
    const sizes = new Set();

    products.forEach((product) => {
      product.sanPhamChiTiets.forEach((detail) => {
        colors.add(detail.mauSac.tenMauSac);
        sizes.add(detail.size.tenSize);
      });
    });

    return {
      colors: Array.from(colors),
      sizes: Array.from(sizes),
    };
  };

  const { colors, sizes } = extractFilters(products);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleViewMore = (id) => navigate(`/Products/${id}`);

  const handlePriceChange = (value) => setSelectedPrice(value);

  return (
    <>
      <HeaderF5 />
      <div className="bg-[#f5f5f5] p-6">
        <Swiper
          className="mySwiper rounded-xl"
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <img
              src="https://file.hstatic.net/200000182297/file/1920x500_1419eff661374b32aa624729627c58ad.jpg"
              alt="Banner 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://file.hstatic.net/200000182297/file/1__6__fd5e31ae0d5e4499ab07ac9f2f20c8ba.png"
              alt="Banner 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://file.hstatic.net/200000182297/file/1__3__df515d83dc2d438d8de83a85246be9d3.png"
              alt="Banner 3"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://file.hstatic.net/200000182297/file/1__7__eb2ace13e5f64d68a9853828b7ab2e73.png"
              alt="Banner 4"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://file.hstatic.net/200000182297/file/1__1__fa3f241c259b4ec4814c16f7f3e515e1.png"
              alt="Banner 4"
            />
          </SwiperSlide>
        </Swiper>
        {/* <div className="flex gap-1 p-4">
        <span>Sản phẩm</span>
        <span>/</span>
        <span>{selectedCategory}</span>
      </div> */}
        <div className="flex gap-5 justify-between pt-8">
          <div className="w-1/5 h-full p-4 bg-white rounded-xl">
            <div className="flex flex-col gap-2">
              <div
                className={`cursor-pointer p-2 rounded-lg hover:bg-[#ffe6e6] font-semibold ${
                  selectedCategory === "Tất cả" ? "bg-[#ffc5c5]" : ""
                }`}
                onClick={() => setSelectedCategory("Tất cả")}
              >
                Tất cả
              </div>
              {Object.keys(categories).map((group) => (
                <div key={group}>
                  <div
                    className="flex justify-between items-center rounded-lg p-2 text-gray-700 font-bold cursor-pointer hover:bg-[#ffe6e6]"
                    onClick={() => handleShowSubMenu(group)}
                  >
                    <span>{group}</span>
                    <span className="text-base">
                      {showSubMenu === group ? (
                        <IoMdArrowDropdown size={20} />
                      ) : (
                        <IoMdArrowDropup size={20} />
                      )}
                    </span>
                  </div>
                  {showSubMenu === group && (
                    <div className="pl-2 pt-1">
                      {categories[group].map((category) => (
                        <div
                          key={category}
                          className={`cursor-pointer p-2 mb-1 rounded hover:bg-[#ffe6e6] ${
                            selectedCategory === category
                              ? "bg-[#ffc5c5] font-semibold"
                              : ""
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category || "Danh mục không xác định"}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col p-5 bg-white rounded-xl w-4/5">
            <div className="flex pb-5 items-center justify-between">
              <span className="text-2xl font-bold">TẤT CẢ SẢN PHẨM</span>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap font-semibold">
                    Màu sắc:
                  </span>
                  <select
                    id="color"
                    name="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="pr-3"
                  >
                    <option value="all">Tất cả</option>
                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap font-semibold">
                    Kích cỡ:
                  </span>
                  <select
                    id="size"
                    name="size"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="pr-3"
                  >
                    <option value="all">Tất cả</option>
                    {sizes.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="whitespace-nowrap font-semibold">
                    Giá bán:
                  </span>
                  <Slider
                    range
                    min={0}
                    max={1000000}
                    step={10000}
                    defaultValue={selectedPrice}
                    onChange={handlePriceChange}
                    value={selectedPrice}
                    tipFormatter={(value) => `${value.toLocaleString()} VNĐ`}
                    style={{ width: "200px" }}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-5">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card relative col-span-1 bg-white rounded-xl border-2 border-gray-200"
                >
                  <img
                    alt={product.tenSp}
                    src={product.imageDefaul}
                    className="w-full h-full object-cover"
                  />
                  <div className="flex flex-col gap-2 p-3 items-center border-t border-t-gray-200">
                    <span className="text-base font-bold uppercase">
                      {product.tenSp}
                    </span>
                    <span className="text-sm font-bold text-primary">{`${product.giaBan.toLocaleString()} VNĐ`}</span>
                  </div>
                  <div className="overlay">
                    <button
                      className="view-more-button"
                      onClick={() => handleViewMore(product.id)}
                    >
                      Xem thêm
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 items-center justify-center pt-4">
              <button
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
                className={`m-0 text-sm font-medium p-2 ${
                  currentPage === 1 && "text-[#9f9f9f] pointer-events-none"
                }`}
              >
                Trang trước
              </button>
              <span>
                Trang {currentPage} /{" "}
                {Math.ceil(filteredProducts.length / productsPerPage)}
              </span>
              <button
                disabled={
                  currentPage ===
                  Math.ceil(filteredProducts.length / productsPerPage)
                }
                onClick={handleNextPage}
                className={`m-0 text-sm font-medium p-2 ${
                  currentPage ===
                    Math.ceil(filteredProducts.length / productsPerPage) &&
                  "text-[#9f9f9f] pointer-events-none"
                }`}
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
