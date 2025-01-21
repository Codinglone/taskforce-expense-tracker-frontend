import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import axiosInstance from '../utils/api';

const SignUp = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/register", { name, email, password });
      const { token } = response.data;
      login(token);
      toast.success("Registered Successfully!");
    } catch (err) {
      setError(err);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h1 className="text-2xl font-bold mb-4 text-left text-blue-600">Taskforce Expense Tracker</h1>
        <h2 className="text-xl font-bold mb-4 text-left">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error.message}</p>}
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded w-full"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700 w-full">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <a href="/signin" className="text-blue-500 hover:underline">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;