import React from "react";
import { Result, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderF5 from "../../Layouts/Header/Header";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  return (
    <>
      <HeaderF5 />
      <div className="min-h-screen bg-[#f5f5f5] py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle={
              <div className="text-center">
                <p className="text-lg mb-2">
                  Cảm ơn bạn đã mua hàng tại F5 Fashion
                </p>
                {orderDetails && (
                  <div className="text-left mt-4 border-t pt-4">
                    <h3 className="text-xl font-semibold mb-3">
                      Chi tiết đơn hàng:
                    </h3>
                    <p>
                      <strong>Mã đơn hàng:</strong> {orderDetails.maHoaDon}
                    </p>
                    <p>
                      <strong>Tổng tiền:</strong>{" "}
                      {orderDetails.tongTien?.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p>
                      <strong>Phí vận chuyển:</strong>{" "}
                      {orderDetails.phiShip?.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <p>
                      <strong>Thành tiền:</strong>{" "}
                      {orderDetails.thanhTien?.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                )}
              </div>
            }
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => navigate("/order/" + orderDetails?.id)}
              >
                Xem chi tiết đơn hàng
              </Button>,
              <Button key="buy" onClick={() => navigate("/")}>
                Tiếp tục mua sắm
              </Button>,
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
