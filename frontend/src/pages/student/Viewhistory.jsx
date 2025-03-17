import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaKey,
  FaBicycle,
  FaSignOutAlt,
  FaHistory,
  FaInfoCircle,
  FaEnvelope,
  FaHome,
  FaSearch,
  FaDownload,
} from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { FiClock } from "react-icons/fi";

const ViewHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("keys");
  const [filterOption, setFilterOption] = useState("all"); // "all" or "date"
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const keysHistory = [
    { room: "Room 101", borrowed: "Jun 10, 03:00 PM", returned: "Jun 10, 08:15 PM", duration: "5h 15m" },
    { room: "Room 203", borrowed: "Jun 8, 06:45 PM", returned: "Jun 8, 09:00 PM", duration: "2h 15m" },
    { room: "Room 105", borrowed: "Jun 5, 03:30 PM", returned: "Jun 5, 05:15 PM", duration: "1h 45m" },
  ];

  const bicyclesHistory = [
    { room: "Bicycle 1", borrowed: "Jun 9, 10:00 AM", returned: "Jun 9, 12:30 PM", duration: "2h 30m" },
    { room: "Bicycle 2", borrowed: "Jun 7, 02:00 PM", returned: "Jun 7, 04:15 PM", duration: "2h 15m" },
  ];

  const historyData = activeTab === "keys" ? keysHistory : bicyclesHistory;

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Borrowing History</h1>
        <p className="text-gray-600 mb-6">
          View your history of borrowed keys and bicycles
        </p>

        {/* Search & Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center border rounded-lg px-3 py-2 w-1/2 bg-white shadow-sm">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search history..."
              className="w-full focus:outline-none"
            />
          </div>

          {/* Dropdown for Date Selection */}
          <div className="relative">
            <select
              className="border rounded-lg px-3 py-2 cursor-pointer bg-white shadow-sm focus:outline-none"
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="date">Select Date</option>
            </select>
          </div>

          {/* Date Picker (Only Shown if "Select Date" is Chosen) */}
          {filterOption === "date" && (
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="border rounded-lg px-3 py-2 cursor-pointer bg-white shadow-sm focus:outline-none"
              placeholderText="Choose date"
              isClearable
            />
          )}

          {/* Export Button */}
          <button className="border rounded-lg px-3 py-2 flex items-center bg-white shadow-sm hover:bg-gray-100 transition-colors">
            <FaDownload className="mr-2" /> Export
          </button>
        </div>

        {/* Tabs for Keys and Bicycles */}
        <div className="mt-6 flex border-b">
          <button
            className={`px-6 py-3 ${
              activeTab === "keys"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            } transition-colors`}
            onClick={() => setActiveTab("keys")}
          >
            Keys
          </button>
          <button
            className={`px-6 py-3 ${
              activeTab === "bicycles"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500 hover:text-blue-500"
            } transition-colors`}
            onClick={() => setActiveTab("bicycles")}
          >
            Bicycles
          </button>
        </div>

        {/* History List */}
        <div className="mt-4">
          {historyData.map((entry, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {activeTab === "keys" ? (
                  <FaKey className="text-blue-500 text-lg" />
                ) : (
                  <FaBicycle className="text-green-500 text-lg" />
                )}
                <div>
                  <h3 className="font-semibold">{entry.room}</h3>
                  <p className="text-gray-500">Borrowed: {entry.borrowed}</p>
                  <p className="text-gray-500">Returned: {entry.returned}</p>
                </div>
              </div>
              <span className="text-gray-700 font-semibold">{entry.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewHistory;