import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import CustomHeader from "../../Layouts/Header/Header"; // Import CustomHeader
import GioHangService from "../../../Service/GiohangService";
import "./Home.css";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const Cart = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUsername(user.TaiKhoan);
        setUserId(user.IdKhachhang);
        fetchCartData(user.IdKhachhang);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        setIsFetching(false);
        console.log(userId);
      }
    }
  }, []);

  const fetchCartData = async (userId) => {
    if (!userId) return;
    try {
      const data = await GioHangService.getAllGioHang(userId);
      setCartItems(data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      message.error("Không thể tải giỏ hàng");
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUsername(null);
    navigate("/");
  };

  const handleContinueShopping = () => {
    setTimeout(() => navigate("/"), 1000);
  };

  const handleDelete = async (id) => {
    try {
      await GioHangService.deleteGioHang(id);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      message.success("Sản phẩm đã được xóa khỏi giỏ hàng");
    } catch (error) {
      console.error("Error deleting cart item:", error);
      message.error("Xóa sản phẩm thất bại!");
    }
  };

  const handleClickViewOrder = () => {
    message.success("Tải trang thông tin đơn hàng thành công!");
    const orderId = userId;
    navigate(`/order/${orderId}`);
  };
  const handleQuantityChange = async (value, record) => {
    if (!value || value <= 0) {
      message.error("Số lượng phải lớn hơn 0");
      return;
    }
    try {
      // Tạo đối tượng cập nhật
      await GioHangService.updateGioHang(record.id, value);
      // Cập nhật lại danh sách giỏ hàng
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === record.id
            ? { ...item, soLuong: value, tongTien: value * item.donGia } // Cập nhật số lượng và tổng tiền
            : item
        )
      );
      message.success("Cập nhật số lượng thành công!");
    } catch (error) {
      console.error("Error updating cart item:", error);
      message.error(
        error.response?.data?.Message || "Cập nhật số lượng thất bại!"
      );
    }
  };

  const handleCheckoutClick = () => {
    if (cartItems.length === 0) {
      message.warning(
        "Giỏ hàng của bạn hiện tại không có sản phẩm để thanh toán. Bạn vui lòng chọn Sản Phẩm vào giỏ hàng !"
      );
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <CustomHeader username={username} handleLogout={handleLogout} />
      <div className="bg-white rounded-xl my-6 mx-[12%]">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center gap-5 p-10">
            <div className="text-2xl uppercase text-center font-bold">
              Giỏ hàng của bạn trống
            </div>
            <img
              src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-illustration-download-in-svg-png-gif-file-formats--shopping-ecommerce-simple-error-state-pack-user-interface-illustrations-6024626.png"
              alt=""
              width={200}
              height={200}
            ></img>
            <div
              className="py-2 px-20 bg-primary text-white text-base font-semibold rounded-lg cursor-pointer"
              onClick={handleContinueShopping}
            >
              Mua ngay
            </div>
            <button
              className="m-0 text-white bg-primary text-sm font-bold py-3 px-5 hover:scale-105 hover:bg-primary/90"
              onClick={handleClickViewOrder}
            >
              Lịch sử đặt hàng
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 p-6">
            <table className="w-full text-center border-collapse border-2">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-2">Hình ảnh</th>
                  <th className="p-2">Tên sản phẩm</th>
                  <th className="p-2">Màu sắc</th>
                  <th className="p-2">Kích cỡ</th>
                  <th className="p-2">Số lượng</th>
                  <th className="p-2">Đơn giá</th>
                  <th className="p-2">Tổng tiền</th>
                  <th className="p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b border-2">
                    <td className="">
                      <img
                        src={item.hinhAnh}
                        alt="product"
                        width={80}
                        height={80}
                        className="mx-auto object-contain py-2"
                      />
                    </td>
                    <td>{item.tenSp}</td>
                    <td>{item.tenMauSac}</td>
                    <td>{item.tenSize}</td>
                    <td>
                      <div className="flex gap-4 items-center justify-center">
                        <button
                          className="p-2 m-0 outline-none"
                          onClick={() =>
                            handleQuantityChange(item.soLuong - 1, item)
                          }
                          disabled={item.soLuong <= 1}
                        >
                          <AiOutlineMinus size={16} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.soLuong}
                          onChange={(e) =>
                            handleQuantityChange(Number(e.target.value), item)
                          }
                          className="w-16 text-center border rounded px-2 py-1"
                        />
                        <button
                          className="p-2 m-0 outline-none"
                          onClick={() =>
                            handleQuantityChange(item.soLuong + 1, item)
                          }
                        >
                          <AiOutlinePlus size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="text-base font-normal">
                      {item.donGia.toLocaleString()} VNĐ
                    </td>
                    <td className="text-base font-semibold text-primary">
                      {item.tongTien.toLocaleString()} VNĐ
                    </td>
                    <td>
                      <div
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white p-1 mx-6 rounded-lg text-base font-semibold cursor-pointer hover:scale-105"
                      >
                        Xóa
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center gap-3 justify-end mr-3">
              <span className="font-semibold text-right">Tổng tiền:</span>
              <span className="font-bold text-xl text-primary">
                {cartItems
                  .reduce((sum, item) => sum + item.tongTien, 0)
                  .toLocaleString()}{" "}
                VNĐ
              </span>
            </div>
            <div className="flex gap-5 justify-between items-center">
              <button
                className="m-0 text-white bg-primary text-sm font-bold py-3 px-5 hover:scale-105 hover:bg-primary/90"
                onClick={() => navigate("/")}
              >
                Tiếp tục mua sắm
              </button>
              <div className="flex gap-5 items-center">
                <button
                  className="m-0 text-white bg-primary text-sm font-bold py-3 px-5 hover:scale-105 hover:bg-primary/90"
                  onClick={handleClickViewOrder}
                >
                  Lịch sử đặt hàng
                </button>
                <button
                  className="m-0 text-white bg-primary text-sm font-bold py-3 px-5 hover:scale-105 hover:bg-primary/90"
                  onClick={handleCheckoutClick}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
