import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { toast } from "react-toastify";
import { addIncome, getIncome, getAccounts, getIncomeCategories } from "../utils/api";
import axiosInstance from "../utils/api";
const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState("All");
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: "",
    accountId: "",
    category: "",
    subcategory: "",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
    fetchIncomeCategories();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomesData, accountsData] = await Promise.all([
        getIncome(),
        getAccounts()
      ]);
      setIncomes(incomesData);
      setAccounts(accountsData.data || accountsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomeCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncomeCategories();
      if (Array.isArray(data)) {
        setIncomeCategories(data);
      } else {
        console.error("Unexpected income categories data format:", data);
        setError("Failed to load income categories");
        toast.error("Error loading income categories");
      }
    } catch (error) {
      console.error("Error fetching income categories:", error);
      setError("Failed to load income categories");
      toast.error("Error fetching income categories");
    } finally {
      setLoading(false);
    }
  };

  // Filter incomes based on selected account
  const filteredIncomes = incomes.filter(income => {
    if (selectedAccountFilter === "All") return true;
    return income.accountId?._id === selectedAccountFilter;
  });

  // Calculate total for filtered incomes
  const filteredTotal = filteredIncomes.reduce(
    (sum, income) => sum + Number(income.amount),
    0
  );

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/income-categories', {
        name: newCategory,
        subcategories: []
      });
      setIncomeCategories([...incomeCategories, response.data]);
      setNewCategory("");
      setShowCategoryModal(false);
      toast.success("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error("Please select a category first");
      return;
    }

    try {
      const category = incomeCategories.find(cat => cat._id === selectedCategory);
      const updatedSubcategories = [...category.subcategories, { name: newSubcategory }];

      const response = await axiosInstance.put(`/income-categories/${selectedCategory}`, {
        subcategories: updatedSubcategories
      });

      setIncomeCategories(incomeCategories.map(cat =>
        cat._id === selectedCategory ? response.data : cat
      ));

      setNewSubcategory("");
      setShowSubcategoryModal(false);
      toast.success("Subcategory added successfully!");
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Error adding subcategory");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newIncome.accountId) {
        toast.error("Please select an account");
        return;
      }
      if (!newIncome.category) {
        toast.error("Please select a category");
        return;
      }
      if (!newIncome.subcategory) {
        toast.error("Please select a subcategory");
        return;
      }

      // Log the data being sent
      const incomeData = {
        description: newIncome.description,
        amount: Number(newIncome.amount),
        accountId: newIncome.accountId,
        category: newIncome.category,
        subcategory: newIncome.subcategory,
        date: newIncome.date
      };

      console.log("Sending income data:", incomeData);

      const response = await addIncome(incomeData);
      console.log("Server response:", response);

      setIncomes([response, ...incomes]);
      setShowTransactionForm(false);
      setNewIncome({
        description: "",
        amount: "",
        accountId: "",
        category: "",
        subcategory: "",
        date: new Date().toISOString().split('T')[0],
      });
      toast.success("Income added successfully!");
      fetchData();
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(error.response?.data?.message || "Error adding income");
    }
  };

  const chartData = {
    labels: filteredIncomes.map((income) => income.description),
    datasets: [
      {
        label: "Amount",
        data: filteredIncomes.map((income) => income.amount),
        backgroundColor: filteredIncomes.map((income) => {
          switch (income.accountId?.type) {
            case "bank":
              return "rgba(54, 162, 235, 0.6)";
            case "mobile_money":
              return "rgba(153, 102, 255, 0.6)";
            case "cash":
              return "rgba(75, 192, 192, 0.6)";
            default:
              return "rgba(75, 192, 192, 0.6)";
          }
        }),
        borderColor: filteredIncomes.map((income) => {
          switch (income.accountId?.type) {
            case "bank":
              return "rgba(54, 162, 235, 1)";
            case "mobile_money":
              return "rgba(153, 102, 255, 1)";
            case "cash":
              return "rgba(75, 192, 192, 1)";
            default:
              return "rgba(75, 192, 192, 1)";
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 h-[94vh] overflow-auto w-full bg-gray-100 border-4 border-white shadow-xl rounded-2xl">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Income</h2>
      {/* Category Management Buttons */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setShowCategoryModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Category
        </button>
        <button
          onClick={() => setShowSubcategoryModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Add Subcategory
        </button>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add New Category</h3>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category Name"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Add New Subcategory</h3>
            <form onSubmit={handleAddSubcategory}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                required
              >
                <option value="">Select Category</option>
                {incomeCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                placeholder="Subcategory Name"
                className="w-full p-2 border rounded mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowSubcategoryModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button
          className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700"
          onClick={() => setShowTransactionForm(!showTransactionForm)}
        >
          Add Income
        </button>
      </div>

      {showTransactionForm && (
        <form className="mb-4 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                placeholder="Description"
                value={newIncome.description}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, description: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                placeholder="Amount"
                value={newIncome.amount}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, amount: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={newIncome.category || ""}
                onChange={(e) => {
                  setNewIncome({
                    ...newIncome,
                    category: e.target.value,
                    subcategory: ""
                  });
                }}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              >
                <option value="">Select Category</option>
                {incomeCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subcategory</label>
              <select
                value={newIncome.subcategory || ""}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, subcategory: e.target.value })
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                disabled={!newIncome.category}
              >
                <option value="">Select Subcategory</option>
                {newIncome.category && incomeCategories
                  .find(cat => cat._id === newIncome.category)
                  ?.subcategories.map((subcat) => (
                    <option key={subcat._id} value={subcat._id}>
                      {subcat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account</label>
              <select
                value={newIncome.accountId || ""}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, accountId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                required
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.name} ({account.type})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={newIncome.date}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, date: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </form>
      )}

      {/* Account Filter */}
      <div className="mb-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800">Filter by Account</h3>
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

      <div className="mb-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800">
          Total Income {selectedAccountFilter !== "All" && `for ${accounts.find(acc => acc._id === selectedAccountFilter)?.name}`}
        </h3>
        <p className="text-2xl font-bold text-green-600">
          +${filteredTotal.toFixed(2)}
        </p>
      </div>

      <div className="mb-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800">
          Income Transactions List
        </h3>
        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Date</th>
                <th className="py-2 px-4 border-b text-left">Account</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomes.length > 0 ? (
                filteredIncomes.map((income, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-left">
                      {income.description}
                    </td>
                    <td className="py-2 px-4 border-b text-left text-green-600">
                      +${Number(income.amount).toFixed(2)}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {new Date(income.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {income.accountId?.name} ({income.accountId?.type})
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">
                    No income found {selectedAccountFilter !== "All" && "for this account"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800">Income Chart</h3>
        <div className="p-4 shadow-lg bg-white rounded-lg">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Income;