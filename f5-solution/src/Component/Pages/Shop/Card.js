import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteTwoTone } from "@ant-design/icons";
import { Layout, Button, message, InputNumber } from "antd";
import CustomHeader from "../../Layouts/Header/Header"; // Import CustomHeader
import GioHangService from "../../../Service/GiohangService";
import "./Home.css";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const Cart = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const data = await GioHangService.getAllGioHang(userId);
      setCartItems(data);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      message.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUsername(null);
    navigate("/");
  };

  const handleContinueShopping = () => {
    setLoading(true);
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

  const handleClickViewOder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success("Tải trang thông tin đơn hàng thành công!");
      const orderId = userId;
      navigate(`/order/${orderId}`);
    }, 1000);
  };
  const handleQuantityChange = async (value, record) => {
    if (value <= 0) {
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
                        <span className="text-base font-semibold">
                          {item.soLuong}
                        </span>
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
                onClick={handleContinueShopping}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    aria-hidden="true"
                    class="w-4 h-4 text-white animate-spin fill-gray-500"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                ) : (
                  "Tiếp tục mua sắm"
                )}
              </button>
              <div className="flex gap-5 items-center">
                <button
                  className="m-0 text-white bg-primary text-sm font-bold py-3 px-5 hover:scale-105 hover:bg-primary/90"
                  onClick={handleClickViewOder}
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 text-white animate-spin fill-gray-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    "Xem thông tin đơn hàng"
                  )}
                </button>
                <button
                  className="m-0 text-white bg-primary text-sm font-bold py-3 px-5 hover:scale-105 hover:bg-primary/90"
                  onClick={handleCheckoutClick}
                  disabled={loading}
                >
                  {loading ? (
                    <svg
                      aria-hidden="true"
                      class="w-4 h-4 text-white animate-spin fill-gray-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    "Thanh toán"
                  )}
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
