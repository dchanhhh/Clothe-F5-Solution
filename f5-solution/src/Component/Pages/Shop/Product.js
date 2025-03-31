import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  Breadcrumb,
  Carousel,
  Card,
  message,
  Slider,
} from "antd";
import "./Home.css";
import "./Product.css";
import HomeView from "../../../Service/HomeService";
import HeaderF5 from "../../Layouts/Header/Header";

const { Header, Content, Sider } = Layout;
const { Meta } = Card;

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  // const [selectedHomeView, setSelectedHome] = useState('all');
  const productsPerPage = 8;

  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true);
      try {
        const data = await HomeView.ViewProductHome();
        setProducts(data);
        setCategories(getCategories(data));
      } catch (error) {
        message.error(error || "Không thể tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchNewProducts();
  }, []);

  const getCategories = (products) => {
    const categoryGroups = {
      Áo: [],
      Quần: [],
      Váy: [],
      Khác: [], // Để nhóm những sản phẩm không thuộc các danh mục trên
    };

    products.forEach((product) => {
      if (product.danhMuc && product.danhMuc.tenDanhMuc) {
        const categoryName = product.danhMuc.tenDanhMuc;
        // Gán sản phẩm vào đúng nhóm
        if (categoryName.includes("Áo")) {
          categoryGroups["Áo"].push(categoryName);
        } else if (categoryName.includes("Quần")) {
          categoryGroups["Quần"].push(categoryName);
        } else if (categoryName.includes("Váy")) {
          categoryGroups["Váy"].push(categoryName);
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
        selectedCategory === "all" ||
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
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderF5 />
      <Breadcrumb style={{ marginLeft: "20%" }}>
        <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
        <Breadcrumb.Item>{selectedCategory}</Breadcrumb.Item>
      </Breadcrumb>
      <Carousel autoplay>
        <div>
          <img
            src="https://file.hstatic.net/200000182297/file/1920x500_1419eff661374b32aa624729627c58ad.jpg"
            alt="Banner 1"
            style={{ width: "100%" }}
          />
        </div>
      </Carousel>
      <Layout>
        <Sider width={300} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={["all"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item key="all" onClick={() => setSelectedCategory("all")}>
              Tất cả
            </Menu.Item>

            {Object.keys(categories).map((group) => (
              <React.Fragment key={group}>
                <Menu.SubMenu key={group} title={group}>
                  {categories[group].map((category) => (
                    <Menu.Item
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category || "Danh mục không xác định"}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              </React.Fragment>
            ))}
          </Menu>
        </Sider>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: "#fff",
            borderRadius: "4px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="product-header">
            <h2>TẤT CẢ SẢN PHẨM</h2>
            <div className="filters">
              <div className="filter-item">
                <label htmlFor="color">Color:</label>
                <select
                  id="color"
                  name="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="all">All Colors</option>
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <label htmlFor="size">Size:</label>
                <select
                  id="size"
                  name="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="all">All Sizes</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="filter-item">
                <label htmlFor="price">Price:</label>
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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "start",
              gap: "16px",
            }}
          >
            {currentProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  flex: "0 0 calc(25% - 16px)",
                  boxSizing: "border-box",
                }}
                className="product-card"
              >
                <Card
                  hoverable
                  cover={
                    <img
                      alt={product.tenSp}
                      src={product.imageDefaul}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  }
                >
                  <Meta
                    title={product.tenSp}
                    description={`${product.giaBan.toLocaleString()} VNĐ`}
                  />
                </Card>
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
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              disabled={currentPage === 1}
              onClick={handlePreviousPage}
              style={{ marginRight: "10px" }}
            >
              Trang trước
            </Button>
            <span>
              Trang {currentPage} /{" "}
              {Math.ceil(filteredProducts.length / productsPerPage)}
            </span>
            <Button
              disabled={
                currentPage ===
                Math.ceil(filteredProducts.length / productsPerPage)
              }
              onClick={handleNextPage}
              style={{ marginLeft: "10px" }}
            >
              Trang sau
            </Button>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProductPage;
