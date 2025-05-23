import axios from "axios";

const http = axios.create({
  baseURL: "https://localhost:7030/api", // Đặt base URL cho tất cả các yêu cầu API
  headers: {
    "Content-Type": "application/json", // Cấu hình headers mặc định
  },
});

export default http;
