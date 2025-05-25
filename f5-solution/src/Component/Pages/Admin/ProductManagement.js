import { useEffect, useState } from "react";
import {
  Button,
  Switch,
  Form,
  message,
  Select,
  Input,
  Drawer,
  Radio,
  Divider,
  Modal,
} from "antd";
import {
  EditOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./ProductManagement.css";
import ProductService from "../../../Service/ProductService";
import BrandService from "../../../Service/BrandService";
import OriginalService from "../../../Service/OriginalService";
import MaterialService from "../../../Service/MaterialService";
import CategoryService from "../../../Service/CategoryService";
import DiscountService from "../../../Service/DiscountService";
import ColorService from "../../../Service/ColorService";
import SizeService from "../../../Service/SizeService";
import { FiEdit } from "react-icons/fi";
import { Option } from "antd/es/mentions";

// Skeleton component for table row
const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-8 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-16 w-16 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-16 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
    </td>
    <td className="px-4 py-3 whitespace-nowrap text-center">
      <div className="h-8 w-16 bg-gray-200 rounded mx-auto"></div>
    </td>
  </tr>
);

const ProductManagement = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const pageSize = 10;
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [originals, setOriginals] = useState([]);
  const [brands, setBrands] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [productDetails, setProductDetails] = useState([]);
  const [productDetailEdit, setEditingProductDetail] = useState([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [error, setError] = useState("");
  const [currentProductId, setCurrentProductId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        productData,
        discountData,
        brandData,
        originalData,
        materialData,
        categoryData,
        colorData,
        sizeData,
      ] = await Promise.all([
        ProductService.getAllProduct(),
        DiscountService.getAllDiscount(),
        BrandService.getAllBrand(),
        OriginalService.getAllOriginal(),
        MaterialService.getAllMaterial(),
        CategoryService.getAllCategory(),
        ColorService.getAllColor(),
        SizeService.getAllSize(),
      ]);
      setProducts(productData);
      setDiscounts(discountData);
      setBrands(brandData);
      setOriginals(originalData);
      setMaterials(materialData);
      setCategories(categoryData);
      setColors(colorData);
      setSizes(sizeData);
    } catch (error) {
      showToast("Lỗi khi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add this new function to remove diacritics
  const removeDiacritics = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  useEffect(() => {
    if (products.length > 0) {
      const filtered = products.filter((product) => {
        const productName = product.tenSp ? product.tenSp.toLowerCase() : "";
        const productCode = product.maSp ? product.maSp.toLowerCase() : "";
        const searchQuery = searchTerm.toLowerCase();

        // Check both product name and product code
        const matchesSearch =
          removeDiacritics(productName).includes(
            removeDiacritics(searchQuery)
          ) ||
          removeDiacritics(productCode).includes(removeDiacritics(searchQuery));

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && product.trangThai === 1) ||
          (statusFilter === "inactive" && product.trangThai === 0);

        return matchesSearch && matchesStatus;
      });
      setFilteredProducts(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, products]);

  const showToast = (message, type = "success") => {
    // You can implement a custom toast notification here
    alert(message);
  };

  const fetchProduct = async (search = "", status = "all") => {
    setLoading(true);
    try {
      const data = await ProductService.getAllProduct();
      const filteredData = data.filter((product) => {
        const matchesSearch = product.tenSp
          ? product.tenSp.toLowerCase().includes(search.toLowerCase())
          : false;
        const matchesStatus =
          status === "all" ||
          (status === "active" && product.trangThai === 1) ||
          (status === "inactive" && product.trangThai === 0);
        return matchesSearch && matchesStatus;
      });
      setProducts(filteredData);
      message.success("Lấy danh sách sản phẩm thành công");
    } catch (error) {
      message.error("Lỗi khi lấy danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const openDrawer = async (record = null) => {
    setDrawerVisible(true);
    form.resetFields(); // Reset form before setting new values
    setImageUrl(""); // Reset image
    setEditingProduct(null);

    if (record && record.id) {
      try {
        const productDetails = await ProductService.ViewProductDetail(
          record.id
        );
        if (productDetails) {
          setEditingProduct(record);
          setCurrentProductId(record.id);

          // Set form values with existing data
          form.setFieldsValue({
            maSp: productDetails.maSp,
            tenSp: productDetails.tenSp,
            giaBan: productDetails.giaBan,
            giaNhap: productDetails.giaNhap,
            giaGiam: productDetails.giaGiam,
            ngayThem: productDetails.ngayThem
              ? moment(productDetails.ngayThem)
              : null,
            idDm: productDetails.danhMuc?.id,
            idCl: productDetails.chatLieu?.id,
            moTa: productDetails.moTa,
            trangThai: productDetails.trangThai || 0,
          });

          // Set image if exists
          if (productDetails.imageDefaul) {
            setImageUrl(productDetails.imageDefaul);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        message.error("Lỗi khi tải chi tiết sản phẩm");
      }
    }
  };

  const handleOpenDetailsModal = async (value = null) => {
    try {
      setDetailsModalVisible(true);
      setEditingProductDetail(null);
      setLoading(true);
      setError("");

      if (currentProductId == null) {
        throw new Error("Product ID không hợp lệ");
      }

      const details = await ProductService.getSanPhamChiTietByIdSanPham(
        currentProductId
      );

      // Verify the response
      if (!details || !Array.isArray(details)) {
        throw new Error("Dữ liệu API không hợp lệ");
      }

      const formattedDetails = details.map((item) => ({
        Id: item.id,
        color: item.idMs,
        size: item.idSize,
        quantity: item.soLuongTon,
      }));

      setProductDetails(formattedDetails);
    } catch (e) {
      setError(e.message || "Có lỗi xảy ra khi tải thông tin sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (detailsModalVisible) {
      handleOpenDetailsModal();
    }
  }, [detailsModalVisible]);

  useEffect(() => {
    if (productDetails.length) {
      form.setFieldsValue({
        fields: productDetails.map((item) => ({
          Id: item.Id, // Ensure it's 'Id' not 'id' if that's how your backend returns the field
          name: item.color,
          IdSp: currentProductId,
          type: item.size,
          options: item.quantity,
        })),
      });
    }
  }, [productDetails, form]);

  const handleSaveProductDetail = async (fieldData) => {
    if (!fieldData) {
      message.error("Dữ liệu chi tiết sản phẩm không xác định.");
      return;
    }

    try {
      if (fieldData.Id) {
        // Ensure the check is on fieldData not productDetails
        await ProductService.createProductDetail({
          id: fieldData.Id,
          idMs: fieldData.name,
          idSize: fieldData.type,
          soLuongTon: fieldData.options,
          ...fieldData,
        });
        message.success("Sản phẩm chi tiết đã được cập nhật thành công");
      } else {
        await ProductService.createProductDetail({
          id: fieldData.Id,
          idMs: fieldData.name,
          IdSp: currentProductId,
          idSize: fieldData.type,
          soLuongTon: fieldData.options,
          ...fieldData,
        });
        message.success("Sản phẩm chi tiết mới đã được tạo thành công");
      }
      form.resetFields();
      console.log("Kết quả:", fieldData);
      handleOpenDetailsModal(); // Refresh details
    } catch (error) {
      console.error("Lỗi khi thêm hoặc cập nhật chi tiết sản phẩm:", error);
      message.error(`Thêm hoặc cập nhật chi tiết sản phẩm thất bại: ${error}`);
    }
  };
  const handleCreateOrUpdate = async (values) => {
    try {
      const formData = {
        ...values,
        imageDefaul: imageUrl,
        id: editingProduct?.id, // Include ID if editing
      };

      if (editingProduct) {
        await ProductService.createProduct(formData);
        message.success("Sản phẩm đã được cập nhật thành công");
      } else {
        await ProductService.createProduct(formData);
        message.success("Sản phẩm đã được tạo thành công");
      }

      setDrawerVisible(false);
      form.resetFields();
      setImageUrl("");
      setEditingProduct(null);
      fetchData(); // Refresh the product list
    } catch (error) {
      console.error("Lỗi khi tạo/cập nhật sản phẩm:", error);
      message.error(
        "Có lỗi xảy ra: " + (error.message || "Không thể thực hiện thao tác")
      );
    }
  };

  const handleStatusChange = async (product, newStatus) => {
    try {
      const updatedProduct = {
        ...product,
        idDm: product.danhMuc?.id || null,
        idCl: product.chatLieu?.id || null,
        trangThai: newStatus ? 1 : 0,
      };

      await ProductService.createProduct(updatedProduct);
      showToast("Chuyển trạng thái thành công");
      fetchData();
    } catch (error) {
      showToast("Lỗi khi chuyển trạng thái: " + error.message, "error");
    }
  };

  const handleFilter = () => {
    fetchProduct(searchTerm, statusFilter);
  };
  const handleCancel = () => {
    setDetailsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    setDetailsModalVisible(false);
  };
  const handleUploadChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setFieldsValue({ imageDefaul: reader.result });
        setImageUrl(reader.result);
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      form.setFieldsValue({ imageDefaul: "" });
      setImageUrl("");
    }
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalVisible(false);
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
      title: "Mã Sản Phẩm",
      dataIndex: "maSp",
      key: "maSp",
      align: "center",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "imageDefaul",
      key: "imageDefaul",
      render: (text) => (
        <img src={text} alt="Product" style={{ width: 80, height: 80 }} />
      ),
      align: "center",
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "tenSp",
      key: "tenSp",
      align: "center",
    },
    {
      title: "Số lượng tồn",
      dataIndex: "soLuongTon",
      key: "soLuongTon",
      align: "center",
      render: (text, record) => {
        const totalQuantity = record.sanPhamChiTiets?.reduce(
          (sum, item) => sum + item.soLuongTon,
          0
        );
        return totalQuantity ? totalQuantity : 0;
      },
    },
    {
      title: "Giá Bán",
      dataIndex: "giaBan",
      key: "giaBan",
      render: (value) => value ?? "N/A",
      align: "center",
    },
    {
      title: "Ngày Thêm",
      dataIndex: "ngayThem",
      key: "ngayThem",
      render: (text) => (text ? moment(text).format("DD/MM/YYYY") : ""),
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
          onClick={() => openDrawer(record)}
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
    <div className="w-full">
      <span className="text-2xl font-bold text-center mb-6 uppercase">
        Quản lý sản phẩm
      </span>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Search and Filter Section */}
        <div className="pt-4 pb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-[300px]">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm sản phẩm
              </label>
              <input
                type="text"
                placeholder="Tìm theo mã hoặc tên sản phẩm..."
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
                onClick={() => setDrawerVisible(true)}
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
                Thêm sản phẩm mới
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "60px" }}
                >
                  STT
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "100px" }}
                >
                  Mã sản phẩm
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "120px" }}
                >
                  Hình Ảnh
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "200px" }}
                >
                  Tên sản phẩm
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "100px" }}
                >
                  SL Tồn
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "120px" }}
                >
                  Giá Bán
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "120px" }}
                >
                  Ngày Thêm
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "100px" }}
                >
                  Trạng Thái
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: "100px" }}
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? // Show skeleton loading rows
                  Array(pageSize)
                    .fill(null)
                    .map((_, index) => <TableRowSkeleton key={index} />)
                : // Show actual data rows
                  filteredProducts
                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                    .map((product, index) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {product.maSp}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            <img
                              src={product.imageDefaul}
                              alt={product.tenSp}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {product.tenSp}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {product.sanPhamChiTiets?.reduce(
                            (sum, item) => sum + item.soLuongTon,
                            0
                          ) || 0}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {product.giaBan
                            ? new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(product.giaBan)
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          {product.ngayThem
                            ? moment(product.ngayThem).format("DD/MM/YYYY")
                            : ""}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            <Switch
                              checked={product.trangThai === 1}
                              onChange={(checked) =>
                                handleStatusChange(product, checked)
                              }
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-center">
                          <div className="flex justify-center">
                            <div
                              onClick={() => openDrawer(product)}
                              className="flex items-center gap-1 cursor-pointer text-blue-600 hover:text-blue-900 rounded-lg border-blue-600 border px-3 py-2"
                            >
                              <FiEdit />
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
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || loading}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredProducts.length / pageSize)
                  )
                )
              }
              disabled={
                currentPage >= Math.ceil(filteredProducts.length / pageSize) ||
                loading
              }
              className="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
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
                        filteredProducts.length
                      )}
                    </span>{" "}
                    trong{" "}
                    <span className="font-medium">
                      {filteredProducts.length}
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
                {/* Pagination Navigation */}
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
                {[...Array(Math.ceil(filteredProducts.length / pageSize))].map(
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

                {/* Next Button */}
                <div
                  onClick={() =>
                    !loading &&
                    currentPage <
                      Math.ceil(filteredProducts.length / pageSize) &&
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(filteredProducts.length / pageSize)
                      )
                    )
                  }
                  className={`relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage >=
                      Math.ceil(filteredProducts.length / pageSize) || loading
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

      {/* Product Form Modal */}
      {drawerVisible && (
        <Drawer
          visible={drawerVisible}
          onClose={() => {
            setDrawerVisible(false);
            form.resetFields();
            setImageUrl("");
            setEditingProduct(null);
          }}
          width={720}
          title={editingProduct ? "Cập nhật Sản Phẩm" : "Thêm mới Sản Phẩm"}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateOrUpdate}
            initialValues={{
              trangThai: 1, // Default value for new products
            }}
          >
            {/* Image Upload */}
            <Form.Item label="Hình Ảnh">
              <div className="mt-1 flex justify-center px-4 py-3 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="mx-auto h-24 w-24 object-cover rounded-md"
                    />
                  ) : (
                    <div className="mx-auto h-24 w-24 flex items-center justify-center border-2 border-gray-300 border-dashed rounded-md">
                      <span className="text-gray-500 text-sm">Chọn ảnh</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white font-medium text-blue-600 hover:text-blue-500">
                      <span>Tải ảnh lên</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImageUrl(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </div>
                </div>
              </div>
            </Form.Item>

            {/* Product Code - Read only when editing */}
            {editingProduct && (
              <Form.Item name="maSp" label="Mã Sản Phẩm">
                <Input readOnly className="bg-gray-50" />
              </Form.Item>
            )}

            {/* Product Name */}
            <Form.Item
              name="tenSp"
              label="Tên Sản Phẩm"
              rules={[
                { required: true, message: "Vui lòng nhập tên sản phẩm" },
              ]}
            >
              <Input />
            </Form.Item>

            {/* Price */}
            <Form.Item
              name="giaBan"
              label="Giá Bán"
              rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>

            {/* Import Price */}
            <Form.Item
              name="giaNhap"
              label="Giá Nhập"
              rules={[{ required: true, message: "Vui lòng nhập giá nhập" }]}
            >
              <Input type="number" min={0} />
            </Form.Item>

            {/* Discount Price */}
            <Form.Item name="giaGiam" label="Đơn Giá Khi Giảm">
              <Input type="number" min={0} />
            </Form.Item>

            {/* Category */}
            <Form.Item
              name="idDm"
              label="Danh Mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select>
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.tenDanhMuc}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Material */}
            <Form.Item
              name="idCl"
              label="Chất Liệu"
              rules={[{ required: true, message: "Vui lòng chọn chất liệu" }]}
            >
              <Select>
                {materials.map((material) => (
                  <Select.Option key={material.id} value={material.id}>
                    {material.tenChatLieu}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Description */}
            <Form.Item name="moTa" label="Mô tả">
              <Input.TextArea rows={4} />
            </Form.Item>

            {/* Status */}
            <Form.Item name="trangThai" label="Trạng thái">
              <Radio.Group>
                <Radio value={1}>Hoạt động</Radio>
                <Radio value={0}>Không hoạt động</Radio>
              </Radio.Group>
            </Form.Item>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                onClick={() => {
                  setDrawerVisible(false);
                  form.resetFields();
                  setImageUrl("");
                  setEditingProduct(null);
                }}
              >
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Cập nhật" : "Thêm mới"}
              </Button>
            </div>
            <Button
              type="primary"
              onClick={handleOpenDetailsModal}
              style={{ margin: "20px 0" }}
            >
              Chi tiết Sản Phẩm
            </Button>
          </Form>
        </Drawer>
      )}

      {/* Product Details Modal */}
      <Modal
        title="Chi Tiết Sản Phẩm"
        visible={detailsModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        width={800}
      >
        <Form form={form}>
          <Form.List name="fields">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field, index) => (
                  <div key={field.key}>
                    <Divider>Chi tiết sản phẩm {index + 1}</Divider>
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      label="Màu Sắc"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn màu sắc!",
                        },
                      ]}
                    >
                      <Select placeholder="Chọn màu sắc">
                        {colors.map((color) => (
                          <Option key={color.id} value={color.id}>
                            {color.tenMauSac}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "type"]}
                      label="Size"
                      rules={[
                        { required: true, message: "Vui lòng chọn size!" },
                      ]}
                    >
                      <Select placeholder="Chọn size">
                        {sizes.map((size) => (
                          <Option key={size.id} value={size.id}>
                            {size.tenSize}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "options"]}
                      label="Số Lượng Tồn"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số lượng tồn!",
                        },
                        {
                          validator: (_, value) =>
                            value < 0
                              ? Promise.reject("Số lượng tồn không được âm!")
                              : Promise.resolve(),
                        },
                      ]}
                    >
                      <Input
                        type="number"
                        min={0}
                        placeholder="Nhập số lượng tồn"
                      />
                    </Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        const fieldData =
                          form.getFieldValue("fields")[field.name];
                        handleSaveProductDetail(fieldData); // Gọi hàm đã gộp xử lý thêm/cập nhật
                      }}
                      style={{ marginRight: 8 }}
                    >
                      Add/Update
                    </Button>
                    {fields.length > 1 ? (
                      <Button
                        type="danger"
                        onClick={() => remove(field.name)}
                        icon={<MinusCircleOutlined />}
                      >
                        Remove chi tiết
                      </Button>
                    ) : null}
                  </div>
                ))}
                <Divider />
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: "60%" }}
                  >
                    <PlusOutlined /> Thêm chi tiết
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
