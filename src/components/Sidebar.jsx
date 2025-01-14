import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { GrTransaction } from 'react-icons/gr';
import { FaBook, FaGear } from 'react-icons/fa6';
import { FaMoneyCheckAlt } from "react-icons/fa";
import { GiReceiveMoney, GiPayMoney } from 'react-icons/gi';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/', icon: <MdDashboard /> },
    { name: 'Transactions', path: '/transactions', icon: <GrTransaction /> },
    { name: 'Budget', path: '/budget', icon: <FaMoneyCheckAlt /> },
    { name: 'Income', path: '/income', icon: <GiReceiveMoney /> },
    { name: 'Expense', path: '/expense', icon: <GiPayMoney /> },
    { name: 'Reports', path: '/reports', icon: <FaBook /> },
    { name: 'Settings', path: '/settings', icon: <FaGear /> },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    console.log('User logged out');
  };

  return (
    <div className="w-64 h-[94vh] bg-gray-100 border-4 border-white shadow-xl rounded-2xl my-4 mx-2 text-gray-800 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold p-4">My Dashboard</h2>
        <nav className="flex-grow">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block py-1.5 px-4 text-lg ${
                  isActive ? 'border-l border-blue-600 text-blue-600 font-semibold' : 'hover:text-blue-600 hover:font-semibold'
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