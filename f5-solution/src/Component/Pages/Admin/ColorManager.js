import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Switch,
  Modal,
  Radio,
  Form,
  Input,
  message,
  Select,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import ColorService from "../../../Service/ColorService";
import "./ColorManagement.css";

const { Option } = Select;

const ColorManagement = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // Trạng thái lọc
  const [form] = Form.useForm();
  const pageSize = 10;

  const fetchColor = async (search = "", status = "all") => {
    setLoading(true);
    try {
      const data = await ColorService.getAllColor();
      const filteredData = data.filter((color) => {
        const matchesSearch = color.tenMauSac
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus =
          status === "all" ||
          (status === "active" && color.trangThai === 1) ||
          (status === "inactive" && color.trangThai === 0);
        return matchesSearch && matchesStatus;
      });
      setColors(filteredData);
      message.success("Lấy danh sách màu sắc thành công");
    } catch (error) {
      message.error("Lỗi khi lấy danh sách màu sắc");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColor();
  }, []);

  const openModal = (record = null) => {
    setModalVisible(true);
    setEditingColor(record);
    if (record) {
      form.setFieldsValue({ ...record, trangThai: record.trangThai });
    } else {
      form.resetFields();
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      console.log("Submitting values for create:", values);
      const newColor = {
        tenMauSac: values.tenMauSac,
        moTa: values.moTa,
        trangThai: values.trangThai === 1 ? 1 : 0,
      };
      const response = await ColorService.createColor(newColor);
      console.log("Create response:", response);
      message.success("Thêm mới Màu sắc thành công");
      setModalVisible(false);
      fetchColor(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error response data:", error.response.data);
        message.error(`Lỗi: ${error.response.data}`);
      } else {
        message.error("Lỗi không xác định khi xử lý dữ liệu");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedValues = {
        id: editingColor.id,
        tenMauSac: values.tenMauSac,
        moTa: values.moTa,
        trangThai: values.trangThai === 1 ? 1 : 0,
      };
      const response = await ColorService.updateColor(
        editingColor.id,
        updatedValues
      );
      console.log("Update response:", response);
      message.success("Cập nhật Màu sắc thành công");
      setModalVisible(false);
      fetchColor(searchTerm, statusFilter); // Lọc lại theo từ khóa và trạng thái
    } catch (error) {
      console.error("Error updating Mau Sac:", error);
      message.error(
        error.response?.data || "Lỗi không xác định khi xử lý dữ liệu"
      );
    }
  };

  const handleOk = async () => {
    if (editingColor) {
      await handleUpdate();
    } else {
      await handleCreate();
    }
  };

  const handleStatusChange = async (color, newStatus) => {
    try {
      const updateColor = {
        ...color,
        trangThai: newStatus ? 1 : 0,
      };
      await ColorService.updateColor(color.id, updateColor);
      message.success("Chuyển trạng thái Màu sắc thành công");
      fetchColor(searchTerm, statusFilter); // Reload lại dữ liệu sau khi cập nhật
    } catch (error) {
      message.error("Lỗi khi chuyển trạng thái Màu sắc");
    }
  };

  const handleFilter = () => {
    fetchColor(searchTerm, statusFilter); // Gọi hàm lọc khi người dùng nhấn nút Lọc
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
      align: "center",
    },
    {
      title: "Tên Màu Sắc",
      dataIndex: "tenMauSac",
      key: "tenMauSac",
      align: "center",
      sorter: (a, b) => a.tenMauSac.localeCompare(b.tenMauSac),
      defaultSortOrder: "ascend",
    },
    {
      title: "Mô tả",
      dataIndex: "moTa",
      key: "moTa",
      align: "center",
    },

    {
      title: "Trạng Thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text, record) => (
        <Switch
          checked={text === 1}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          className="button-s"
          type="primary"
          icon={<EditOutlined />}
          onClick={() => openModal(record)}
          style={{
            backgroundColor: "#ffffff",
            color: "#000000",
            marginRight: 10,
          }}
        >
          Sửa
        </Button>
      ),
      align: "center",
    },
  ];

  return (
    <div className="color-management">
      <h2>Quản lý Màu Sắc</h2>
      <div className="color-management-container">
        <div className="sidebar">
          <h2>Bộ lọc</h2>
          <Input
            placeholder="Tìm kiếm tên màu sắc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: "100%", marginTop: 10 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Ngừng hoạt động</Option>
          </Select>
          <Button
            className="button"
            type="primary"
            onClick={handleFilter}
            style={{ marginTop: 10 }}
          >
            Lọc
          </Button>
        </div>

        <div className="main-content">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ marginBottom: "20px" }}
            onClick={() => openModal()}
            className="button"
          >
            Thêm màu sắc mới
          </Button>

          <Table
            columns={columns}
            dataSource={colors}
            rowKey="id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: colors.length,
              onChange: (page) => setCurrentPage(page),
            }}
          />

          <Modal
            title={editingColor ? "Cập nhật Màu Sắc" : "Thêm mới Màu Sắc"}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleOk}>
              <Form.Item
                label="Tên Màu Sắc"
                name="tenMauSac"
                rules={[
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!value || value.trim() === "") {
                        return Promise.reject("Vui lòng nhập tên Màu Sắc");
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder="Nhập tên màu sắc" />
              </Form.Item>
              <Form.Item label="Mô tả" name="moTa">
                <Input.TextArea placeholder="Nhập mô tả cho màu sắc" rows={4} />
              </Form.Item>
              <Form.Item label="Trạng thái" name="trangThai" initialValue={1}>
                <Radio.Group style={{ display: "flex", flexDirection: "row" }}>
                  <Radio value={1}>Hoạt động</Radio>
                  <Radio value={0}>Không hoạt động</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <div style={{ display: "flex", gap: "16px" }}>
                  <Button
                    onClick={() => setModalVisible(false)}
                    style={{ flex: 1, height: "40px" }}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ flex: 1, height: "40px" }}
                  >
                    Lưu
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ColorManagement;
