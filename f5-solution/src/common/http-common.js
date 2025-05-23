import axios from "axios";

const http = axios.create({
  baseURL: "https://localhost:7030/api",
  headers: {
    "Content-Type": "application/json",
  },
  // Timeout sau 30 giây
  timeout: 30000,
  // Tự động retry khi request thất bại
  retry: 3,
  retryDelay: 1000,
});

// Add a request interceptor
http.interceptors.request.use(
  (config) => {
    // Thêm timestamp để tránh cache của browser
    if (config.method === "get") {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const {
      config,
      response: { status },
    } = error;

    // Retry logic
    if (status !== 401 && config && config.retry) {
      config.retryCount = config.retryCount || 0;

      if (config.retryCount < config.retry) {
        config.retryCount += 1;

        // Delay using exponential backoff
        const delay = config.retryDelay * Math.pow(2, config.retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));

        return http(config);
      }
    }

    return Promise.reject(error);
  }
);

export default http;
