import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      description: "Salary",
      amount: 1000,
      type: "income",
      category: "Salary",
      subcategory: "Monthly",
      account: "VISA",
    },
    {
      description: "Groceries",
      amount: 200,
      type: "expense",
      category: "Food",
      subcategory: "Weekly",
      account: "Mobile Money",
    },
    {
      description: "Bitcoin Purchase",
      amount: 500,
      type: "expense",
      category: "Investment",
      subcategory: "Crypto",
      account: "BTC",
    },
    {
      description: "Freelance Work",
      amount: 300,
      type: "income",
      category: "Freelance",
      subcategory: "Project",
      account: "BTC",
    },
  ]);
  const [budget, setBudget] = useState(1500);
  const [totalExpenses, setTotalExpenses] = useState(700);
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const calculateTotals = () => {
      const filteredTransactions =
        selectedAccount === "All"
          ? transactions
          : transactions.filter(
              (transaction) => transaction.account === selectedAccount
            );
      const totalIncome = filteredTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
      const totalExpenses = filteredTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
      setTotalIncome(totalIncome);
      setTotalExpenses(totalExpenses);
      setTotalAmount(totalIncome - totalExpenses);
    };

    calculateTotals();
  }, [selectedAccount, transactions]);

  const filteredTransactions =
    selectedAccount === "All"
      ? transactions
      : transactions.filter(
          (transaction) => transaction.account === selectedAccount
        );

  const chartData = {
    labels: filteredTransactions.map((transaction) => transaction.description),
    datasets: [
      {
        label: "Amount",
        data: filteredTransactions.map((transaction) => transaction.amount),
        backgroundColor: filteredTransactions.map((transaction) => {
          switch (transaction.account) {
            case "VISA":
              return "rgba(54, 162, 235, 0.6)";
            case "Mobile Money":
              return "rgba(255, 206, 86, 0.6)";
            case "BTC":
              return "rgba(153, 102, 255, 0.6)";
            default:
              return "rgba(75, 192, 192, 0.6)";
          }
        }),
        borderColor: filteredTransactions.map((transaction) => {
          switch (transaction.account) {
            case "VISA":
              return "rgba(54, 162, 235, 1)";
            case "Mobile Money":
              return "rgba(255, 206, 86, 1)";
            case "BTC":
              return "rgba(153, 102, 255, 1)";
            default:
              return "rgba(75, 192, 192, 1)";
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 h-[94vh] overflow-auto w-full bg-gray-100 border-4 border-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h2>
      <div className="flex justify-between mb-4">
        <div className="w-1/2 p-4 shadow-lg bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer mr-4">
          <h3 className="text-xl font-bold text-gray-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">${totalExpenses}</p>
        </div>
        <div className="w-1/2 p-4 shadow-lg bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800">Budget</h3>
          <p className="text-2xl font-bold text-blue-600">${budget}</p>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Filter by Account</h3>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="All">All</option>
          <option value="Mobile Money">Mobile Money</option>
          <option value="VISA">VISA</option>
          <option value="BTC">BTC</option>
        </select>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Total Income for {selectedAccount} Account
        </h3>
        <p className="text-2xl font-bold text-green-600">+${totalIncome}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Total Expenses for {selectedAccount} Account
        </h3>
        <p className="text-2xl font-bold text-red-600">-${totalExpenses}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Transactions List</h3>
        <div className="overflow-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Description</th>
                <th className="py-2 px-4 border-b text-left">Amount</th>
                <th className="py-2 px-4 border-b text-left">Category</th>
                <th className="py-2 px-4 border-b text-left">Subcategory</th>
                <th className="py-2 px-4 border-b text-left">Account</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-left">
                    {transaction.description}
                  </td>
                  <td
                    className={`py-2 px-4 border-b text-left ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {transaction.amount}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {transaction.category}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {transaction.subcategory}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {transaction.account}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {transaction.type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Transactions Chart</h3>
        <div className="p-4 shadow-lg bg-white rounded-lg">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
