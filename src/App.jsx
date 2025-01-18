import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="bg-gray-300">
    <Router>
      <div className="flex">
        {isAuthenticated && <Sidebar onLogout={handleLogout} />}
        <div className="flex-grow p-4">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
            <Route path="/transactions" element={isAuthenticated ? <Transactions /> : <Navigate to="/signin" />} />
            <Route path="/budget" element={isAuthenticated ? <Budget /> : <Navigate to="/signin" />} />
            <Route path="/income" element={isAuthenticated ? <Income /> : <Navigate to="/signin" />} />
            <Route path="/expense" element={isAuthenticated ? <Expense /> : <Navigate to="/signin" />} />
            <Route path="/reports" element={isAuthenticated ? <Reports /> : <Navigate to="/signin" />} />
            <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/signin" />} />
            <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </div>
    </Router>
    </div>
  );
};

export default App;