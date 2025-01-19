import React, { useState, useContext } from "react";
import axiosInstance from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const token = response.data.token;
      login(token);
      toast.success("Logged in successfully!!");
    } catch (error) {
      setError("Login error:", error);
      toast.error("Invalid credentials. Try again!!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
        <h1 className="text-2xl font-bold mb-4 text-left text-blue-600">
          Taskforce Expense Tracker
        </h1>
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        {error && <p className="text-red-500 text-center">{error.message}</p>}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-lg font-bold mb-2">Demo User</h3>
          <p>
            <strong>Email:</strong> demo@taskforce.com
          </p>
          <p>
            <strong>Password:</strong> demo123
          </p>
        </div>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
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
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
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
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-700 w-full"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
