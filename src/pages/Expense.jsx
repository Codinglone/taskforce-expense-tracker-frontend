import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { toast } from "react-toastify";
import { addExpense, getExpenses } from "../utils/api";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [view, setView] = useState("expense"); // 'expense', 'category', 'subcategory'
  const [categories, setCategories] = useState(["Food", "Investment"]);
  const [subcategories, setSubcategories] = useState({
    Food: ["Weekly"],
    Investment: ["Crypto"],
  });
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: 0,
    category: "",
    subcategory: "",
    account: "",
    date: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getExpenses(token);
        setExpenses(data);
      } catch (error) {
        toast.error("Error fetching expenses");
      }
    };

    fetchExpenses();
  }, []);

  useEffect(() => {
    const calculateTotalExpenses = () => {
      const filteredExpenses =
        selectedAccount === "All"
          ? expenses
          : expenses.filter((expense) => expense.account === selectedAccount);
      const totalExpenses = filteredExpenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );
      setTotalExpenses(totalExpenses);
    };

    calculateTotalExpenses();
  }, [selectedAccount, expenses]);

  const addTransaction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await addExpense(newExpense, token);
      setExpenses([...expenses, data]);
      setView("expense");
      setNewExpense({
        description: "",
        amount: 0,
        category: "",
        subcategory: "",
        account: "",
        date: "",
      });
      toast.success("Expense added successfully!");
    } catch (error) {
      toast.error("Error adding expense");
    }
  };

  const addCategory = (e) => {
    e.preventDefault();
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setSubcategories({ ...subcategories, [newCategory]: [] });
      setNewCategory("");
      setView("expense");
      toast.success("Category added successfully!");
    } else {
      toast.error("Category already exists or is empty");
    }
  };

  const addSubcategory = (e) => {
    e.preventDefault();
    if (
      newSubcategory &&
      selectedCategory &&
      !subcategories[selectedCategory].includes(newSubcategory)
    ) {
      setSubcategories({
        ...subcategories,
        [selectedCategory]: [
          ...subcategories[selectedCategory],
          newSubcategory,
        ],
      });
      setNewSubcategory("");
      setView("expense");
      toast.success("Subcategory added successfully!");
    } else {
      toast.error(
        "Subcategory already exists, category not selected, or is empty"
      );
    }
  };

  const filteredExpenses =
    selectedAccount === "All"
      ? expenses
      : expenses.filter((expense) => expense.account === selectedAccount);

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
      <div className="mb-4 flex justify-between">
        <button
          className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700"
          onClick={() => setView("expense")}
        >
          New Expense
        </button>
        <button
          className="bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-700"
          onClick={() => setView("category")}
        >
          Add Category
        </button>
        <button
          className="bg-yellow-500 text-white p-2 rounded-lg shadow hover:bg-yellow-700"
          onClick={() => setView("subcategory")}
        >
          Add Subcategory
        </button>
      </div>
      {view === "expense" && (
        <form className="mb-4" onSubmit={addTransaction}>
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) =>
              setNewExpense({ ...newExpense, description: e.target.value })
            }
            className="p-2 border rounded mr-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense({ ...newExpense, amount: e.target.value })
            }
            className="p-2 border rounded mr-2 w-[13.74%]"
          />
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense({ ...newExpense, category: e.target.value })
            }
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={newExpense.subcategory}
            onChange={(e) =>
              setNewExpense({ ...newExpense, subcategory: e.target.value })
            }
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Subcategory</option>
            {newExpense.category &&
              subcategories[newExpense.category].map((subcategory, index) => (
                <option key={index} value={subcategory}>
                  {subcategory}
                </option>
              ))}
          </select>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) =>
              setNewExpense({ ...newExpense, date: e.target.value })
            }
            className="p-2 border rounded mr-2"
          />
          <select
            value={newExpense.account}
            onChange={(e) =>
              setNewExpense({ ...newExpense, account: e.target.value })
            }
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Account</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="BTC">BTC</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700 mr-2 mt-2"
          >
            Add Expense
          </button>
        </form>
      )}
      {view === "category" && (
        <form className="mb-4" onSubmit={addCategory}>
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-700"
          >
            Add Category
          </button>
        </form>
      )}
      {view === "subcategory" && (
        <form className="mb-4" onSubmit={addSubcategory}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New Subcategory"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button
            type="submit"
            className="bg-yellow-500 text-white p-2 rounded-lg shadow hover:bg-yellow-700"
          >
            Add Subcategory
          </button>
        </form>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Filter by Account</h3>
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
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Total Expenses for {selectedAccount} Account
        </h3>
        <p className="text-2xl font-bold text-red-600">-${totalExpenses}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
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
              {filteredExpenses.map((expense, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-left">
                    {expense.description}
                  </td>
                  <td className="py-2 px-4 border-b text-left text-red-600">
                    -${expense.amount}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {expense.category}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {expense.subcategory}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {expense.date}
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
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Expenses Chart</h3>
        <div className="p-4 shadow-lg bg-white rounded-lg">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Expense;
