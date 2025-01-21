import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { FaBook, FaGear } from "react-icons/fa6";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/", icon: <MdDashboard /> },
    { name: "Transactions", path: "/transactions", icon: <GrTransaction /> },
    { name: "Budget", path: "/budget", icon: <FaMoneyCheckAlt /> },
    { name: "Income", path: "/income", icon: <GiReceiveMoney /> },
    { name: "Expense", path: "/expense", icon: <GiPayMoney /> },
    { name: "Reports", path: "/reports", icon: <FaBook /> },
    // { name: "Settings", path: "/settings", icon: <FaGear /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div className="relative w-64 h-[94vh] bg-gray-100 border-4 border-white shadow-xl rounded-2xl my-4 mx-2 text-gray-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center p-4 gap-3">
          <img
            src="https://imgs.search.brave.com/c7bLCe7j_VgSXV0ocTj8kxiH5V0CISY7Qw80Lq76LFY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS12ZWN0b3Iv/YnVzaW5lc3NtYW4t/Y2hhcmFjdGVyLWF2/YXRhci1pc29sYXRl/ZF8yNDg3Ny02MDEx/MS5qcGc_c2VtdD1h/aXNfaHlicmlk"
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{user?.name || 'User'}</span>
            <span className="text-xs text-gray-600">{user?.email}</span>
          </div>
        </div>
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
    </div>
  );
};

export default Sidebar;