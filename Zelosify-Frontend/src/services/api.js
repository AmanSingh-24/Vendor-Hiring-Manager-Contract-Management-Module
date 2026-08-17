import axios from "axios";
import { toast } from "sonner";
import { clearAuthData } from "../utils/Auth/authUtils";

// Shared redirect-in-progress flag to prevent duplicate 401 handling
let isRedirecting = false;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && !isRedirecting) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        // Prevent redirect loop if already on auth pages
        if (!path.startsWith("/login") && !path.startsWith("/register") && !path.startsWith("/setup-totp") && path !== "/") {
          isRedirecting = true;
          toast.error("Session Expired, Login Again");
          // AWAIT cookie clearing before redirecting
          await clearAuthData();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;


