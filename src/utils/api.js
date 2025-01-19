import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const addIncome = async (incomeData, token) => {
  try {
    const response = await axios.post(`${API_URL}/income`, incomeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding income:", error);
    throw error;
  }
};

export const addExpense = async (expenseData, token) => {
  try {
    const response = await axios.post(`${API_URL}/expenses`, expenseData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

export const getIncome = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/income`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching income:", error);
    throw error;
  }
};

export const getExpenses = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/expenses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

export const addCategory = async (categoryData, token) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const getCategories = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const addSubcategory = async (subcategoryData, token) => {
  try {
    const response = await axios.post(`${API_URL}/subcategories`, subcategoryData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding subcategory:', error);
    throw error;
  }
};

export const getSubcategories = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/subcategories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};
