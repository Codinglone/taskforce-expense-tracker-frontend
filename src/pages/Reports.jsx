import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getIncome, getExpenses } from '../utils/api';

const Reports = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [reportFormat, setReportFormat] = useState('json');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('Current filtered transactions:', filteredTransactions);
  }, [filteredTransactions]);

  const generateReport = async () => {
    setLoading(true);
    setError('');
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        getIncome(),
        getExpenses()
      ]);
  
      console.log('Raw income data:', incomeRes);
      console.log('Raw expense data:', expenseRes);
  
      const incomeTransactions = incomeRes.map(income => ({
        ...income,
        type: 'income',
        category: income.category?.name || income.category || 'N/A',
        subcategory: income.subcategory?.name || income.subcategory || 'N/A',
        account: income.accountId?.name || 'N/A'
      }));
  
      const expenseTransactions = expenseRes.map(expense => ({
        ...expense,
        type: 'expense',
        category: expense.category?.name || expense.category || 'N/A',
        subcategory: expense.subcategory?.name || expense.subcategory || 'N/A',
        account: expense.accountId?.name || 'N/A'
      }));
  
      const allTransactions = [...incomeTransactions, ...expenseTransactions]
        .filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= new Date(startDate) && 
                 transactionDate <= new Date(endDate);
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));
  
      console.log('Processed transactions:', allTransactions);
      setFilteredTransactions(allTransactions);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (filteredTransactions.length === 0) {
      setError('No transactions to download');
      return;
    }

    const report = filteredTransactions.map(transaction => ({
      Description: transaction.description,
      Amount: `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount}`,
      Type: transaction.type,
      Category: transaction.category,
      Subcategory: transaction.subcategory,
      Account: transaction.account,
      Date: new Date(transaction.date).toLocaleDateString(),
    }));

    try {
      if (reportFormat === 'json') {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        saveAs(blob, `transactions_${startDate}_to_${endDate}.json`);
      }
      else if (reportFormat === 'csv') {
        const headers = Object.keys(report[0]).join(',');
        const csv = [
          headers,
          ...report.map(row => Object.values(row).join(','))
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `transactions_${startDate}_to_${endDate}.csv`);
      }
      else if (reportFormat === 'pdf') {
        const doc = new jsPDF();
        doc.autoTable({
          head: [['Description', 'Amount', 'Type', 'Category', 'Subcategory', 'Account', 'Date']],
          body: report.map(row => Object.values(row)),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [41, 128, 185] },
        });
        doc.save(`transactions_${startDate}_to_${endDate}.pdf`);
      }
    } catch (err) {
      setError('Failed to download report. Please try again.');
      console.error('Error:', err);
    }
  };

  const calculateTotals = () => {
    const totals = filteredTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    }, { income: 0, expenses: 0 });

    return {
      ...totals,
      balance: totals.income - totals.expenses
    };
  };

  return (
    <div className="p-4 h-[94vh] overflow-auto w-full bg-gray-100 border-4 border-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Financial Reports</h2>

      {/* Date Range Selection */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-3">Generate Report</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={generateReport}
            disabled={loading}
            className={`${loading
              ? 'bg-gray-500'
              : 'bg-blue-500 hover:bg-blue-700'
              } text-white px-4 py-2 rounded-lg shadow transition duration-200 self-end`}
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>

        {/* Export Options */}
        <div className="flex gap-4">
          <select
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
          <button
            onClick={downloadReport}
            disabled={filteredTransactions.length === 0}
            className={`${filteredTransactions.length === 0
              ? 'bg-gray-500'
              : 'bg-green-500 hover:bg-green-700'
              } text-white px-4 py-2 rounded-lg shadow transition duration-200`}
          >
            Download Report
          </button>
        </div>

        {error && (
          <div className="mt-4 text-red-500 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.entries(calculateTotals()).map(([key, value]) => (
              <div key={key} className="p-4 rounded-lg shadow bg-gray-50">
                <h4 className="text-lg font-semibold capitalize">{key}</h4>
                <p className={`text-xl ${key === 'expenses' ? 'text-red-600' :
                  key === 'income' ? 'text-green-600' :
                    value >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  ${Math.abs(value).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Transactions Table */}
          <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
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
                {filteredTransactions.map((transaction, index) => {
                  console.log('Rendering transaction:', transaction); // Debug log
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{transaction.description}</td>
                      <td className={`py-2 px-4 border-b font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                      </td>
                      <td className="py-2 px-4 border-b capitalize">{transaction.type}</td>
                      <td className="py-2 px-4 border-b">
                        {transaction.category}
                        {transaction.category === 'N/A' &&
                          console.log('Category data:', transaction.category)}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {transaction.subcategory}
                        {transaction.subcategory === 'N/A' &&
                          console.log('Subcategory data:', transaction.subcategory)}
                      </td>
                      <td className="py-2 px-4 border-b">{transaction.account}</td>
                      <td className="py-2 px-4 border-b">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;