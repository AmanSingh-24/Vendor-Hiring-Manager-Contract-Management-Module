// src/utils/axiosInstance.js
import axios from "axios";
import { toast } from "sonner";
import { clearAuthData } from "../Auth/authUtils";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

// Global flag to prevent multiple 401 handlers from racing
let isSessionExpiredRedirecting = false;

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(
      `API Response [${
        response.status
      }]: ${response.config.method.toUpperCase()} ${response.config.url}`
    );
    return response;
  },
  async (error) => {
    if (error.response) {
      console.error(
        `API Error [${
          error.response.status
        }]: ${error.config.method.toUpperCase()} ${error.config.url}`,
        error.response.data
      );
      
      // Global 401 handler for expired tokens
      if (error.response.status === 401 && !isSessionExpiredRedirecting) {
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          isSessionExpiredRedirecting = true;
          toast.error("Session Expired, Login Again");
          // AWAIT cookie clearing before redirecting
          await clearAuthData();
          window.location.href = "/login";
        }
      }
    } else {
      console.error(`API Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

// Export the flag so api.js can check it too
export { isSessionExpiredRedirecting };
export default axiosInstance;


