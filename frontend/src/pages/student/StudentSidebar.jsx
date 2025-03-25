import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaKey,
  FaBicycle,
  FaEnvelope,
  FaHistory,
  FaInfoCircle,
  FaSignOutAlt,
  FaHome,
  FaUser,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";

const StudentSidebar = ({ sidebarOpen, setSidebarOpen, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard/student", icon: <FaHome />, label: "Dashboard" },
    { path: "/borrowkeys", icon: <FaKey />, label: "Borrow Keys" },
    { path: "/borrowbicycle", icon: <FaBicycle />, label: "Borrow Bicycles" },
    { path: "/receivedrequests", icon: <FaEnvelope />, label: "Received Requests" },
    { path: "/sentrequests", icon: <FiClock />, label: "Sent Requests" },
    { path: "/viewhistory", icon: <FaHistory />, label: "View History" },
    { path: "/s-about", icon: <FaInfoCircle />, label: "About" },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-indigo-700 to-indigo-800 shadow-xl flex flex-col p-4 ${
        sidebarOpen ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-between mb-8">
        <button
          className="p-2 text-white hover:bg-indigo-600 rounded-full transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <IoMenu className="text-xl" />
        </button>
        {sidebarOpen && (
          <h2 className="text-xl font-bold text-white">Student Portal</h2>
        )}
      </div>

      

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full py-3 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === item.path
                ? "bg-indigo-600 text-white shadow-md"
                : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
            } rounded-lg transition-all`}
          >
            <span className={`${sidebarOpen ? "mr-3" : ""}`}>{item.icon}</span>
            {sidebarOpen && item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={() => navigate("/")}
        className={`w-full py-3 mt-auto flex items-center ${
          sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
        } text-indigo-100 hover:bg-indigo-600 hover:text-white rounded-lg transition-all`}
      >
        <FaSignOutAlt className={`${sidebarOpen ? "mr-3" : ""}`} />
        {sidebarOpen && "Sign Out"}
      </button>
    </aside>
  );
};

export default StudentSidebar;