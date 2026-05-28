import axios from "axios";

export const getBackendBase = () => {
  if (process.env.REACT_APP_BACKEND_BASE_URL) {
    return process.env.REACT_APP_BACKEND_BASE_URL;
  }
  return window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : `${window.location.protocol}//${window.location.host}`;
};

const adminApi = axios.create({
  baseURL: `${getBackendBase()}/api`,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[Admin API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[Admin API Request Error]", error);
    return Promise.reject(error);
  }
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    console.error(`[Admin API Error] ${status || "Network"} from ${url}:`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default adminApi;
