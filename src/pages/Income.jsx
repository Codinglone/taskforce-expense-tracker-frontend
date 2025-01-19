import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { toast } from "react-toastify";
import { addIncome, getIncome } from "../utils/api";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [totalIncome, setTotalIncome] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [newIncome, setNewIncome] = useState({
    description: "",
    amount: 0,
    account: "",
    date: "",
  });

  useEffect(() => {
    const fetchIncome = async () => {
      const token = localStorage.getItem("token");
      try {
        const data = await getIncome(token);
        setIncomes(data);
      } catch (error) {
        toast.error("Error fetching income");
      }
    };

    fetchIncome();
  }, []);

  useEffect(() => {
    const calculateTotalIncome = () => {
      const filteredIncomes =
        selectedAccount === "All"
          ? incomes
          : incomes.filter((income) => income.account === selectedAccount);
      const totalIncome = filteredIncomes.reduce(
        (sum, income) => sum + parseFloat(income.amount),
        0
      );
      setTotalIncome(totalIncome);
    };

    calculateTotalIncome();
  }, [selectedAccount, incomes]);

  const addTransaction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const data = await addIncome(newIncome, token);
      setIncomes([...incomes, data]);
      setShowTransactionForm(false);
      setNewIncome({
        description: "",
        amount: 0,
        account: "",
        date: "",
      });
      toast.success("Income added successfully!");
    } catch (error) {
      toast.error("Error adding income");
    }
  };

  const filteredIncomes =
    selectedAccount === "All"
      ? incomes
      : incomes.filter((income) => income.account === selectedAccount);

  const chartData = {
    labels: filteredIncomes.map((income) => income.description),
    datasets: [
      {
        label: "Amount",
        data: filteredIncomes.map((income) => income.amount),
        backgroundColor: filteredIncomes.map((income) => {
          switch (income.account) {
            case "VISA":
              return "rgba(54, 162, 235, 0.6)";
            case "BTC":
              return "rgba(153, 102, 255, 0.6)";
            default:
              return "rgba(75, 192, 192, 0.6)";
          }
        }),
        borderColor: filteredIncomes.map((income) => {
          switch (income.account) {
            case "VISA":
              return "rgba(54, 162, 235, 1)";
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
        <form className="mb-4" onSubmit={addTransaction}>
          <input
            type="text"
            placeholder="Description"
            value={newIncome.description}
            onChange={(e) =>
              setNewIncome({ ...newIncome, description: e.target.value })
            }
            className="p-2 border rounded mr-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newIncome.amount}
            onChange={(e) =>
              setNewIncome({ ...newIncome, amount: e.target.value })
            }
            className="p-2 border rounded mr-2"
          />
          <input
            type="date"
            value={newIncome.date}
            onChange={(e) =>
              setNewIncome({ ...newIncome, date: e.target.value })
            }
            className="p-2 border rounded mr-2"
          />
          <select
            value={newIncome.account}
            onChange={(e) =>
              setNewIncome({ ...newIncome, account: e.target.value })
            }
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Account</option>
            <option value="VISA">VISA</option>
            <option value="BTC">BTC</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700"
          >
            Add
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
              {filteredIncomes.map((income, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-left">
                    {income.description}
                  </td>
                  <td className="py-2 px-4 border-b text-left text-green-600">
                    +${income.amount}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {income.date}
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {income.account}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Income Chart</h3>
        <div className="p-4 shadow-lg bg-white rounded-lg">
          <Bar data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Income;
