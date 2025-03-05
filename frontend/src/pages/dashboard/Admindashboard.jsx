import { useState } from "react";
import { FaBars, FaSignOutAlt, FaKey, FaBicycle, FaComment, FaUser, FaInfoCircle, FaPlus } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoPersonCircle } from "react-icons/io5";
import KeyManagement from "../KeyManagement";
import { Link } from "react-router-dom";
const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-indigo-700 text-white transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16"} p-5`}>
        {/* Sidebar Toggle Button */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white text-xl mb-6">
          <FaBars />
        </button>

        {/* Sidebar Navigation */}
        <ul className="space-y-4">
          <li className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-600 p-2 rounded">
            <MdDashboard />
            {isSidebarOpen && <span>Dashboard</span>}
          </li>
          <Link to="/key-management" className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-600 p-2 rounded">
            <FaKey />
            {isSidebarOpen && <span>Key Management</span>}
          </Link>
          <li className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-600 p-2 rounded">
            <FaBicycle />
            {isSidebarOpen && <span>Bicycle Management</span>}
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-600 p-2 rounded">
            <FaComment />
            {isSidebarOpen && <span>Feedback</span>}
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-600 p-2 rounded">
            <FaPlus />
            {isSidebarOpen && <span>Assign CR</span>}
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-600 p-2 rounded">
            <FaUser />
            {isSidebarOpen && <span>Profile</span>}
          </li>
          <li className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-600 p-2 rounded">
            <FaInfoCircle />
            {isSidebarOpen && <span>About</span>}
          </li>
        </ul>

        {/* Logout Button */}
        <div className="absolute bottom-5 left-5 flex items-center space-x-2 cursor-pointer hover:bg-indigo-600 p-2 rounded">
          <FaSignOutAlt />
          {isSidebarOpen && <span>Sign Out</span>}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="flex justify-between items-center bg-white p-4 shadow">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <button className="text-indigo-700 text-3xl">
            <IoPersonCircle />
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="flex flex-col items-center justify-center flex-1 p-10">
          <h1 className="text-2xl font-semibold text-indigo-700 bg-indigo-100 p-4 rounded-lg">Welcome Admin</h1>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4 w-full max-w-md">
            <button className="flex items-center justify-center w-full p-4 bg-indigo-700 text-white rounded-full text-lg">
              <FaKey className="mr-2" /> View Key Status & Borrowings
            </button>
            <button className="flex items-center justify-center w-full p-4 bg-indigo-700 text-white rounded-full text-lg">
              <FaBicycle className="mr-2" /> View Bicycle Status & Borrowings
            </button>
            <button className="flex items-center justify-center w-full p-4 bg-indigo-700 text-white rounded-full text-lg">
              <FaComment className="mr-2" /> View Feedbacks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
