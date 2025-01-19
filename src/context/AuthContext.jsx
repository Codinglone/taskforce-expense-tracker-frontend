import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  const loadUser = async () => {
    if (auth.token) {
      try {
        const response = await axiosInstance.get("/auth/user");
        console.log("User data received:", response.data);
        setAuth({
          ...auth,
          isAuthenticated: true,
          loading: false,
          user: response.data,
        });
      } catch (error) {
        console.error("Error loading user:", error);
        localStorage.removeItem("token");
        setAuth({
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    } else {
      setAuth({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, [auth.token]);

  const login = (token) => {
    if (typeof token === "string") {
      localStorage.setItem("token", token);
      setAuth({
        ...auth,
        token,
        isAuthenticated: true,
      });
      loadUser();
      window.location.href = "/";
    } else {
      console.error("Token must be a string");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    setAuth({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
    });
    toast.success("Logged out successfully!");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};
