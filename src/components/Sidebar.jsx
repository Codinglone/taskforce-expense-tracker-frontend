import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { GiPayMoney } from "react-icons/gi";
import { FaBook } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
const Sidebar = () => {
  const links = [
    { name: "Dashboard", path: "/", icon: <MdDashboard /> },
    { name: "Transactions", path: "/transactions", icon: <GrTransaction /> },
    { name: "Budget", path: "/budget", icon: <FaMoneyCheckAlt /> },
    { name: "Income", path: "/income", icon: <GiReceiveMoney /> },
    { name: "expense", path: "/expense", icon: <GiPayMoney /> },
    { name: "Reports", path: "/reports", icon: <FaBook /> },
    { name: "Settings", path: "/settings", icon: <FaGear /> },
  ];

  return (
    <div className="w-64 h-[94vh] bg-gray-100 border-4 border-white shadow-xl rounded-2xl my-4 mx-2 text-gray-800 flex flex-col">
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
              <span className="mr-2">{link.icon}</span>
              <span>{link.name}</span>
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
