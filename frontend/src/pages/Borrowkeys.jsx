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
  FaLock
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
    { room: "103", available: true }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md flex flex-col p-4 ${sidebarOpen ? "w-64" : "w-16"} transition-all`}>
  <button className="mb-4 p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
    <IoMenu className="text-xl" />
  </button>
  {sidebarOpen && <h2 className="text-xl font-bold mb-6">Student Portal</h2>}
  <nav className="flex-1 space-y-4">
    <button 
      onClick={() => navigate('/dashboard/student')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaHome className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Dashboard"}
    </button>
    <button 
      onClick={() => navigate('/borrowkeys')} 
      className={`w-full py-2 flex items-center ${
        sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
      } ${
        location.pathname === '/borrowkeys' 
          ? 'bg-blue-100 text-blue-600' 
          : 'hover:bg-gray-200'
      }`}
    >
      <FaKey className={`${sidebarOpen ? "mr-2" : ""} ${
        location.pathname === '/borrowkeys' ? 'text-blue-600' : ''
      }`} /> 
      {sidebarOpen && "Borrow Keys"}
    </button>
    <button 
      onClick={() => navigate('/borrowbicycle')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaBicycle className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Borrow Bicycles"}
    </button>
    <button 
      onClick={() => navigate('/receivedrequests')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaEnvelope className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Received Requests"}
    </button>
    <button 
      onClick={() => navigate('/sentrequests')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FiClock className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Sent Requests"}
    </button>
    <button 
      onClick={() => navigate('/viewhistory')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaHistory className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "View History"}
    </button>
    <button 
      onClick={() => navigate('/s-about')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaInfoCircle className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "About"}
    </button>
  </nav>
  <button className={`mt-auto text-red-500 flex items-center ${!sidebarOpen ? "justify-center" : ""}`}>
    <FaSignOutAlt className={sidebarOpen ? "mr-2" : ""} /> 
    {sidebarOpen && "Sign Out"}
  </button>
</aside>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Classroom Keys</h1>
        <p className="text-gray-600 mb-6">Select a building and floor to see available classroom keys</p>

        <div className="flex space-x-4 mb-6">
          <select
            className="border p-2 rounded-lg"
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
            className="border p-2 rounded-lg"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            disabled={!building}
          >
            <option value="">{building ? "Select a floor" : "Select a building first"}</option>
            <option value="1st Floor">1st Floor</option>
          </select>
        </div>

        {!building || !floor ? (
          <div className="flex flex-col items-center text-gray-500">
            <FaBuilding className="text-6xl mb-4" />
            <p className="text-lg font-medium">Select a building and floor</p>
            <p className="text-sm">Choose a building and floor to see available classrooms</p>
          </div>
        ) : (
          <div className="bg-white p-4 shadow-lg rounded-lg w-3/4">
            <h2 className="text-xl font-semibold mb-2">
              Available Classrooms - {building}, {floor}
            </h2>
            <ul>
              {classrooms.map(({ room, available }) => (
                <li key={room} className="p-2 flex items-center justify-between border-b">
                  <span className={`font-medium ${available ? "text-green-500" : "text-red-500"}`}>
                    Room {room} - {available ? "Available" : "In Use"}
                  </span>
                  {available ? (
                    <button className="bg-green-500 text-white px-4 py-1 rounded flex items-center">
                      Borrow Key <FaBicycle className="ml-2" />
                    </button>
                  ) : (
                    <button className="bg-blue-500 text-white px-4 py-1 rounded flex items-center">
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
  );
};

export default BorrowKeys;
