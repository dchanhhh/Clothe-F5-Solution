import http from "../common/http-common"; // Import http từ http-common
const HomeView = {
  // Hàm tạo mới thuộc tính
  ViewProductHome: async () => {
    try {
      const response = await http.get("SanPham/store");
      return response.data;
    } catch (error) {
      throw error.response?.data || "API không hoạt động";
    }
  },
  ViewProductDetail: async (productId) => {
    try {
      const response = await http.get(`SanPham/details/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || "API không hoạt động";
    }
  },
};

export default HomeView;
