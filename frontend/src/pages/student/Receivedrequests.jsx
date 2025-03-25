import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "./StudentSidebar";
import { 
  FaKey, FaClock, FaTimes, FaCheck, 
  FaExchangeAlt, FaSpinner, FaInfoCircle 
} from "react-icons/fa";

const ReceivedRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  // Fetch current user data
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

  // Fetch received requests when currentUser is available
  useEffect(() => {
    if (!currentUser) return;

    const fetchReceivedRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/key-requests/received-requests/${currentUser.id}`,
          { withCredentials: true }
        );
        setRequests(response.data);
      } catch (error) {
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
    setSelectedRequest(request);
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

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Received Requests</h1>
            <p className="text-gray-600">Manage key requests from other students</p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaKey className="text-blue-500 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No pending requests
              </h3>
              <p className="text-gray-500">
                You haven't received any key requests yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="font-bold text-lg text-gray-800 flex items-center">
                          <FaKey className="text-blue-500 mr-2" />
                          {request.classroomKey.blockName} - {request.classroomKey.classroomName}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            request.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : request.status === "DECLINED"
                              ? "bg-red-100 text-red-800"
                              : request.status === "TRANSFER_INITIATED"
                              ? "bg-purple-100 text-purple-800"
                              : request.status === "TRANSFER_COMPLETED"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">From:</span> {request.student.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Requested:</span>{" "}
                            {new Date(request.requestTime).toLocaleString()}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                        >
                          <FaInfoCircle className="mr-1" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    {request.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleDecline(request.id)}
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center"
                        >
                          <FaTimes className="mr-2" />
                          Decline
                        </button>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <FaCheck className="mr-2" />
                          Approve
                        </button>
                      </>
                    ) : request.status === "APPROVED" ? (
                      <button
                        onClick={() => handleInitiateTransfer(request.id)}
                        className="ml-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
                      >
                        <FaExchangeAlt className="mr-2" />
                        Initiate Transfer
                      </button>
                    ) : request.status === "TRANSFER_INITIATED" ? (
                      <div className="ml-auto text-sm text-purple-600 italic">
                        Waiting for requester to complete transfer
                      </div>
                    ) : request.status === "DECLINED" ? (
                      <div className="ml-auto text-sm text-red-500 italic">
                        Request declined
                      </div>
                    ) : null}
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Request Details
                </h3>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">Classroom</h4>
                  <p className="text-gray-900">
                    {selectedRequest.classroomKey.blockName} - {selectedRequest.classroomKey.classroomName}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Requested By</h4>
                  <p className="text-gray-900">{selectedRequest.student.name}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700">Request Time</h4>
                  <p className="text-gray-900">
                    {new Date(selectedRequest.requestTime).toLocaleString()}
                  </p>
                </div>
                
                {selectedRequest.startTime && selectedRequest.endTime && (
                  <div>
                    <h4 className="font-medium text-gray-700">Requested Time Slot</h4>
                    <p className="text-gray-900">
                      {new Date(selectedRequest.startTime).toLocaleString()} -{" "}
                      {new Date(selectedRequest.endTime).toLocaleString()}
                    </p>
                  </div>
                )}
                
                {selectedRequest.purpose && (
                  <div>
                    <h4 className="font-medium text-gray-700">Purpose</h4>
                    <p className="text-gray-900">{selectedRequest.purpose}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium text-gray-700">Status</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedRequest.status}
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

export default ReceivedRequests;