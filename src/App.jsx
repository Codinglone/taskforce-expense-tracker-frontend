import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Reports from './pages/Reports';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { auth } = useContext(AuthContext);
  const isAuthenticated = auth.isAuthenticated;


  return (
    <div className="bg-gray-300">
      <Router>
        <div className="flex">
          {isAuthenticated && <Sidebar />}
          <div className="flex-grow p-4">
            <Routes>
              <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" replace />} />
              <Route path="/transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/signin" replace />} />
              <Route path="/budget" element={isAuthenticated ? <Budget /> : <Navigate to="/signin" replace />} />
              <Route path="/income" element={isAuthenticated ? <Income /> : <Navigate to="/signin" replace />} />
              <Route path="/expense" element={isAuthenticated ? <Expense /> : <Navigate to="/signin" replace />} />
              <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/signin" replace />} />
              <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to="/" replace />} />
              <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default App;