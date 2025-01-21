import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getIncome, getExpenses } from '../utils/api';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [incomeData, expensesData] = await Promise.all([
        getIncome(),
        getExpenses()
      ]);

      // Calculate totals
      const totalInc = incomeData.reduce((sum, inc) => sum + parseFloat(inc.amount), 0);
      const totalExp = expensesData.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

      setTotalIncome(totalInc);
      setTotalExpenses(totalExp);
      setTotalBalance(totalInc - totalExp);

      // Format transactions for the chart
      const monthlyData = getMonthlyData(incomeData, expensesData);
      setTransactions(monthlyData);

      // Get latest 5 transactions
      const formattedIncome = incomeData.map(inc => ({
        description: inc.description,
        amount: inc.amount,
        type: 'income',
        date: new Date(inc.date)
      }));

      const formattedExpenses = expensesData.map(exp => ({
        description: exp.description,
        amount: exp.amount,
        type: 'expense',
        date: new Date(exp.date)
      }));

      const latest = [...formattedIncome, ...formattedExpenses]
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

      setLatestTransactions(latest);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyData = (incomeData, expensesData) => {
    const months = {};

    // Process income
    incomeData.forEach(inc => {
      const date = new Date(inc.date);
      const monthKey = date.toLocaleString('default', { month: 'long' });
      if (!months[monthKey]) {
        months[monthKey] = { name: monthKey, income: 0, expense: 0, amt: 0 };
      }
      months[monthKey].income += parseFloat(inc.amount);
      months[monthKey].amt += parseFloat(inc.amount);
    });

    // Process expenses
    expensesData.forEach(exp => {
      const date = new Date(exp.date);
      const monthKey = date.toLocaleString('default', { month: 'long' });
      if (!months[monthKey]) {
        months[monthKey] = { name: monthKey, income: 0, expense: 0, amt: 0 };
      }
      months[monthKey].expense += parseFloat(exp.amount);
      months[monthKey].amt -= parseFloat(exp.amount);
    });

    return Object.values(months).sort((a, b) => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      return months.indexOf(a.name) - months.indexOf(b.name);
    });
  };

  return (
    <div className="p-4 w-full h-[94vh] bg-gray-100 border-4 border-white shadow-xl rounded-2xl">
      <div className="flex">
        <h2 className="text-2xl font-bold text-gray-800">All Transactions</h2>
      </div>
      <div className="flex w-full justify-between my-4">
        <div className="w-1/2 p-4 shadow-lg w-[22%] bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800">Total Income</h3>
          <p className="text-2xl font-bold text-blue-600">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="w-1/2 p-4 shadow-lg w-[22%] bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="w-1/2 p-4 shadow-lg w-[22%] bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800">Total Balance</h3>
          <p className="text-2xl font-bold text-green-600">${totalBalance.toFixed(2)}</p>
        </div>

      </div>
      <div className="flex w-full justify-between">
        <div className="flex w-[48%] h-96 flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Transactions Summary
          </h2>
          <ResponsiveContainer
            width="100%"
            height="80%"
            className="shadow-xl rounded-lg bg-white"
          >
            <LineChart
              width={500}
              height={300}
              data={transactions}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="green"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="expense" stroke="red" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-[48%] h-96 flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Transactions History
          </h2>
          {latestTransactions.map((transaction, index) => (
            <p key={index} className="flex justify-between rounded-full bg-gray-50 border-4 border-white px-4 py-2 shadow-xl mb-4 hover:bg-gray-100 hover:cursor-pointer">
              <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.description}
              </span>
              <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;