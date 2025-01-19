import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  addAccount,
  getBudgets,
  getAccounts,
  createBudget,
} from "../utils/api";

const Budget = () => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // Form States
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

  useEffect(() => {
    fetchAccounts();
    fetchBudgets();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAccounts();
      console.log("Raw API response:", response);

      // Check if response has data property
      const accountsData = response.data || response;
      console.log("Accounts data to be set:", accountsData);

      setAccounts(Array.isArray(accountsData) ? accountsData : []);

      // Verify state update
      console.log("Accounts state after update:", accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError("Failed to fetch accounts");
      toast.error("Failed to fetch accounts");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await getBudgets();
      console.log("Raw budgets response:", response);
      const budgetsData = response.data || response;
      console.log("Budgets data to set:", budgetsData);
      setBudgets(Array.isArray(budgetsData) ? budgetsData : []);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to fetch budgets");
      setBudgets([]);
    }
  };

  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAccount(newAccount);
      toast.success("Account added successfully");
      fetchAccounts();
      setNewAccount({ name: "", type: "bank", description: "" });
    } catch (error) {
      toast.error("Failed to add account");
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBudget(newBudget);
      toast.success("Budget created successfully");
      fetchBudgets();
      setNewBudget({
        amount: "",
        accountId: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        alertThreshold: 80,
        period: "monthly",
      });
    } catch (error) {
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

      {/* Accounts List */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Accounts</h3>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading accounts...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-600">{error}</div>
          ) : accounts?.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {account.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          account.type === "bank"
                            ? "bg-blue-100 text-blue-800"
                            : account.type === "mobile_money"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {account.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{account.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4">No accounts found</div>
          )}
        </div>
      </div>

      {/* Budget Creation Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Create New Budget
        </h3>
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              value={newBudget.accountId}
              onChange={(e) =>
                setNewBudget({ ...newBudget, accountId: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            >
              <option value="">Select Account</option>
              {accounts?.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.name} ({account.type})
                </option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Start Date"
              value={newBudget.startDate}
              onChange={(e) =>
                setNewBudget({ ...newBudget, startDate: e.target.value })
              }
              className="p-2 border rounded-md"
              required
            />
            <input
              type="date"
              placeholder="End Date"
              value={newBudget.endDate}
              onChange={(e) =>
                setNewBudget({ ...newBudget, endDate: e.target.value })
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
              type="number"
              placeholder="Alert Threshold (%)"
              value={newBudget.alertThreshold}
              onChange={(e) =>
                setNewBudget({ ...newBudget, alertThreshold: e.target.value })
              }
              className="p-2 border rounded-md"
              min="1"
              max="100"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Create Budget
          </button>
        </form>
      </div>

      {budgets?.length > 0 ? (
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
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
            {budgets.map((budget, index) => (
              <tr key={budget._id || index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {budget.accountId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${parseFloat(budget.amount).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{budget.period}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(budget.startDate).toLocaleDateString()} -
                  {new Date(budget.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      budget.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {budget.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-4">No budgets found</div>
      )}
    </div>
  );
};

export default Budget;
