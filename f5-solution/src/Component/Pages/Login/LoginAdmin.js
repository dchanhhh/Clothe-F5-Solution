import React, { useState } from "react";
import { message } from "antd";
import "antd/dist/reset.css";
import BackgroundImage from "../../../assets/images/Back_Login.png"; // Đường dẫn tới hình nền
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../Service/AuthService"; // Import AuthService
import { jwtDecode } from "jwt-decode"; // Thêm thư viện jwt-decode để giải mã token

const Login = () => {
  const [loading, setLoading] = useState(false); // Trạng thái tải
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onFinish = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      message.error("Vui lòng điền đầy đủ tài khoản và mật khẩu.");
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.loginNhanVien(username, password);
      if (response && response.token) {
        // Giải mã token JWT (nếu sử dụng JWT)
        console.log(response);
        const decodedToken = jwtDecode(response.token);
        // Lưu thông tin người dùng và token vào localStorage
        localStorage.setItem("user", JSON.stringify(decodedToken));
        localStorage.setItem("token", response.token);

        navigate("/");

        message.success("Đăng nhập thành công!");
      } else {
        message.error(
          "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại!"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        "Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden bg-cover bg-center h-[100vh]"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
      }}
    >
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[#00000033]"></div>
      <div className="relative flex flex-col gap-6 items-center justify-center w-full max-w-[500px] p-8 bg-white rounded-xl drop-shadow-md">
        <Link to={"/"}>
          <div className="flex gap-2 text-4xl font-bold">
            <span className="text-orange-500">F5</span>
            <span>FASHION</span>
          </div>
        </Link>
        <div className="flex flex-col gap-3 items-center w-full">
          <div className="text-2xl font-bold">ĐĂNG NHẬP</div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="username" className="text-base font-medium mb-0">
              Tên đăng nhập
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="username"
              id="username"
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="password" className="text-base font-medium mb-0">
              Mật khẩu
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5 rounded-lg"
              id="password"
              name="password"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div
            className="flex w-full justify-end text-sm text-primary hover:underline cursor-pointer"
            onClick={() => navigate("/resetPassword")}
          >
            Quên mật khẩu?
          </div>
          <div
            className="flex items-center justify-center cursor-pointer bg-black text-white font-bold p-2.5 w-full text-sm rounded-lg"
            onClick={onFinish}
          >
            Đăng nhập
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
