import React, { useState } from "react";
import "antd/dist/reset.css";
import BackgroundImage from "../../../assets/images/Back_Login.png"; // Replace with your background image path
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const onFinish = (values) => {
    console.log("Email submitted for password reset:", values);
    // Implement password reset logic (e.g., send request to API)
  };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden bg-cover bg-center h-[100vh]"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
      }}
    >
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[#00000033]"></div>
      <div className="relative flex flex-col gap-4 items-center justify-center w-full max-w-[500px] px-8 pb-8 pt-6 bg-white rounded-xl drop-shadow-md">
        <div
          className="flex items-center gap-2 w-full text-base font-semibold cursor-pointer"
          onClick={() => navigate("/Login")}
        >
          <BiArrowBack size={"1.3em"} />
          <span>Quay lại</span>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Link to={"/"}>
            <div className="flex items-center justify-center gap-2 text-4xl font-bold">
              <span className="text-orange-500">F5</span>
              <span>FASHION</span>
            </div>
          </Link>
          <div className="flex flex-col gap-3 items-center w-full">
            <div className="text-2xl font-bold">QUÊN MẬT KHẨU</div>
            <div className="flex flex-col gap-1 items-start w-full">
              <label htmlFor="email" className="text-base font-medium mb-0">
                Email khôi phục
              </label>
              <input
                className="outline-none text-base leading-5 font-normal px-3 py-5"
                name="email"
                id="email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => email(e.target.value)}
                required
              />
            </div>
          </div>
          <div
            className="flex items-center justify-center cursor-pointer bg-primary hover:scale-[103%] transition duration-200 text-white font-bold p-2.5 w-full text-sm rounded-lg"
            onClick={onFinish}
          >
            Xác nhận
          </div>
        </div>
      </div>
    </div>
    /* <div style={{
            position: 'relative',
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                zIndex: 1,
            }} />

            <div style={{
                position: 'relative',
                zIndex: 2,
                width: '90%',
                maxWidth: '1200px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '1', padding: '10px' }}>
                    <img
                        src={logo_v1}
                        alt="Forgot Password Illustration"
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                    />
                </div>
                <div style={{ flex: '1', padding: '20px', maxWidth: '700px' }}>
                    <Row style={{ marginBottom: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <h1 style={{
                                fontSize: '30px',
                                fontWeight: 'bold',
                                fontFamily: "'Roboto', sans-serif",
                                color: '#333',
                                margin: 0,
                                letterSpacing: '1px'
                            }}>
                                QUÊN MẬT KHẨU
                            </h1>
                        </div>
                    </Row>

                    <Form
                        name="forgot_password"
                        className="forgot-password-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        style={{ textAlign: 'center' }}
                    >
                        <Form.Item
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ email!' }, { type: 'email', message: 'Địa chỉ email không hợp lệ!' }]}
                        >
                            <Input
                                size="large"
                                style={{ width: '90%' }}
                                prefix={<MailOutlined />}
                                placeholder="Email"
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: 'center' }}>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                className="forgot-password-button"
                                style={{
                                    width: '60%',
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderColor: 'black'
                                }}
                            >
                                Gửi yêu cầu
                            </Button>
                        </Form.Item>

                        <Row style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <Col span={24}>
                                <a href="#" onClick={handleLoginRedirect} style={{ color: 'blue' }}>
                                    Quay lại trang đăng nhập
                                </a>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div> */
  );
};

export default ResetPassword;
