"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Rehydrate user on load by hitting /user endpoint
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/user");
        setUser(response.data.user);
      } catch (error) {
        // Not authenticated
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const response = await api.post("/auth/verify-login", {
      usernameOrEmail,
      password,
    });
    return response.data; // { message: "Login verified. Please enter your TOTP code." }
  };

  const verifyTotp = async (totp) => {
    const response = await api.post("/auth/verify-totp", { totp });
    const userData = response.data.user;
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data; // { qrCode, otpAuthUrl, user, message }
  };

  const completeRegistration = async () => {
    await api.post("/auth/complete-registration");
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      // Fallback manual cleanup for any non-http-only cookies (like role)
      document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, verifyTotp, register, completeRegistration, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
