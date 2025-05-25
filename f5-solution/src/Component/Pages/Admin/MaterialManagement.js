import React, { useEffect, useState } from "react";
import { Button, Switch, Modal, Radio, Form, Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import MaterialService from "../../../Service/MaterialService";
import "./MaterialManagement.css";

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
      <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-8 w-16 bg-gray-200 rounded mx-auto"></div>
    </td>
  </tr>
);

const MaterialManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form] = Form.useForm();
  const pageSize = 10;
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  const fetchMaterial = async () => {
    setLoading(true);
    try {
      const data = await MaterialService.getAllMaterial();
      setMaterials(data);
      message.success("Lấy danh sách Chất Liệu thành công");
    } catch (error) {
      message.error("Lỗi khi lấy danh sách Chất Liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterial();
  }, []);

  useEffect(() => {
    if (materials.length > 0) {
      const filtered = materials.filter((material) => {
        const materialName = material.tenChatLieu
          ? material.tenChatLieu.toLowerCase()
          : "";
        const searchQuery = searchTerm.toLowerCase();

        const matchesSearch = materialName.includes(searchQuery);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && material.trangThai === 1) ||
          (statusFilter === "inactive" && material.trangThai === 0);

        return matchesSearch && matchesStatus;
      });
      setFilteredMaterials(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, materials]);

  const openModal = (record = null) => {
    setModalVisible(true);
    setEditingMaterial(record);
    if (record) {
      form.setFieldsValue({ ...record });
    } else {
      form.resetFields();
      form.setFieldsValue({ trangThai: 1 });
    }
  };

  const handleCreateOrUpdate = async (values) => {
    try {
      if (editingMaterial) {
        const updatedMaterial = {
          ...values,
          id: editingMaterial.id,
        };
        await MaterialService.updateMaterial(
          editingMaterial.id,
          updatedMaterial
        );

        // Update materials state directly
        setMaterials((prevMaterials) =>
          prevMaterials.map((material) =>
            material.id === editingMaterial.id
              ? { ...material, ...updatedMaterial }
              : material
          )
        );
        message.success("Cập nhật chất liệu thành công");
      } else {
        const response = await MaterialService.createMaterial(values);
        // Add new material to state
        setMaterials((prevMaterials) => [...prevMaterials, response]);
        message.success("Thêm mới chất liệu thành công");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingMaterial(null);
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật chất liệu:", error);
      message.error(
        "Có lỗi xảy ra: " + (error.message || "Không thể thực hiện thao tác")
      );
    }
  };

  const handleStatusChange = async (material, newStatus) => {
    try {
      const updatedMaterial = {
        ...material,
        trangThai: newStatus ? 1 : 0,
      };
      await MaterialService.updateMaterial(material.id, updatedMaterial);

      // Update materials state directly
      setMaterials((prevMaterials) =>
        prevMaterials.map((m) =>
          m.id === material.id ? { ...m, trangThai: newStatus ? 1 : 0 } : m
        )
      );
      message.success("Chuyển trạng thái thành công");
    } catch (error) {
      message.error("Lỗi khi chuyển trạng thái: " + error.message);
    }
  };

  return (
    <div className="w-full">
      <span className="text-2xl font-bold text-center mb-6 uppercase">
        Quản lý chất liệu
      </span>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Search and Filter Section */}
        <div className="pt-4 pb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-[300px]">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm chất liệu
              </label>
              <input
                type="text"
                placeholder="Tìm theo tên chất liệu..."
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
                Thêm chất liệu mới
              </div>
            </div>
          </div>
        </div>

        {/* Materials Table */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên chất liệu
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
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
                : filteredMaterials
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((material, index) => (
                      <tr key={material.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {material.tenChatLieu}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {material.moTa}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <Switch
                            checked={material.trangThai === 1}
                            onChange={(checked) =>
                              handleStatusChange(material, checked)
                            }
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          <div className="flex justify-center">
                            <div
                              onClick={() => openModal(material)}
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
                      {Math.min(
                        currentPage * pageSize,
                        filteredMaterials.length
                      )}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium">
                      {filteredMaterials.length}
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
                {[...Array(Math.ceil(filteredMaterials.length / pageSize))].map(
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
                      Math.ceil(filteredMaterials.length / pageSize) &&
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredMaterials.length / pageSize)
                      )
                    )
                  }
                  className={`relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage >=
                      Math.ceil(filteredMaterials.length / pageSize) || loading
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

      {/* Material Form Modal */}
      <Modal
        title={editingMaterial ? "Cập nhật Chất Liệu" : "Thêm mới Chất Liệu"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingMaterial(null);
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateOrUpdate}>
          <Form.Item
            label="Tên Chất Liệu"
            name="tenChatLieu"
            rules={[
              {
                required: true,
                validator: (_, value) => {
                  if (!value || value.trim() === "") {
                    return Promise.reject("Vui lòng nhập tên Chất Liệu");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="Nhập tên chất liệu" />
          </Form.Item>
          <Form.Item label="Mô tả" name="moTa">
            <Input.TextArea placeholder="Nhập mô tả cho chất liệu" rows={4} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="trangThai" initialValue={1}>
            <Radio.Group>
              <Radio value={1}>Hoạt động</Radio>
              <Radio value={0}>Không hoạt động</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setEditingMaterial(null);
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingMaterial ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MaterialManagement;
