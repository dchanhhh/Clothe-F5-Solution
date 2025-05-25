import React, { useState, useEffect } from 'react';
import { Button, Switch, Modal, Form, Input, message, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import AdminService from '../../../Service/AdminService';
import AuthService from '../../../Service/AuthService';

const { Option } = Select;

// Skeleton component for table row
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-8 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-16 w-16 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-8 w-16 bg-gray-200 rounded mx-auto"></div>
    </td>
  </tr>
);

const KhachHangPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [khachHangs, setKhachHangs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredKhachHangs, setFilteredKhachHangs] = useState([]);

  const fetchKhachHangs = async () => {
    setLoading(true);
    try {
      const data = await AdminService.GetCustomer();
      setKhachHangs(data);
      message.success('Lấy danh sách khách hàng thành công!');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu khách hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKhachHangs();
  }, []);

  useEffect(() => {
    if (khachHangs.length > 0) {
      const filtered = khachHangs.filter((khachHang) => {
        const customerName = khachHang.hoVaTenKh ? khachHang.hoVaTenKh.toLowerCase() : "";
        const searchQuery = searchTerm.toLowerCase();

        const matchesSearch = customerName.includes(searchQuery);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && khachHang.trangThai === 1) ||
          (statusFilter === "inactive" && khachHang.trangThai === 0);

        return matchesSearch && matchesStatus;
      });
      setFilteredKhachHangs(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, khachHangs]);

  const openModal = async (record = null) => {
    try {
      if (record) {
        const data = await AdminService.getKhachHangById(record.id);
        setEditingUser(data);
        form.setFieldsValue({
          ...data,
          gioiTinh: data.gioiTinh ? 'Nam' : 'Nữ',
          ngaySinh: moment(data.ngaySinh).format('YYYY-MM-DD')
        });
      } else {
        setEditingUser(null);
        form.resetFields();
      }
      setModalVisible(true);
    } catch (error) {
      message.error('Lỗi khi lấy chi tiết khách hàng.');
    }
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      const userValues = {
        ...editingUser,
        ...values,
        hoVaTenKh: values.hoVaTenKh,
        gioiTinh: values.gioiTinh === 'Nam',
        ngaySinh: values.ngaySinh,
        taiKhoan: values.taiKhoan || 'string',
        matKhau: values.matKhau || 'string',
        soDienThoai: values.soDienThoai,
        email: values.email,
        trangThai: editingUser ? editingUser.trangThai : 1,
      };

      await AuthService.registerCustomer(userValues);
      
      if (editingUser) {
        // Update khachHangs state directly
        setKhachHangs((prevKhachHangs) =>
          prevKhachHangs.map((kh) =>
            kh.id === editingUser.id ? { ...kh, ...userValues } : kh
          )
        );
        message.success('Cập nhật khách hàng thành công!');
      } else {
        // Add new khachHang to state
        setKhachHangs((prevKhachHangs) => [...prevKhachHangs, userValues]);
        message.success('Thêm khách hàng mới thành công');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingUser(null);
    } catch (error) {
      message.error('Có lỗi xảy ra: ' + (error.message || 'Không thể thực hiện thao tác'));
    }
  };

  const handleStatusChange = async (khachHang, newStatus) => {
    try {
      const updatedKhachHang = {
        ...khachHang,
        trangThai: newStatus ? 1 : 0,
      };
      await AuthService.registerCustomer(updatedKhachHang);
      
      // Update khachHangs state directly
      setKhachHangs((prevKhachHangs) =>
        prevKhachHangs.map((kh) =>
          kh.id === khachHang.id ? { ...kh, trangThai: newStatus ? 1 : 0 } : kh
        )
      );
      message.success('Chuyển trạng thái thành công');
    } catch (error) {
      message.error('Lỗi khi chuyển trạng thái: ' + error.message);
    }
  };

  return (
    <div className="w-full">
      <span className="text-2xl font-bold text-center mb-6 uppercase">
        Quản lý khách hàng
      </span>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Search and Filter Section */}
        <div className="pt-4 pb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-[300px]">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm khách hàng
              </label>
              <input
                type="text"
                placeholder="Tìm theo tên khách hàng..."
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
                Thêm khách hàng mới
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và Tên
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giới Tính
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày Sinh
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số Điện Thoại
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hình Ảnh
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? Array(pageSize)
                    .fill(null)
                    .map((_, index) => <TableRowSkeleton key={index} />)
                : filteredKhachHangs
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((khachHang, index) => (
                      <tr key={khachHang.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {khachHang.hoVaTenKh}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {khachHang.gioiTinh ? 'Nam' : 'Nữ'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {moment(khachHang.ngaySinh).format('DD/MM/YYYY')}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {khachHang.soDienThoai}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {khachHang.email}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            <img
                              src={khachHang.image}
                              alt={khachHang.hoVaTenKh}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <Switch
                            checked={khachHang.trangThai === 1}
                            onChange={(checked) =>
                              handleStatusChange(khachHang, checked)
                            }
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          <div className="flex justify-center">
                            <div
                              onClick={() => openModal(khachHang)}
                              className="flex items-center gap-1 cursor-pointer text-blue-600 hover:text-blue-900 rounded-lg border-blue-600 border px-3 py-2"
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
                      {Math.min(currentPage * pageSize, filteredKhachHangs.length)}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium">{filteredKhachHangs.length}</span>{" "}
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
                {[...Array(Math.ceil(filteredKhachHangs.length / pageSize))].map(
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
                    currentPage < Math.ceil(filteredKhachHangs.length / pageSize) &&
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredKhachHangs.length / pageSize)
                      )
                    )
                  }
                  className={`relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage >= Math.ceil(filteredKhachHangs.length / pageSize) ||
                    loading
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

      {/* Customer Form Modal */}
      <Modal
        title={editingUser ? "Cập nhật Khách Hàng" : "Thêm mới Khách Hàng"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingUser(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            name="hoVaTenKh"
            label="Họ và Tên"
            rules={[
              { required: true, message: 'Nhập họ và tên' },
              {
                pattern: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÊÔêôơƯÁÉÍÓÚÝáéíóúýĂÂÊÔƯàáầấẩẫậèéềếểễệìíòóồốổỗộùúừứửữựỳýỷỹđịạọụờăưễảứ\s]+$/,
                message: 'Tên không được chứa số hoặc ký tự đặc biệt'
              }
            ]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            name="gioiTinh"
            label="Giới Tính"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <Select placeholder="Chọn giới tính">
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ngaySinh"
            label="Ngày Sinh"
            rules={[{ required: false, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <Input type="date" placeholder="Chọn ngày sinh" />
          </Form.Item>

          <Form.Item
            name="soDienThoai"
            label="Số Điện Thoại"
            rules={[
              { required: true, message: 'Nhập số điện thoại' },
              { pattern: /^[0-9]+$/, message: 'Số điện thoại không được chứa chữ hoặc ký tự đặc biệt' },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: false, message: 'Nhập email' },
              { type: 'email', message: 'Email không đúng định dạng' },
            ]}
          >
            <Input type="email" placeholder="Nhập email" />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setEditingUser(null);
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KhachHangPage;
