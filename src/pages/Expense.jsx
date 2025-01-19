import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { toast } from "react-toastify";
import {
  getExpenses,
  addExpense,
  getCategories,
  addCategory,
  addSubcategory,
} from "../utils/api";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});

  const [view, setView] = useState("expense");
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [totalExpenses, setTotalExpenses] = useState(0);

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    subcategory: "",
    account: "",
    date: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  // Fetch all categories from server
  const fetchAllCategories = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await getCategories();
      const catNames = data.map((cat) => cat.name);
      const subcatMap = {};
      data.forEach((cat) => {
        subcatMap[cat.name] = cat.subcategories || [];
      });
      setCategories(catNames);
      setSubcategories(subcatMap);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };

  const fetchAllExpenses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Error fetching expenses");
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllCategories();
    fetchAllExpenses();
  }, []);

  // Calculate total expenses whenever expenses or selectedAccount changes
  useEffect(() => {
    const filtered =
      selectedAccount === "All"
        ? expenses
        : expenses.filter((expense) => expense.account === selectedAccount);
    const total = filtered.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );
    setTotalExpenses(total);
  }, [selectedAccount, expenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated");
      return;
    }
    try {
      const response = await addExpense(newExpense);
      setExpenses([...expenses, response]);
      setView("expense");
      setNewExpense({
        description: "",
        amount: "",
        category: "",
        subcategory: "",
        account: "",
        date: "",
      });
      toast.success("Expense added successfully!");
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Error adding expense");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated");
      return;
    }
    try {
      await addCategory({ name: newCategory });
      toast.success("Category added successfully!");
      setNewCategory("");
      setView("expense");
      await fetchAllCategories(); // Refresh categories
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not authenticated");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }
    try {
      await addSubcategory({
        category: selectedCategory,
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

  // Filtered expenses based on selectedAccount
  const filteredExpenses =
    selectedAccount === "All"
      ? expenses
      : expenses.filter((expense) => expense.account === selectedAccount);

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
          className={`p-2 rounded-lg shadow ${
            view === "expense"
              ? "bg-blue-700 text-white"
              : "bg-blue-500 text-white hover:bg-blue-700"
          }`}
          onClick={() => setView("expense")}
        >
          Add Expense
        </button>
        <button
          className={`p-2 rounded-lg shadow ${
            view === "category"
              ? "bg-green-700 text-white"
              : "bg-green-500 text-white hover:bg-green-700"
          }`}
          onClick={() => setView("category")}
        >
          Add Category
        </button>
        <button
          className={`p-2 rounded-lg shadow ${
            view === "subcategory"
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
              value={newExpense.account}
              onChange={(e) =>
                setNewExpense({ ...newExpense, account: e.target.value })
              }
              required
              className="p-2 border rounded w-1/6"
            >
              <option value="">Select Account</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="BTC">BTC</option>
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
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Filter by Account
        </h3>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="BTC">BTC</option>
        </select>
      </div>

      {/* Total Expenses */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          Total Expenses for {selectedAccount} Account
        </h3>
        <p className="text-2xl font-bold text-red-600">
          -${totalExpenses.toFixed(2)}
        </p>
      </div>

      {/* Expense Transactions List */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Expense Transactions List
        </h3>
        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Subcategory</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Account</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-4 border-b text-left">
                    {expense.description}
                  </td>
                  <td className="py-2 px-4 border-b text-left text-red-600">
                    -${Number(expense.amount).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {expense.category}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {expense.subcategory}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {expense.account}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expenses Chart */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Expenses Chart</h3>
        <div className="p-4 shadow-lg bg-white rounded-lg">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Expense;