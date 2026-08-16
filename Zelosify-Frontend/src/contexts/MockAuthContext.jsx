"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Mock Data
const MOCK_VENDOR = {
  id: "vendor-123",
  username: "vendor_clark",
  email: "clark@vendor.com",
  firstName: "Clark",
  lastName: "Kent",
  role: "IT_VENDOR",
  tenantId: "bruce-wayne-corp-id",
};

const MOCK_HIRING_MANAGER = {
  id: "hm-456",
  username: "bruce_hm",
  email: "hiringmanager@brucewayne.corp",
  firstName: "Bruce",
  lastName: "Wayne",
  role: "HIRING_MANAGER",
  tenantId: "bruce-wayne-corp-id",
};

const MockAuthContext = createContext(null);

export const MockAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session on load
    const savedUser = localStorage.getItem("mock_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const loginAsVendor = () => {
    setUser(MOCK_VENDOR);
    localStorage.setItem("mock_user", JSON.stringify(MOCK_VENDOR));
    
    // Create a mock JWT that middlewareUtils.js can successfully decode
    const vendorPayload = btoa(JSON.stringify({ realm_access: { roles: ["IT_VENDOR"] } }));
    const mockToken = `mockHeader.${vendorPayload}.mockSignature`;

    document.cookie = `access_token=${mockToken}; path=/;`;
    document.cookie = `refresh_token=mock_refresh; path=/;`;
    document.cookie = `role=IT_VENDOR; path=/;`;
  };

  const loginAsHiringManager = () => {
    setUser(MOCK_HIRING_MANAGER);
    localStorage.setItem("mock_user", JSON.stringify(MOCK_HIRING_MANAGER));
    
    // Create a mock JWT that middlewareUtils.js can successfully decode
    const hmPayload = btoa(JSON.stringify({ realm_access: { roles: ["HIRING_MANAGER"] } }));
    const mockToken = `mockHeader.${hmPayload}.mockSignature`;

    document.cookie = `access_token=${mockToken}; path=/;`;
    document.cookie = `refresh_token=mock_refresh; path=/;`;
    document.cookie = `role=HIRING_MANAGER; path=/;`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_user");
    // Clear cookies
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  };

  return (
    <MockAuthContext.Provider
      value={{ user, isLoading, loginAsVendor, loginAsHiringManager, logout }}
    >
      {children}
    </MockAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(MockAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a MockAuthProvider");
  }
  return context;
};
