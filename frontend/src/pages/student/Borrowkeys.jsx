import React, { useState } from "react";
import {
  FaKey,
  FaBicycle,
  FaEnvelope,
  FaHistory,
  FaInfoCircle,
  FaSignOutAlt,
  FaBuilding,
  FaHome,
  FaLock,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const BorrowKeys = () => {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Mock data for room availability
  const classrooms = [
    { room: "101", available: true },
    { room: "102", available: false },
    { room: "103", available: true },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-blue-600 to-blue-700 shadow-lg flex flex-col p-4 ${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300`}
      >
        <button
          className="mb-4 p-2 text-white hover:bg-blue-500 rounded-full transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <IoMenu className="text-xl" />
        </button>
        {sidebarOpen && (
          <h2 className="text-xl font-bold mb-6 text-white">Student Portal</h2>
        )}
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => navigate("/dashboard/student")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/dashboard/student"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaHome className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Dashboard"}
          </button>
          <button
            onClick={() => navigate("/borrowkeys")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/borrowkeys"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaKey className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Borrow Keys"}
          </button>
          <button
            onClick={() => navigate("/borrowbicycle")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/borrowbicycle"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaBicycle className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Borrow Bicycles"}
          </button>
          <button
            onClick={() => navigate("/receivedrequests")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/receivedrequests"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaEnvelope className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Received Requests"}
          </button>
          <button
            onClick={() => navigate("/sentrequests")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/sentrequests"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FiClock className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Sent Requests"}
          </button>
          <button
            onClick={() => navigate("/viewhistory")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/viewhistory"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaHistory className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "View History"}
          </button>
          <button
            onClick={() => navigate("/s-about")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/s-about"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaInfoCircle className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "About"}
          </button>
        </nav>
        <button
          className={`mt-auto text-white hover:bg-blue-500 flex items-center ${
            !sidebarOpen ? "justify-center" : ""
          } py-2 px-4 rounded-lg transition-all`}
        >
          <FaSignOutAlt className={sidebarOpen ? "mr-2" : ""} />
          {sidebarOpen && "Sign Out"}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Classroom Keys
          </h1>
          <p className="text-gray-600 mb-6">
            Select a building and floor to see available classroom keys
          </p>

          {/* Building and Floor Selection */}
          <div className="flex space-x-4 mb-8">
            <select
              className="border p-3 rounded-lg w-1/2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={building}
              onChange={(e) => {
                setBuilding(e.target.value);
                setFloor("");
              }}
            >
              <option value="">Select a building</option>
              <option value="ELHC Block">ELHC Block</option>
            </select>
            <select
              className="border p-3 rounded-lg w-1/2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              disabled={!building}
            >
              <option value="">
                {building ? "Select a floor" : "Select a building first"}
              </option>
              <option value="1st Floor">1st Floor</option>
            </select>
          </div>

          {/* Classroom List */}
          {!building || !floor ? (
            <div className="flex flex-col items-center text-gray-500">
              <FaBuilding className="text-6xl mb-4" />
              <p className="text-lg font-medium">Select a building and floor</p>
              <p className="text-sm">
                Choose a building and floor to see available classrooms
              </p>
            </div>
          ) : (
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Available Classrooms - {building}, {floor}
              </h2>
              <ul className="space-y-3">
                {classrooms.map(({ room, available }) => (
                  <li
                    key={room}
                    className="p-4 flex items-center justify-between border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <span
                      className={`font-medium ${
                        available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      Room {room} -{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm ${
                          available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {available ? "Available" : "In Use"}
                      </span>
                    </span>
                    {available ? (
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-colors">
                        Borrow Key <FaKey className="ml-2" />
                      </button>
                    ) : (
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
                        Request Key <FaLock className="ml-2" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowKeys;