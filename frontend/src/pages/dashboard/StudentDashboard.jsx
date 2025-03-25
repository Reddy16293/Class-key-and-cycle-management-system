import { useState, useEffect } from "react";
import { 
  FaKey, 
  FaBicycle, 
  FaUser,
  FaEnvelope, // Added missing import
  FaHistory,
  FaInfoCircle
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "../student/StudentSidebar";

const StudentDashboard = () => {
  const [activeBorrows, setActiveBorrows] = useState({
    keys: [],
    bicycles: [],
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch current user data
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
        
        const keys = response.data
          .filter(item => item.classroomKey)
          .map(item => ({
            id: item.id,
            name: item.classroomKey.classroomName,
            blockName: item.classroomKey.blockName,
            classroomNumber: item.classroomKey.classroomName,
            since: new Date(item.borrowTime).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));

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

        setActiveBorrows({ keys, bicycles });
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
        keys: prev.keys.filter(key => key.id !== borrowId),
        bicycles: prev.bicycles.filter(bike => bike.id !== borrowId)
      }));
      alert("Item returned successfully");
    } catch (error) {
      console.error("Return error:", error);
      alert("Failed to return item");
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
  // Rest of your component code remains the same...
  // [Previous useEffect for fetchActiveBorrowings]
  // [handleReturn function]
  // [Loading and error states]

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header and Profile Button */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome Back, {currentUser?.name || "User"}
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your borrowings today.
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfileSidebar(!showProfileSidebar)}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <FaUser className="text-xl text-gray-700" />
            </button>
            {showProfileSidebar && (
              <div className="absolute right-0 top-12 bg-white shadow-xl rounded-lg p-5 min-w-[260px] z-50 border border-gray-100">
                <h3 className="text-lg font-semibold">{currentUser?.name}</h3>
                <p className="text-sm text-gray-600">{currentUser?.email}</p>
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full mt-2 inline-block">
                  {currentUser?.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Active Borrows Section */}
        {(activeBorrows.keys.length > 0 || activeBorrows.bicycles.length > 0) && (
          <div className="mt-6 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Active Borrows</h2>
            <div className="mt-4 space-y-3">
              {activeBorrows.keys.map(key => (
                <div key={key.id} className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex flex-col">
                    <span className="text-gray-700 font-medium">{key.name}</span>
                    <span className="text-sm text-gray-500">Block: {key.blockName}, Room: {key.classroomNumber}</span>
                    <span className="text-sm text-gray-500">Since {key.since}</span>
                  </div>
                  <button 
                    onClick={() => handleReturn(key.id)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Return
                  </button>
                </div>
              ))}
              {activeBorrows.bicycles.map(bike => (
                <div key={bike.id} className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow">
                  <div className="flex flex-col">
                    <span className="text-gray-700 font-medium">{bike.name}</span>
                    <span className="text-sm text-gray-500">Since {bike.since}</span>
                  </div>
                  <button 
                    onClick={() => handleReturn(bike.id)}
                    className="text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Return
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg rounded-lg flex flex-col items-center text-white hover:shadow-xl transition-shadow">
            <FaKey className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">Borrow Keys</h3>
            <p className="text-sm text-blue-100 text-center mt-2">
              Borrow classroom keys or request from others
            </p>
            <button
              onClick={() => navigate("/borrowkeys")}
              className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors"
            >
              Borrow Keys
            </button>
          </div>
          <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 shadow-lg rounded-lg flex flex-col items-center text-white hover:shadow-xl transition-shadow">
            <FaBicycle className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">Borrow Bicycles</h3>
            <p className="text-sm text-green-100 text-center mt-2">
              Scan QR code to borrow campus bicycles
            </p>
            <button
              onClick={() => navigate("/borrowbicycle")}
              className="mt-4 bg-white text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-colors"
            >
              Borrow Bicycles
            </button>
          </div>
          <div className="p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg rounded-lg flex flex-col items-center text-white hover:shadow-xl transition-shadow">
            <FaEnvelope className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">Received Requests</h3>
            <p className="text-sm text-yellow-100 text-center mt-2">
              Check pending key requests from others
            </p>
            <button
              onClick={() => navigate("/receivedrequests")}
              className="mt-4 bg-white text-yellow-600 px-6 py-2 rounded-full hover:bg-yellow-50 transition-colors"
            >
              View Requests
            </button>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg rounded-lg flex flex-col items-center text-white hover:shadow-xl transition-shadow">
            <FiClock className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">Sent Requests</h3>
            <p className="text-sm text-purple-100 text-center mt-2">
              Track your sent key requests
            </p>
            <button
              onClick={() => navigate("/sentrequests")}
              className="mt-4 bg-white text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors"
            >
              View Requests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;