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
  Radio,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

// Skeleton component for table row
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-8 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-8 w-16 bg-gray-200 rounded mx-auto"></div>
    </td>
  </tr>
);

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 10;
  const [filteredVouchers, setFilteredVouchers] = useState([]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7030/api/VouCher");
      const updatedVouchers = response.data.map((voucher) => {
        const currentDate = moment();
        if (
          voucher.soLuongDung === voucher.soLuongMa ||
          currentDate.isAfter(moment(voucher.ngayKetThuc))
        ) {
          voucher.trangThai = 0;
          updateVoucherStatus(voucher);
        }
        return voucher;
      });
      setVouchers(updatedVouchers);
      message.success("Lấy danh sách voucher thành công!");
    } catch (error) {
      message.error("Lỗi khi lấy danh sách voucher");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  useEffect(() => {
    if (vouchers.length > 0) {
      const filtered = vouchers.filter((voucher) => {
        const voucherName = voucher.tenVouCher
          ? voucher.tenVouCher.toLowerCase()
          : "";
        const voucherCode = voucher.maVouCher
          ? voucher.maVouCher.toLowerCase()
          : "";
        const searchQuery = searchTerm.toLowerCase();

        const matchesSearch =
          voucherName.includes(searchQuery) ||
          voucherCode.includes(searchQuery);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && voucher.trangThai === 1) ||
          (statusFilter === "inactive" && voucher.trangThai === 0);

        return matchesSearch && matchesStatus;
      });
      setFilteredVouchers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, vouchers]);

  const updateVoucherStatus = async (voucher) => {
    try {
      await axios.put(`https://localhost:7030/api/VouCher/${voucher.id}`, {
        ...voucher,
        trangThai: 0,
      });
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái voucher");
    }
  };

  const openModal = (record = null) => {
    setModalVisible(true);
    setEditingVoucher(record);
    if (record) {
      form.setFieldsValue({
        ...record,
        ngayBatDau: record.ngayBatDau ? moment(record.ngayBatDau) : null,
        ngayKetThuc: record.ngayKetThuc ? moment(record.ngayKetThuc) : null,
      });
    } else {
      form.resetFields();
    }
  };

  const handleCreateOrUpdate = async (values) => {
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

      if (editingVoucher) {
        await axios.put(
          `https://localhost:7030/api/VouCher/${editingVoucher.id}`,
          formattedValues
        );

        // Update vouchers state directly
        setVouchers((prevVouchers) =>
          prevVouchers.map((v) =>
            v.id === editingVoucher.id ? { ...v, ...formattedValues } : v
          )
        );
        message.success("Cập nhật voucher thành công!");
      } else {
        // Check for duplicate voucher code
        const isDuplicate = vouchers.some(
          (voucher) => voucher.maVouCher === values.maVouCher
        );

        if (isDuplicate) {
          message.error("Mã voucher đã tồn tại! Vui lòng nhập mã khác.");
          return;
        }

        const response = await axios.post(
          "https://localhost:7030/api/VouCher",
          formattedValues
        );
        // Add new voucher to state
        setVouchers((prevVouchers) => [...prevVouchers, response.data]);
        message.success("Thêm mới voucher thành công!");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingVoucher(null);
    } catch (error) {
      message.error(
        "Có lỗi xảy ra: " + (error.message || "Không thể thực hiện thao tác")
      );
    }
  };

  // Add form validation rules for voucher code
  const validateVoucherCode = async (_, value) => {
    if (!value) {
      return Promise.reject("Vui lòng nhập mã voucher!");
    }

    if (!editingVoucher && vouchers.some((v) => v.maVouCher === value)) {
      return Promise.reject("Mã voucher đã tồn tại! Vui lòng nhập mã khác.");
    }

    return Promise.resolve();
  };

  const handleStatusChange = async (voucher, newStatus) => {
    try {
      const updatedVoucher = {
        ...voucher,
        trangThai: newStatus ? 1 : 0,
      };
      await axios.put(
        `https://localhost:7030/api/VouCher/${voucher.id}`,
        updatedVoucher
      );

      // Update vouchers state directly
      setVouchers((prevVouchers) =>
        prevVouchers.map((v) =>
          v.id === voucher.id ? { ...v, trangThai: newStatus ? 1 : 0 } : v
        )
      );
      message.success("Chuyển trạng thái thành công");
    } catch (error) {
      message.error("Lỗi khi chuyển trạng thái: " + error.message);
    }
  };

  // Columns for Ant Design Table
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Mã",
      dataIndex: "maVouCher",
      key: "maVouCher",
      width: 100,
      align: "center",
    },
    {
      title: "Tên",
      dataIndex: "tenVouCher",
      key: "tenVouCher",
      width: 120,
      align: "center",
    },
    {
      title: "Bắt đầu",
      dataIndex: "ngayBatDau",
      key: "ngayBatDau",
      width: 100,
      align: "center",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Kết thúc",
      dataIndex: "ngayKetThuc",
      key: "ngayKetThuc",
      width: 100,
      align: "center",
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "SL Mã",
      dataIndex: "soLuongMa",
      key: "soLuongMa",
      width: 80,
      align: "center",
    },
    {
      title: "Đã dùng",
      dataIndex: "soLuongDung",
      key: "soLuongDung",
      width: 80,
      align: "center",
    },
    {
      title: "Giá trị",
      dataIndex: "giaTriGiam",
      key: "giaTriGiam",
      width: 100,
      align: "center",
      render: (value, record) => {
        return record.hinhThucGiam === 1
          ? `${value}%`
          : new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value);
      },
    },
    {
      title: "Điều kiện",
      dataIndex: "dieuKienToiThieuHoaDon",
      key: "dieuKienToiThieuHoaDon",
      width: 100,
      align: "center",
      render: (value) => {
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value);
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      width: 100,
      align: "center",
      render: (text, record) => (
        <Switch
          checked={text === 1}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center">
          <div
            onClick={() => openModal(record)}
            className="flex items-center gap-1 cursor-pointer text-blue-600 hover:text-blue-900 rounded-lg border-blue-600 border px-2 py-1"
          >
            <EditOutlined />
            Sửa
          </div>
        </div>
      ),
    },
  ];

  // Handle page change
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div className="w-full">
      <span className="text-2xl font-bold text-center mb-6 uppercase">
        Quản lý voucher
      </span>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Search and Filter Section */}
        <div className="pt-4 pb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-[300px]">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm voucher
              </label>
              <input
                type="text"
                placeholder="Tìm theo mã hoặc tên voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
            </div>

            <div className="max-w-full">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                disabled={loading}
              >
                <option value="all">Tất cả</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngừng hoạt động</option>
              </select>
            </div>

            <div className="flex items-end">
              <div
                onClick={() => openModal()}
                className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                disabled={loading}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Thêm voucher mới
              </div>
            </div>
          </div>
        </div>

        {/* Vouchers Table */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bắt đầu
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kết thúc
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SL Mã
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đã dùng
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điều kiện
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? Array(pageSize)
                    .fill(null)
                    .map((_, index) => <TableRowSkeleton key={index} />)
                : filteredVouchers
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((voucher, index) => (
                      <tr key={voucher.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {voucher.maVouCher}
                        </td>
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {voucher.tenVouCher}
                        </td>
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {moment(voucher.ngayBatDau).format("DD/MM/YYYY")}
                        </td>
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {moment(voucher.ngayKetThuc).format("DD/MM/YYYY")}
                        </td>
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {voucher.soLuongMa}
                        </td>
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {voucher.soLuongDung || 0}
                        </td>
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {voucher.hinhThucGiam === 1
                            ? `${voucher.giaTriGiam}%`
                            : new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(voucher.giaTriGiam)}
                        </td>
                        <td className="px-3 py-2 whitespace-normal text-sm text-gray-900 text-center">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(voucher.dieuKienToiThieuHoaDon)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Switch
                            checked={voucher.trangThai === 1}
                            onChange={(checked) =>
                              handleStatusChange(voucher, checked)
                            }
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex justify-center">
                            <div
                              onClick={() => openModal(voucher)}
                              className="flex items-center gap-1 cursor-pointer text-blue-600 hover:text-blue-900 rounded-lg border-blue-600 border px-2 py-1"
                            >
                              <EditOutlined />
                              Sửa
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <>
                    Hiển thị{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * pageSize + 1}
                    </span>{" "}
                    -{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * pageSize,
                        filteredVouchers.length
                      )}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium">
                      {filteredVouchers.length}
                    </span>{" "}
                    kết quả
                  </>
                )}
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <div
                  onClick={() =>
                    !loading &&
                    currentPage > 1 &&
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={`relative cursor-pointer inline-flex items-center rounded-l-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === 1 || loading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none opacity-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Page Numbers */}
                {[...Array(Math.ceil(filteredVouchers.length / pageSize))].map(
                  (_, index) => (
                    <div
                      key={index + 1}
                      onClick={() => !loading && setCurrentPage(index + 1)}
                      className={`relative cursor-pointer inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        loading
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none opacity-50"
                          : currentPage === index + 1
                          ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }`}
                    >
                      {index + 1}
                    </div>
                  )
                )}

                <div
                  onClick={() =>
                    !loading &&
                    currentPage <
                      Math.ceil(filteredVouchers.length / pageSize) &&
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredVouchers.length / pageSize)
                      )
                    )
                  }
                  className={`relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage >=
                      Math.ceil(filteredVouchers.length / pageSize) || loading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none opacity-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Voucher Form Modal */}
      <Modal
        title={editingVoucher ? "Cập nhật Voucher" : "Thêm mới Voucher"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingVoucher(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <div className="grid grid-cols-2 gap-4">
            {/* Mã Voucher */}
            <Form.Item
              name="maVouCher"
              label="Mã Voucher"
              rules={[
                { required: true, message: "Vui lòng nhập mã voucher!" },
                { validator: validateVoucherCode },
              ]}
              validateTrigger="onBlur"
            >
              <Input
                placeholder="Nhập mã voucher"
                disabled={!!editingVoucher}
              />
            </Form.Item>

            {/* Tên Voucher */}
            <Form.Item
              name="tenVouCher"
              label="Tên Voucher"
              rules={[
                { required: true, message: "Vui lòng nhập tên voucher!" },
              ]}
            >
              <Input placeholder="Nhập tên voucher" />
            </Form.Item>

            {/* Ngày Bắt Đầu */}
            <Form.Item
              name="ngayBatDau"
              label="Ngày Bắt Đầu"
              rules={[
                { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
              ]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>

            {/* Ngày Kết Thúc */}
            <Form.Item
              name="ngayKetThuc"
              label="Ngày Kết Thúc"
              rules={[
                { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>

            {/* Số Lượng Mã */}
            <Form.Item
              name="soLuongMa"
              label="Số Lượng Mã"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng mã!" },
                {
                  validator: (_, value) =>
                    value < 0
                      ? Promise.reject("Số lượng mã không được âm!")
                      : Promise.resolve(),
                },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Nhập số lượng mã"
              />
            </Form.Item>

            {/* Số Lượng Đã Dùng - Chỉ hiển thị khi sửa */}
            {editingVoucher && (
              <Form.Item
                name="soLuongDung"
                label="Số Lượng Đã Dùng"
                initialValue={0}
              >
                <InputNumber className="w-full" disabled />
              </Form.Item>
            )}

            {/* Hình Thức Giảm */}
            <Form.Item
              name="hinhThucGiam"
              label="Hình Thức Giảm"
              rules={[
                { required: true, message: "Vui lòng chọn hình thức giảm!" },
              ]}
            >
              <Select>
                <Option value={1}>Giảm Giá Theo Phần Trăm</Option>
                <Option value={2}>Giảm Giá Theo Số Tiền</Option>
              </Select>
            </Form.Item>

            {/* Giá Trị Giảm */}
            <Form.Item
              name="giaTriGiam"
              label="Giá Trị Giảm"
              rules={[
                { required: true, message: "Vui lòng nhập giá trị giảm!" },
                {
                  validator: (_, value) =>
                    value < 0
                      ? Promise.reject("Giá trị giảm không được âm!")
                      : Promise.resolve(),
                },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Nhập giá trị giảm"
              />
            </Form.Item>

            {/* Điều Kiện Tối Thiểu */}
            <Form.Item
              name="dieuKienToiThieuHoaDon"
              label="Điều Kiện Tối Thiểu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập điều kiện tối thiểu!",
                },
                {
                  validator: (_, value) =>
                    value < 0
                      ? Promise.reject("Điều kiện tối thiểu không được âm!")
                      : Promise.resolve(),
                },
              ]}
            >
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Nhập điều kiện tối thiểu"
              />
            </Form.Item>

            {/* Loại Voucher */}
            <Form.Item
              name="loaiVouCher"
              label="Loại Voucher"
              rules={[
                { required: true, message: "Vui lòng chọn loại voucher!" },
              ]}
            >
              <Select>
                <Option value={1}>Giảm Giá</Option>
                <Option value={2}>Miễn Phí Vận Chuyển</Option>
              </Select>
            </Form.Item>

            {/* Trạng Thái */}
            <Form.Item name="trangThai" label="Trạng thái" initialValue={1}>
              <Radio.Group>
                <Radio value={1}>Hoạt động</Radio>
                <Radio value={0}>Không hoạt động</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <Form.Item>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setEditingVoucher(null);
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingVoucher ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManagement;
