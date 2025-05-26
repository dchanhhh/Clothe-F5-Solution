import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeaderF5 from "../../Layouts/Header/Header";
import { BsCheckCircleFill } from "react-icons/bs";
import { BiErrorCircle } from "react-icons/bi";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const vnpResponseCode = queryParams.get("vnp_ResponseCode");
    if (!vnpResponseCode) {
      navigate("/");
    }
  }, [location, navigate]);

  const queryParams = new URLSearchParams(location.search);
  const vnpResponseCode = queryParams.get("vnp_ResponseCode");
  const isSuccess = vnpResponseCode === "00";

  return (
    <>
      <HeaderF5 />
      <div className="min-h-screen bg-gray-100 pt-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div
              className={`text-7xl ${
                isSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              {isSuccess ? <BsCheckCircleFill /> : <BiErrorCircle />}
            </div>
            <div className="flex flex-col gap-2 items-center">
              <div
                className={`text-2xl font-bold ${
                  isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {isSuccess ? "THANH TOÁN THÀNH CÔNG!" : "Thanh toán thất bại!"}
              </div>
              <span className="text-lg text-gray-700 text-center">
                {isSuccess
                  ? "Cảm ơn bạn đã mua hàng tại F5 Fashion!"
                  : "Đã xảy ra lỗi trong quá trình thanh toán!"}
              </span>
            </div>
            <div className="flex gap-4">
              {isSuccess && (
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
              )}
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
