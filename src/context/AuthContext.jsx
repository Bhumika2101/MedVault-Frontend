import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../api/endpoints";
import { toast } from "react-toastify";
import axiosInstance from "../api/axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serverConnected, setServerConnected] = useState(false);
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    // Check server connection first
    await checkServerConnection();

    // Check for BOTH user AND token
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    console.log("🔍 Checking authentication...");
    console.log("Token exists:", !!token);
    console.log("User exists:", !!storedUser);

    // Both must exist, otherwise clear everything
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log(
          "✅ User authenticated:",
          parsedUser.email,
          parsedUser.role
        );
      } catch (error) {
        console.error("❌ Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      console.log("❌ Missing authentication credentials");
      // Clear everything if either is missing
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  };

  const checkServerConnection = async () => {
    try {
      await axiosInstance.get("/auth/health", { timeout: 5000 });
      setServerConnected(true);
      setServerError(false);
    } catch (error) {
      // Check if it's a network error (ERR_CONNECTION_REFUSED, timeout, etc.)
      const isNetworkError =
        error.code === "ERR_NETWORK" ||
        error.code === "ECONNABORTED" ||
        error.message?.includes("ERR_CONNECTION_REFUSED") ||
        !error.response;

      if (isNetworkError) {
        console.error("Server is not available:", error.message);
        setServerConnected(false);
        setServerError(true);
      } else {
        // Server responded with an error (403, 404, etc.) but is available
        console.warn(
          "Server is available but returned error:",
          error.response?.status
        );
        setServerConnected(true);
        setServerError(false);
      }
    }
  };

  const retryConnection = async () => {
    setLoading(true);
    await checkServerConnection();
    if (serverConnected && !serverError) {
      await initializeAuth();
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      console.log("📥 Login response:", response.data);

      const { token, ...userData } = response.data.data;

      if (!token) {
        console.error("❌ No token received in login response!");
        throw new Error("No authentication token received");
      }

      console.log(
        "💾 Saving token to localStorage:",
        token.substring(0, 30) + "..."
      );
      console.log("💾 Saving user to localStorage:", userData);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      console.log(
        "✅ Login complete. User set:",
        userData.email,
        userData.role
      );
      toast.success("Login successful!");
      return userData;
    } catch (error) {
      console.error("❌ Login error:", error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.registerPatient(data);
      const { token, ...userData } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      toast.success("Registration successful!");
      return userData;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out successfully");
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
    serverConnected,
    serverError,
    retryConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
