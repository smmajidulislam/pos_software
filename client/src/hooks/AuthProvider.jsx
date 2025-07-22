import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on first load
  const getToken = () => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    if (!tokenData) return null;

    const now = new Date().getTime();
    if (now > tokenData.expiresAt) {
      localStorage.removeItem("token");
      return null;
    }

    return tokenData.token;
  };

  // Login Function
  const login = (userData, isRemember) => {
    const now = new Date();
    const expiresAt = isRemember
      ? now.getTime() + 365 * 24 * 60 * 60 * 1000 // 365 days
      : now.getTime() + 24 * 60 * 60 * 1000; // 1 day

    const tokenData = {
      token: userData,
      expiresAt,
    };

    localStorage.setItem("token", JSON.stringify(tokenData));
    setUser(userData);
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser(token);
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isLoggedIn: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth
export const useAuth = () => useContext(AuthContext);
