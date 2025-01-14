import React from "react";
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

const data = [
  {
    name: "January",
    income: 4000,
    expense: 2400,
    amt: 2400,
  },
  {
    name: "February",
    income: 3000,
    expense: 1398,
    amt: 2210,
  },
  {
    name: "March",
    income: 2000,
    expense: 9800,
    amt: 2290,
  },
  {
    name: "April",
    income: 2780,
    expense: 3908,
    amt: 2000,
  },
  {
    name: "May",
    income: 1890,
    expense: 4800,
    amt: 2181,
  },
  {
    name: "June",
    income: 2390,
    expense: 3800,
    amt: 2500,
  },
  {
    name: "July",
    income: 3490,
    expense: 4300,
    amt: 2100,
  },
];

const Dashboard = () => {
  return (
    <div className="p-4">
      <div className="flex">
        <h2 className="text-2xl font-bold text-gray-800">All Transactions</h2>
      </div>
      <div className="flex w-full justify-between my-4">
        <div className="w-1/2 p-4 shadow-lg w-[22%] bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800">Total Income</h3>
          <p className="text-2xl font-bold text-blue-600">$1,000.00</p>
        </div>
        <div className="w-1/2 p-4 shadow-lg w-[22%] bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">$500.00</p>
        </div>
        <div className="w-1/2 p-4 shadow-lg w-[22%] bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800">Total Balance</h3>
          <p className="text-2xl font-bold text-green-600">$500.00</p>
        </div>
        <div className="w-1/2 p-4 shadow-lg w-[22%] bg-white rounded-lg hover:shadow-2xl hover:transition hover:cursor-pointer">
          <h3 className="text-xl font-bold text-gray-800">Remaining Budget</h3>
          <p className="text-2xl font-bold text-blue-900">$500.00</p>
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
              data={data}
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
          <p className="flex justify-between rounded-full bg-gray-50 border-4 border-white px-4 py-2 shadow-xl mb-4 hover:bg-gray-100 hover:cursor-pointer">
            <span className="text-red-600 font-medium">Rent</span>
            <span className="text-red-600 font-medium">-$1000</span>
          </p>
          <p className="flex justify-between rounded-full bg-gray-50 border-4 border-white px-4 py-2 shadow-xl mb-4  hover:bg-gray-100 hover:cursor-pointer">
            <span className="text-green-600 font-medium">Salary</span>
            <span className="text-green-600 font-medium">+$12000</span>
          </p>
          <p className="flex justify-between rounded-full bg-gray-50 border-4 border-white px-4 py-2 shadow-xl mb-4  hover:bg-gray-100 hover:cursor-pointer">
            <span className="text-red-600 font-medium">Rent</span>
            <span className="text-red-600 font-medium">-$1000</span>
          </p>
          <p className="flex justify-between rounded-full bg-gray-50 border-4 border-white px-4 py-2 shadow-xl mb-4  hover:bg-gray-100 hover:cursor-pointer">
            <span className="text-green-600 font-medium">Profit</span>
            <span className="text-green-600 font-medium">+$32000</span>
          </p>
          <p className="flex justify-between rounded-full bg-gray-50 border-4 border-white px-4 py-2 shadow-xl mb-4  hover:bg-gray-100 hover:cursor-pointer">
            <span className="text-red-600 font-medium">Rent</span>
            <span className="text-red-600 font-medium">-$1000</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
