import { useState, useEffect } from "react";
import { 
  FaKey, 
  FaBicycle, 
  FaUser,
  FaEnvelope,
  FaHistory,
  FaInfoCircle,
  FaArrowRight,
  FaStar,
  FaTimes
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudentSidebar from "../student/StudentSidebar";
import { Toaster, toast } from "react-hot-toast";

const BicycleReturnModal = ({ bicycle, onReturn, onClose }) => {
  const [feedback, setFeedback] = useState("");
  const [conditionDescription, setConditionDescription] = useState("");
  const [experienceRating, setExperienceRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onReturn({
        feedback,
        conditionDescription,
        experienceRating
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold flex items-center">
            <FaBicycle className="mr-2 text-green-500" />
            Return Bicycle: {bicycle.name}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              How was your cycling experience? (1-5 stars)
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setExperienceRating(star)}
                  className={`text-2xl ${star <= experienceRating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe the bicycle's condition
            </label>
            <textarea
              value={conditionDescription}
              onChange={(e) => setConditionDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Any damages or issues?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional feedback (optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Your overall experience..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !conditionDescription || experienceRating === 0}
              className={`px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium ${
                isSubmitting || !conditionDescription || experienceRating === 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit & Return'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedBicycle, setSelectedBicycle] = useState(null);
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
        // Fetch keys and bicycles separately using the new APIs
        const [keysResponse, bicyclesResponse] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/history/user/${currentUser.id}/active-keys`,
            { withCredentials: true }
          ),
          axios.get(
            `http://localhost:8080/api/history/user/${currentUser.id}/active-bicycles`,
            { withCredentials: true }
          )
        ]);

        const keys = keysResponse.data.map(item => ({
          id: item.id,
          blockName: item.classroomKey.blockName,
          classroomNumber: item.classroomKey.classroomName,
          since: new Date(item.borrowTime).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        const bicycles = bicyclesResponse.data.map(item => ({
          id: item.id,
          name: item.bicycle.name || `Bicycle #${item.bicycle.id}`,
          qrCode: item.bicycle.qrCode,
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

  const handleReturnClick = (bike) => {
    setSelectedBicycle(bike);
    setReturnModalOpen(true);
  };

  const handleReturnWithFeedback = async (feedbackData) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/history/return-with-feedback/${selectedBicycle.id}`,
        null,
        {
          params: {
            feedback: feedbackData.feedback,
            conditionDescription: feedbackData.conditionDescription,
            experienceRating: feedbackData.experienceRating
          },
          withCredentials: true
        }
      );
      
      setActiveBorrows(prev => ({
        ...prev,
        bicycles: prev.bicycles.filter(b => b.id !== selectedBicycle.id)
      }));
      
      setReturnModalOpen(false);
      toast.success("Bicycle returned successfully with feedback");
    } catch (error) {
      console.error("Error returning bicycle:", error);
      toast.error(error.response?.data || "Failed to return bicycle");
    }
  };

  const handleKeyReturn = async (borrowId) => {
    try {
      await axios.post(
        `http://localhost:8080/api/history/return/${borrowId}`,
        null,
        { withCredentials: true }
      );
      setActiveBorrows(prev => ({
        ...prev,
        keys: prev.keys.filter(key => key.id !== borrowId)
      }));
      toast.success("Key returned successfully");
    } catch (error) {
      console.error("Return error:", error);
      toast.error("Failed to return key");
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
      <Toaster position="top-center" />
      
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
        <div className="mt-6">
          {/* Keys Section */}
          {activeBorrows.keys.length > 0 && (
            <div className="bg-white p-6 shadow-lg rounded-lg mb-6">
              <div className="flex items-center mb-4">
                <FaKey className="text-blue-500 text-xl mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Borrowed Keys</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBorrows.keys.map(key => (
                  <div key={key.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{key.blockName} - {key.classroomNumber}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                          <FiClock className="mr-1" /> Borrowed {key.since}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleKeyReturn(key.id)}
                        className="text-blue-500 hover:text-blue-700 transition-colors flex items-center"
                      >
                        Return <FaArrowRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bicycles Section */}
          {activeBorrows.bicycles.length > 0 && (
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <div className="flex items-center mb-4">
                <FaBicycle className="text-green-500 text-xl mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Borrowed Bicycles</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeBorrows.bicycles.map(bike => (
                  <div key={bike.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">Bicycle: {bike.qrCode || bike.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center">
                          <FiClock className="mr-1" /> Borrowed {bike.since}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleReturnClick(bike)}
                        className="text-green-500 hover:text-green-700 transition-colors flex items-center"
                      >
                        Return <FaArrowRight className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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

      {returnModalOpen && (
        <BicycleReturnModal
          bicycle={selectedBicycle}
          onReturn={handleReturnWithFeedback}
          onClose={() => setReturnModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;