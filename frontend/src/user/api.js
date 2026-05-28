import axios from "axios";

export const getBackendBase = () => {
  if (process.env.REACT_APP_BACKEND_BASE_URL) {
    return process.env.REACT_APP_BACKEND_BASE_URL;
  }
  return window.location.hostname === "localhost"
    ? "http://localhost:8080"
    : `${window.location.protocol}//${window.location.host}`;
};

export const getWsUrl = (token) => {
  if (process.env.REACT_APP_WS_BASE_URL) {
    return `${process.env.REACT_APP_WS_BASE_URL}?token=${token}`;
  }
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.hostname === "localhost" ? "localhost:8080" : window.location.host;
  return `${protocol}//${host}/ws-chat?token=${token}`;
};

// Create centralized Axios instance
const api = axios.create({
  baseURL: `${getBackendBase()}/api`,
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