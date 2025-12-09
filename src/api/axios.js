import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Skip token check for public endpoints
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/set-password",
      "/auth/health",
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.includes(endpoint)
    );

    if (!isPublicEndpoint && !token) {
      console.error("🚫 No authentication token - Request blocked");
      return Promise.reject(new Error("Authentication required"));
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "🔐 Request with token:",
        config.method?.toUpperCase(),
        config.url
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
            toast.error("Session expired. Please login again.");
          }
          break;

        case 403:
          toast.error("You do not have permission to perform this action.");
          break;

        case 404:
          toast.error("The requested resource was not found.");
          break;

        case 500:
          toast.error("Server error. Please try again later.");
          break;

        default:
          if (error.response.data?.message) {
            toast.error(error.response.data.message);
          }
          break;
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
