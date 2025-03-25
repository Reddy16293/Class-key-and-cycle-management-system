import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { FaKey, FaBicycle, FaSearch, FaDownload, FaCalendarAlt, FaFilter } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

const ViewHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("keys");
  const [filterOption, setFilterOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user and history data (keep your existing useEffect hooks)

  const formatTime = (time) => {
    if (!time) return <span className="text-red-500">Not Returned</span>;
    const date = new Date(time);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filteredHistory = historyData.filter((entry) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "returned") return entry.returnTime !== null;
    if (statusFilter === "not_returned") return entry.returnTime === null;
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

      {/* Enhanced Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h1 className="text-3xl font-bold">Borrowing History</h1>
          <p className="text-blue-100 mt-1">
            Track all your key and bicycle transactions
          </p>
        </div>

        {/* Main Content Container */}
        <div className="p-6 max-w-7xl mx-auto">
          {/* Filters Card */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              {/* Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search history..."
                  className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Filter */}
              <div className="flex items-center space-x-2">
                <FaCalendarAlt className="text-gray-500" />
                <select
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterOption}
                  onChange={(e) => setFilterOption(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="date">Select Date</option>
                </select>
                {filterOption === "date" && (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Choose date"
                    isClearable
                  />
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <select
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="returned">Returned</option>
                  <option value="not_returned">Not Returned</option>
                </select>
              </div>

              {/* Export Button */}
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                <FaDownload />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "keys"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              } transition-colors`}
              onClick={() => setActiveTab("keys")}
            >
              <div className="flex items-center space-x-2">
                <FaKey />
                <span>Keys</span>
              </div>
            </button>
            <button
              className={`px-6 py-3 font-medium ${
                activeTab === "bicycles"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              } transition-colors`}
              onClick={() => setActiveTab("bicycles")}
            >
              <div className="flex items-center space-x-2">
                <FaBicycle />
                <span>Bicycles</span>
              </div>
            </button>
          </div>

          {/* History List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your history...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No history records found
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <FaKey className="text-blue-600 text-lg" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {entry.classroomKey?.classroomName || 'Unknown Room'} - {entry.classroomKey?.blockName || 'Unknown Block'}
                          </h3>
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Borrowed:</span>
                              <span>{formatTime(entry.borrowTime)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Returned:</span>
                              <span>{formatTime(entry.returnTime)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          entry.returnTime ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {entry.returnTime ? 'Returned' : 'Pending Return'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHistory;