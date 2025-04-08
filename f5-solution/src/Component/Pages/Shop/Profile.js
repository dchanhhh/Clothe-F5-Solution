import React, { useState, useEffect } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Layout,
  Button,
  Input,
  Row,
  Col,
  Card,
  Avatar,
  Form,
  Modal,
  message,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import moment from "moment";
import AdminService from "../../../Service/AdminService";
import AuthService from "../../../Service/AuthService";
import HeaderF5 from "../../Layouts/Header/Header";

const { Header } = Layout;

const Profile = () => {
  const navigate = useNavigate();
  const [TaiKhoan, setUsername] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [form] = Form.useForm(); // Form instance for handling form data
  const [MaKh, setMaKhachHang] = useState(null);
  const storedUser = localStorage.getItem("user");
  const user = JSON.parse(storedUser);
  const maKh = user.MaKh;
  const fetchData = async () => {
    try {
      const data = await AdminService.getKhachHangBymaKH(maKh); // Gọi API với MaKh đã được gán
      setUserProfile({
        hoVaTenKh: data.hoVaTenKh,
        TaiKhoan: data.TaiKhoan,
        fullName: data.fullName,
        email: data.email,
        ngaySinh: data.ngaySinh,
        soDienThoai: data.soDienThoai,
        gioiTinh: data.gioiTinh ? "Nam" : "Nữ", // Giới tính sẽ được chuyển thành chuỗi
        avatarUrl:
          data.avatarUrl || "https://www.w3schools.com/howto/img_avatar.png",
      });

      // Đổ dữ liệu vào form
      form.setFieldsValue({
        hoVaTenKh: data.hoVaTenKh,
        gioiTinh: data.gioiTinh ? "Nam" : "Nữ",
        ngaySinh: moment(data.ngaySinh).format("YYYY-MM-DD"),
        soDienThoai: data.soDienThoai,
        email: data.email,
      });
    } catch (error) {
      message.error("Lỗi khi lấy thông tin khách hàng.");
      console.error(error); // In lỗi ra console để dễ dàng debug
    }
  };

  useEffect(() => {
    if (storedUser) {
      if (maKh) {
        const user = JSON.parse(storedUser);
        setUsername(user.TaiKhoan);
        setMaKhachHang(maKh); // Cập nhật MaKh vào state
        fetchData(); // Gọi fetchData sau khi có MaKh
      } else {
        message.error(
          "Không tìm thấy mã khách hàng trong thông tin người dùng."
        );
      }
    } else {
      message.error("Không tìm thấy thông tin người dùng trong localStorage.");
    }
  }, []); // Chỉ chạy một lần khi component mount

  const handleFormSubmit = async (values) => {
    try {
      const userValues = {
        id: values.id,
        maKh: values.maKh,
        hoVaTenKh: values.hoVaTenKh,
        gioiTinh: values.gioiTinh === "Nam", // Chuyển đổi từ chuỗi thành boolean
        ngaySinh: moment(values.ngaySinh).format("YYYY-MM-DD"),
        taiKhoan: values.taiKhoan || "string",
        matKhau: values.matKhau || "string",
        soDienThoai: values.soDienThoai,
        email: values.email,
        trangThai: 0,
      };

      if (isEditing) {
        await AuthService.registerCustomer(userValues);
        console.log(userValues);
        setIsEditing(userValues);
        form.setFieldsValue({
          ...userValues,
          gioiTinh: userValues.gioiTinh ? "Nam" : "Nữ", // Chuyển đổi từ boolean thành chuỗi
          ngaySinh: moment(userValues.ngaySinh).format("YYYY-MM-DD"),
        });
        message.success("Cập nhật khách hàng thành công!");
      }
      fetchData();
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalVisible(true);
  };

  const handleEditAddress = (index) => {
    setEditingAddress({ index, ...addresses[index] });
    setIsAddressModalVisible(true);
  };

  const handleDeleteAddress = (index) => {
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleAddressModalOk = () => {
    const updatedAddresses = editingAddress
      ? addresses.map((addr, index) =>
          index === editingAddress.index ? editingAddress : addr
        )
      : [...addresses, editingAddress];
    setAddresses(updatedAddresses);
    setIsAddressModalVisible(false);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditingAddress({ ...editingAddress, [name]: value });
  };

  return (
    <Layout>
      <HeaderF5 />
      <div className="bg-white">
        <div className="text-2xl font-semibold text-center mt-8">
          THÔNG TIN NGƯỜI DÙNG
        </div>
        <Card style={{ maxWidth: "90%", margin: "20px auto", padding: "20px" }}>
          <Row gutter={[16, 16]}>
            <Col span={6} style={{ textAlign: "center" }}>
              <Avatar size={120} src={userProfile.avatarUrl} />
            </Col>
            <Col span={18}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                disabled={!isEditing}
              >
                <Form.Item
                  name="hoVaTenKh"
                  label="Họ và Tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item
                  name="gioiTinh"
                  label="Giới Tính"
                  rules={[
                    { required: true, message: "Vui lòng chọn giới tính!" },
                  ]}
                >
                  <Select placeholder="Chọn giới tính">
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="ngaySinh"
                  label="Ngày Sinh"
                  rules={[{ required: false }]}
                >
                  <Input type="date" placeholder="Chọn ngày sinh" />
                </Form.Item>
                <Form.Item
                  name="soDienThoai"
                  label="Số Điện Thoại"
                  rules={[
                    {
                      required: false,
                      message: "Vui lòng nhập số điện thoại!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                  <Input type="email" placeholder="Nhập email" />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  {isEditing ? "Cập nhật" : "Chỉnh sửa"}
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>

        {/* CRUD Address Section */}
        <h2 style={{ marginTop: "24px", textAlign: "center" }}>
          ĐỊA CHỈ NGƯỜI DÙNG
        </h2>
        <Card style={{ maxWidth: "90%", margin: "20px auto", padding: "20px" }}>
          <Button
            type="primary"
            onClick={handleAddAddress}
            style={{ marginBottom: "20px" }}
          >
            Thêm Địa Chỉ
          </Button>
          {addresses.map((address, index) => (
            <Card key={index} style={{ marginBottom: "10px" }}>
              <Row justify="space-between">
                <Col span={18}>
                  <div>{address.address}</div>
                </Col>
                <Col span={6} style={{ textAlign: "right" }}>
                  <Button
                    onClick={() => handleEditAddress(index)}
                    icon={<EditOutlined />}
                    style={{ marginRight: "8px" }}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button
                    danger
                    onClick={() => handleDeleteAddress(index)}
                    icon={<DeleteOutlined />}
                  >
                    Xóa
                  </Button>
                </Col>
              </Row>
            </Card>
          ))}
        </Card>

        {/* Address Modal */}
        <Modal
          title="Chỉnh sửa địa chỉ"
          visible={isAddressModalVisible}
          onCancel={() => setIsAddressModalVisible(false)}
          onOk={handleAddressModalOk}
        >
          <Input
            name="address"
            value={editingAddress?.address || ""}
            onChange={handleAddressChange}
            placeholder="Nhập địa chỉ"
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Profile;
