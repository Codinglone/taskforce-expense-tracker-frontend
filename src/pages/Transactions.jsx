import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { getIncome, getExpenses } from '../utils/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState("All");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const [incomeData, expensesData] = await Promise.all([
        getIncome(),
        getExpenses()
      ]);

      // Format income transactions
      const incomeTransactions = incomeData.map(income => ({
        description: income.description,
        amount: income.amount,
        type: 'income',
        category: income.category?.name || 'Uncategorized',
        subcategory: income.subcategory?.name || 'None',
        account: income.accountId?.name || 'No Account',
        accountType: income.accountId?.type || 'Unknown',
        date: new Date(income.date).toISOString().split('T')[0]
      }));

      // Format expense transactions
      const expenseTransactions = expensesData.map(expense => ({
        description: expense.description,
        amount: expense.amount,
        type: 'expense',
        category: expense.category?.name || 'Uncategorized',
        subcategory: expense.subcategory?.name || 'None',
        account: expense.accountId?.name || 'No Account',
        accountType: expense.accountId?.type || 'Unknown',
        date: new Date(expense.date).toISOString().split('T')[0]
      }));

      // Combine and sort by date
      const allTransactions = [...incomeTransactions, ...expenseTransactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
    } catch (err) {
      setError('Failed to fetch transactions. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const calculateTotals = () => {
      const filteredTransactions = transactions.filter(transaction => {
        const typeMatch = selectedType === "All" || transaction.type === selectedType;
        return typeMatch;
      });

      const income = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expenses = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      setTotalIncome(income);
      setTotalExpenses(expenses);
      setTotalAmount(income - expenses);
    };

    calculateTotals();
  }, [selectedType, transactions]);

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter(transaction => {
      const typeMatch = selectedType === "All" || transaction.type === selectedType;
      return typeMatch;
    });
  }, [transactions, selectedType]);

  // Chart data
  const chartData = React.useMemo(() => {
    return {
      labels: filteredTransactions.map(t => t.description),
      datasets: [
        {
          label: "Amount",
          data: filteredTransactions.map(t => t.amount),
          backgroundColor: filteredTransactions.map(t => {
            if (t.type === 'income') {
              return 'rgba(75, 192, 192, 0.6)';
            } else {
              return 'rgba(255, 99, 132, 0.6)';
            }
          }),
          borderColor: filteredTransactions.map(t => {
            if (t.type === 'income') {
              return 'rgba(75, 192, 192, 1)';
            } else {
              return 'rgba(255, 99, 132, 1)';
            }
          }),
          borderWidth: 1,
        },
      ],
    };
  }, [filteredTransactions]);

  return (
    <div className="p-4 h-[94vh] overflow-auto w-full bg-gray-100 border-4 border-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Transactions</h2>

      {error && (
        <div className="mb-4 text-red-500 bg-red-100 p-3 rounded">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 shadow-lg bg-white rounded-lg hover:shadow-2xl transition">
          <h3 className="text-xl font-bold text-gray-800">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">+${totalIncome.toFixed(2)}</p>
        </div>
        <div className="p-4 shadow-lg bg-white rounded-lg hover:shadow-2xl transition">
          <h3 className="text-xl font-bold text-gray-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">-${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="p-4 shadow-lg bg-white rounded-lg hover:shadow-2xl transition">
          <h3 className="text-xl font-bold text-gray-800">Balance</h3>
          <p className={`text-2xl font-bold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalAmount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Filters</h3>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Transactions Chart</h3>
        <div className="h-[400px]">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Transactions List</h3>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 border-b text-left">Description</th>
                  <th className="py-2 px-4 border-b text-left">Amount</th>
                  <th className="py-2 px-4 border-b text-left">Type</th>
                  <th className="py-2 px-4 border-b text-left">Category</th>
                  <th className="py-2 px-4 border-b text-left">Subcategory</th>
                  <th className="py-2 px-4 border-b text-left">Account</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{transaction.description}</td>
                    <td className={`py-2 px-4 border-b font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </td>
                    <td className="py-2 px-4 border-b capitalize">{transaction.type}</td>
                    <td className="py-2 px-4 border-b">{transaction.category}</td>
                    <td className="py-2 px-4 border-b">{transaction.subcategory}</td>
                    <td className="py-2 px-4 border-b">
                      {transaction.account} ({transaction.accountType})
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;