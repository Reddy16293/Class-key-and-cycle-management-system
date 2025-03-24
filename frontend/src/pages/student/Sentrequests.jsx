import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "./StudentSidebar";
import { 
  FaKey, FaBicycle, FaSignOutAlt, FaHistory, 
  FaInfoCircle, FaEnvelope, FaHome, FaUser,
  FaClock, FaTimes, FaCheck, FaSpinner
} from "react-icons/fa";
import { IoMenu } from "react-icons/io5";

const SentRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
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

  // Fetch sent requests when currentUser is available
  useEffect(() => {
    if (!currentUser) return;

    const fetchSentRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/key-requests/sent-requests/${currentUser.id}`,
          { withCredentials: true }
        );

        // Handle case where no requests exist
        if (response.data.length === 0) {
          setRequests([]);
        } else {
          setRequests(response.data);
        }
      } catch (error) {
        console.error("Error fetching sent requests:", error);
        setError(error.response?.data?.message || "Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, [currentUser]);

  const handleCancelRequest = async (requestId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/key-requests/cancel/${requestId}`,
        null,
        { withCredentials: true }
      );
      
      // Update the request status locally
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId ? { ...req, status: "CANCELED" } : req
        )
      );
    } catch (error) {
      console.error("Error canceling request:", error);
      alert(error.response?.data?.message || "Failed to cancel request");
    }
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
            <h1 className="text-2xl font-bold text-gray-800">Sent Requests</h1>
            <p className="text-gray-600">View all requests you've sent for classroom keys</p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FaEnvelope className="text-blue-500 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No sent requests
              </h3>
              <p className="text-gray-500">
                You haven't sent any key requests yet.
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
                    <div>
                      <h2 className="font-bold text-lg text-gray-800 flex items-center">
                        <FaKey className="text-blue-500 mr-2" />
                        {request.classroom.blockName} - {request.classroom.classroomName}
                      </h2>
                      <div className="mt-2 text-sm text-gray-600 space-y-2">
                        <p>
                          <span className="font-medium">Status:</span>{" "}
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            request.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : request.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : request.status === "DECLINED"
                              ? "bg-red-100 text-red-800"
                              : request.status === "CANCELED"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {request.status}
                          </span>
                        </p>
                        <p>
                          <span className="font-medium">Requested:</span>{" "}
                          {new Date(request.requestTime).toLocaleString()}
                        </p>
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="font-medium text-blue-700">At time of request:</p>
                          <p>
                            <span className="font-medium">Holder:</span>{" "}
                            {request.holderAtRequestTime?.name || "No holder"}
                            {request.holderAtRequestTime?.email && (
                              <span className="text-gray-500 ml-1">({request.holderAtRequestTime.email})</span>
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Key Status:</span>{" "}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              request.keyStatusAtRequest === "Available"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {request.keyStatusAtRequest || "Unknown"}
                            </span>
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium text-gray-700">Current Status:</p>
                          <p>
                            <span className="font-medium">Holder:</span>{" "}
                            {request.currentHolder?.name || "No current holder"}
                            {request.currentHolder?.email && (
                              <span className="text-gray-500 ml-1">({request.currentHolder.email})</span>
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Key Status:</span>{" "}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              request.keyStatus === "Available"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {request.keyStatus || "Unknown"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.status === "PENDING" && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCancelRequest(request.id)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center"
                      >
                        <FaTimes className="mr-2" />
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentRequests;