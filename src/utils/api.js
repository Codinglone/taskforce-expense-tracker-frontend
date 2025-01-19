import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;
const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Setting Authorization header:", `Bearer ${token}`);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const addIncome = async (incomeData) => {
  try {
    const response = await axiosInstance.post("/income", incomeData);
    return response.data;
  } catch (error) {
    console.error("Error adding income:", error);
    throw error;
  }
};

export const addExpense = async (expenseData) => {
  try {
    const response = await axiosInstance.post("/expenses", expenseData);
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const getIncome = async () => {
  try {
    const response = await axiosInstance.get("/income");
    return response.data;
  } catch (error) {
    console.error("Error fetching income:", error);
    throw error;
  }
};

export const getExpenses = async () => {
  try {
    const response = await axiosInstance.get("/expenses");
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("/categories/category", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

export const addSubcategory = async (subcategoryData) => {
  try {
    const response = await axiosInstance.post(
      "/categories/subcategory",
      subcategoryData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding subcategory:", error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export default axiosInstance;
