import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { toast } from "react-toastify";
import { addIncome, getIncome, getAccounts } from "../utils/api";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountFilter, setSelectedAccountFilter] = useState("All");
  const [totalIncome, setTotalIncome] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: "",
    accountId: "",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newIncome.accountId) {
        toast.error("Please select an account");
        return;
      }

      const response = await addIncome(newIncome);
      setIncomes([response, ...incomes]);
      setShowTransactionForm(false);
      setNewIncome({
        description: "",
        amount: "",
        accountId: "",
        date: new Date().toISOString().split('T')[0],
      });
      toast.success("Income added successfully!");
      fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Error adding income");
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
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Income</h2>
      
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
              <label className="block text-sm font-medium text-gray-700">Account</label>
              <select
                value={newIncome.accountId}
                onChange={(e) =>
                  setNewIncome({ ...newIncome, accountId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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