import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
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
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "returned", "not_returned"
  const [selectedDate, setSelectedDate] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch the current user's ID
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user", {
        withCredentials: true,
      });
      return response.data?.id; // Return the user ID
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  // Fetch borrowing history for the current user
  const fetchBorrowingHistory = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/history/user/${userId}`,
        { withCredentials: true }
      );
      return response.data; // Return the history data
    } catch (error) {
      console.error("Error fetching borrowing history:", error);
      throw error;
    }
  };

  // Load history data when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = await fetchCurrentUser();
        if (!userId) {
          setError("User not authenticated. Please log in.");
          return;
        }

        const history = await fetchBorrowingHistory(userId);
        setHistoryData(history);
      } catch (error) {
        setError("Failed to load history data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Format the time to a readable format
  const formatTime = (time) => {
    if (!time) return "Not Returned";
    const date = new Date(time);
    return date.toLocaleString(); // Format as "3/19/2025, 7:02:55 PM"
  };

  // Filter history data based on status
  const filteredHistory = historyData.filter((entry) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "returned") return entry.returnTime !== null;
    if (statusFilter === "not_returned") return entry.returnTime === null;
    return true;
  });

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
          onClick={() => navigate("/")}
          className={`w-full py-2 flex items-center ${
            sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
          } ${
            location.pathname === "/"
              ? "bg-blue-500 text-white"
              : "text-white hover:bg-blue-500"
          } rounded-lg transition-all`}
        >
          <FaSignOutAlt className={`${sidebarOpen ? "mr-2" : ""}`} />
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

          {/* Dropdown for Status Filter */}
          <div className="relative">
            <select
              className="border rounded-lg px-3 py-2 cursor-pointer bg-white shadow-sm focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="returned">Returned</option>
              <option value="not_returned">Not Returned</option>
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
          {loading ? (
            <p>Loading history...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : filteredHistory.length === 0 ? (
            <p>No history found.</p>
          ) : (
            filteredHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FaKey className="text-blue-500 text-lg" />
                  <div>
                    <h3 className="font-semibold">
                      Room {entry.classroomKey.classroomName} - {entry.classroomKey.blockName}
                    </h3>
                    <p className="text-gray-500">
                      Booked from {formatTime(entry.borrowTime)} to {formatTime(entry.returnTime)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewHistory;