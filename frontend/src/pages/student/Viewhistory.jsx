import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  FaKey,
  FaBicycle,
  FaHistory,
  FaSearch,
  FaDownload,
  FaCalendarAlt,
  FaFilter,
  FaExchangeAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaQrcode
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

const ViewHistory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("keys");
  const [filterOption, setFilterOption] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData, setHistoryData] = useState({
    keys: [],
    bicycles: []
  });
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

  const fetchHistoryData = async (userId) => {
    try {
      setLoading(true);
      const [keysResponse, bicyclesResponse] = await Promise.all([
        axios.get(`http://localhost:8080/api/history/user/${userId}/classroom-keys`, {
          withCredentials: true
        }),
        axios.get(`http://localhost:8080/api/history/user/${userId}/bicycles`, {
          withCredentials: true
        })
      ]);

      setHistoryData({
        keys: keysResponse.data,
        bicycles: bicyclesResponse.data
      });
      setError(null);
    } catch (error) {
      console.error("Error fetching history data:", error);
      setError("Failed to load history data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      fetchHistoryData(currentUser.id);
    }
  }, [currentUser?.id]);

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not returned yet";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const filterData = (data) => {
    return data.filter(item => {
      // Status filter
      if (statusFilter === "returned" && !item.returnTime) return false;
      if (statusFilter === "not_returned" && item.returnTime) return false;
      
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        if (activeTab === "keys") {
          const roomInfo = `${item.classroomKey?.blockName || ''} ${item.classroomKey?.classroomName || ''}`.toLowerCase();
          if (!roomInfo.includes(searchLower)) return false;
        } else {
          const bikeInfo = `${item.bicycle?.name || ''} ${item.bicycle?.brand || ''} ${item.bicycle?.model || ''}`.toLowerCase();
          if (!bikeInfo.includes(searchLower)) return false;
        }
      }
      
      // Date filter
      if (selectedDate && filterOption === "date") {
        const borrowDate = new Date(item.borrowTime).setHours(0, 0, 0, 0);
        const selectedDateValue = new Date(selectedDate).setHours(0, 0, 0, 0);
        if (borrowDate !== selectedDateValue) return false;
      }
      
      return true;
    });
  };

  const currentData = activeTab === "keys" 
    ? filterData(historyData.keys) 
    : filterData(historyData.bicycles);

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Borrowing History</h1>
            <p className="text-gray-600 mt-2">
              Track all your borrowing activities in one place
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
                  placeholder={`Search ${activeTab === "keys" ? "room numbers" : "bicycles"}...`}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    <option value="not_returned">Active</option>
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
                    placeholderText="Select date"
                    isClearable
                  />
                )}

                <button 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  onClick={() => {
                    // Implement export functionality
                    alert("Export feature coming soon!");
                  }}
                >
                  <FaDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-6 py-3 font-medium text-sm flex items-center ${
                activeTab === "keys"
                  ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-500"
              } transition-colors`}
              onClick={() => setActiveTab("keys")}
            >
              <FaKey className="mr-2" /> Key History
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm flex items-center ${
                activeTab === "bicycles"
                  ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                  : "text-gray-500 hover:text-blue-500"
              } transition-colors`}
              onClick={() => setActiveTab("bicycles")}
            >
              <FaBicycle className="mr-2" /> Bicycle History
            </button>
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
            ) : currentData.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {activeTab === "keys" ? (
                    <FaKey className="text-gray-400 text-xl" />
                  ) : (
                    <FaBicycle className="text-gray-400 text-xl" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-700">No history found</h3>
                <p className="text-gray-500 mt-1">
                  {statusFilter === "all"
                    ? `You don't have any ${activeTab} history yet.`
                    : `No ${statusFilter.replace("_", " ")} ${activeTab} items found.`}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {currentData.map((entry, index) => (
                  <li 
                    key={index} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      // You could add a detail view here if needed
                    }}
                  >
                    <div className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg mt-1 ${
                            entry.returnTime 
                              ? "bg-green-100 text-green-600" 
                              : "bg-blue-100 text-blue-600"
                          }`}>
                            {activeTab === "keys" ? (
                              <FaKey className="text-lg" />
                            ) : (
                              <FaBicycle className="text-lg" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <h3 className="font-medium text-gray-900">
                                {activeTab === "keys" 
                                  ? `${entry.classroomKey?.blockName || 'Unknown'} - Room ${entry.classroomKey?.classroomName || 'Unknown'}`
                                  : `Bicycle: ${entry.bicycle?.name || `#${entry.bicycle?.id || 'Unknown'}`}`}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                entry.returnTime 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {entry.returnTime ? (
                                  <>
                                    <FaCheckCircle className="mr-1" />
                                    Returned
                                  </>
                                ) : (
                                  <>
                                    <FaTimesCircle className="mr-1" />
                                    Active
                                  </>
                                )}
                              </span>
                            </div>
                            
                            {/* Bicycle Specific Details */}
                            {activeTab === "bicycles" && (
                              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                {entry.bicycle?.brand && (
                                  <span className="flex items-center">
                                    <span className="font-medium">Brand:</span> {entry.bicycle.brand}
                                  </span>
                                )}
                                {entry.bicycle?.model && (
                                  <span className="flex items-center">
                                    <span className="font-medium">Model:</span> {entry.bicycle.model}
                                  </span>
                                )}
                                {entry.bicycle?.qrCode && (
                                  <span className="flex items-center">
                                    <FaQrcode className="mr-1" />
                                    <span className="font-medium">QR:</span> {entry.bicycle.qrCode}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <FiClock className="mr-2 text-gray-400" />
                                <span>
                                  <span className="font-medium">Borrowed:</span> {formatDateTime(entry.borrowTime)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <FaExchangeAlt className="mr-2 text-gray-400" />
                                <span>
                                  <span className="font-medium">Returned:</span> {formatDateTime(entry.returnTime)}
                                </span>
                              </div>
                            </div>
                            
                            {entry.feedback && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                <span className="font-medium">Your Feedback:</span> {entry.feedback}
                              </div>
                            )}
                          </div>
                        </div>
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

export default ViewHistory;