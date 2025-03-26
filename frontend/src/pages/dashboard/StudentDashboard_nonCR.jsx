import React, { useState, useEffect } from 'react';
import { FaBicycle, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentSidebar_nonCR from '../student_nonCR/StudentSidebar_nonCR';

const StudentDashboard_nonCR = () => {
  const [activeBorrows, setActiveBorrows] = useState({
    bicycles: [],
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchActiveBorrowings = async () => {
      if (!currentUser?.id) return;

      try {
        const response = await axios.get(
          `http://localhost:8080/api/history/user/${currentUser.id}/active-borrowings`,
          { withCredentials: true }
        );
        
        const bicycles = response.data
          .filter(item => item.bicycle)
          .map(item => ({
            id: item.id,
            name: item.bicycle.name,
            since: new Date(item.borrowTime).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

        setActiveBorrows({ bicycles });
      } catch (error) {
        console.error("Error fetching borrowings:", error);
        setError("Failed to load active borrowings");
      }
    };

    fetchActiveBorrowings();
  }, [currentUser?.id]);

  const handleReturn = async (borrowId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/history/return/${borrowId}`,
        null,
        { withCredentials: true }
      );
      setActiveBorrows(prev => ({
        bicycles: prev.bicycles.filter(bike => bike.id !== borrowId)
      }));
      alert("Bicycle returned successfully");
    } catch (error) {
      console.error("Return error:", error);
      alert("Failed to return bicycle");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StudentSidebar_nonCR
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome Back, {currentUser?.name || 'Student'}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your borrowings today.
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfileSidebar(!showProfileSidebar)}
              className="p-2 hover:bg-gray-200 rounded-full flex items-center transition-colors"
            >
              <FaUser className="text-xl text-gray-700" />
            </button>

            {showProfileSidebar && (
              <div className="absolute right-0 top-12 bg-white shadow-xl rounded-lg p-5 min-w-[260px] z-50 border border-gray-100">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 break-words">
                    {currentUser?.name}
                  </h3>
                  <p className="text-sm text-gray-600 break-words leading-tight">
                    {currentUser?.email}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {currentUser?.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {activeBorrows.bicycles.length > 0 && (
          <div className="mt-6 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Active Borrows</h2>
            <p className="text-sm text-gray-500 mt-1">
              Currently borrowed bicycles
            </p>
            <div className="mt-4 space-y-3">
              {activeBorrows.bicycles.map((bicycle) => (
                <div
                  key={bicycle.id}
                  className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <FaBicycle className="mr-3 text-indigo-600" />
                    <span className="text-gray-700">
                      {bicycle.name}{" "}
                      <span className="text-sm text-gray-500">
                        (Since {bicycle.since})
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => handleReturn(bicycle.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Return
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 shadow-lg rounded-lg flex flex-col items-center text-white hover:shadow-xl transition-shadow">
            <FaBicycle className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">Borrow Bicycles</h3>
            <p className="text-sm text-green-100 text-center mt-2">
              Scan QR code to borrow campus bicycles
            </p>
            <button
              onClick={() => navigate("/borrowbicycle_nonCR")}
              className="mt-4 bg-white text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-colors"
            >
              Borrow Bicycles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard_nonCR;