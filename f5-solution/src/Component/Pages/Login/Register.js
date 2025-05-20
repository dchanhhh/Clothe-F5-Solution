import React, { useState } from "react";
import BackgroundImage from "../../../assets/images/Back_Login.png";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../Service/AuthService";
import { BiArrowBack } from "react-icons/bi";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hoVaTenKh: "",
    taiKhoan: "",
    matKhau: "",
    email: "",
    soDienThoai: "",
    gioiTinh: null,
    ngaySinh: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "gioiTinh"
          ? value === "true"
          : name === "ngaySinh"
          ? new Date(value).toISOString().split("T")[0]
          : value,
    }));
  };

  const onFinish = async () => {
    if (
      !formData.hoVaTenKh.trim() ||
      !formData.taiKhoan.trim() ||
      !formData.matKhau.trim() ||
      !formData.email.trim() ||
      !formData.soDienThoai.trim() ||
      formData.gioiTinh === null ||
      !formData.ngaySinh
    ) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const customerCode = `KH${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      const response = await AuthService.registerCustomer({
        maKh: customerCode,
        ...formData,
      });

      if (response && response.token) {
        localStorage.setItem("user", JSON.stringify(response));
        console.log(response);
        alert("Đăng ký thành công!");
        navigate("/Login");
      } else {
        alert("Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.");
      }
    } catch (error) {
      console.error(error);
      alert("Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.");
    }
  };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden bg-cover bg-center p-10"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
      }}
    >
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[#00000033]"></div>
      <div className="relative flex flex-col gap-4 items-center justify-center w-full max-w-[500px] p-8 bg-white rounded-xl drop-shadow-md">
        <div
          className="flex items-center gap-2 w-full text-base font-semibold cursor-pointer"
          onClick={() => navigate("/")}
        >
          <BiArrowBack size={"1.3em"} />
          <span>Trang chủ</span>
        </div>
        <Link to={"/"}>
          <div className="flex gap-2 text-4xl font-bold">
            <span className="text-orange-500">F5</span>
            <span>FASHION</span>
          </div>
        </Link>
        <div className="flex flex-col gap-3 items-center w-full">
          <div className="text-2xl font-bold">ĐĂNG KÝ TÀI KHOẢN</div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="hoVaTenKh" className="text-base font-medium mb-0">
              Họ và tên
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="hoVaTenKh"
              id="hoVaTenKh"
              type="text"
              placeholder="Họ và tên"
              value={formData.hoVaTenKh}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="taiKhoan" className="text-base font-medium mb-0">
              Tên tài khoản
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="taiKhoan"
              id="taiKhoan"
              type="text"
              placeholder="Tên tài khoản"
              value={formData.taiKhoan}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="matKhau" className="text-base font-medium mb-0">
              Mật khẩu
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="matKhau"
              id="matKhau"
              type="password"
              placeholder="Mật khẩu"
              value={formData.matKhau}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="email" className="text-base font-medium mb-0">
              Email đăng ký
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="email"
              id="email"
              type="email"
              placeholder="Email đăng ký"
              pattern=".+@gmail\.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="soDienThoai" className="text-base font-medium mb-0">
              Số điện thoại
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="soDienThoai"
              id="soDienThoai"
              type="text"
              size={10}
              placeholder="Số điện thoại"
              value={formData.soDienThoai}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="gioiTinh" className="text-base font-medium mb-0">
              Giới tính
            </label>
            <select
              className="outline-none text-base leading-5 font-normal h-[42px] pl-2"
              id="gioiTinh"
              name="gioiTinh"
              value={formData.gioiTinh}
              onChange={handleChange}
              required
            >
              <option value="" selected>
                Chọn giới tính
              </option>
              <option value={true}>Nam</option>
              <option value={false}>Nữ</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="ngaySinh" className="text-base font-medium mb-0">
              Ngày sinh
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="ngaySinh"
              id="ngaySinh"
              type="date"
              placeholder="Chọn ngày sinh"
              value={formData.ngaySinh}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <div
            onClick={onFinish}
            className="flex items-center justify-center w-full bg-primary text-white p-2.5 text-sm font-bold rounded-lg cursor-pointer hover:scale-[103%] transition duration-200"
          >
            Đăng ký
          </div>
          <div className="flex gap-2 items-center justify-center text-base">
            <span>Bạn đã có tài khoản?</span>
            <div
              onClick={() => navigate("/Login")}
              className="font-semibold text-primary cursor-pointer hover:underline"
            >
              Đăng nhập
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
