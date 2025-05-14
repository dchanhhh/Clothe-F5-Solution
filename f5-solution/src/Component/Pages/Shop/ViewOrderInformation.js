import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderF5 from "../../Layouts/Header/Header";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const ViewOrderInformation = () => {
  const navigate = useNavigate();
  const [TaiKhoan, setUsername] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const [statusOptions] = useState([
    { value: 1, label: "Chờ xác nhận" },
    { value: 2, label: "Đã xác nhận" },
    { value: 3, label: "Chờ giao" },
    { value: 4, label: "Đang giao hàng" },
    { value: 5, label: "Đã hoàn tất" },
    { value: 6, label: "Đã hủy đơn" },
  ]);
  const [statusPay] = useState([
    { value: 0, label: "Chưa thanh toán" },
    { value: 1, label: "Đã thanh toán" },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `https://localhost:7030/api/HoaDon/by-makh/${user.IdKhachhang}`
          );
          const data = await response.json();
          if (response.ok) {
            setCartItems(data);
          } else {
            alert("Lỗi khi tải dữ liệu đơn hàng!");
          }
        } catch (error) {
          alert("Không thể kết nối với server!");
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-400";
      case 2:
        return "bg-green-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-red-600";
      case 5:
        return "bg-green-700";
      case 6:
        return "bg-purple-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderF5 />
      <div className="flex flex-col gap-5 px-6 pt-4 pb-10">
        <div className="text-2xl font-bold text-center uppercase">
          Danh sách đơn hàng
        </div>
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {cartItems.map((order) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white shadow rounded-lg p-4 border"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleExpand(order.id)}
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex gap-5">
                        <div className="flex gap-1 w-[250px]">
                          <span className="font-semibold">Mã hóa đơn:</span>
                          <span>{order.maHoaDon}</span>
                        </div>
                        <div className="flex gap-1 w-[250px]">
                          <span className="font-semibold">Tên người nhận:</span>
                          <span>{order.tenNguoiNhan}</span>
                        </div>
                      </div>
                      <div className="flex gap-5">
                        <div className="flex gap-1 w-[250px]">
                          <span className="font-semibold">Ngày đặt hàng:</span>
                          <span>
                            {new Date(order.ngayTao).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex gap-1 w-[250px]">
                          <span className="font-semibold">Tổng tiền:</span>
                          <span className="text-primary font-bold">
                            {order.thanhTien.toLocaleString("vi-VN")} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-5 items-center">
                      <div className="flex gap-2 items-center w-[200px]">
                        <span className="font-semibold">Trạng thái:</span>
                        <span
                          className={`text-white text-sm px-2 py-1 rounded ${getStatusColor(
                            order.tinhTrangThanhToan
                          )}`}
                        >
                          {statusOptions.find(
                            (o) => o.value === order.tinhTrangThanhToan
                          )?.label || "Chưa xác định"}
                        </span>
                      </div>
                      <div className="flex gap-2 items-center w-[250px]">
                        <span className="font-semibold">Thanh toán:</span>
                        <span
                          className={`text-white text-sm px-2 py-1 rounded ${getStatusColor(
                            order.trangThaiThanhToan
                          )}`}
                        >
                          {statusPay.find(
                            (o) => o.value === order.trangThaiThanhToan
                          )?.label || "Chưa xác định"}
                        </span>
                      </div>
                      {isExpanded ? (
                        <TiArrowSortedUp size={26} />
                      ) : (
                        <TiArrowSortedDown size={26} />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="flex flex-col mt-4 border-t pt-3 gap-3">
                      <div className="font-semibold">Chi tiết đơn hàng:</div>
                      <div className="flex flex-col gap-3">
                        {order.hoaDonChiTiets.map((detail) => (
                          <div
                            key={detail.id}
                            className="flex gap-4 justify-between items-center bg-[#f3f3f3] p-3 rounded-lg"
                          >
                            <div className="flex gap-4">
                              <img
                                src={detail.sanPham.anh}
                                width={60}
                                alt="product"
                                className="object-cover"
                              />
                              <div className="flex flex-col gap-2">
                                <div className="font-medium">
                                  {detail.sanPham.tenSanPham}
                                </div>
                                <div className="flex gap-2 items-center">
                                  <div className="flex gap-1">
                                    <span className="font-medium">
                                      Kích cỡ:
                                    </span>
                                    <span>{detail.sanPham.size}</span>
                                  </div>
                                  <span className="font-semibold">-</span>
                                  <div className="flex gap-1">
                                    <span className="font-medium">
                                      Màu sắc:
                                    </span>
                                    <span>{detail.sanPham.mauSac}</span>
                                  </div>
                                </div>
                                <div>x{detail.soLuong}</div>
                              </div>
                            </div>
                            <div className="text-primary font-bold">
                              {detail.tongtien.toLocaleString("vi-VN")} VNĐ
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        Giảm giá: {order.giaTriGiam} VNĐ
                      </div>
                      <div className="text-right text-primary font-bold text-lg">
                        Thành tiền: {order.thanhTien.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrderInformation;
