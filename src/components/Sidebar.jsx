import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaBell } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { FaBook, FaGear } from "react-icons/fa6";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";

const Sidebar = ({ onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/", icon: <MdDashboard /> },
    { name: "Transactions", path: "/transactions", icon: <GrTransaction /> },
    { name: "Budget", path: "/budget", icon: <FaMoneyCheckAlt /> },
    { name: "Income", path: "/income", icon: <GiReceiveMoney /> },
    { name: "Expense", path: "/expense", icon: <GiPayMoney /> },
    { name: "Reports", path: "/reports", icon: <FaBook /> },
    { name: "Settings", path: "/settings", icon: <FaGear /> },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    console.log("User logged out");
    onLogout();
    navigate('/signin');
  };

  const notifications = [
    { id: 1, message: "New transaction added" },
    { id: 2, message: "Budget exceeded" },
    { id: 3, message: "Profile updated" },
  ];

  return (
    <div className="relative w-64 h-[94vh] bg-gray-100 border-4 border-white shadow-xl rounded-2xl my-4 mx-2 text-gray-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between p-4">
          <img
            src="https://imgs.search.brave.com/c7bLCe7j_VgSXV0ocTj8kxiH5V0CISY7Qw80Lq76LFY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/YnVzaW5lc3NtYW4t/Y2hhcmFjdGVyLWF2/YXRhci1pc29sYXRl/ZF8yNDg3Ny02MDEx/MS5qcGc_c2VtdD1h/aXNfaHlicmlk"
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-gray-300"
          />
          <div className="relative">
            <FaBell
              className="text-xl cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold p-4">My Dashboard</h2>
        <nav className="flex-grow">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block py-1.5 px-4 text-lg ${
                  isActive ? "border-l border-blue-600 text-blue-600 font-semibold" : "hover:text-blue-600 hover:font-semibold"
                }`
              }
            >
              <span className="flex items-center">
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center py-2 px-4 text-lg text-gray-800 hover:text-blue-600 hover:font-semibold"
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>
      {showNotifications && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full z-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Notifications</h3>
              <button onClick={() => setShowNotifications(false)} className="text-gray-600 hover:text-gray-800">
                &times;
              </button>
            </div>
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-gray-100 p-2 rounded mb-2">
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;