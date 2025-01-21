import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    if (notification.type === 'error') {
      toast.error(notification.message);
    } else if (notification.type === 'warning') {
      toast.warning(notification.message);
    } else if (notification.type === 'success') {
      toast.success(notification.message);
    } else {
      toast.info(notification.message);
    }
    setNotifications(prev => {
      // Check if notification with same ID already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      return [notification, ...prev];
    });

    // Automatically remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

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
    // Clear all notifications on logout
    setNotifications([]);
  };

  return (
    <AuthContext.Provider value={{
      auth, login, logout, notifications, addNotification, removeNotification
    }}>
      {!auth.loading && children}
      <div className="fixed top-4 right-4 z-50">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`mb-2 p-4 rounded-lg shadow-lg ${notification.type === 'error' ? 'bg-red-100 text-red-800' :
                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  notification.type === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
              }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};
