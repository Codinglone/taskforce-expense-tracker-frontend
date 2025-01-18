import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Expense = () => {
  const [transactions, setTransactions] = useState([
    { description: 'Groceries', amount: 200, type: 'expense', category: 'Food', subcategory: 'Weekly', account: 'Mobile Money', date: '2023-01-05' },
    { description: 'Bitcoin Purchase', amount: 500, type: 'expense', category: 'Investment', subcategory: 'Crypto', account: 'BTC', date: '2023-01-10' },
  ]);
  const [categories, setCategories] = useState(['Food', 'Investment']);
  const [subcategories, setSubcategories] = useState(['Weekly', 'Crypto']);
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: 0, category: '', subcategory: '', account: '', date: '' });

  useEffect(() => {
    const calculateTotalExpenses = () => {
      const filteredTransactions = selectedAccount === 'All' ? transactions : transactions.filter(transaction => transaction.account === selectedAccount);
      const totalExpenses = filteredTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);
      setTotalExpenses(totalExpenses);
    };

    calculateTotalExpenses();
  }, [selectedAccount, transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    setTransactions([...transactions, { ...newTransaction, type: 'expense' }]);
    setShowTransactionForm(false);
    setNewTransaction({ description: '', amount: 0, category: '', subcategory: '', account: '', date: '' });
  };

  const filteredTransactions = selectedAccount === 'All' ? transactions : transactions.filter(transaction => transaction.account === selectedAccount);

  const chartData = {
    labels: filteredTransactions.map(transaction => transaction.description),
    datasets: [
      {
        label: 'Amount',
        data: filteredTransactions.map(transaction => transaction.amount),
        backgroundColor: filteredTransactions.map(transaction => {
          switch (transaction.account) {
            case 'Mobile Money':
              return 'rgba(255, 206, 86, 0.6)';
            case 'BTC':
              return 'rgba(153, 102, 255, 0.6)';
            default:
              return 'rgba(255, 99, 132, 0.6)';
          }
        }),
        borderColor: filteredTransactions.map(transaction => {
          switch (transaction.account) {
            case 'Mobile Money':
              return 'rgba(255, 206, 86, 1)';
            case 'BTC':
              return 'rgba(153, 102, 255, 1)';
            default:
              return 'rgba(255, 99, 132, 1)';
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 h-[94vh] overflow-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Expenses</h2>
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700"
          onClick={() => setShowTransactionForm(!showTransactionForm)}
        >
          Add Expense
        </button>
      </div>
      {showTransactionForm && (
        <form className="mb-4" onSubmit={addTransaction}>
          <input
            type="text"
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <select
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={newTransaction.subcategory}
            onChange={(e) => setNewTransaction({ ...newTransaction, subcategory: e.target.value })}
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>{subcategory}</option>
            ))}
          </select>
          <input
            type="date"
            value={newTransaction.date}
            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
            className="p-2 border rounded mr-2"
          />
          <select
            value={newTransaction.account}
            onChange={(e) => setNewTransaction({ ...newTransaction, account: e.target.value })}
            className="p-2 border rounded mr-2"
          >
            <option value="">Select Account</option>
            <option value="Mobile Money">Mobile Money</option>
            <option value="BTC">BTC</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700">
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
          <option value="Mobile Money">Mobile Money</option>
          <option value="BTC">BTC</option>
        </select>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Total Expenses for {selectedAccount} Account</h3>
        <p className="text-2xl font-bold text-red-600">-${totalExpenses}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Expense Transactions List</h3>
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
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b text-left">{transaction.description}</td>
                  <td className="py-2 px-4 border-b text-left text-red-600">-${transaction.amount}</td>
                  <td className="py-2 px-4 border-b text-left">{transaction.category}</td>
                  <td className="py-2 px-4 border-b text-left">{transaction.subcategory}</td>
                  <td className="py-2 px-4 border-b text-left">{transaction.date}</td>
                  <td className="py-2 px-4 border-b text-left">{transaction.account}</td>
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