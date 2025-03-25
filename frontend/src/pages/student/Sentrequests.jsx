import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "./StudentSidebar";
import { 
  FaKey, FaClock, FaTimes, FaCheck, 
  FaExchangeAlt, FaSpinner, FaInfoCircle, FaTrash,
  FaCalendarAlt, FaUser, FaBuilding, FaHistory
} from "react-icons/fa";

const SentRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setError("Failed to load user data");
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchSentRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/key-requests/sent-requests/${currentUser.id}`,
          { withCredentials: true }
        );
        
        const processedRequests = response.data.map(request => ({
          id: request.id,
          status: request.status,
          requestTime: request.requestTime,
          startTime: request.startTime,
          endTime: request.endTime,
          purpose: request.purpose,
          classroomKey: {
            id: request.classroomKey?.id,
            blockName: request.classroomKey?.blockName || 'Unknown Block',
            classroomName: request.classroomKey?.classroomName || 'Unknown Classroom',
            floor: request.classroomKey?.floor
          },
          holderAtRequestTime: request.holderAtRequestTime || { 
            name: 'Unknown at request time',
            email: ''
          },
          currentHolder: request.currentHolder || { 
            name: 'Currently unassigned',
            email: ''
          }
        }));
        
        setRequests(processedRequests);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, [currentUser]);

  const handleCompleteTransfer = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/key-requests/complete-transfer/${requestId}`,
        null,
        { withCredentials: true }
      );
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: "TRANSFER_COMPLETED" } : req
        )
      );
    } catch (error) {
      console.error("Error completing transfer:", error);
      alert(error.response?.data?.message || "Failed to complete transfer");
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/key-requests/cancel/${requestId}`,
        null,
        { withCredentials: true }
      );
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: "CANCELLED" } : req
        )
      );
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert(error.response?.data?.message || "Failed to cancel request");
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest({
      ...request,
      classroomKey: request.classroomKey || {
        blockName: 'Unknown Block',
        classroomName: 'Unknown Classroom'
      },
      holderAtRequestTime: request.holderAtRequestTime || { name: 'Unknown at request time' },
      currentHolder: request.currentHolder || { name: 'Currently unassigned' }
    });
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <StudentSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          user={currentUser} 
        />
        <div className="flex-1 flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <StudentSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          user={currentUser} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
            <h3 className="text-lg font-medium text-red-500 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        user={currentUser} 
      />

      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sent Requests</h1>
            <p className="text-gray-600">Track the status of your key requests</p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaKey className="text-blue-500 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No sent requests
              </h3>
              <p className="text-gray-500">
                You haven't made any key requests yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requests.map((request) => {
                const safeRequest = {
                  ...request,
                  id: request.id || 'unknown-id',
                  classroomKey: request.classroomKey || {
                    blockName: 'Unknown Block',
                    classroomName: 'Unknown Classroom'
                  },
                  holderAtRequestTime: request.holderAtRequestTime || { name: 'Unknown at request time' },
                  currentHolder: request.currentHolder || { name: 'Currently unassigned' },
                  status: request.status || 'UNKNOWN'
                };

                return (
                  <div
                    key={safeRequest.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="font-bold text-xl text-gray-800 flex items-center">
                            <FaBuilding className="text-blue-500 mr-3" />
                            {safeRequest.classroomKey.blockName} - {safeRequest.classroomKey.classroomName}
                          </h2>
                          <div className="flex items-center mt-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                safeRequest.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : safeRequest.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : safeRequest.status === "DECLINED"
                                  ? "bg-red-100 text-red-800"
                                  : safeRequest.status === "TRANSFER_INITIATED"
                                  ? "bg-purple-100 text-purple-800"
                                  : safeRequest.status === "TRANSFER_COMPLETED"
                                  ? "bg-teal-100 text-teal-800"
                                  : safeRequest.status === "CANCELLED"
                                  ? "bg-gray-100 text-gray-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {safeRequest.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewDetails(safeRequest)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                        >
                          <FaInfoCircle className="text-lg" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <FaUser className="mr-3 text-gray-400" />
                          <div>
                            <p className="text-sm">Requested from</p>
                            <p className="font-medium text-gray-800">{safeRequest.holderAtRequestTime.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaUser className="mr-3 text-gray-400" />
                          <div>
                            <p className="text-sm">Current holder</p>
                            <p className="font-medium text-gray-800">{safeRequest.currentHolder.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600">
                          <FaCalendarAlt className="mr-3 text-gray-400" />
                          <div>
                            <p className="text-sm">Requested on</p>
                            <p className="font-medium text-gray-800">
                              {new Date(safeRequest.requestTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex space-x-3">
                        {safeRequest.status === "TRANSFER_INITIATED" && (
                          <button
                            onClick={() => handleCompleteTransfer(safeRequest.id)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                          >
                            <FaExchangeAlt className="mr-2" />
                            Complete Transfer
                          </button>
                        )}
                        
                        {(safeRequest.status === "PENDING" || safeRequest.status === "APPROVED") && (
                          <button
                            onClick={() => handleCancelRequest(safeRequest.id)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                          >
                            <FaTrash className="mr-2" />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Request Details
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {selectedRequest.classroomKey.blockName} - {selectedRequest.classroomKey.classroomName}
                  </p>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <FaKey className="mr-2 text-blue-500" />
                    Classroom Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Block</p>
                      <p className="text-gray-900 font-medium">{selectedRequest.classroomKey.blockName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Classroom</p>
                      <p className="text-gray-900 font-medium">{selectedRequest.classroomKey.classroomName}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    Key Holders
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Holder When Requested</p>
                      <p className="text-gray-900 font-medium">{selectedRequest.holderAtRequestTime.name}</p>
                      {selectedRequest.holderAtRequestTime.email && (
                        <p className="text-gray-600 text-sm">{selectedRequest.holderAtRequestTime.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Current Holder</p>
                      <p className="text-gray-900 font-medium">{selectedRequest.currentHolder.name}</p>
                      {selectedRequest.currentHolder.email && (
                        <p className="text-gray-600 text-sm">{selectedRequest.currentHolder.email}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <FaClock className="mr-2 text-blue-500" />
                    Timing Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Request Time</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedRequest.requestTime).toLocaleString()}
                      </p>
                    </div>
                    {selectedRequest.startTime && selectedRequest.endTime && (
                      <div>
                        <p className="text-xs text-gray-500">Requested Time Slot</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(selectedRequest.startTime).toLocaleString()} -{" "}
                          {new Date(selectedRequest.endTime).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedRequest.purpose && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                      <FaInfoCircle className="mr-2 text-blue-500" />
                      Purpose
                    </h4>
                    <p className="text-gray-900">{selectedRequest.purpose}</p>
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <FaHistory className="mr-2 text-blue-500" />
                    Status
                  </h4>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedRequest.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedRequest.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : selectedRequest.status === "DECLINED"
                        ? "bg-red-100 text-red-800"
                        : selectedRequest.status === "TRANSFER_INITIATED"
                        ? "bg-purple-100 text-purple-800"
                        : selectedRequest.status === "TRANSFER_COMPLETED"
                        ? "bg-teal-100 text-teal-800"
                        : selectedRequest.status === "CANCELLED"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedRequest.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentRequests;