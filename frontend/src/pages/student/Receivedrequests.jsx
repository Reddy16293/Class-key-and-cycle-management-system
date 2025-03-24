import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "./StudentSidebar";
import { FaKey, FaClock, FaTimes, FaCheck } from "react-icons/fa";

const ReceivedRequests = () => {
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <StudentSidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          user={currentUser} 
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
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
            <p className="text-gray-600">All requests for keys you hold/have held</p>
          </div>

          {requests.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FaKey className="text-indigo-500 text-xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No requests found
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
                    <div>
                      <h2 className="font-bold text-lg text-gray-800 flex items-center">
                        <FaKey className="text-indigo-500 mr-2" />
                        {request.classroomKey.blockName} - {request.classroomKey.classroomName}
                      </h2>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">From:</span> {request.student.name}
                        </p>
                        <p>
                          <span className="font-medium">Requested:</span>{" "}
                          {new Date(request.requestTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>

                  {request.status === "PENDING" ? (
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleDecline(request.id)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors flex items-center"
                      >
                        <FaTimes className="mr-2" />
                        Decline
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <FaCheck className="mr-2" />
                        Approve
                      </button>
                    </div>
                  ) : request.status === "DECLINED" ? (
                    <div className="mt-4 text-right">
                      <span className="text-sm text-gray-500 italic flex items-center justify-end">
                        <FaTimes className="mr-1 text-red-500" />
                        You declined this request
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 text-right">
                      <span className="text-sm text-gray-500 italic flex items-center justify-end">
                        <FaCheck className="mr-1 text-green-500" />
                        You approved this request
                      </span>
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

export default ReceivedRequests;