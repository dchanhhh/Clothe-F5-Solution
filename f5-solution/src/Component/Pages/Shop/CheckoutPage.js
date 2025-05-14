import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { Button, message, notification } from "antd";
import Anh from "../Admin/Anh1.png";
import CustomHeader from "../../Layouts/Header/Header";
import AddressFormModal from "../Shop/AddressForm";
import DiaChiService from "../../../Service/DiaChiService";
import GioHangService from "../../../Service/GiohangService";
import GHN from "../../../Service/ghnAPI";
import vnPayService from "../../../Service/VNpayServices";
function Checkout() {
  const [deliveryMethod, setDeliveryMethod] = useState("Giao hàng");

  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [userId, setUserId] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [TenNguoiNhan, setTenNguoiNhan] = useState("");
  const [SdtNguoiNhan, setSdtNguoiNhan] = useState("");
  const [NgayNhan, setNgayNhan] = useState("");
  const [GhiChu, setGhiChu] = useState("");
  const [voucherData, setVoucherData] = useState(null);
  const [voucherCode, setVoucherCode] = useState("");

  const [codFee, setCodFee] = useState(0); // Phí COD
  const [error, setError] = useState({
    TenNguoiNhan: "",
    SdtNguoiNhan: "",
    NgayNhan: "",
    GhiChu: "",
  });
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.IdKhachhang); // Set the userId from local storage
        fetchCartData(user.IdKhachhang);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  const [reloadAddresses, setReloadAddresses] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (userId) {
        try {
          const data = await DiaChiService.getAddressById(userId);
          setAddresses(data);
          console.log(data);
        } catch (error) {
          console.error("Error fetching address:", error);
        }
      }
    };

    if (reloadAddresses) {
      fetchAddresses();
      setReloadAddresses(false);
    } else {
      fetchAddresses();
    }
  }, [userId, reloadAddresses]);
  useEffect(() => {
    if (voucherData) {
      console.log("Voucher đã áp dụng:", voucherData);
    }
  }, [voucherData]);

  const handleVoucher = async () => {
    try {
      // Gọi API để lấy dữ liệu voucher dựa trên mã voucher
      const data = await GioHangService.getMaVouchers(voucherCode);

      // Kiểm tra nếu không tìm thấy voucher
      if (!data) {
        message.warning("Mã voucher không tồn tại.");
        return;
      }

      // Lấy ngày bắt đầu và ngày kết thúc từ dữ liệu voucher
      const ngayBatDau = new Date(data.ngayBatDau);
      const ngayKetThuc = new Date(data.ngayKetThuc);
      const currentDate = new Date(); // Ngày hiện tại

      // Kiểm tra nếu voucher chưa bắt đầu
      if (currentDate < ngayBatDau) {
        notification.warning({ message: "Voucher chưa đến ngày bắt đầu." });
        return;
      }

      // Kiểm tra nếu voucher đã hết hạn
      if (currentDate > ngayKetThuc) {
        notification.warning({ message: "Voucher đã hết hạn." });
        return;
      }

      // Kiểm tra nếu số lượng mã nhỏ hơn hoặc bằng 0
      if (data.soLuongMa <= 0) {
        notification.warning({ message: "Voucher đã hết số lượng." });
        return;
      }

      // Kiểm tra nếu subtotal không đủ điều kiện hóa đơn tối thiểu
      if (subtotal < data.dieuKienToiThieuHoaDon) {
        notification.warning({
          message: `Tổng giá trị đơn hàng phải lớn hơn hoặc bằng ${data.dieuKienToiThieuHoaDon}.`,
        });
        return;
      }

      // Nếu tất cả điều kiện hợp lệ, cập nhật voucher
      setVoucherData(data);
      console.log(data);
      notification.success({ message: "Áp dụng voucher thành công!" });
      const calculatedDiscount =
        data.hinhThucGiam === 1
          ? (subtotal * data.giaTriGiam) / 100 // Percentage discount
          : data.giaTriGiam; // Fixed amount discount
      setDiscount(calculatedDiscount);
    } catch (error) {
      notification.warning({ message: "Mã voucher không tồn tại" });
    }
  };

  const fetchCartData = async (userId) => {
    try {
      const data = await GioHangService.getAllGioHang(userId);

      // Kiểm tra nếu giỏ hàng rỗng
      if (!data || data.length === 0) {
        setCartItems([]); // Đảm bảo giỏ hàng được đặt thành mảng trống

        return;
      }

      // Chuyển đổi dữ liệu giỏ hàng thành cấu trúc mong muốn
      const mappedData = data.map((item) => ({
        Anh: item.hinhAnh || "/images/default-product.jpg", // Hình ảnh mặc định
        TenSanPham: item.tenSp || "Sản phẩm không xác định",
        Size: item.tenSize || "Không có",
        Color: item.tenMauSac || "Không có",
        Price: item.tongTien || 0,
      }));

      console.log("Fetched Cart Data:", data);
      setCartItems(mappedData); // Cập nhật dữ liệu giỏ hàng
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      message.error("Không thể tải giỏ hàng. Vui lòng thử lại.");
    }
  };

  const handlePlaceOrder = async () => {
    let formIsValid = true;
    let errorObj = {
      TenNguoiNhan: "",
      SdtNguoiNhan: "",
      NgayNhan: "",
      GhiChu: "",
    };

    // Kiểm tra các trường nhập liệu bắt buộc
    if (!TenNguoiNhan) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Vui lòng nhập tên!";
    }

    if (!SdtNguoiNhan) {
      formIsValid = false;
      errorObj.SdtNguoiNhan = "Vui lòng nhập số điện thoại!";
    } else {
      // Kiểm tra định dạng số điện thoại
      const phonePattern = /^(\+84|84|0)(\d{9})$/;
      if (!phonePattern.test(SdtNguoiNhan)) {
        formIsValid = false;
        errorObj.SdtNguoiNhan = "Số điện thoại không hợp lệ!";
      }
    }

    if (!NgayNhan) {
      formIsValid = false;
      errorObj.NgayNhan = "Vui lòng chọn ngày nhận hàng!";
    }

    if (!GhiChu) {
      formIsValid = false;
      errorObj.GhiChu = "Vui lòng nhập !";
    }

    if (!formIsValid) {
      setError(errorObj);
      return; // Dừng lại nếu có lỗi
    }

    setLoading(true);

    const orderData = {
      IdDiaChi: selectedAddress.id,
      TenNguoiNhan: TenNguoiNhan,
      SdtNguoiNhan: SdtNguoiNhan,
      VoucherId: voucherData?.id || null,
      GhiChu: GhiChu,
      TienShip: codFee || 0,
      NgayNhanHang: NgayNhan,
    };

    console.log(orderData);
    try {
      const response = await GioHangService.placeOrder(userId, orderData);
      notification.success({ message: "Đặt hàng thành công!" });
      console.log(response);
      await fetchCartData(userId); // Cập nhật giỏ hàng sau khi đặt hàng thành công
      const orderId = userId;
      navigate(`/order/${orderId}`);
    } catch (error) {
      setLoading(false);
      message.error("Đặt hàng không thành công. Vui lòng thử lại!");
      console.error(error);
    }
  };

  const handleDeliveryMethodChange = async (method) => {
    setDeliveryMethod(method);

    if (method === "Nhận tại cửa hàng") {
      // Thiết lập các giá trị mặc định cho nhận tại cửa hàng
      const IdCuaHang = "00000000-0000-0000-0000-000000000000"; // Đặt GUID mặc định của cửa hàng
      setSelectedAddress([
        {
          id: IdCuaHang,
          diaChiChiTiet:
            "Cửa hàng BBQ - 123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
        },
      ]);
      setGhiChu("Nhận tại cửa hàng");
      setNgayNhan(new Date().toISOString().split("T")[0]); // Gán ngày hiện tại
    } else if (method === "Giao hàng") {
      try {
        // Lấy danh sách địa chỉ của khách hàng từ máy chủ
        const data = await DiaChiService.getAddressById(userId);
        if (data && data.length > 0) {
          setAddresses(data); // Cập nhật danh sách địa chỉ
        } else {
          setAddresses([]); // Xóa danh sách địa chỉ nếu không có
          message.info("Bạn chưa có địa chỉ nào, hãy thêm mới.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách địa chỉ:", error);
        message.error("Không thể tải danh sách địa chỉ. Vui lòng thử lại!");
      }

      // Xóa ghi chú và ngày nhận (nếu cần)
      setGhiChu("");
      setNgayNhan("");
    }
  };

  const handlePayment = async () => {
    let formIsValid = true;
    let errorObj = {
      TenNguoiNhan: "",
      SdtNguoiNhan: "",
      NgayNhan: "",
      GhiChu: "",
    };

    // Kiểm tra các trường nhập liệu bắt buộc
    if (!TenNguoiNhan || TenNguoiNhan.trim() === "") {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được để trống!";
    } else if (/\d/.test(TenNguoiNhan)) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được chứa số!";
    } else if (
      /[^a-zA-Z\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/.test(
        TenNguoiNhan
      )
    ) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được chứa ký tự đặc biệt!";
    } else if (TenNguoiNhan.length < 2) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên phải có ít nhất 2 ký tự!";
    } else if (TenNguoiNhan.length > 50) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được vượt quá 50 ký tự!";
    } else if (
      TenNguoiNhan.trim() !== TenNguoiNhan ||
      /\s{2,}/.test(TenNguoiNhan)
    ) {
      formIsValid = false;
      errorObj.TenNguoiNhan = "Tên không được chứa khoảng trắng thừa!";
    }

    if (!SdtNguoiNhan) {
      formIsValid = false;
      errorObj.SdtNguoiNhan = "Vui lòng nhập số điện thoại!";
    } else {
      // Kiểm tra định dạng số điện thoại
      const phonePattern = /^(\+84|84|0)(\d{9})$/;
      if (!phonePattern.test(SdtNguoiNhan)) {
        formIsValid = false;
        errorObj.SdtNguoiNhan = "Số điện thoại không hợp lệ!";
      }
    }

    if (!NgayNhan) {
      formIsValid = false;
      errorObj.NgayNhan = "Vui lòng chọn ngày nhận hàng!";
    }

    if (!GhiChu) {
      formIsValid = false;
      errorObj.GhiChu = "Vui lòng nhập ghi chú!";
    }

    if (!formIsValid) {
      setError(errorObj);
      return; // Dừng lại nếu có lỗi
    }

    setLoading(true);

    try {
      // Gọi API VNPay để lấy URL thanh toán
      const orderData = {
        IdDiaChi: selectedAddress.id,
        TenNguoiNhan: TenNguoiNhan,
        SdtNguoiNhan: SdtNguoiNhan,
        VoucherId: voucherData?.id || null,
        GhiChu: GhiChu,
        TienShip: codFee || 0,
        NgayNhanHang: NgayNhan,
      };

      // Gọi API VNPayPayment và lấy URL thanh toán
      const paymentResponse = await vnPayService.VNPayPayment(
        userId,
        orderData
      );
      console.log("hhhhhhh", paymentResponse);
      window.location.href = paymentResponse;

      await fetchCartData(userId); // Cập nhật giỏ hàng sau khi đặt hàng thành công
      const orderId = userId;
      navigate(`/order/${orderId}`);
    } catch (error) {
      setLoading(false);
      setError(
        "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveAddress = (address) => {
    setIsModalVisible(false); // Close the modal after saving the address
    setReloadAddresses(true); // Set reloadAddresses to true to trigger a re-fetch of the addresses
  };

  const calculateShipping = async (recipientAddress) => {
    setError(""); // Reset error message

    try {
      // Lấy thông tin địa chỉ của người nhận
      const recipientIds = await getAddressIds(recipientAddress);
      console.log("Provinces:", recipientIds);

      // Đặt sản phẩm mặc định (quần áo)
      const defaultItem = {
        name: "Quần Áo", // Tên sản phẩm
        quantity: 1, // Số lượng
        weight: 200, // Trọng lượng sản phẩm (gram)
        length: 10, // Chiều dài sản phẩm (cm)
        width: 20, // Chiều rộng sản phẩm (cm)
        height: 20, // Chiều cao sản phẩm (cm)
      };

      // Tính tổng trọng lượng và kích thước của đơn hàng
      const totalWeight = defaultItem.weight * defaultItem.quantity; // Tổng trọng lượng
      const totalLength = defaultItem.length * defaultItem.quantity; // Tổng chiều dài
      const totalWidth = defaultItem.width * defaultItem.quantity; // Tổng chiều rộng
      const totalHeight = defaultItem.height * defaultItem.quantity; // Tổng chiều cao

      // Dữ liệu gửi yêu cầu tính phí vận chuyển
      const shippingData = {
        service_type_id: 2, // ID loại dịch vụ vận chuyển
        from_district_id: 1442, // ID quận/huyện của cửa hàng
        from_ward_code: "21211", // Mã phường xã của cửa hàng
        to_district_id: recipientIds.districtId, // ID quận/huyện của người nhận
        to_ward_code: recipientIds.wardId, // Mã phường xã của người nhận
        height: totalHeight, // Chiều cao tổng của gói hàng
        length: totalLength, // Chiều dài tổng của gói hàng
        weight: totalWeight, // Trọng lượng tổng của gói hàng
        width: totalWidth, // Chiều rộng tổng của gói hàng
        insurance_value: 0, // Giá trị bảo hiểm
        coupon: null, // Mã giảm giá (nếu có)
        items: [defaultItem], // Mảng sản phẩm mặc định (quần áo)
      };

      // Gửi yêu cầu đến GHN API để tính phí vận chuyển
      const response = await GHN.calculateShippingFee(shippingData);

      // Log phản hồi để debug
      console.log("Shipping Fee Response:", response);

      // Kiểm tra và lấy các phí từ phản hồi trả về
      if (response) {
        const shippingFee = response.total || response.service_fee || 0; // Sử dụng 'total' hoặc 'service_fee'
        const codFee = response.service_fee || 0; // Giả sử phí COD có thể tương đương phí dịch vụ

        if (shippingFee) {
          setCodFee(codFee); // Lưu phí COD (nếu có)
        } else {
          console.error(
            "Phí vận chuyển không tìm thấy trong phản hồi:",
            response
          );
          setError("Không thể tính phí vận chuyển.");
        }
      } else {
        setError("Không có phản hồi từ API GHN.");
      }
    } catch (error) {
      console.error("Lỗi khi tính phí vận chuyển và COD:", error);
      setError("Không thể tính phí vận chuyển. Vui lòng thử lại.");
    }
  };

  // Function to get address IDs (province, district, ward)
  const getAddressIds = async (selected) => {
    const provinceId = await getProvinceId(selected.tinhThanh);
    const districtId = await getDistrictId(provinceId, selected.quanHuyen);
    const wardId = await getWardId(districtId, selected.phuongXa);
    return { provinceId, districtId, wardId };
  };

  // Function to get Province ID from GHN
  const getProvinceId = async (tinhThanh) => {
    try {
      // Clean up the province name if it includes "Thành phố"
      const cleanedTinhThanh = tinhThanh
        .replace(/^(Thành phố |Tỉnh )/, "")
        .trim();

      console.log("Searching for province:", cleanedTinhThanh);

      // Get the list of provinces from GHN API
      const provinces = await GHN.getProvinces();
      console.log("Provinces:", provinces);

      // Find the province by name
      const province = provinces.find(
        (p) => p.ProvinceName === cleanedTinhThanh
      );

      if (province) {
        console.log("Province found:", province.ProvinceID);
        return province.ProvinceID;
      } else {
        console.error("Province not found:", cleanedTinhThanh);
        return null;
      }
    } catch (error) {
      console.error("Error when fetching provinces:", error);
      return null;
    }
  };

  // Function to get District ID from GHN
  const getDistrictId = async (provinceId, quanHuyen) => {
    try {
      console.log("Searching for district:", quanHuyen);

      const districts = await GHN.getDistricts(provinceId);
      console.log("Districts:", districts);

      const district = districts.find((d) => d.DistrictName === quanHuyen);

      if (district) {
        console.log("District found:", district.DistrictID);
        return district.DistrictID;
      } else {
        console.error("District not found:", quanHuyen);
        return null;
      }
    } catch (error) {
      console.error("Error when fetching districts:", error);
      return null;
    }
  };

  // Function to get Ward ID from GHN
  const getWardId = async (districtId, phuongXa) => {
    try {
      console.log("Searching for ward:", phuongXa);

      const wards = await GHN.getWards(districtId);
      console.log("Wards:", wards);

      const ward = wards.find((w) => w.WardName === phuongXa);

      if (ward) {
        console.log("Ward found:", ward.WardCode);
        return ward.WardCode;
      } else {
        console.error("Ward not found:", phuongXa);
        return null;
      }
    } catch (error) {
      console.error("Error when fetching wards:", error);
      return null;
    }
  };

  // Function to handle address selection
  const handleSelectAddress = (id) => {
    const selected = addresses.find((address) => address.id === id);

    if (selected) {
      const { diaChiChiTiet, phuongXa, quanHuyen, tinhThanh } = selected;

      // Validate the selected address
      if (!diaChiChiTiet || !phuongXa || !quanHuyen || !tinhThanh) {
        console.error("Thông tin địa chỉ không đầy đủ:", selected);
        setError("Địa chỉ không hợp lệ. Vui lòng chọn địa chỉ khác.");
        return;
      }

      console.log("Selected Address ID:", selected.id);
      console.log("Selected District Name:", quanHuyen);

      setSelectedAddress(selected); // Update the selected address
      calculateShipping({ diaChiChiTiet, phuongXa, quanHuyen, tinhThanh }); // Pass full address to shipping calculation
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.Price, 0);
  const total = subtotal - discount + codFee;
  return (
    <div className="flex flex-col gap-5 mb-10">
      <CustomHeader />
      <div className="flex gap-8 px-8 w-full">
        <div className="bg-[#f5f5f5] flex flex-col gap-5 rounded-xl p-5 w-1/2 border border-gray-200">
          <div className="text-2xl font-bold uppercase text-center">
            Thanh toán
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xl font-semibold">1. Thông tin liên hệ</span>
            <div className="flex gap-5 justify-between">
              <div className="flex flex-col w-full">
                <label htmlFor="fullName">Họ và tên</label>
                <input
                  className="px-2"
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={TenNguoiNhan}
                  onChange={(e) => setTenNguoiNhan(e.target.value)}
                  placeholder="Nhập họ và tên"
                  required
                />
                {error.TenNguoiNhan && (
                  <span className="text-xs font-semibold text-[#ff3333] mt-1">
                    {error.TenNguoiNhan}
                  </span>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  className="px-2"
                  type="text"
                  name="phone"
                  id="phone"
                  value={SdtNguoiNhan}
                  onChange={(e) => setSdtNguoiNhan(e.target.value)}
                  placeholder="+84 xxx-xxx-xxx"
                  required
                  pattern="^(\+84|84|0)(\d{9})$"
                  title="Vui lòng nhập số điện thoại hợp lệ"
                  aria-required="true"
                />
                {error.SdtNguoiNhan && (
                  <span className="text-xs font-semibold text-[#ff3333] mt-1">
                    {error.SdtNguoiNhan}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xl font-semibold">
              2. Phương thức giao hàng
            </span>
            <div className="flex gap-5 justify-between">
              <div
                className={`text-sm font-semibold rounded-lg w-full cursor-pointer p-3 ${
                  deliveryMethod === "Nhận tại cửa hàng"
                    ? "bg-primary text-white"
                    : "bg-[#dfdfdf] text-black"
                }`}
                onClick={() => handleDeliveryMethodChange("Nhận tại cửa hàng")}
              >
                Nhận tại cửa hàng
              </div>
              <div
                className={`text-sm font-semibold rounded-lg w-full cursor-pointer p-3 ${
                  deliveryMethod === "Giao hàng"
                    ? "bg-primary text-white"
                    : "bg-[#dfdfdf] text-black"
                }`}
                onClick={() => handleDeliveryMethodChange("Giao hàng")}
              >
                Giao hàng
              </div>
            </div>

            {deliveryMethod === "Nhận tại cửa hàng" ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <span className="text-base font-semibold">
                    Thông tin cửa hàng:
                  </span>
                  <span className="text-base font-normal">
                    63 An Trai, Xã Vân Canh, Huyện Hoài Đức, Thành phố Hà Nội
                  </span>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.004604085039!2d105.73295227503152!3d21.032501780617764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454882c01259b%3A0xefdf3cd91a1fd687!2zNjMgQW4gVHJhaSwgVsOibiBDYW5oLCBOYW0gVOG7qyBMacOqbSwgSMOgIE7hu5lpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1747105687455!5m2!1svi!2s"
                  className="border-0 rounded-xl w-full h-[200px]"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  title="Bản đồ địa chỉ 63 An Trai, Hà Nội"
                ></iframe>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex gap-5 justify-between">
                  <div className="flex flex-col w-full">
                    <label htmlFor="deliveryDate">
                      Ngày nhận hàng mong muốn
                    </label>
                    <input
                      className="px-2"
                      id="deliveryDate"
                      name="deliveryDate"
                      type="date"
                      value={NgayNhan}
                      onChange={(e) => setNgayNhan(e.target.value)}
                      disabled={deliveryMethod !== "Giao hàng"}
                      required
                      min={new Date().toISOString().split("T")[0]} // Không cho phép chọn ngày quá khứ
                      aria-required="true"
                    />
                    {error.NgayNhan && (
                      <span className="text-xs font-semibold text-[#ff3333] mt-1">
                        {error.NgayNhan}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-full">
                    <label htmlFor="note">Ghi chú (giờ thuận tiện)</label>
                    <input
                      id="note"
                      name="note"
                      className="px-2"
                      type="text"
                      value={GhiChu}
                      onChange={(e) => setGhiChu(e.target.value)}
                      placeholder="Ghi chú"
                    />
                    {error.GhiChu && (
                      <span className="text-xs font-semibold text-[#ff3333] mt-1">
                        {error.GhiChu}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="address">Địa chỉ</label>
                    <div className="flex flex-col gap-2">
                      {addresses.length > 0 ? (
                        addresses.map((address) => (
                          <div
                            key={address.id}
                            // className={
                            //   selectedAddress?.id === address.id
                            //     ? "selected"
                            //     : ""
                            // }
                            className={`text-sm font-medium p-3 rounded-xl w-fit cursor-pointer hover:scale-105 ${
                              selectedAddress?.id === address.id
                                ? "bg-primary text-white"
                                : "bg-[#dfdfdf] text-black"
                            }`}
                            onClick={() => handleSelectAddress(address.id)}
                          >
                            {address.diaChiChiTiet &&
                            address.phuongXa &&
                            address.quanHuyen &&
                            address.tinhThanh
                              ? `${address.diaChiChiTiet}, ${address.phuongXa}, ${address.quanHuyen},${address.tinhThanh}`
                              : "Chưa có địa chỉ, Vui lòng thêm địa chỉ"}
                          </div>
                        ))
                      ) : (
                        <div
                          className="cursor-pointer bg-[#dfdfdf] text-black w-fit p-3 rounded-xl font-semibold hover:scale-105"
                          onClick={handleOpenModal}
                        >
                          Chưa có địa chỉ, Vui lòng thêm địa chỉ
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="input-group">
                  <div
                    className="cursor-pointer bg-black text-white w-fit p-3 rounded-xl font-semibold hover:scale-105"
                    onClick={handleOpenModal}
                  >
                    Địa chỉ Khác
                  </div>
                </div>
                <AddressFormModal
                  visible={isModalVisible}
                  onClose={handleCloseModal}
                  onSave={handleSaveAddress}
                />
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-[#f5f5f5] flex flex-col gap-5 rounded-xl p-5 w-1/2 border border-gray-200">
          <div className="text-2xl font-bold uppercase text-center">
            Đơn hàng
          </div>
          <div>
            {loading ? (
              <div className="loading-spinner">
                <p>Loading...</p>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div className="flex gap-3 w-full items-center" key={index}>
                  <img
                    src={item.Anh}
                    width={80}
                    alt={item.TenSanPham || "Product"}
                  />
                  <div className="flex flex-col gap-2">
                    <span className="text-base font-semibold">
                      {item.TenSanPham}
                    </span>
                    <span className="text-sm font-normal">
                      Size: <span className="font-bold">{item.Size}</span> | Màu
                      sắc: <span className="font-bold">{item.Color}</span>
                    </span>
                    <span className="text-primary text-lg font-bold">
                      {item.Price} VNĐ
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xl font-semibold">3. Mã khuyến mãi</div>
            <input
              type="text"
              className="px-2"
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
            />
            <button
              onClick={handleVoucher}
              className={`text-sm px-4 py-2 w-fit rounded-lg font-semibold ${
                voucherCode
                  ? "bg-primary text-white cursor-pointer hover:scale-100 hover:bg-primary/70"
                  : "bg-[#cccccc] text-[#666666] hover:scale-100 hover:bg-[#cccccc] cursor-default"
              }`}
              disabled={!voucherCode}
            >
              Áp dụng
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <span className="flex gap-1 items-center">
              <span>Tổng giá sản phẩm:</span>
              <span className="text-base font-bold">{subtotal} VNĐ</span>
            </span>
            <span className="flex gap-1 items-center">
              <span>Giảm giá:</span>
              <span className="text-base font-bold">{discount} VNĐ</span>
            </span>
            <span className="flex gap-1 items-center">
              <span>Phí ship:</span>
              <span className="text-base font-bold">
                {codFee ? `${codFee} VNĐ` : "0 VNĐ"}
              </span>
            </span>
          </div>
          <span className="flex gap-2 justify-end text-primary text-xl font-bold">
            <span>Thành tiền:</span>
            <span>{total} VNĐ</span>
          </span>

          <div className="flex gap-3 justify-between">
            <div
              className="w-full text-center text-white font-semibold py-2 bg-primary rounded-lg cursor-pointer"
              onClick={handlePlaceOrder}
              loading={loading}
            >
              Đặt hàng
            </div>
            <div
              className="w-full text-center text-white font-semibold py-2 bg-primary rounded-lg cursor-pointer"
              onClick={handlePayment}
              disabled={loading}
            >
              Thanh toán VNPay
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
