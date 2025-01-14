import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [transactions, setTransactions] = useState([
    { description: 'Salary', amount: 1000, type: 'income', category: 'Salary', subcategory: 'Monthly', account: 'VISA', date: '2023-01-01' },
    { description: 'Groceries', amount: 200, type: 'expense', category: 'Food', subcategory: 'Weekly', account: 'Mobile Money', date: '2023-01-05' },
    { description: 'Bitcoin Purchase', amount: 500, type: 'expense', category: 'Investment', subcategory: 'Crypto', account: 'BTC', date: '2023-01-10' },
    { description: 'Freelance Work', amount: 300, type: 'income', category: 'Freelance', subcategory: 'Project', account: 'BTC', date: '2023-01-15' },
    { description: 'Rent', amount: 800, type: 'expense', category: 'Housing', subcategory: 'Monthly', account: 'VISA', date: '2023-01-20' },
    { description: 'Electricity Bill', amount: 100, type: 'expense', category: 'Utilities', subcategory: 'Monthly', account: 'Mobile Money', date: '2023-01-25' },
    { description: 'Stock Dividend', amount: 150, type: 'income', category: 'Investment', subcategory: 'Stocks', account: 'BTC', date: '2023-01-30' },
    { description: 'Internet Bill', amount: 50, type: 'expense', category: 'Utilities', subcategory: 'Monthly', account: 'Mobile Money', date: '2023-02-01' },
    { description: 'Gym Membership', amount: 60, type: 'expense', category: 'Health', subcategory: 'Monthly', account: 'VISA', date: '2023-02-05' },
    { description: 'Book Purchase', amount: 30, type: 'expense', category: 'Education', subcategory: 'Books', account: 'BTC', date: '2023-02-10' },
    { description: 'Consulting Fee', amount: 400, type: 'income', category: 'Freelance', subcategory: 'Consulting', account: 'BTC', date: '2023-02-15' },
  ]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [reportFormat, setReportFormat] = useState('json');

  useEffect(() => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    setFilteredTransactions(sortedTransactions.slice(0, 10));
  }, [transactions]);

  const generateReport = () => {
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
    });
    setFilteredTransactions(filtered);
  };

  const downloadReport = () => {
    const report = filteredTransactions.map(transaction => ({
      Description: transaction.description,
      Amount: transaction.amount,
      Type: transaction.type,
      Category: transaction.category,
      Subcategory: transaction.subcategory,
      Account: transaction.account,
      Date: transaction.date,
    }));

    if (reportFormat === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      saveAs(blob, 'report.json');
    } else if (reportFormat === 'csv') {
      const csv = report.map(row => Object.values(row).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      saveAs(blob, 'report.csv');
    } else if (reportFormat === 'pdf') {
      const doc = new jsPDF();
      doc.autoTable({
        head: [['Description', 'Amount', 'Type', 'Category', 'Subcategory', 'Account', 'Date']],
        body: report.map(row => Object.values(row)),
      });
      doc.save('report.pdf');
    }
  };

  return (
    <div className="p-4 h-[94vh] overflow-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Reports</h2>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800">Generate Report</h3>
        <div className="flex mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={generateReport}
            className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700"
          >
            Generate
          </button>
        </div>
        <div className="flex mb-4">
          <select
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value)}
            className="p-2 border rounded mr-2"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
          <button
            onClick={downloadReport}
            className="bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-700"
          >
            Download Report
          </button>
        </div>
      </div>
      {filteredTransactions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800">Filtered Transactions</h3>
          <div className="overflow-auto">
            <table className="min-w-full bg-white">
              <thead>
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
                  <tr key={index}>
                    <td className="py-2 px-4 border-b text-left">{transaction.description}</td>
                    <td className={`py-2 px-4 border-b text-left ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                    </td>
                    <td className="py-2 px-4 border-b text-left">{transaction.type}</td>
                    <td className="py-2 px-4 border-b text-left">{transaction.category}</td>
                    <td className="py-2 px-4 border-b text-left">{transaction.subcategory}</td>
                    <td className="py-2 px-4 border-b text-left">{transaction.account}</td>
                    <td className="py-2 px-4 border-b text-left">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;