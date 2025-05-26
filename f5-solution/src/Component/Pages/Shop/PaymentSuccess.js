import React from "react";
import { useNavigate } from "react-router-dom";
import HeaderF5 from "../../Layouts/Header/Header";
import { BsCheckCircleFill } from "react-icons/bs";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <>
      <HeaderF5 />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Success Icon */}
            <div className="text-green-500 text-6xl">
              <BsCheckCircleFill />
            </div>

            {/* Success Title */}
            <h1 className="text-2xl font-bold text-green-600">
              Thanh toán thành công!
            </h1>

            {/* Success Message */}
            <p className="text-lg text-gray-700 text-center">
              Cảm ơn bạn đã mua hàng tại F5 Fashion
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() =>
                  navigate(
                    "/order/" +
                      JSON.parse(localStorage.getItem("user"))?.IdKhachhang
                  )
                }
                className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out"
              >
                Xem chi tiết đơn hàng
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out border border-gray-300"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
