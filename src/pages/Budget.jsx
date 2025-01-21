import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  addAccount,
  getBudgets,
  getAccounts,
  createBudget,
} from "../utils/api";
import BudgetProgress from "../components/BudgetProgress";

const Budget = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { addNotification } = useContext(AuthContext);

  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "bank",
    description: "",
  });

  const [newBudget, setNewBudget] = useState({
    amount: "",
    accountId: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    alertThreshold: 80,
    period: "monthly",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accountsResponse, budgetsResponse] = await Promise.all([
        getAccounts(),
        getBudgets()
      ]);

      setAccounts(accountsResponse.data || []);
      setBudgets(budgetsResponse || []);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAccount(newAccount);
      toast.success("Account added successfully");
      const accountsResponse = await getAccounts();
      setAccounts(accountsResponse.data || []);
      setNewAccount({ name: "", type: "bank", description: "" });
    } catch (error) {
      console.error("Account creation error:", error);
      toast.error("Failed to add account");
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newBudget.accountId) {
        toast.error("Please select an account");
        return;
      }
      if (!newBudget.amount || newBudget.amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }
      if (!newBudget.startDate || !newBudget.endDate) {
        toast.error("Please select start and end dates");
        return;
      }

      await createBudget(newBudget);
      toast.success("Budget created successfully");

      // Fetch updated budgets
      const budgetsResponse = await getBudgets();
      setBudgets(budgetsResponse || []);

      setNewBudget({
        amount: "",
        accountId: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        alertThreshold: 80,
        period: "monthly",
      });
    } catch (error) {
      console.error("Budget creation error:", error);
      toast.error("Failed to create budget");
    }
  };

  return (
    <div className="p-4 h-[94vh] overflow-auto w-full bg-gray-100 border-4 border-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Budget Management
      </h2>

      {/* Account Management Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Add New Account
        </h3>
        <form onSubmit={handleAccountSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Account Name"
              value={newAccount.name}
              onChange={(e) =>
                setNewAccount({ ...newAccount, name: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            />
            <select
              value={newAccount.type}
              onChange={(e) =>
                setNewAccount({ ...newAccount, type: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            >
              <option value="bank">Bank Account</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cash">Cash</option>
            </select>
            <input
              type="text"
              placeholder="Description"
              value={newAccount.description}
              onChange={(e) =>
                setNewAccount({ ...newAccount, description: e.target.value })
              }
              className="p-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Account
          </button>
        </form>
      </div>

      {/* Budget Creation Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Budget</h3>
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              value={newBudget.accountId}
              onChange={(e) =>
                setNewBudget({ ...newBudget, accountId: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Budget Amount"
              value={newBudget.amount}
              onChange={(e) =>
                setNewBudget({ ...newBudget, amount: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            />

            <select
              value={newBudget.period}
              onChange={(e) =>
                setNewBudget({ ...newBudget, period: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <input
              type="date"
              value={newBudget.startDate}
              onChange={(e) =>
                setNewBudget({ ...newBudget, startDate: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            />

            <input
              type="date"
              value={newBudget.endDate}
              onChange={(e) =>
                setNewBudget({ ...newBudget, endDate: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            />

            <input
              type="number"
              placeholder="Alert Threshold (%)"
              value={newBudget.alertThreshold}
              onChange={(e) =>
                setNewBudget({
                  ...newBudget,
                  alertThreshold: Math.min(100, Math.max(1, e.target.value)),
                })
              }
              min="1"
              max="100"
              className="p-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Create Budget
          </button>
        </form>
      </div>

      {/* Budgets List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Budgets</h3>
        {loading ? (
          <div className="text-center py-4">Loading budgets...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : budgets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgets.map((budget) => (
                  <tr key={budget._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {budget.accountId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 w-64">
                      <BudgetProgress budget={budget} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">
                      {budget.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(budget.startDate).toLocaleDateString()} -
                      {new Date(budget.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${budget.status === "active"
                            ? "bg-green-100 text-green-800"
                            : budget.status === "exceeded"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {budget.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4">No budgets found</div>
        )}
      </div>
    </div>
  );
};

export default Budget;