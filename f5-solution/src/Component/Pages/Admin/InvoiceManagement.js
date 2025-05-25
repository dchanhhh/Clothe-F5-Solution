import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Select,
  Tag,
  Row,
  Col,
  Card,
  Modal,
  Form,
  notification,
  InputNumber,
  message,
  Image,
  List,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import "./InvoiceManagement.css";

// Khởi tạo fonts cho pdfMake
if (typeof window !== "undefined") {
  pdfMake.vfs = pdfFonts.vfs;
}

// Định nghĩa fonts
pdfMake.fonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

const { Option } = Select;

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isProductSelectVisible, setIsProductSelectVisible] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] = useState(null);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("https://localhost:7030/api/HoaDon");
      const data = response.data;
      setInvoices(data || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu hóa đơn:", error);
      notification.error({ message: "Không thể lấy dữ liệu hóa đơn từ API." });
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleAddNew = () => {
    setEditingInvoice(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7030/api/SanPham/GetAll"
        );
        if (isMounted && response.data) {
          const filteredData = response.data
            .flatMap((item) =>
              item.sanPhamChiTiets.map((chiTiet) => ({
                key: chiTiet.id,
                id: item.id,
                idSpct: chiTiet.id,
                name: `${item.tenSp} - ${
                  "size " + chiTiet.size?.tenSize || "Chưa có kích thước"
                } - ${chiTiet.mauSac?.tenMauSac || "Chưa có màu"}`,
                price: item.giaBan,
                image: item.imageDefaul,
                soLuongTon: chiTiet.soLuongTon,
              }))
            )
            .filter((product) => product.soLuongTon > 0);
          setProductList(filteredData);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching product data:", error);
          message.error("Không thể tải dữ liệu sản phẩm.");
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectProduct = (product) => {
    const existingProductIndex = invoiceDetails.findIndex(
      (detail) => detail.idSpct === product.idSpct // So sánh theo idSpct (kích thước)
    );

    if (existingProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng
      const updatedProduct = {
        ...invoiceDetails[existingProductIndex],
        quantity: invoiceDetails[existingProductIndex].quantity + 1,
        totalPrice:
          invoiceDetails[existingProductIndex].unitPrice *
          (invoiceDetails[existingProductIndex].quantity + 1),
      };

      const updatedInvoiceDetails = [...invoiceDetails];
      updatedInvoiceDetails[existingProductIndex] = updatedProduct; // Cập nhật sản phẩm trong danh sách

      setInvoiceDetails(updatedInvoiceDetails); // Cập nhật state
      form.resetFields();
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới
      const newProduct = {
        key: invoiceDetails.length + 1,
        id: product.id,
        idSpct: product.idSpct,
        product: product.name,
        image: product.image,
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
      };
      setInvoiceDetails([...invoiceDetails, newProduct]); // Thêm sản phẩm mới
    }

    setIsProductSelectVisible(false);
  };
  const handleSave = async (values) => {
    try {
      const tienKhachTra = values.tienKhachTra;
      const tongTien = values.tongTien;
      if (tienKhachTra < totalAmount) {
        notification.error({
          message: "Lỗi",
          description: "Tiền khách trả không thể nhỏ hơn tổng tiền.",
        });
        return;
      }
      const predefinedValues = {
        TienThua: tienKhachTra - tongTien,
        GhiChu: "đơn dc tạo bởi hệ thống",
      };
      const invoiceData = {
        ...editingInvoice, // Keep existing fields
        ...values, // Override with new form values
        ...predefinedValues,
        hoaDonChiTiets: invoiceDetails.map((detail) => ({
          idSpct: detail.idSpct,
          soLuong: detail.quantity,
          giaBan: detail.unitPrice,
        })),
        tongTien: totalAmount,
      };

      if (editingInvoice) {
        // Use PUT method for updating existing invoice
        try {
          const response = await axios.put(
            `https://localhost:7030/api/HoaDon/${editingInvoice.id}`,
            invoiceData
          );
          setInvoices(
            invoices.map((invoice) =>
              invoice.id === editingInvoice.id ? response.data : invoice
            )
          );

          notification.success({ message: "Hóa đơn đã được cập nhật!" });
        } catch {
          const updateUrl = `https://localhost:7030/api/HoaDon/${editingInvoice.id}`;
          console.log("Full Update URL:", updateUrl);
        }
      } else {
        // Add new invoice using POST method
        const newInvoice = {
          ...invoiceData,
          ngayTao: new Date().toISOString(), // Use ngayTao instead of dateCreated
        };

        const response = await axios.post(
          "https://localhost:7030/api/HoaDon",
          newInvoice
        );
        setInvoices([...invoices, response.data]);
        await fetchInvoices();
        notification.success({ message: "Hóa đơn đã được thêm mới!" });
      }

      setIsModalVisible(false);
      // Reset editing state
      setEditingInvoice(null);
      setInvoiceDetails([]);
    } catch (error) {
      console.error("Lỗi khi lưu hóa đơn:", error);
      notification.error({
        message: "Không thể lưu hóa đơn",
        description: error.response?.data || error.message,
      });
    }
  };
  useEffect(() => {
    const total = invoiceDetails.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice;
    }, 0);
    setTotalAmount(total);
    form.setFieldsValue({
      // tienKhachTra: total,
      tongTien: total, // Thêm trường tổng tiền nếu cần
    });
  }, [invoiceDetails, form]);
  const handleEditStatus = async (record) => {
    setEditingInvoice(record);
    form.setFieldsValue({ trangThai: record.trangThai });
    setIsStatusModalVisible(true);
  };

  const handleSaveStatus = async (values) => {
    try {
      const updatedInvoice = {
        ...editingInvoice,
        trangThai: values.trangThai,
      };

      const response = await axios.put(
        `https://localhost:7030/api/HoaDon/updateStatus`,
        updatedInvoice
      );
      setInvoices(
        invoices.map((invoice) =>
          invoice.id === editingInvoice.id ? response.data : invoice
        )
      );
      notification.success({ message: "Trạng thái hóa đơn đã được cập nhật!" });
      await fetchInvoices();
      setIsStatusModalVisible(false); // Close modal
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái hóa đơn:", error);
      notification.error({
        message: "Không thể cập nhật trạng thái hóa đơn",
        description: error.response?.data || error.message,
      });
    }
  };
  const handleViewDetails = async (record) => {
    try {
      const response = await axios.get(
        `https://localhost:7030/api/HoaDon/${record.id}`
      );
      if (!response || !response.data) {
        notification.error({ message: "Không tìm thấy chi tiết hóa đơn" });
        return;
      }

      const invoiceData = response.data;
      console.log("Invoice Data:", invoiceData); // In ra để kiểm tra cấu trúc
      setSelectedInvoiceDetails(invoiceData);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết hóa đơn:", error);
      notification.error({
        message: "Không thể tải chi tiết hóa đơn",
        description: error.message,
      });
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:7030/api/HoaDon/${id}`);
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
    notification.success({ message: "Hóa đơn đã bị xóa!" });
  };
  const sortedInvoices = invoices.sort((a, b) => {
    if (a.trangThai !== b.trangThai) {
      return a.trangThai - b.trangThai;
    }
    return new Date(a.ngayTao) - new Date(b.ngayTao);
  });
  const filteredInvoices = sortedInvoices.filter((invoice) => {
    const matchesSearchText =
      (invoice.maHoaDon &&
        invoice.maHoaDon.toLowerCase().includes(searchText.toLowerCase())) ||
      (invoice.tenNguoiNhan &&
        invoice.tenNguoiNhan.toLowerCase().includes(searchText.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || invoice.trangThai === selectedStatus;

    return matchesSearchText && matchesStatus;
  });

  const statusCounts = {
    1: invoices.filter((invoice) => invoice.trangThai === 1).length,
    2: invoices.filter((invoice) => invoice.trangThai === 2).length,
    3: invoices.filter((invoice) => invoice.trangThai === 3).length,
    4: invoices.filter((invoice) => invoice.trangThai === 4).length,
    5: invoices.filter((invoice) => invoice.trangThai === 5).length,
    6: invoices.filter((invoice) => invoice.trangThai === 6).length,
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "maHoaDon",
      key: "maHoaDon",
      render: (text) => <a>{text}</a>,
    },
    // {
    //     title: 'Nhân viên tạo',
    //     dataIndex: 'idNvNavigation',
    //     key: 'staff',
    //     render: (idNvNavigation) => idNvNavigation?.hoVaTenNv  || 'Hệ thống'
    // },
    {
      title: "Khách hàng",
      dataIndex: "idKhNavigation",
      key: "customer",
      render: (idKhNavigation, record) =>
        idKhNavigation?.hoVaTenKh || record.tenNguoiNhan || "Hệ thống",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngayTao",
      key: "ngayTao",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Số điện thoại",
      dataIndex: "sdtnguoiNhan",
      key: "sdtnguoiNhan",
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      key: "thanhTien",
      render: (total) => `${total?.toLocaleString("vi-VN")} vnđ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (status) => {
        let color = "green";
        switch (status) {
          case 1:
            color = "volcano";
            break;
          case 2:
            color = "blue";
            break;
          case 3:
            color = "orange";
            break;
          case 4:
            color = "yellow";
            break;
          case 5:
            color = "green";
            break;
          case 6:
            color = "red";
            break;
          default:
            color = "grey";
        }
        const statusText = statusMapping[status] || "Không xác định";
        return <Tag color={color}>{statusText}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditStatus(record)}
          >
            Sửa Trạng Thái
          </Button>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            Xem chi tiết
          </Button>
          {/* <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>Xóa</Button> */}
        </Space>
      ),
    },
  ];

  const statusMapping = {
    1: "Chờ xác nhận",
    2: "Đã xác nhận",
    3: "Chờ giao",
    4: "Đang giao",
    5: "Hoàn thành",
    6: "Đơn hủy",
  };
  const columnsProductDetails = [
    { title: "STT", dataIndex: "key", key: "stt" },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="Product" style={{ width: 50 }} />
      ),
    },
    { title: "Sản phẩm", dataIndex: "product", key: "product" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <Space>
          <Button
            icon={<MinusOutlined />}
            onClick={() => decreaseQuantity(record.key)}
          />
          {quantity}
          <Button
            icon={<PlusOutlined />}
            onClick={() => increaseQuantity(record.key)}
          />
        </Space>
      ),
    },
    // {
    //     title: 'Đơn giá',
    //     dataIndex: 'unitPrice',
    //     key: 'unitPrice',
    //     render: price => `${price.toLocaleString('vi-VN')} vnđ`
    // },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total) => `${total.toLocaleString("vi-VN")} vnđ`,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteProduct(record.key)}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];
  // Đóng modal
  const closeProductModal = () => {
    setIsProductSelectVisible(false);
  };
  const handleDeleteProduct = (key) => {
    setInvoiceDetails(invoiceDetails.filter((product) => product.key !== key));
    notification.success({ message: "Sản phẩm đã bị xóa!" });
  };
  const increaseQuantity = (key) => {
    setInvoiceDetails(
      invoiceDetails.map((product) =>
        product.key === key
          ? {
              ...product,
              quantity: product.quantity + 1,
              totalPrice: product.unitPrice * (product.quantity + 1),
            }
          : product
      )
    );
  };
  const decreaseQuantity = (key) => {
    setInvoiceDetails(
      invoiceDetails.map((product) =>
        product.key === key && product.quantity > 1
          ? {
              ...product,
              quantity: product.quantity - 1,
              totalPrice: product.unitPrice * (product.quantity - 1),
            }
          : product
      )
    );
  };

  //in hóa đơn
  const handlePrintInvoice = () => {
    if (!selectedInvoiceDetails) return;

    const docDefinition = {
      pageSize: { width: 595.28, height: "auto" }, // A4 width in points
      pageMargins: [40, 20, 40, 20], // [left, top, right, bottom]
      content: [
        { text: "F5 Fashion", style: "header" },
        {
          text: "123 Đường ABC, Phường XYZ, cầu giấy, TP.HN",
          style: "subheader",
        },
        { text: "Hotline: 0123 456 789", style: "subheader" },
        {
          canvas: [
            { type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 },
          ],
        },
        { text: `Mã HĐ: ${selectedInvoiceDetails.maHoaDon}`, style: "info" },
        {
          text: `Ngày: ${new Date(
            selectedInvoiceDetails.ngayTao
          ).toLocaleString()}`,
          style: "info",
        },
        { text: "Thu ngân: Hệ thống", style: "info" },
        {
          canvas: [
            { type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 },
          ],
        },
        {
          text: `KH: ${
            selectedInvoiceDetails.khachHang?.hoVaTenKh || "Khách lẻ"
          }`,
          style: "info",
        },
        {
          text: `SĐT: ${
            selectedInvoiceDetails.khachHang?.soDienThoai || "Không có"
          }`,
          style: "info",
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 },
          ],
        },
        ...selectedInvoiceDetails.hoaDonChiTiets
          .map((item) => [
            {
              text: item.sanPham?.tenSanPham || "SP Không xác định",
              style: "product",
            },
            {
              columns: [
                {
                  text: `${item.soLuong} x ${item.donGia.toLocaleString(
                    "vi-VN"
                  )}`,
                  width: "50%",
                },
                {
                  text: item.thanhTien.toLocaleString("vi-VN"),
                  width: "50%",
                  alignment: "right",
                },
              ],
              style: "productDetails",
            },
          ])
          .flat(),
        {
          canvas: [
            { type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 },
          ],
        },
        {
          columns: [
            { text: "Tổng cộng:", style: "total", width: "50%" },
            {
              text: `${selectedInvoiceDetails.tongTien.toLocaleString(
                "vi-VN"
              )} VNĐ`,
              style: "total",
              width: "50%",
              alignment: "right",
            },
          ],
        },
        {
          columns: [
            { text: "Tiền mặt:", style: "payment", width: "50%" },
            {
              text: `${selectedInvoiceDetails.tongTien.toLocaleString(
                "vi-VN"
              )} VNĐ`,
              style: "payment",
              width: "50%",
              alignment: "right",
            },
          ],
        },
        {
          columns: [
            { text: "Tiền thừa:", style: "payment", width: "50%" },
            {
              text: "0 VNĐ",
              style: "payment",
              width: "50%",
              alignment: "right",
            },
          ],
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1 },
          ],
        },
        { text: "Cảm ơn quý khách!", style: "footer", alignment: "center" },
        { text: "Hẹn gặp lại", style: "footer", alignment: "center" },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 12,
          alignment: "center",
          margin: [0, 0, 0, 5],
        },
        info: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
        product: {
          fontSize: 12,
          margin: [0, 10, 0, 0],
        },
        productDetails: {
          fontSize: 12,
          margin: [0, 5, 0, 10],
        },
        total: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        payment: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
        footer: {
          fontSize: 12,
          margin: [0, 10, 0, 5],
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`HoaDon_${selectedInvoiceDetails.maHoaDon}.pdf`);
  };

  return (
    <div className="invoice-management-container">
      <Row gutter={[16, 16]} className="status-cards" justify="center">
        {Object.keys(statusCounts).map((status) => (
          <Col xs={24} sm={12} md={8} lg={6} xl={4} key={status}>
            <Card
              title={`${statusMapping[status] || "Không xác định"}`}
              bordered={false}
              className="status-card"
            >
              {statusCounts[status]}
            </Card>
          </Col>
        ))}
      </Row>

      <div className="filter-section">
        <Input
          className="search-input"
          placeholder="Tìm kiếm theo mã hoá đơn, tên người nhận..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          className="status-select"
          defaultValue="all"
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value)}
        >
          <Option value="all">Tất cả các đơn</Option>
          <Option value={1}>Chờ xác nhận</Option>
          <Option value={2}>Đã xác nhận</Option>
          <Option value={3}>Chờ giao</Option>
          <Option value={4}>Đang giao</Option>
          <Option value={5}>Hoàn thành</Option>
          <Option value={6}>Đơn huỷ</Option>
        </Select>
        <Button
          type="primary"
          className="add-button"
          icon={<PlusOutlined />}
          onClick={handleAddNew}
        >
          Tạo hoá đơn
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredInvoices}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }} // Cuộn ngang nếu cần
      />

      <Modal
        title={editingInvoice ? "Chỉnh sửa hóa đơn" : "Thêm hóa đơn mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item
            label="Tên người nhận"
            name="tenNguoiNhan"
            rules={[
              { required: true, message: "Vui lòng nhập tên người nhận!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại người nhận"
            name="sdtnguoiNhan"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { len: 10, message: "Số điện thoại phải có 10 chữ số!" },
              { max: 10, message: "Số điện thoại không được quá 10 chữ số!" },
              {
                pattern: /^[0-9]+$/,
                message:
                  "Số điện thoại chỉ được chứa số và không được có ký tự đặc biệt!",
              }, // Kiểm tra chỉ chứa số
            ]}
          >
            <Input
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*$/.test(value) || value === "") {
                  form.setFieldsValue({ sdtnguoiNhan: value });
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="Địa chỉ người nhận"
            name="diaChiNhanHang"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại hóa đơn"
            name="LoaiHoaDon"
            rules={[{ required: true, message: "Vui lòng chọn loại hóa đơn!" }]}
          >
            <Select>
              <Option value={1}>tại quầy</Option>
              <Option value={2}>Online</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Trạng Thái"
            name="trangThai"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value={1}>Chờ xác nhận</Option>
              <Option value={2}>Đã xác nhận</Option>
              <Option value={3}>Chờ giao</Option>
              <Option value={4}>Đang giao</Option>
              <Option value={5}>Hoàn thành</Option>
              <Option value={6}>Đơn hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Tổng tiền" name="tongTien">
            <InputNumber
              style={{ width: "100%" }}
              value={totalAmount}
              formatter={(value) => `${value.toLocaleString("vi-VN")} VND`}
              parser={(value) => value.replace(/\s?VND|,/g, "")}
              readOnly
            />
          </Form.Item>
          <Form.Item
            label="Tiền khách trả"
            name="tienKhachTra"
            rules={[
              { required: true, message: "Vui lòng nhập số tiền khách trả!" },
              {
                validator: (rule, value) => {
                  if (value < 0) {
                    return Promise.reject("Tiền khách trả không được âm.");
                  }
                  if (value < totalAmount) {
                    return Promise.reject(
                      "Tiền khách trả phải lớn hơn tổng tiền."
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <div className="product-details-section">
            <Table
              columns={columnsProductDetails}
              dataSource={invoiceDetails}
              pagination={false}
            />
            <Button
              className="add-product-btn"
              onClick={() => setIsProductSelectVisible(true)}
            >
              Chọn sản phẩm
            </Button>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingInvoice ? "Cập nhật hóa đơn" : "Tạo hóa đơn"}
            </Button>
          </Form.Item>
          <div>
            <Modal
              title="Chọn sản phẩm"
              open={isProductSelectVisible}
              onCancel={closeProductModal}
              footer={null}
            >
              <List
                dataSource={productList} // Dữ liệu sản phẩm từ API
                renderItem={(item) => (
                  <List.Item>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      style={{ marginRight: 10 }}
                    />
                    <Button onClick={() => handleSelectProduct(item)}>
                      {item.name} -{" "}
                      {item.price
                        ? item.price.toLocaleString("vi-VN")
                        : "Liên hệ"}{" "}
                      vnđ
                    </Button>
                  </List.Item>
                )}
              />
            </Modal>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Sửa Trạng Thái Hóa Đơn"
        visible={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSaveStatus} layout="vertical">
          <Form.Item
            label="Trạng Thái"
            name="trangThai"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Option value={1}>Chờ xác nhận</Option>
              <Option value={2}>Đã xác nhận</Option>
              <Option value={3}>Chờ giao</Option>
              <Option value={4}>Đang giao</Option>
              <Option value={5}>Hoàn thành</Option>
              <Option value={6}>Đơn hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật trạng thái
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết hóa đơn"
        visible={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="print" type="primary" onClick={handlePrintInvoice}>
            In hóa đơn
          </Button>,
        ]}
        width={800}
      >
        {selectedInvoiceDetails ? (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <h3>Thông tin hóa đơn</h3>
                <p>
                  <strong>Mã hóa đơn:</strong> {selectedInvoiceDetails.maHoaDon}
                </p>
                <p>
                  <strong>Tên khách hàng:</strong>{" "}
                  {selectedInvoiceDetails.tenNguoiNhan ||
                    selectedInvoiceDetails.khachHang?.hoVaTenKh ||
                    "Không có thông tin"}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {selectedInvoiceDetails.sdtnguoiNhan ||
                    selectedInvoiceDetails.khachHang?.soDienThoai ||
                    "Không có thông tin"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>
                  {selectedInvoiceDetails.diaChiNhanHang ||
                    (selectedInvoiceDetails.khachHang?.diaChis &&
                    selectedInvoiceDetails.khachHang.diaChis.length > 0
                      ? selectedInvoiceDetails.khachHang.diaChis.map(
                          (diaChi, index) => (
                            <div key={index}>
                              {diaChi.diaChiChiTiet}, {diaChi.phuongXa},{" "}
                              {diaChi.quanHuyen}, {diaChi.tinhThanh},{" "}
                              {diaChi.quocGia}
                              {/* <br />
                    <em>{diaChi.ghiChu}</em> */}
                            </div>
                          )
                        )
                      : "Không có")}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(selectedInvoiceDetails.ngayTao).toLocaleString()}
                </p>
              </Col>
              <Col span={12}>
                <h3>Chi tiết sản phẩm</h3>

                {selectedInvoiceDetails.hoaDonChiTiets &&
                  selectedInvoiceDetails.hoaDonChiTiets.length > 0 && (
                    <Table
                      columns={[
                        {
                          title: "Sản phẩm",
                          dataIndex: "sanPham",
                          key: "product",
                          render: (text, record) =>
                            record.sanPham?.tenSanPham || "Không có tên",
                        },
                        {
                          title: "Số lượng",
                          dataIndex: "soLuong",
                          key: "quantity",
                        },
                        {
                          title: "đơn giá",
                          dataIndex: "DonGia",
                          key: "DonGia",
                        },
                        {
                          title: "Thành Tiền",
                          dataIndex: "thanhTien",
                          key: "thanhTien",
                          render: (price) =>
                            `${price.toLocaleString("vi-VN")} vnđ`,
                        },
                      ]}
                      dataSource={selectedInvoiceDetails.hoaDonChiTiets.map(
                        (item) => ({
                          key: item.id,
                          idSpct: item.idSpct,
                          soLuong: item.soLuong,
                          DonGia: item.donGia,
                          thanhTien: item.thanhTien,
                          sanPham: item.sanPham,
                        })
                      )}
                      pagination={false}
                    />
                  )}
                <div style={{ marginTop: 16, textAlign: "right" }}>
                  <strong>Tổng tiền:</strong>{" "}
                  {selectedInvoiceDetails.tongTien?.toLocaleString("vi-VN") ||
                    0}{" "}
                  vnđ
                </div>
              </Col>
            </Row>
          </div>
        ) : (
          <p>Không có dữ liệu chi tiết hóa đơn.</p>
        )}
      </Modal>
    </div>
  );
};

export default InvoiceManagement;
