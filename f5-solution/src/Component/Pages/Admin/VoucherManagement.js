import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  message,
  DatePicker,
  InputNumber,
  Select,
  Modal,
  Switch,
  Row,
  Col,
} from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [form] = Form.useForm();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Set number of vouchers per page

  // Fetch all vouchers
  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7030/api/VouCher");
      const updatedVouchers = response.data.map((voucher) => {
        const currentDate = moment(); // Get current date
        if (
          voucher.soLuongDung === voucher.soLuongMa ||
          currentDate.isAfter(moment(voucher.ngayKetThuc))
        ) {
          voucher.trangThai = 0; // Set status to inactive
          updateVoucherStatus(voucher); // Update status in the backend
        }
        return voucher;
      });
      setVouchers(updatedVouchers);
    } catch (error) {
      message.error("Failed to fetch vouchers.");
    }
    setLoading(false);
  };

  // Update voucher status in the backend
  const updateVoucherStatus = async (voucher) => {
    try {
      await axios.put(`https://localhost:7030/api/VouCher/${voucher.id}`, {
        ...voucher,
        trangThai: 0, // Set status to inactive
      });
    } catch (error) {
      message.error("Failed to update voucher status.");
    }
  };

  // Call fetchVouchers when component mounts
  useEffect(() => {
    fetchVouchers();
  }, []);

  // Open modal for create
  const showModal = () => {
    setIsModalVisible(true);
    setIsEditing(false); // Set form to create mode
    form.resetFields(); // Reset form fields
  };

  // Open modal for update
  const showUpdateModal = (voucher) => {
    setSelectedVoucher(voucher);
    setIsEditing(true); // Set form to update mode
    setIsModalVisible(true);

    // Pre-fill form with selected voucher data
    form.setFieldsValue({
      ...voucher,
      ngayBatDau: voucher.ngayBatDau ? moment(voucher.ngayBatDau) : null,
      ngayKetThuc: voucher.ngayKetThuc ? moment(voucher.ngayKetThuc) : null,
    });
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Clear form when modal closes
    setSelectedVoucher(null); // Clear selected voucher
  };

  // Submit new voucher
  const onSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        ngayBatDau: values.ngayBatDau
          ? values.ngayBatDau.format("YYYY-MM-DD")
          : null,
        ngayKetThuc: values.ngayKetThuc
          ? values.ngayKetThuc.format("YYYY-MM-DD")
          : null,
      };

      if (isEditing && selectedVoucher) {
        // Update existing voucher
        await axios.put(
          `https://localhost:7030/api/VouCher/${selectedVoucher.id}`,
          formattedValues
        );
        message.success("Voucher updated successfully!");
      } else {
        // Create new voucher
        await axios.post("https://localhost:7030/api/VouCher", formattedValues);
        message.success("Voucher created successfully!");
      }

      fetchVouchers(); // Refresh the voucher list
      handleCancel(); // Close the modal
    } catch (error) {
      message.error(
        isEditing ? "Failed to update voucher." : "Failed to create voucher."
      );
    }
  };

  // Handle the status change directly in the list
  const handleStatusChange = async (voucher, newStatus) => {
    try {
      const updatedVoucher = {
        ...voucher,
        trangThai: newStatus ? 1 : 0, // Update the status to 1 (active) or 0 (inactive)
      };
      await axios.put(
        `https://localhost:7030/api/VouCher/${voucher.id}`,
        updatedVoucher
      );
      message.success("Voucher status updated successfully!");
      fetchVouchers(); // Refresh the voucher list
    } catch (error) {
      message.error("Failed to update voucher status.");
    }
  };

  // Columns for Ant Design Table
  const columns = [
    {
      title: "STT", // Add a header for the sequence number
      dataIndex: "index", // New index field
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Generate sequential number based on page
      width: 70, // Set width for better alignment
    },
    {
      title: "Ma Voucher",
      dataIndex: "maVouCher",
      key: "maVouCher",
    },
    {
      title: "Ten Voucher",
      dataIndex: "tenVouCher",
      key: "tenVouCher",
    },
    {
      title: "Ngay Bat Dau",
      dataIndex: "ngayBatDau",
      key: "ngayBatDau",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Ngay Ket Thuc",
      dataIndex: "ngayKetThuc",
      key: "ngayKetThuc",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "So Luong Ma",
      dataIndex: "soLuongMa",
      key: "soLuongMa",
    },
    {
      title: "So Luong Da Dung",
      dataIndex: "soLuongDung",
      key: "soLuongDung",
    },
    {
      title: "Gia Tri Giam",
      dataIndex: "giaTriGiam",
      key: "giaTriGiam",
    },
    {
      title: "Dieu Kien Toi Thieu Hoa Don",
      dataIndex: "dieuKienToiThieuHoaDon",
      key: "dieuKienToiThieuHoaDon",
    },
    {
      title: "Hinh Thuc Giam",
      dataIndex: "hinhThucGiam",
      key: "hinhThucGiam",
    },
    {
      title: "Loai Voucher",
      dataIndex: "loaiVouCher",
      key: "loaiVouCher",
    },
    {
      title: "Ghi Chu",
      dataIndex: "ghiChu",
      key: "ghiChu",
    },
    {
      title: "Trang Thai",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (text, record) => (
        <Switch
          checked={text === 1} // Check if the status is active (1)
          onChange={(checked) => handleStatusChange(record, checked)} // Handle status toggle
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showUpdateModal(record)}>
            Sửa
          </Button>
        </>
      ),
    },
  ];

  // Handle page change
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div>
      <h1>Tạo Voucher giảm giá</h1>

      <Button type="primary" onClick={showModal}>
        Create Voucher
      </Button>

      {/* Modal for creating/updating voucher */}
      <Modal
        title={isEditing ? "Sửa Voucher" : "Tạo Voucher"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Remove default footer buttons
      >
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maVouCher"
                label="Ma Voucher"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tenVouCher"
                label="Ten Voucher"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ngayBatDau" label="Ngay Bat Dau">
                <DatePicker />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ngayKetThuc" label="Ngay Ket Thuc">
                <DatePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="soLuongMa"
                label="So Luong Ma"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập So Luong Ma!",
                  },
                  {
                    validator: (_, value) =>
                      value < 0
                        ? Promise.reject("So Luong Ma không được âm!")
                        : Promise.resolve(),
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="giaTriGiam"
                label="Gia Tri Giam"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Gia Tri Giam!",
                  },
                  {
                    validator: (_, value) =>
                      value < 0
                        ? Promise.reject("Gia Tri Giam không được âm!")
                        : Promise.resolve(),
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dieuKienToiThieuHoaDon"
                label="Dieu Kien Toi Thieu Hoa Don"
                rules={[
                  {
                    required: true,
                    message: "Dieu Kien Toi Thieu Hoa Don!",
                  },
                  {
                    validator: (_, value) =>
                      value < 0
                        ? Promise.reject(
                            "Dieu Kien Toi Thieu Hoa Don không được âm!"
                          )
                        : Promise.resolve(),
                  },
                ]}
              >
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="hinhThucGiam" label="Hinh Thuc Giam">
                <Select>
                  <Option value={1}>Giảm Giá Theo Phần Trăm</Option>
                  <Option value={2}>Giảm Giá Theo Số Tiền</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="loaiVouCher" label="Loai Voucher">
                <Select>
                  <Option value={1}>Giảm Giá</Option>
                  <Option value={2}>Miễn Phí Vận Chuyển</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="ghiChu" label="Ghi Chu">
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Sửa Voucher" : "Tạo Voucher"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Table to display vouchers */}
      <Table
        columns={columns}
        dataSource={vouchers}
        loading={loading}
        rowKey="id" // Assuming 'id' is the unique identifier for each voucher
        pagination={{
          current: currentPage,
          pageSize,
          total: vouchers.length,
          onChange: handleTableChange,
        }}
      />
    </div>
  );
};

export default VoucherManagement;
