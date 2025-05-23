import http from "../common/http-common"; // Import http từ http-common

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let productsCache = {
     data: null,
     timestamp: null
};

const HomeView = {
     // Hàm tạo mới thuộc tính
     ViewProductHome: async () => {
          try {
               // Check if we have valid cached data
               if (productsCache.data && productsCache.timestamp) {
                    const now = Date.now();
                    if (now - productsCache.timestamp < CACHE_DURATION) {
                         return productsCache.data;
                    }
               }

               // If no valid cache, fetch from API
               const response = await http.get('SanPham/store');
               
               // Update cache
               productsCache = {
                    data: response.data,
                    timestamp: Date.now()
               };

               return response.data;
          } catch (error) {
               throw error.response?.data || "API không hoạt động";             
          }         
     },
     ViewProductDetail: async (productId) => {
          try {
               // Check if we have the product in cache
               if (productsCache.data) {
                    const cachedProduct = productsCache.data.find(p => p.id === productId);
                    if (cachedProduct) {
                         return cachedProduct;
                    }
               }

               const response = await http.get(`SanPham/details/${productId}`);
               return response.data;
          } catch (error) {
               throw error.response?.data || "API không hoạt động";             
          }  
     },
     // Method to clear cache if needed
     clearCache: () => {
          productsCache = {
               data: null,
               timestamp: null
          };
     }
};

export default HomeView;