import React, { useState, useEffect } from "react";
import HeaderF5 from "../../Layouts/Header/Header";
import { SlLocationPin } from "react-icons/sl";
import { LuPhone } from "react-icons/lu";
import { PiUserCircleThin } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
import HomeView from "../../../Service/HomeService";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { fullname, email, phone, message } = formData;
    if (!fullname || !email || !phone || !message) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ!");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Số điện thoại phải là 10 chữ số!");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    console.log("Sending data:", formData);
    setTimeout(() => {
      alert("Tin nhắn của bạn đã được gửi thành công!");
      setFormData({ fullname: "", email: "", phone: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    // Fetch products for search functionality
    HomeView.ViewProductHome().then((data) => {
      setProducts(data);
    });
  }, []);

  return (
    <div>
      {/* Header */}
      <HeaderF5 products={products} />

      {/* Banner */}
      <div className="flex flex-col gap-3 items-center justify-center bg-[#f0f2f5] py-[30px]">
        <span className="text-2xl font-bold uppercase">
          Liên hệ với chúng tôi
        </span>
        <div className="flex flex-col items-center justify-center text-lg font-normal">
          <span>
            Hãy để lại tin nhắn, chúng tôi sẽ phản hồi bạn trong thời gian sớm
            nhất!
          </span>
          <span>F5 Fashion luôn luôn sẵn lòng hỗ trợ</span>
        </div>
      </div>

      <div className="max-w-screen-xl mt-3 mb-10 mx-auto p-5 bg-white rounded-xl shadow-xl border-2 border-[#f0f2f5]">
        <div className="flex justify-between gap-5">
          <div className="flex flex-col gap-5 w-2/5">
            <span className="text-2xl font-bold text-center">
              THÔNG TIN LIÊN HỆ
            </span>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex gap-2 items-center">
                <SlLocationPin size={16} />
                <span>
                  Địa chỉ: 63 đường An Trai, Vân Canh, Hoài Đức, Hà Nội
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <TfiEmail size={16} />
                <span>Email: f5fashioncskh@gmail.com</span>
              </div>
              <div className="flex gap-2 items-center">
                <LuPhone size={16} />
                <span>Điện thoại: 0855338978</span>
              </div>
            </div>
            <iframe
              className="rounded-xl"
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0046040850393!2d105.73295227503151!3d21.03250178061775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454882c01259b%3A0xefdf3cd91a1fd687!2zNjMgQW4gVHJhaSwgVsOibiBDYW5oLCBOYW0gVOG7qyBMacOqbSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1744599194353!5m2!1svi!2s"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Cột form liên hệ */}
          <div className="flex flex-col gap-4 w-3/5">
            <span className="text-2xl font-bold text-center">GỬI LIÊN HỆ</span>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="fullname">Họ và tên</label>
                <div className="relative">
                  <PiUserCircleThin
                    size={20}
                    className="absolute top-2 left-2"
                  />
                  <input
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    className="pl-8 pr-4 py-2 border rounded-md w-full outline-none focus:border focus:border-[#1877f2]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <div className="relative">
                  <TfiEmail size={16} className="absolute top-2.5 left-2.5" />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập email của bạn"
                    className="pl-8 pr-4 py-2 border rounded-md w-full outline-none focus:border focus:border-[#1877f2]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="phone">Số điện thoại</label>
                <div className="relative">
                  <LuPhone size={16} className="absolute top-2.5 left-2.5" />
                  <input
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại của bạn"
                    className="pl-8 pr-4 py-2 border rounded-md w-full outline-none focus:border focus:border-[#1877f2]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message">Nội dung</label>
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Nhập nội dung liên hệ của bạn"
                  className="p-3 border rounded-md w-full outline-none focus:border focus:border-[#1877f2]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`bg-primary text-center text-white font-semibold py-2 rounded-md transition-all my-0 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#2f6ab8]"
                }`}
              >
                {loading ? "Đang gửi..." : "Gửi liên hệ"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
