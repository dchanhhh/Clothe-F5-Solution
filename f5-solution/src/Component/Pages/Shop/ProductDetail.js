import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  Layout,
  Card,
  Carousel,
  message,
  notification,
} from "antd";
import { CheckOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { FaCheck } from "react-icons/fa6";
import "./Home.css";
import { Content } from "antd/es/layout/layout";
import HomeView from "../../../Service/HomeService";
import GioHangService from "../../../Service/GiohangService";
import HeaderF5 from "../../Layouts/Header/Header";
const { Header } = Layout;
const { Meta } = Card;

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [TaiKhoan, setUsername] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [CartId, setCartId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [filteredSizes, setfilteredSizes] = useState("");
  const [soLuong, setSoluong] = useState(0);

  const visibleImages = 3;
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
      setUserId(user.IdKhachhang);
      handCart(user.IdKhachhang);
      console.log(user.IdKhachhang);
    }
  }, []);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const data = await HomeView.ViewProductHome();
        setProducts(data);
      } catch (error) {
        message.error(error || "Không thể tải danh sách sản phẩm.");
      }
    };
    fetchNewProducts();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        return;
      }

      setLoading(true);

      try {
        const data = await HomeView.ViewProductDetail(id);
        console.log(data);
        if (data) {
          const convertData = {
            ...data,
          };
          setProduct(convertData);
          setMainImage(data.imageDefaul || "");
        } else {
          setProduct(null);
          message.error("Lỗi: Không có dữ liệu sản phẩm.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        setProduct(null);
        message.error("Lỗi khi lấy chi tiết sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log(user);
      setUsername(user.TaiKhoan);
    }
  }, []);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (
      product &&
      Array.isArray(product.size) &&
      Array.isArray(product.mauSac)
    ) {
      // Nếu chưa chọn màu, bạn cần kết hợp tất cả các size mà không bị trùng lặp
      if (!selectedColor) {
        // Dùng Set để loại bỏ các size trùng lặp
        const uniqueSizes = Array.from(
          new Set(product.size.map((size) => size.sizeId))
        ).map((sizeId) => product.size.find((size) => size.sizeId === sizeId));
        setAvailableSizes(uniqueSizes);
      } else {
        // Nếu đã chọn màu, lọc các size theo màu
        const sanPhamChiTietIds = product.mauSac
          .filter((color) => color.mauSacId === selectedColor)
          .map((color) => color.sanPhamChiTietId);

        // Lọc size dựa trên các sanPhamChiTietId đã lọc được
        const filteredSizes = product.size.filter((size) =>
          sanPhamChiTietIds.includes(size.sanPhamChiTietId)
        );

        // Loại bỏ các size trùng lặp
        const uniqueSizes = Array.from(
          new Set(filteredSizes.map((size) => size.sizeId))
        ).map((sizeId) => filteredSizes.find((size) => size.sizeId === sizeId));

        setAvailableSizes(uniqueSizes);
      }
    }
  }, [selectedColor, product]);

  // Hàm xử lý khi người dùng chọn màu
  const handleSelectColor = (mauSac) => {
    const mauSacId = mauSac.mauSacId;

    if (mauSacId === selectedColor) {
      // Hủy chọn màu nếu đã chọn màu này
      setSelectedColor("");
      setFilteredProducts([]); // Xóa sản phẩm đã lọc
      setAvailableSizes([]); // Xóa size đã lọc
    } else {
      // Lưu màu đã chọn
      setSelectedColor(mauSacId);

      // Lọc sản phẩm theo màu sắc đã chọn
      const filteredProductsByColor = product.mauSac.filter(
        (color) => color.mauSacId === mauSacId
      );
      setFilteredProducts(filteredProductsByColor);

      // Lọc các size tương ứng với sanPhamChiTietId đã lọc
      const sanPhamChiTietIds = filteredProductsByColor.map(
        (item) => item.sanPhamChiTietId
      );
      const filteredSizes = product.size.filter((size) =>
        sanPhamChiTietIds.includes(size.sanPhamChiTietId)
      );
      setfilteredSizes(filteredSizes);
      // Loại bỏ các size trùng lặp
      const uniqueSizes = Array.from(
        new Set(filteredSizes.map((size) => size.sizeId))
      ).map((sizeId) => filteredSizes.find((size) => size.sizeId === sizeId));

      // Cập nhật lại danh sách size có sẵn
      setAvailableSizes(uniqueSizes);
    }
  };

  // Hàm xử lý khi người dùng chọn size
  const handleSelectSize = (sizeId) => {
    // Cập nhật size được chọn
    setSelectedSize(sizeId);
    console.log("Filtered sizes:", filteredSizes);
    console.log("Selected size ID:", sizeId);

    // Kiểm tra điều kiện trước khi lọc
    if (selectedColor && Array.isArray(filteredSizes)) {
      const filteredProductsWithSize = filteredSizes.filter(
        (product) => product.sizeId === sizeId
      );

      if (filteredProductsWithSize.length > 0) {
        // Lấy ID sản phẩm đầu tiên từ kết quả lọc
        setSelectedProductId(filteredProductsWithSize[0].sanPhamChiTietId);
        setSoluong(filteredProductsWithSize[0].soLuongTon);
        console.log(
          "Updated selected product ID:",
          filteredProductsWithSize[0].sanPhamChiTietId
        );
      } else {
        notification.warning({ message: "Vui lòng chọn màu sắc và size" });
      }
    } else {
      console.warn("Color not selected or filteredSizes is not valid.");
    }
  };

  const handCart = async (userId) => {
    try {
      const data = await GioHangService.getByGioHang(userId);
      setCartId(data.id);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      message.error("Không thể tải giỏ hàng");
    }
  };
  const handleAddToCart = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      notification.warning({
        message: "Vui lòng đăng nhập trước khi mua hàng!",
      });
      navigate("/Login"); // Điều hướng đến trang đăng nhập
      return;
    }
    if (!selectedColor || !selectedSize) {
      setErrorMessage("Vui lòng chọn màu sắc và size trước khi mua.");
      notification.warning({
        message: "Vui lòng chọn màu sắc và size trước khi mua.",
      });
      return;
    }
    if (quantity > soLuong) {
      setErrorMessage("Số lượng trong kho không đủ.");
      notification.warning({ message: "Số lượng trong kho không đủ." });
      return;
    }

    const addDto = {
      idGh: CartId,
      idSpCt: selectedProductId,
      soLuong: quantity,
    };

    try {
      console.log("Payload gửi lên API:", addDto);
      if (addDto.idGh == null) {
        notification.warning({
          message: "Vui lòng đăng nhập trước khi mua hàng!",
        });
        navigate("/Login");
        return;
      }
      const result = await GioHangService.addGioHang(addDto); // Call the backend API

      notification.success({ message: "Sản phẩm đã được thêm vào giỏ hàng" });

      console.log("Kết quả trả về từ API:", result);
      setErrorMessage(""); // Clear the error message if everything is fine
    } catch (error) {
      console.error("Không thể thêm sản phẩm vào giỏ hàng:", error);

      // Handle specific errors from the backend API
      if (error.response) {
        console.error("Chi tiết lỗi từ API:", error.response.data);
        if (error.response.data && error.response.data.message) {
          // Show error message from backend (e.g. stock error)
          setErrorMessage(error.response.data.message);
        } else {
          // Fallback to a generic error message
          setErrorMessage("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
        }
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
        setErrorMessage("Không nhận được phản hồi từ server.");
      } else {
        console.error("Lỗi khi gửi yêu cầu:", error.message);
        setErrorMessage("Đã xảy ra lỗi khi gửi yêu cầu.");
      }
    }
  };

  const handleBuyNow = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // Kiểm tra nếu chưa đăng nhập
    if (!storedUser) {
      notification.warning({
        message: "Vui lòng đăng nhập trước khi mua hàng!",
      });
      navigate("/Login"); // Điều hướng đến trang đăng nhập
      return;
    }

    // Kiểm tra nếu chưa chọn màu sắc và size
    if (!selectedColor || !selectedSize) {
      setErrorMessage("Vui lòng chọn màu sắc và size trước khi mua.");
      notification.warning({
        message: "Vui lòng chọn màu sắc và size trước khi mua.",
      });
      return;
    }

    // Kiểm tra số lượng vượt quá số lượng trong kho
    if (quantity > soLuong) {
      setErrorMessage("Số lượng trong kho không đủ.");
      notification.warning({ message: "Số lượng trong kho không đủ." });
      return;
    }

    // Tạo dữ liệu payload để gửi đến API
    const addDto = {
      idGh: CartId,
      idSpCt: selectedProductId,
      soLuong: quantity,
    };

    try {
      console.log("Payload gửi lên API:", addDto);

      // Kiểm tra nếu giỏ hàng (`idGh`) chưa được khởi tạo
      if (addDto.idGh == null) {
        notification.warning({
          message: "Vui lòng đăng nhập trước khi mua hàng!",
        });
        navigate("/Login");
        return;
      }

      // Gọi API thêm vào giỏ hàng
      const result = await GioHangService.addGioHang(addDto);

      console.log("Kết quả trả về từ API:", result);
      notification.success({ message: "Sản phẩm đã được thêm vào giỏ hàng" });

      setErrorMessage(""); // Xóa thông báo lỗi nếu mọi thứ ổn
      navigate(`/cart/${storedUser.TaiKhoan}`); // Điều hướng về trang giỏ hàng
    } catch (error) {
      console.error("Không thể thêm sản phẩm vào giỏ hàng:", error);

      // Xử lý các lỗi từ API
      if (error.response) {
        console.error("Chi tiết lỗi từ API:", error.response.data);
        if (error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message); // Hiển thị thông báo lỗi cụ thể từ server
        } else {
          setErrorMessage("Đã xảy ra lỗi khi mua sản phẩm."); // Thông báo lỗi chung
        }
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
        setErrorMessage("Không nhận được phản hồi từ server."); // Thông báo lỗi phản hồi server
      } else {
        console.error("Lỗi khi gửi yêu cầu:", error.message);
        setErrorMessage("Đã xảy ra lỗi khi gửi yêu cầu."); // Thông báo lỗi gửi yêu cầu
      }
    }
  };

  const handleViewMore = (id) => {
    navigate(`/Products/${id}`);
  };

  // Lọc ra danh sách các màu sắc không trùng lặp
  const uniqueColorsMap = new Map();
  if (product && Array.isArray(product.mauSac)) {
    product.mauSac.forEach((mauSac) => {
      if (!uniqueColorsMap.has(mauSac.mauSacId)) {
        uniqueColorsMap.set(mauSac.mauSacId, mauSac);
      }
    });
  }

  const uniqueSizesMap = new Map();
  if (product && Array.isArray(product.size)) {
    product.size.forEach((size) => {
      // Nếu chưa có sizeId này trong map, thì thêm vào
      if (!uniqueSizesMap.has(size.sizeId)) {
        uniqueSizesMap.set(size.sizeId, size);
      }
    });
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const uniqueColors = Array.from(uniqueColorsMap.values());
  const uniqueSizes = Array.from(uniqueSizesMap.values());

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <HeaderF5 />
      <Content>
        <Layout>
          <div className="p-3 mx-[12%]">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-2 max-h-[600px] overflow-y-auto">
                <div className="flex flex-col gap-2 items-center justify-center mr-1">
                  <img
                    className="cursor-pointer object-cover"
                    src={product?.imageDefaul}
                    alt={product?.tenSp}
                    style={{
                      border:
                        mainImage === product?.imageDefaul
                          ? "2px solid #1890ff"
                          : "1px solid #ddd",
                    }}
                    onClick={() => setMainImage(product?.imageDefaul)}
                  />
                  {product?.images
                    ?.slice(startIndex, startIndex + visibleImages)
                    .map((img) => (
                      <img
                        className="cursor-pointer object-cover"
                        key={img.id}
                        src={img.tenImage}
                        alt={product.tenSp}
                        style={{
                          border:
                            mainImage === img.tenImage
                              ? "2px solid #1890ff"
                              : "1px solid #ddd",
                        }}
                        onClick={() => setMainImage(img.tenImage)}
                      />
                    ))}
                </div>
              </div>

              <div className="col-span-4 border border-gray-300">
                <img
                  src={mainImage}
                  alt={product?.tenSp || ""}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="col-span-6 flex flex-col justify-center gap-4 p-4">
                <div className="text-2xl font-bold uppercase text-center">
                  {product?.tenSp || "Tên sản phẩm"}
                </div>
                <div className="text-base font-medium">
                  Mã sản phẩm: {product?.maSp || ""}
                </div>
                <div className="flex gap-2 items-center text-2xl font-semibold">
                  <span>Giá:</span>
                  <span className="text-[#FF0000]">
                    {product?.giaBan.toLocaleString() || 0} VNĐ
                  </span>
                </div>
                <span className="text-base font-medium">
                  Chất liệu: {product?.chatLieu?.tenChatLieu || "Không rõ"}
                </span>
                <div className="flex flex-col gap-4">
                  {product && (
                    <>
                      <div className="flex flex-col gap-2">
                        <span className="text-base font-semibold">
                          Màu sắc:
                        </span>
                        <div className="flex gap-2">
                          {uniqueColors.map((mauSac, index) => (
                            <div
                              key={mauSac.mauSacId}
                              className={`relative w-10 h-10 rounded-full text-center cursor-pointer ${
                                selectedColor === mauSac.mauSacId
                                  ? "border-2 border-black"
                                  : "border border-[#ddd]"
                              }`}
                              style={{ backgroundColor: mauSac.mauSacTen }}
                              onClick={() => handleSelectColor(mauSac)}
                            >
                              {selectedColor === mauSac.mauSacId && (
                                <FaCheck className="absolute top-3 right-[11px]" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="text-base font-semibold">Size:</span>
                        <div className="flex gap-2">
                          {availableSizes.map((size) => (
                            <div
                              key={size.sizeId}
                              className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
                                selectedSize === size.sizeId
                                  ? "border-2 border-black"
                                  : "border border-[#ddd]"
                              }`}
                              onClick={() => handleSelectSize(size.sizeId)}
                            >
                              <span className="text-base font-semibold">
                                {size.sizeTen}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2 items-center">
                  <span className="text-base font-semibold">
                    Số lượng trong kho:
                  </span>
                  <span className="text-base font-bold text-primary">
                    {soLuong}
                  </span>
                </div>

                <div className="flex gap-2 items-center">
                  <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                    <MinusOutlined />
                  </button>
                  <span style={{ padding: "0 15px", fontWeight: 500 }}>
                    {quantity}
                  </span>
                  <button onClick={increaseQuantity}>
                    <PlusOutlined />
                  </button>
                </div>

                <div
                  className="outline-none bg-black text-white text-base text-center font-semibold rounded-lg py-2 cursor-pointer hover:scale-105"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </div>
                <div
                  className="bg-primary text-white py-2 font-semibold text-base rounded-lg outline-none text-center cursor-pointer hover:scale-105"
                  onClick={handleBuyNow}
                >
                  Mua ngay
                </div>
              </div>
            </div>
            <h1
              style={{
                marginTop: "3%",
                textAlign: "center",
                marginBottom: "2%",
              }}
            >
              XEM THÊM CÁC SẢN PHẨM TƯƠNG TỰ
            </h1>
            <Carousel
              slidesToShow={4}
              dots={false}
              style={{ margin: "0 2%", marginBottom: "10%" }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{ padding: "0 10px" }}
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
                          objectFit: "contain",
                          height: "auto",
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
            </Carousel>
          </div>
        </Layout>
      </Content>
    </Layout>
  );
};

export default ProductDetail;
