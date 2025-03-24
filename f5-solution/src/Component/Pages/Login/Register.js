import React from "react";
import { Form, Input, Button, Row, Col, DatePicker, Radio } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import BackgroundImage from "../../../assets/images/Back_Login.png";
import logo_v1 from "../../../assets/images/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../../Service/AuthService"; // Import AuthService

const Register = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const onFinish = async (values) => {
    try {
      const customerCode = `KH${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;
      // Thực hiện đăng ký khách hàng qua AuthService
      const response = await AuthService.registerCustomer({
        maKh: customerCode,
        hoVaTenKh: values.hoVaTenKh,
        taiKhoan: values.username,
        matKhau: values.password,
        email: values.email,
        soDienThoai: values.soDienThoai,
        gioiTinh: values.gioiTinh,
        ngaySinh: values.ngaySinh.format("YYYY-MM-DD"), // Chuyển đổi ngày sinh về định dạng API cần
      });

      if (response && response.token) {
        localStorage.setItem("user", JSON.stringify(response));
        alert("Đăng ký thành công!");
        navigate("/"); // Chuyển hướng sau khi đăng ký thành công
      } else {
        alert("Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.");
      }
    } catch (error) {
      // Bắt và ném lỗi ra bên ngoài
      alert("Đăng ký thất bại. Vui lòng kiểm tra thông tin và thử lại.");
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
              //   value={fullname}
              //   onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="username" className="text-base font-medium mb-0">
              Tên tài khoản
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="username"
              id="username"
              type="text"
              placeholder="Tên tài khoản"
              //   value={username}
              //   onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="password" className="text-base font-medium mb-0">
              Mật khẩu
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="password"
              id="password"
              type="password"
              placeholder="Mật khẩu"
              //   value={password}
              //   onChange={(e) => setPassword(e.target.value)}
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
              //   value={email}
              //   onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="phoneNumber" className="text-base font-medium mb-0">
              Số điện thoại
            </label>
            <input
              className="outline-none text-base leading-5 font-normal px-3 py-5"
              name="phoneNumber"
              id="phoneNumber"
              type="text"
              size={10}
              placeholder="Số điện thoại"
              //   value={phoneNumber}
              //   onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1 items-start w-full">
            <label htmlFor="gender" className="text-base font-medium mb-0">
              Giới tính
            </label>
            <select
              className="outline-none text-base leading-5 font-normal h-[42px] pl-2"
              id="gender"
              required
            >
              <option value="" selected>
                Chọn giới tính
              </option>
              <option>Nam</option>
              <option>Nữ</option>
            </select>
          </div>
          <Form
            name="register_form"
            className="register-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ textAlign: "center" }}
          >
            <Form.Item
              name="gioiTinh"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Radio.Group>
                <Radio value={true}>Nam</Radio>
                <Radio value={false}>Nữ</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="ngaySinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker placeholder="Ngày sinh" style={{ width: "90%" }} />
            </Form.Item>

            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                className="register-form-button"
                style={{
                  width: "60%",
                  backgroundColor: "black",
                  color: "white",
                  borderColor: "black",
                }}
              >
                Đăng kí
              </Button>
            </Form.Item>

            <Row style={{ textAlign: "center", marginBottom: "20px" }}>
              <Col span={24}>Bạn đã có tài khoản</Col>
            </Row>

            <Form.Item style={{ textAlign: "center" }}>
              <Button
                type="default"
                size="large"
                className="register-form-button"
                style={{
                  width: "60%",
                  backgroundColor: "white",
                  color: "black",
                  borderColor: "black",
                }}
                onClick={handleLogin}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
