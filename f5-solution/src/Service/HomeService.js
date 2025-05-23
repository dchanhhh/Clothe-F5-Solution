import http from "../common/http-common"; // Import http từ http-common

// Add cache object
const cache = {
  products: null,
  lastFetch: null,
  expiryTime: 5 * 60 * 1000, // 5 minutes
};

const HomeView = {
  // Hàm tạo mới thuộc tính
  ViewProductHome: async () => {
    try {
      // Check if we have valid cached data
      const now = Date.now();
      if (cache.products && cache.lastFetch && (now - cache.lastFetch < cache.expiryTime)) {
        return cache.products;
      }

      // If no valid cache, fetch from API
      const response = await http.get("SanPham/store");
      
      // Update cache
      cache.products = response.data;
      cache.lastFetch = now;
      
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
  // Add method to clear cache
  clearCache: () => {
    cache.products = null;
    cache.lastFetch = null;
  }
};

export default HomeView;
