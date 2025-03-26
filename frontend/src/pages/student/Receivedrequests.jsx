import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "./StudentSidebar";
import { 
  FaKey, FaClock, FaTimes, FaCheck, 
  FaExchangeAlt, FaSpinner, FaInfoCircle,
  FaCalendarAlt, FaUser, FaBuilding, FaHistory
} from "react-icons/fa";

const ReceivedRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  // Validate and normalize request data
  const normalizeRequest = (request) => {
    return {
      id: request.id || 0,
      status: request.status || 'UNKNOWN',
      requestTime: request.requestTime || new Date().toISOString(),
      startTime: request.startTime,
      endTime: request.endTime,
      purpose: request.purpose || '',
      student: request.student || {
        id: 0,
        name: 'Unknown Student',
        email: ''
      },
      classroomKey: request.classroomKey || {
        id: 0,
        blockName: 'Unknown Block',
        classroomName: 'Unknown Classroom',
        floor: 'Unknown Floor'
      }
    };
  };

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
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchReceivedRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/key-requests/received-requests/${currentUser.id}`,
          { withCredentials: true }
        );
        
        // Normalize all requests to ensure consistent structure
        const normalizedRequests = Array.isArray(response.data) 
          ? response.data.map(normalizeRequest)
          : [];
        
        setRequests(normalizedRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
        setError(error.response?.data?.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedRequests();
  }, [currentUser]);

  const handleApprove = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/key-requests/approve/${requestId}`,
        null,
        { withCredentials: true }
      );
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: "APPROVED" } : req
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
      alert(error.response?.data?.message || "Failed to approve request");
    }
  };

  const handleDecline = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/key-requests/decline/${requestId}`,
        null,
        { withCredentials: true }
      );
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: "DECLINED" } : req
        )
      );
    } catch (error) {
      console.error("Error declining request:", error);
      alert(error.response?.data?.message || "Failed to decline request");
    }
  };

  const handleInitiateTransfer = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/key-requests/initiate-transfer/${requestId}`,
        null,
        { withCredentials: true }
      );
      
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: "TRANSFER_INITIATED" } : req
        )
      );
    } catch (error) {
      console.error("Error initiating transfer:", error);
      alert(error.response?.data?.message || "Failed to initiate transfer");
    }
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(normalizeRequest(request));
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "PENDING" },
      APPROVED: { bg: "bg-green-100", text: "text-green-800", label: "APPROVED" },
      DECLINED: { bg: "bg-red-100", text: "text-red-800", label: "DECLINED" },
      TRANSFER_INITIATED: { bg: "bg-purple-100", text: "text-purple-800", label: "TRANSFER INITIATED" },
      TRANSFER_COMPLETED: { bg: "bg-teal-100", text: "text-teal-800", label: "TRANSFER COMPLETED" },
    };

    const { bg, text, label } = statusMap[status] || { 
      bg: "bg-gray-100", 
      text: "text-gray-800", 
      label: status || "UNKNOWN" 
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    );
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Received Requests</h1>
            <p className="text-gray-600">Manage key requests from other students</p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-200">
              <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaKey className="text-blue-500 text-2xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No pending requests
              </h3>
              <p className="text-gray-500">
                You haven't received any key requests yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="font-bold text-xl text-gray-800 flex items-center">
                          <FaBuilding className="text-blue-500 mr-3" />
                          {request.classroomKey.blockName} - {request.classroomKey.classroomName}
                        </h2>
                        <div className="flex items-center mt-2">
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                      >
                        <FaInfoCircle className="text-lg" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <FaUser className="mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm">Requested by</p>
                          <p className="font-medium text-gray-800">{request.student.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-3 text-gray-400" />
                        <div>
                          <p className="text-sm">Requested on</p>
                          <p className="font-medium text-gray-800">
                            {new Date(request.requestTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      {request.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleDecline(request.id)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                          >
                            <FaTimes className="mr-2" />
                            Decline
                          </button>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                          >
                            <FaCheck className="mr-2" />
                            Approve
                          </button>
                        </>
                      )}
                      
                      {request.status === "APPROVED" && (
                        <button
                          onClick={() => handleInitiateTransfer(request.id)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                          <FaExchangeAlt className="mr-2" />
                          Initiate Transfer
                        </button>
                      )}
                      
                      {request.status === "TRANSFER_INITIATED" && (
                        <div className="flex-1 text-center text-sm text-purple-600 italic py-2">
                          Waiting for requester to complete transfer
                        </div>
                      )}
                      
                      {request.status === "DECLINED" && (
                        <div className="flex-1 text-center text-sm text-red-500 italic py-2">
                          Request declined
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                    Requester Information
                  </h4>
                  <div>
                    <p className="text-xs text-gray-500">Student Name</p>
                    <p className="text-gray-900 font-medium">{selectedRequest.student.name}</p>
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
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedRequests;