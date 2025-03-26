import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Bike, 
  Star, 
  Filter, 
  ArrowUpDown, 
  Info, 
  ChevronDown,
  ChevronUp,
  Search
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const AdminFeedback = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    sortField: "borrowTime",
    sortOrder: "desc",
    minRating: 0
  });

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/feedback/bicycles", {
          params: {
            page: 0,
            size: 100,
            sort: `${filters.sortField},${filters.sortOrder}`
          },
          withCredentials: true
        });

        // Handle both paginated and non-paginated responses
        const feedbackData = response.data.content || response.data;
        setFeedbacks(Array.isArray(feedbackData) ? feedbackData : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setError("Failed to load feedback data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [filters]);

  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const bikeInfo = `${feedback.bicycle?.qrCode || ''} ${feedback.bicycle?.brand || ''} ${feedback.bicycle?.model || ''}`.toLowerCase();
      const userInfo = `${feedback.student?.name || ''}`.toLowerCase();
      if (!bikeInfo.includes(searchLower) && !userInfo.includes(searchLower)) {
        return false;
      }
    }
    
    // Rating filter
    if (feedback.experienceRating < filters.minRating) {
      return false;
    }
    
    return true;
  });

  const handleSort = (field) => {
    if (filters.sortField === field) {
      setFilters({
        ...filters,
        sortOrder: filters.sortOrder === "asc" ? "desc" : "asc"
      });
    } else {
      setFilters({
        ...filters,
        sortField: field,
        sortOrder: "desc"
      });
    }
  };

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Feedback Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Bicycle Feedback</h1>
            <p className="text-gray-600">View and manage all bicycle feedback from users</p>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by QR code, bicycle or user..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 text-gray-500 mr-2" />
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={filters.minRating}
                    onChange={(e) => setFilters({...filters, minRating: parseInt(e.target.value)})}
                  >
                    <option value="0">All Ratings</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading feedback data...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bike className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">No feedback found</h3>
                <p className="text-gray-500 mt-1">
                  {filters.search || filters.minRating > 0 
                    ? "No feedback matches your filters" 
                    : "No feedback has been submitted yet"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("borrowTime")}
                      >
                        <div className="flex items-center">
                          Date
                          {filters.sortField === "borrowTime" ? (
                            filters.sortOrder === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bicycle QR Code
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort("experienceRating")}
                      >
                        <div className="flex items-center">
                          Rating
                          {filters.sortField === "experienceRating" ? (
                            filters.sortOrder === "asc" ? (
                              <ChevronUp className="ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-1 h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFeedbacks.map((feedback) => (
                      <tr key={feedback.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(feedback.borrowTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {feedback.bicycle?.qrCode || `Bicycle #${feedback.bicycle?.id}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {feedback.bicycle?.brand} {feedback.bicycle?.model}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {feedback.student?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {feedback.student?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.experienceRating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-sm text-gray-500">
                              ({feedback.experienceRating}/5)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.conditionDescription?.length > 30
                            ? `${feedback.conditionDescription.substring(0, 30)}...`
                            : feedback.conditionDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setIsModalOpen(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 flex items-center"
                          >
                            <Info className="h-4 w-4 mr-1" />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Feedback Details Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Feedback Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700">Bicycle Information</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">QR Code:</span> {selectedFeedback.bicycle?.qrCode || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Brand/Model:</span> {selectedFeedback.bicycle?.brand || 'N/A'} {selectedFeedback.bicycle?.model || ''}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">User Information</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span> {selectedFeedback.student?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {selectedFeedback.student?.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-700">Borrow Details</h4>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Borrowed:</span> {formatDateTime(selectedFeedback.borrowTime)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Returned:</span> {formatDateTime(selectedFeedback.returnTime) || 'Not returned'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Experience Rating</h4>
                    <div className="mt-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < selectedFeedback.experienceRating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({selectedFeedback.experienceRating}/5)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Condition Description</h4>
                  <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                    {selectedFeedback.conditionDescription || 'No condition description provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;