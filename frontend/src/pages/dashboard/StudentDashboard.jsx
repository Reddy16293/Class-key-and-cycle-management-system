import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBars, FaKey, FaBicycle, FaEnvelope, FaPaperPlane, FaSignOutAlt, FaUser, FaClock, FaInfoCircle } from "react-icons/fa";

const StudentDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/logout",
        {},
        { withCredentials: true } // 🚨 Ensure cookies are sent with the request
      );
  
      // Remove any locally stored user info
      localStorage.removeItem("user");
  
      // Redirect to Google logout (if using OAuth)
      window.location.href = "https://accounts.google.com/logout";
  
      // Redirect to login page
      window.location.href = "http://localhost:5173/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  
  
  return (
    <div className="h-screen bg-indigo-100 flex flex-col">
      {/* Navbar */}
      <div className="bg-indigo-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Borrow your resources</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Sidebar (Toggle Menu) */}
      <div className={`fixed top-0 right-0 w-64 h-full bg-white shadow-md transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-5 space-y-6">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-xl text-indigo-700">
            ✖
          </button>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded">
              <FaUser className="text-indigo-700" />
              <span>Profile</span>
            </li>
            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded">
              <FaClock className="text-indigo-700" />
              <span>View History</span>
            </li>
            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded" onClick={handleLogout}>
              <FaSignOutAlt className="text-indigo-700" />
              <span>Sign Out</span>
            </li>
            <li className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded">
              <FaInfoCircle className="text-indigo-700" />
              <span>About</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-10">
        {/* Action Buttons */}
        <div className="space-y-6 w-full max-w-md">
          <button className="flex items-center justify-center w-full p-4 bg-indigo-700 text-white rounded-full text-lg">
            <FaKey className="mr-2" /> Borrow a Class Key
          </button>
          <button className="flex items-center justify-center w-full p-4 bg-indigo-700 text-white rounded-full text-lg">
            <FaBicycle className="mr-2" /> Borrow a Bicycle
          </button>
          <button className="flex items-center justify-center w-full p-4 bg-indigo-700 text-white rounded-full text-lg">
            <FaEnvelope className="mr-2" /> View Requests
          </button>
          <button className="flex items-center justify-center w-full p-4 bg-indigo-700 text-white rounded-full text-lg">
            <FaPaperPlane className="mr-2" /> Sent Requests
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
