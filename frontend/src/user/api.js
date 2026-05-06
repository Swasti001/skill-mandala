import axios from "axios";

// Create centralized Axios instance
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// Global response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = error.response?.data?.message || "";

    if (status === 401) {
      console.log("🚨 401 Unauthorized from:", url, "Message:", message);
      // Removed automatic logout per Requirement (Manual Terminate Only)
    } else {
      console.error(
        `[API Error] ${status || "Network"} from ${url}:`,
        error.response?.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default api;