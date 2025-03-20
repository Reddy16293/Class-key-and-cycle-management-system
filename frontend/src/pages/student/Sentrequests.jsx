import { useState, useEffect } from "react";
import { FaKey, FaBicycle, FaSignOutAlt, FaHistory, FaInfoCircle, FaEnvelope, FaHome } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SentRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [requests, setRequests] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // State to store the user ID
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch the current user ID
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/user", {
        withCredentials: true,
      });
      return response.data?.id; // Return the user ID
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  };

  // Fetch recipient details
  const fetchRecipientDetails = async (recipientId) => {
    try {
      console.log("Fetching recipient details for ID:", recipientId); // Log the recipient ID
      const response = await axios.get(`http://localhost:8080/api/student/${recipientId}`, {
        withCredentials: true,
      });
      console.log("Recipient details:", response.data); // Log the recipient details
      return response.data; // Return the recipient's details
    } catch (error) {
      console.error("Error fetching recipient details:", error);
      return null;
    }
  };

  // Fetch sent requests from the backend
  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const userId = await fetchCurrentUser(); // Fetch the current user ID
        if (userId) {
          setUserId(userId); // Set the user ID in the state
          const response = await axios.get(`http://localhost:8080/api/key-requests/sent-requests/${userId}`, {
            withCredentials: true, // Include credentials for authentication
          });
          console.log("Backend Response:", response.data); // Log the response for debugging

          // Handle the case where the response is a string (e.g., "No key requests sent.")
          if (typeof response.data === "string") {
            setRequests([]); // Set requests to an empty array
          } else if (Array.isArray(response.data)) {
            // Fetch recipient details for each request
            const requestsWithRecipients = await Promise.all(
              response.data.map(async (req) => {
                console.log("Request object:", req); // Log the request object
                const recipient = await fetchRecipientDetails(req.recipientId); // Fetch recipient details
                return { ...req, recipient }; // Add recipient details to the request object
              })
            );
            console.log("Requests with recipients:", requestsWithRecipients); // Log the final requests array
            setRequests(requestsWithRecipients); // Set requests with recipient details
          } else {
            console.error("Unexpected data format:", response.data);
            setError("Unexpected data format received from the server.");
          }
        } else {
          setError("User not authenticated. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching sent requests:", error);
        setError("Failed to fetch sent requests. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentRequests();
  }, []);

  // Handle canceling a request
  const handleCancelRequest = async (requestId) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/key-requests/cancel/${requestId}`, null, {
        withCredentials: true, // Include credentials for authentication
      });
      if (response.status === 200) {
        // Remove the canceled request from the list
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        alert("Request canceled successfully");
      }
    } catch (error) {
      console.error("Error canceling request:", error);
      alert("Failed to cancel request. Please try again.");
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-blue-600 to-blue-700 shadow-lg flex flex-col p-4 ${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300`}
      >
        <button
          className="mb-4 p-2 text-white hover:bg-blue-500 rounded-full transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <IoMenu className="text-xl" />
        </button>
        {sidebarOpen && (
          <h2 className="text-xl font-bold mb-6 text-white">Student Portal</h2>
        )}
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => navigate("/dashboard/student")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/dashboard/student"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaHome className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Dashboard"}
          </button>
          <button
            onClick={() => navigate("/borrowkeys")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/borrowkeys"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaKey className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Borrow Keys"}
          </button>
          <button
            onClick={() => navigate("/borrowbicycle")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/borrowbicycle"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaBicycle className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Borrow Bicycles"}
          </button>
          <button
            onClick={() => navigate("/receivedrequests")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/receivedrequests"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaEnvelope className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Received Requests"}
          </button>
          <button
            onClick={() => navigate("/sentrequests")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/sentrequests"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FiClock className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Sent Requests"}
          </button>
          <button
            onClick={() => navigate("/viewhistory")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/viewhistory"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaHistory className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "View History"}
          </button>
          <button
            onClick={() => navigate("/s-about")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/s-about"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaInfoCircle className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "About"}
          </button>
        </nav>
        <button
          onClick={() => navigate("/")}
          className={`w-full py-2 flex items-center ${
            sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
          } ${
            location.pathname === "/"
              ? "bg-blue-500 text-white"
              : "text-white hover:bg-blue-500"
          } rounded-lg transition-all`}
        >
          <FaSignOutAlt className={`${sidebarOpen ? "mr-2" : ""}`} />
          {sidebarOpen && "Sign Out"}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sent Requests</h1>
        <p className="text-gray-600 mb-6">Manage your sent requests</p>
        <div className="space-y-4">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">
                      {req.classroomKey.blockName} - Room {req.classroomKey.classroomName}
                    </h2>
                   {/*} <p className="text-gray-500">
                      Requested by: {req.student.name} {/* Display the sender's name */}
                   {/* </p>
                   {/* <p className="text-gray-500">
                      Sent to: {req.recipient?.name || "Unknown"} {/* Display the recipient's name */}
                   {/*} </p>
                    <p className="text-gray-500">
                      Recipient Email: {req.recipient?.email || "Unknown"} {/* Display the recipient's email */}
                    {/*</p> */}
                    <p className="text-gray-500 flex items-center">
                      📅 Requested on {new Date(req.requestTime).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      req.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : req.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                {req.status === "PENDING" && (
                  <button
                    onClick={() => handleCancelRequest(req.id)}
                    className="mt-4 py-2 px-4 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    ❌ Cancel Request
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No sent requests found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentRequests;