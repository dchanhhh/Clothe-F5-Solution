import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Để lấy tham số ID từ URL và điều hướng
import { albums2 } from "./AlbumList"; // Lấy dữ liệu album từ AlbumList
import "./AlbumListDetail.css";
import CustomHeader from "../../Layouts/Header/Header";

const AlbumListDetail = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const navigate = useNavigate(); // Điều hướng tới các trang khác
  const album = albums2.find((album) => album.id === parseInt(id)); // Tìm sản phẩm theo ID
  const imgRef = useRef(null); // Dùng để thao tác với hình ảnh
  const zoomRef = useRef(null); // Dùng cho chức năng zoom ảnh

  const [TaiKhoan, setUsername] = useState(null);
  useEffect(() => {
    // Kiểm tra thông tin người dùng từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
    }
  }, []);

  // State để lưu màu sắc và size được chọn
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showForm, setShowForm] = useState(false); // Hiển thị form mua ngay

  // State để lưu hình ảnh chính và ảnh phụ
  const [mainImage, setMainImage] = useState(album.imgSrc); // Ảnh chính hiện tại
  const [subImages, setSubImages] = useState([
    album.imgSrc,
    album.imgSrc1,
    album.imgSrc2,
  ]); // Các ảnh phụ

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Vui lòng chọn màu sắc và size trước khi thêm vào giỏ hàng.");
      return;
    }
    // Thêm sản phẩm vào localStorage
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    cartItems.push({ ...album, selectedColor, selectedSize });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    // Điều hướng tới trang giỏ hàng
    navigate("/cart");
  };

  // Hiển thị form khi nhấn "Mua ngay"
  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      alert("Vui lòng chọn màu sắc và size trước khi mua.");
      return;
    }
    setShowForm(true);
  };

  // Đóng form khi click ra ngoài
  const handleCloseForm = (e) => {
    if (e.target.className === "overlay") {
      setShowForm(false);
    }
  };

  // State để lưu số lượng sản phẩm
  const [quantity, setQuantity] = useState(1);

  // Tăng số lượng
  const incrementQuantity = () => {
    setQuantity((prevQuantity) => Math.min(prevQuantity + 1, 99)); // Giới hạn tối đa 99
  };

  // Giảm số lượng
  const decrementQuantity = () => {
    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1)); // Giới hạn tối thiểu 1
  };

  // Hàm đổi ảnh chính với ảnh phụ khi click
  const handleImageClick = (clickedImage) => {
    setSubImages(
      subImages.map((img) => (img === clickedImage ? mainImage : img))
    );
    setMainImage(clickedImage); // Đặt ảnh được click làm ảnh chính
  };

  // Chức năng zoom ảnh khi di chuột
  const handleMouseMove = (e) => {
    const img = imgRef.current;
    const zoomLens = zoomRef.current;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bgPosX = (x / img.width) * 100;
    const bgPosY = (y / img.height) * 100;

    zoomLens.style.left = `${x}px`;
    zoomLens.style.top = `${y}px`;
    zoomLens.style.backgroundImage = `url(${mainImage})`;
    zoomLens.style.backgroundSize = `${img.width * 2}px ${img.height * 2}px`;
    zoomLens.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
  };

  // Kiểm tra nếu sản phẩm không tồn tại
  if (!album) {
    return <div>Album không tồn tại!</div>;
  }

  return (
    <div>
      <CustomHeader />

      <div className="album-detail-container">
        {/* Hiển thị chi tiết sản phẩm */}
        <div className="album-detail-content">
          <div className="album-detail-images">
            {/* Hình ảnh phụ */}
            <div className="album-detail-sub-images">
              {subImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={album.title}
                  onClick={() => handleImageClick(img)} // Đổi ảnh khi click
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            {/* Hình ảnh chính */}
            <div
              className="album-detail-main-image-container"
              onMouseMove={handleMouseMove}
            >
              <div ref={zoomRef} className="zoom-lens"></div>
              <img
                src={mainImage}
                alt={album.title}
                className="album-detail-main-image"
                ref={imgRef}
              />
            </div>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="album-detail-info">
            <h2>{album.title}</h2>
            <p className="album-detail-product-code">
              Mã sản phẩm: 07682141244370401
            </p>
            <p className="album-detail-price">Giá: {album.price}</p>
            <p className="album-detail-material">
              Chất liệu: Vải tổng hợp cao cấp
            </p>

            {/* Chọn màu sắc */}
            <div className="album-detail-colors">
              <label>Màu sắc:</label>
              <div className="album-detail-color-options">
                {["red", "white"].map((color, index) => (
                  <div
                    key={index}
                    className={`color-circle ${
                      selectedColor === color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  ></div>
                ))}
              </div>
            </div>

            {/* Chọn size */}
            <div className="album-detail-sizes">
              <label>Size:</label>
              <div className="album-detail-size-options">
                {["S", "M", "L"].map((size) => (
                  <button
                    key={size}
                    className={`size-option ${
                      selectedSize === size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="album-detail-quantity-section">
              <label className="quantity-label">Số lượng:</label>
              <div className="album-detail-quantity">
                <button
                  onClick={decrementQuantity}
                  className={`quantity-btn ${quantity === 1 ? "disabled" : ""}`}
                  disabled={quantity === 1}
                >
                  <i className="material-icons">-</i>
                </button>
                <span className="quantity-value">{quantity}</span>
                <button onClick={incrementQuantity} className="quantity-btn">
                  <i className="material-icons">+</i>
                </button>
              </div>
            </div>

            {/* Hành động thêm vào giỏ hàng và mua ngay */}
            <div className="album-detail-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Thêm vào giỏ hàng
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Mua ngay
              </button>
            </div>
          </div>
        </div>

        {/* Phần giới thiệu sản phẩm */}
        <div className="album-detail-introduction">
          <h3>Giới thiệu sản phẩm</h3>
          <p>
            Sản phẩm {album.title} được thiết kế với chất liệu vải tổng hợp cao
            cấp, mang lại sự thoải mái và phong cách sang trọng. Với thiết kế
            tinh tế và màu sắc hiện đại, chiếc đầm này hoàn hảo cho những bữa
            tiệc hoặc sự kiện quan trọng.
          </p>
        </div>

        {/* Hiển thị form khi nhấn "Mua ngay" */}
        {showForm && (
          <div className="overlay" onClick={handleCloseForm}>
            <div className="buy-now-form">
              <h2>Thông tin mua hàng</h2>
              <div className="buy-now-product-info">
                <img
                  src={mainImage}
                  alt={album.title}
                  className="buy-now-image"
                />
                <div className="buy-now-details">
                  <p>Sản phẩm: {album.title}</p>
                  <p className="price">Giá: {album.price}</p>
                  <p>Màu sắc: {selectedColor}</p>
                  <p>Size: {selectedSize}</p>
                </div>
              </div>
              <form>
                <label>
                  Tên khách hàng:
                  <input type="text" name="name" required />
                </label>
                <label>
                  Địa chỉ giao hàng:
                  <input type="text" name="address" required />
                </label>
                <label>
                  Số điện thoại:
                  <input type="text" name="phone" required />
                </label>
                <button type="submit">Xác nhận mua</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumListDetail;
