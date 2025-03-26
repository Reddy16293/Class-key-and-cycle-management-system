import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  FaBicycle,
  FaHistory,
  FaInfoCircle,
  FaSearch,
  FaDownload,
  FaCalendarAlt,
  FaFilter,
  FaExchangeAlt
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import StudentSidebar_nonCR from "./StudentSidebar_nonCR";

const ViewHistory_nonCR = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOption, setFilterOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchBorrowingHistory = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/history/user/${userId}`,
        { withCredentials: true }
      );
      // Filter to only get bicycle history
      return response.data.filter(entry => entry.bicycle !== null);
    } catch (error) {
      console.error("Error fetching borrowing history:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!currentUser?.id) return;

        const history = await fetchBorrowingHistory(currentUser.id);
        setHistoryData(history);
        setError(null);
      } catch (error) {
        setError("Failed to load history data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser?.id]);

  const formatTime = (time) => {
    if (!time) return "Not Returned";
    const date = new Date(time);
    return date.toLocaleString();
  };

  const filteredHistory = historyData.filter((entry) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "returned") return entry.returnTime !== null;
    if (statusFilter === "not_returned") return entry.returnTime === null;
    return true;
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StudentSidebar_nonCR
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Bicycle Borrowing History</h1>
            <p className="text-gray-600">
              Track all your bicycle borrowing activities
            </p>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bicycle history..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex items-center">
                  <FaFilter className="absolute left-3 text-gray-400" />
                  <select
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="returned">Returned</option>
                    <option value="not_returned">Not Returned</option>
                  </select>
                </div>

                <div className="relative flex items-center">
                  <FaCalendarAlt className="absolute left-3 text-gray-400" />
                  <select
                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value)}
                  >
                    <option value="all">All Time</option>
                    <option value="date">Select Date</option>
                  </select>
                </div>

                {filterOption === "date" && (
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholderText="Choose date"
                    isClearable
                  />
                )}

                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
                  <FaDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading your history...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FaHistory className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">No bicycle history found</h3>
                <p className="text-gray-500 mt-1">
                  {statusFilter === "all"
                    ? "You don't have any bicycle borrowing history yet."
                    : `No ${statusFilter.replace("_", " ")} bicycles found.`}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredHistory.map((entry, index) => (
                  <li key={index} className="hover:bg-gray-50 transition-colors">
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${
                            entry.returnTime ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                          }`}>
                            <FaBicycle className="text-lg" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {`Bicycle ${entry.bicycle?.brand || 'Unknown'} - ${entry.bicycle?.model || 'Unknown'}`}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FiClock className="mr-1" />
                                Borrowed: {formatTime(entry.borrowTime)}
                              </span>
                              <span className="flex items-center">
                                <FaExchangeAlt className="mr-1" />
                                Returned: {formatTime(entry.returnTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          entry.returnTime 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {entry.returnTime ? "Returned" : "Active"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewHistory_nonCR;