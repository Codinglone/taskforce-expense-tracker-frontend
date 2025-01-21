import React, { useState, useEffect, useContext } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { toast } from "react-toastify";
import {
  getExpenses,
  addExpense,
  getCategories,
  addCategory,
  addSubcategory,
  getAccounts,
} from "../utils/api";
import { AuthContext } from "../context/AuthContext";
const Expense = () => {

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState({});
  const [subcategories, setSubcategories] = useState({});
  const [view, setView] = useState("expense");
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState("All");
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    subcategory: "",
    accountId: "", // Changed from account to accountId
    date: new Date().toISOString().split('T')[0],
  });
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  const { addNotification } = useContext(AuthContext);

  // Fetch all categories from server
  const fetchAllCategories = async () => {
    try {
      const data = await getCategories();
      if (Array.isArray(data)) {
        // Set categories names
        setCategories(data.map(cat => cat.name));

        // Create subcategories mapping
        const subCats = {};
        const catIds = {};

        data.forEach(cat => {
          subCats[cat.name] = cat.subcategories.map(sub => sub.name);
          catIds[cat.name] = cat._id;
        });

        setSubcategories(subCats);
        setCategoryIds(catIds);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  // Fetch all expenses from server
  const fetchAllExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await getExpenses();
      console.log("Fetched expenses:", data);
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Error fetching expenses");
    }
  };

  // Fetch accounts from database
  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const response = await getAccounts();
      console.log("Accounts response:", response);
      if (response?.data) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    console.log("Accounts state changed:", accounts);
  }, [accounts]);

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchAccounts(),
        fetchAllCategories(),
        fetchAllExpenses()
      ]);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    console.log("Current accounts:", accounts);
  }, [accounts]);

  // Calculate total expenses whenever expenses or selectedAccount changes
  useEffect(() => {
    const filtered =
      selectedAccount === "All"
        ? expenses
        : expenses.filter((expense) => expense.accountId === selectedAccount);
    const total = filtered.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    setTotalExpenses(total);
  }, [selectedAccount, expenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      // Find the category ID based on the selected category name
      const selectedCategoryId = categoryIds[newExpense.category];
      
      // Find the subcategory ID
      const selectedCategory = await getCategories().then(cats => 
        cats.find(cat => cat.name === newExpense.category)
      );
      
      const selectedSubcategoryId = selectedCategory?.subcategories.find(
        sub => sub.name === newExpense.subcategory
      )?._id;

      if (!selectedCategoryId || !selectedSubcategoryId) {
        toast.error("Invalid category or subcategory selection");
        return;
      }

      // Create the expense with proper IDs
      const expenseData = {
        ...newExpense,
        category: selectedCategoryId,
        subcategory: selectedSubcategoryId,
        amount: Number(newExpense.amount) // Ensure amount is a number
      };

      const response = await addExpense(expenseData);
      
      // Check for budget notification in response
      if (response.data?.budgetNotification) {
        console.log('Budget notification received:', response.data.budgetNotification);
        addNotification(response.data.budgetNotification);
      }
      
      toast.success("Expense added successfully!");
      fetchAllExpenses();
      setNewExpense({
        description: "",
        amount: "",
        category: "",
        subcategory: "",
        accountId: "",
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error("Error adding expense:", error);
      const errorMessage = error.response?.data?.message || "Error adding expense";
      toast.error(errorMessage);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      if (!newCategory.trim()) {
        toast.error("Please enter a category name");
        return;
      }

      await addCategory({ name: newCategory.trim() });
      toast.success("Category added successfully!");
      setNewCategory("");
      setView("expense");
      await fetchAllCategories();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error adding category";
      console.error("Error adding category:", errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }
    try {
      const categoryId = categoryIds[selectedCategory];
      await addSubcategory({
        category: categoryId,
        name: newSubcategory,
      });
      toast.success("Subcategory added successfully!");
      setNewSubcategory("");
      setView("expense");
      await fetchAllCategories();
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Error adding subcategory");
    }
  };

  // Update filtered expenses
  const filteredExpenses = expenses.filter(expense => {
    if (selectedAccountFilter === "All") return true;
    return expense.accountId?._id === selectedAccountFilter;
  });

  const filteredTotal = filteredExpenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  // Prepare chart data
  const chartData = {
    labels: filteredExpenses.map((expense) => expense.description),
    datasets: [
      {
        label: "Amount",
        data: filteredExpenses.map((expense) => expense.amount),
        backgroundColor: filteredExpenses.map((expense) => {
          switch (expense.account) {
            case "Mobile Money":
              return "rgba(255, 206, 86, 0.6)";
            case "BTC":
              return "rgba(153, 102, 255, 0.6)";
            default:
              return "rgba(255, 99, 132, 0.6)";
          }
        }),
        borderColor: filteredExpenses.map((expense) => {
          switch (expense.account) {
            case "Mobile Money":
              return "rgba(255, 206, 86, 1)";
            case "BTC":
              return "rgba(153, 102, 255, 1)";
            default:
              return "rgba(255, 99, 132, 1)";
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 h-[94vh] overflow-auto w-full bg-gray-100 border-4 border-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Expenses</h2>

      {/* Navigation Buttons */}
      <div className="mb-4 flex space-x-2">
        <button
          className={`p-2 rounded-lg shadow ${view === "expense"
            ? "bg-blue-700 text-white"
            : "bg-blue-500 text-white hover:bg-blue-700"
            }`}
          onClick={() => setView("expense")}
        >
          Add Expense
        </button>
        <button
          className={`p-2 rounded-lg shadow ${view === "category"
            ? "bg-green-700 text-white"
            : "bg-green-500 text-white hover:bg-green-700"
            }`}
          onClick={() => setView("category")}
        >
          Add Category
        </button>
        <button
          className={`p-2 rounded-lg shadow ${view === "subcategory"
            ? "bg-yellow-700 text-white"
            : "bg-yellow-500 text-white hover:bg-yellow-700"
            }`}
          onClick={() => setView("subcategory")}
        >
          Add Subcategory
        </button>
      </div>

      {/* Expense Form */}
      {view === "expense" && (
        <form className="mb-6" onSubmit={handleAddExpense}>
          <div className="flex flex-wrap space-x-2 mb-2">
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) =>
                setNewExpense({ ...newExpense, description: e.target.value })
              }
              required
              className="p-2 border rounded w-1/6"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) =>
                setNewExpense({ ...newExpense, amount: e.target.value })
              }
              required
              className="p-2 border rounded w-[12.74%]"
            />
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  category: e.target.value,
                  subcategory: "",
                })
              }
              required
              className="p-2 border rounded w-1/6"
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={newExpense.subcategory}
              onChange={(e) =>
                setNewExpense({ ...newExpense, subcategory: e.target.value })
              }
              className="p-2 border rounded w-1/6"
              disabled={!newExpense.category}
              required
            >
              <option value="">Subcategory</option>
              {newExpense.category &&
                subcategories[newExpense.category]?.map((subcat, idx) => (
                  <option key={idx} value={subcat}>
                    {subcat}
                  </option>
                ))}
            </select>
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) =>
                setNewExpense({ ...newExpense, date: e.target.value })
              }
              required
              className="p-2 border rounded w-1/6"
            />
            <select
              value={newExpense.accountId}
              onChange={(e) =>
                setNewExpense({ ...newExpense, accountId: e.target.value })
              }
              required
              className="p-2 border rounded w-1/6"
            >
              <option value="">Select Account</option>
              {Array.isArray(accounts) && accounts.length > 0 ? (
                accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.name} ({account.type})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Loading accounts...
                </option>
              )}
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700"
          >
            Add Expense
          </button>
        </form>
      )}

      {/* Category Form */}
      {view === "category" && (
        <form className="mb-6" onSubmit={handleAddCategory}>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              className="p-2 border rounded flex-1 min-w-[200px]"
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-700"
            >
              Add Category
            </button>
          </div>
        </form>
      )}

      {/* Subcategory Form */}
      {view === "subcategory" && (
        <form className="mb-6" onSubmit={handleAddSubcategory}>
          <div className="flex space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="New Subcategory"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              required
              className="p-2 border rounded flex-1 min-w-[200px]"
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white p-2 rounded-lg shadow hover:bg-yellow-700"
            >
              Add Subcategory
            </button>
          </div>
        </form>
      )}

      {/* Filter by Account */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold mb-4">Filter by Account</h3>
        <select
          value={selectedAccountFilter}
          onChange={(e) => setSelectedAccountFilter(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="All">All Accounts</option>
          {accounts.map((account) => (
            <option key={account._id} value={account._id}>
              {account.name} ({account.type})
            </option>
          ))}
        </select>
      </div>

      {/* Total Expenses */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Total Expenses {selectedAccountFilter !== "All" && `for ${accounts.find(acc => acc._id === selectedAccountFilter)?.name}`}
        </h3>
        <p className="text-2xl font-bold text-red-600">
          -${filteredTotal.toFixed(2)}
        </p>
      </div>

      {/* Expense Transactions List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Expenses List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {[
                  'Description',
                  'Amount',
                  'Category',
                  'Subcategory',
                  'Account',
                  'Date'
                ].map((header, index) => (
                  <th key={index} className="py-2 px-4 border-b text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id}>
                    {[
                      expense.description,
                      `$${Number(expense.amount).toFixed(2)}`,
                      expense.category?.name || expense.category || 'N/A',
                      expense.subcategory?.name || expense.subcategory || 'N/A',
                      expense.accountId?.name,
                      new Date(expense.date).toLocaleDateString()
                    ].map((cell, index) => (
                      <td key={index} className="py-2 px-4 border-b text-left">{cell}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    <span>No expenses found</span>
                    {selectedAccountFilter !== "All" && " for this account"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Expenses by Category</h3>
        <div className="h-64">
          <Bar data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default Expense;