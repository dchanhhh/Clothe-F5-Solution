import React, { useState, useEffect } from "react";
import moment from "moment";
import AdminService from "../../../Service/AdminService";
import AuthService from "../../../Service/AuthService";
import HeaderF5 from "../../Layouts/Header/Header";
import DiaChiService from "../../../Service/DiaChiService";
import AddressFormModal from "./AddressForm";

const Profile = () => {
  const [TaiKhoan, setUsername] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [MaKh, setMaKh] = useState(null);
  const [reloadAddresses, setReloadAddresses] = useState(false);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const maKh = user.MaKh;
  const idKh = user.IdKhachhang;

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (storedUser && maKh) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
      setMaKh(maKh);
      fetchData();
    } else {
      alert("Không tìm thấy thông tin người dùng.");
    }
  }, []);

  const handleSelectAddress = (id) => {
    const selected = addresses.find((address) => address.id === id);

    if (selected) {
      const { diaChiChiTiet, phuongXa, quanHuyen, tinhThanh } = selected;

      // Validate the selected address
      if (!diaChiChiTiet || !phuongXa || !quanHuyen || !tinhThanh) {
        console.error("Thông tin địa chỉ không đầy đủ:", selected);
        return;
      }

      console.log("Selected Address ID:", selected.id);
      console.log("Selected District Name:", quanHuyen);

      setSelectedAddress(selected); // Update the selected address
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      if (maKh) {
        try {
          const data = await DiaChiService.getAddressById(idKh);
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
  }, [idKh, reloadAddresses]);

  const handleSaveAddress = (address) => {
    setIsModalVisible(false); // Close the modal after saving the address
    setReloadAddresses(true); // Set reloadAddresses to true to trigger a re-fetch of the addresses
  };

  const fetchData = async () => {
    try {
      const data = await AdminService.getKhachHangBymaKH(maKh);
      console.log(data);
      setUserProfile({
        hoVaTenKh: data.hoVaTenKh,
        TaiKhoan: data.TaiKhoan,
        fullName: data.fullName,
        email: data.email,
        ngaySinh: moment(data.ngaySinh).format("YYYY-MM-DD"),
        soDienThoai: data.soDienThoai,
        gioiTinh: data.gioiTinh ? "Nam" : "Nữ",
        avatarUrl:
          data.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png",
      });
    } catch (error) {
      alert("Lỗi khi lấy thông tin khách hàng.");
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      const userValues = {
        hoVaTenKh: form.hoVaTenKh.value,
        gioiTinh: form.gioiTinh.value === "Nam",
        ngaySinh: form.ngaySinh.value,
        taiKhoan: TaiKhoan || "string",
        matKhau: "string",
        soDienThoai: form.soDienThoai.value,
        email: form.email.value,
        trangThai: 0,
        maKh: MaKh,
      };

      await AuthService.registerCustomer(userValues);
      alert("Cập nhật thành công!");
      fetchData();
    } catch (error) {
      alert("Có lỗi xảy ra.");
      console.error(error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await DiaChiService.deleteAddress(addressId);
      setReloadAddresses(true);
    } catch (error) {
      console.error("Lỗi khi xóa địa chỉ:", error);
    }
  };

  const handleUpdateAddress = async (addressId) => {
    try {
      await DiaChiService.updateAddress(addressId);
      setReloadAddresses(true);
    } catch (error) {
      console.error("Lỗi khi sửa địa chỉ:", error);
    }
  };

  const handleAddressModalOk = async (addressData) => {
    try {
      if (editingAddress && editingAddress.id) {
        await DiaChiService.updateAddress(editingAddress.id, addressData);
      } else {
        await DiaChiService.addAddress(maKh, addressData);
      }
      setIsAddressModalVisible(false);
      setReloadAddresses(true);
    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ:", error);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditingAddress({ ...editingAddress, [name]: value });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <HeaderF5 />
      <div className="container mx-auto py-10 px-8 flex gap-3">
        <div className="flex flex-col gap-5 flex-1">
          <span className="text-2xl font-bold text-center">
            THÔNG TIN NGƯỜI DÙNG
          </span>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-row gap-8">
            <img
              src={userProfile.avatarUrl}
              className="w-32 h-32 rounded-full object-cover"
              alt="Avatar"
            />
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Họ và tên</span>
                <input
                  className="px-2.5 rounded"
                  name="hoVaTenKh"
                  value={userProfile.hoVaTenKh}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Giới tính</span>
                <select
                  className="px-2.5 rounded"
                  name="gioiTinh"
                  value={userProfile.gioiTinh}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Ngày sinh</span>
                <input
                  className="px-2.5 rounded"
                  type="date"
                  name="ngaySinh"
                  value={userProfile.ngaySinh}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Số điện thoại</span>
                <input
                  className="px-2.5 rounded"
                  type="number"
                  name="soDienThoai"
                  size="10"
                  value={userProfile.soDienThoai}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Email</span>
                <input
                  type="email"
                  className="px-2.5 rounded"
                  name="email"
                  value={userProfile.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-center text-white font-bold py-3 rounded hover:bg-primary/80 hover:scale-100 m-0"
              >
                Cập nhật
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-5 flex-1">
          <span className="text-2xl font-bold text-center">
            ĐỊA CHỈ NGƯỜI DÙNG
          </span>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 max-h-[470px] overflow-y-auto">
            <div className="py-2.5">
              <span
                className="text-white px-3 py-2 bg-green-600 rounded hover:bg-green-700 cursor-pointer"
                onClick={handleOpenModal}
              >
                Thêm địa chỉ
              </span>
            </div>
            {addresses.length > 0 && (
              <div className="flex flex-col gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="flex justify-between items-center gap-2 bg-gray-200 p-2.5 rounded-xl"
                    onClick={() => handleSelectAddress(address.id)}
                  >
                    <span className="text-primary font-semibold text-base line-clamp-1">
                      {address.diaChiChiTiet &&
                      address.phuongXa &&
                      address.quanHuyen &&
                      address.tinhThanh ? (
                        `${address.diaChiChiTiet}, ${address.phuongXa}, ${address.quanHuyen}, ${address.tinhThanh}`
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Địa chỉ không hợp lệ, vui lòng sửa lại!
                        </span>
                      )}
                    </span>
                    <div className="flex gap-1">
                      <div
                        className="bg-primary py-1 px-3 text-white font-semibold text-sm rounded-lg cursor-pointer"
                        onClick={() => handleUpdateAddress(address.id)}
                      >
                        Sửa
                      </div>
                      <div
                        className="bg-red-500 py-1 px-3 text-white font-semibold text-sm rounded-lg cursor-pointer"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        Xóa
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <AddressFormModal
              visible={isModalVisible}
              onClose={handleCloseModal}
              onSave={handleSaveAddress}
            />
          </div>
        </div>

        {/* Modal đơn giản */}
        {isAddressModalVisible && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="flex flex-col gap-4 bg-white p-6 rounded-lg w-[450px]">
              <span className="text-xl font-semibold">Chỉnh sửa địa chỉ</span>
              <input
                type="text"
                name="address"
                value={editingAddress?.address || ""}
                onChange={handleAddressChange}
                className="w-full border px-3 py-2 rounded"
              />
              <div className="flex justify-end space-x-2">
                <div
                  className="bg-[#444444] hover:bg-[#333333] px-3.5 py-2 rounded text-white text-sm cursor-pointer"
                  onClick={() => setIsAddressModalVisible(false)}
                >
                  Hủy
                </div>
                <div
                  className="bg-primary hover:bg-primary/90 px-3.5 py-2 rounded text-white text-sm cursor-pointer"
                  onClick={handleAddressModalOk}
                >
                  Lưu
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
