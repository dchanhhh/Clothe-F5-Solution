import React, { useState, useEffect } from "react";
import { Modal, Button, message } from "antd";
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from "vn-provinces";
import DiaChiService from "../../../Service/DiaChiService"; // Import the addAddress function from your services
import "../Shop/AddressForm.css"; // Ensure CSS file is properly imported

function AddressFormModal({ visible, onClose, onSave }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [selectedAddress, setSelectedAddress] = useState(""); // Detailed address
  const [userId, setUserId] = useState(null); // User ID to associate with the address

  // Fetch user information from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserId(user.IdKhachhang); // Set the userId from local storage
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, []);

  // Fetch provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      const data = await getProvinces();
      setProvinces(data);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const data = await getDistrictsByProvinceCode(selectedProvince);
        setDistricts(data);
        setWards([]); // Reset wards when province changes
        setSelectedDistrict("");
        setSelectedWard("");
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const data = await getWardsByDistrictCode(selectedDistrict);
        setWards(data);
        setSelectedWard("");
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  const handleSave = async () => {
    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng.");
      return;
    }

    const provinceName =
      provinces.find((p) => p.code === selectedProvince)?.name || "";
    console.log("Selected Province:", provinceName);

    const address = {
      IdKh: userId,
      DiaChiChiTiet: selectedAddress,
      PhuongXa: wards.find((w) => w.code === selectedWard)?.name || "",
      QuanHuyen: districts.find((d) => d.code === selectedDistrict)?.name || "",
      TinhThanh: provinceName, // Ensure this is correctly mapped
    };

    console.log("Address to Save:", address);

    try {
      const newAddress = await DiaChiService.addAddress(address);
      message.success("Địa chỉ đã được thêm thành công!");
      onSave(newAddress);
      onClose();
    } catch (error) {
      console.error("Error adding address:", error);
      message.error(error || "Lỗi khi thêm địa chỉ mới.");
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-4 bg-white w-[450px] rounded-xl p-6 shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xl font-semibold">Chọn địa chỉ</span>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Tỉnh/Thành phố</span>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="select-custom-width"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            {provinces.map((province) => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Quận/Huyện</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedProvince}
            className="select-custom-width"
          >
            <option value="">Chọn quận/huyện</option>
            {districts.map((district) => (
              <option key={district.code} value={district.code}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Xã/Phường</span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            disabled={!selectedDistrict}
            className="select-custom-width"
          >
            <option value="">Chọn xã/phường</option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.code}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold">Địa chỉ chi tiết</span>
          <input
            type="text"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            placeholder="Nhập địa chỉ chi tiết"
            className="select-custom-width px-2.5"
          />
        </div>
        <div className="flex justify-end gap-2">
          <div
            className="px-4 py-2 text-sm rounded-md border bg-gray-200 hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
          >
            Hủy
          </div>
          <div
            className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={handleSave}
          >
            Lưu
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddressFormModal;
