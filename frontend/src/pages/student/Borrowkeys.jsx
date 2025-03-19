import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaKey,
  FaBicycle,
  FaEnvelope,
  FaHistory,
  FaInfoCircle,
  FaSignOutAlt,
  FaBuilding,
  FaHome,
  FaLock,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const BorrowKeys = () => {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startTime, setStartTime] = useState("2.00");
  const [startPeriod, setStartPeriod] = useState("PM");
  const [endTime, setEndTime] = useState("5.00");
  const [endPeriod, setEndPeriod] = useState("PM");
  const [classrooms, setClassrooms] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch current user's ID on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setCurrentUserId(response.data.id);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Process block name and floor
  const processBlockName = (blockName) => {
    return blockName.replace(" Block", "").trim();
  };

  const processFloor = (floor) => {
    return floor.replace(/\D/g, "");
  };

  // Fetch available rooms based on building and floor
  const fetchAvailableRooms = async (blockName, floor) => {
    try {
      const processedBlockName = processBlockName(blockName);
      const processedFloor = processFloor(floor);

      const response = await axios.get(
        `http://localhost:8080/api/student/all-keys/${processedBlockName}/${processedFloor}`,
        { headers: { "Accept": "application/json" } }
      );

      if (Array.isArray(response.data)) {
        setClassrooms(response.data);
      } else {
        throw new Error("Invalid response format: Expected an array");
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    }
  };

  useEffect(() => {
    if (building && floor) {
      fetchAvailableRooms(building, floor);
    }
  }, [building, floor]);

  // Handle borrowing a classroom key
  const handleBorrowClick = (room) => {
    setSelectedRoom({
      building,
      floor,
      room: room.classroomName,
      keyId: room.id,
    });
  };

  const handleCancel = () => {
    setSelectedRoom(null);
  };

  const handleBookNow = async () => {
    if (!selectedRoom) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/api/student/book-classroom-key/${selectedRoom.keyId}`,
        null,
        {
          params: {
            userId: currentUserId,
          },
          withCredentials: true,
        }
      );

      alert(response.data);
      fetchAvailableRooms(building, floor);
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error booking key:", error);
      alert("Failed to book the key. Please try again.");
    }
  };

  // Request access to a key booked by another student
  const handleRequestAccess = async (keyId) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/key-requests/request",
        null,
        {
          params: {
            studentId: currentUserId,
            classroomKeyId: keyId,
          },
          withCredentials: true,
        }
      );

      alert(response.data);
      fetchAvailableRooms(building, floor);
    } catch (error) {
      console.error("Error requesting access:", error);
      alert("Failed to request access. Please try again.");
    }
  };

  // Fetch key request details
  const fetchKeyRequestDetails = async (classroomKeyId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/key-requests/request-details/${classroomKeyId}`
      );

      if (response.data === "Key is available") {
        alert("Key is available for booking.");
      } else {
        const keyRequest = response.data;

        if (keyRequest.student.id === currentUserId) {
          alert("You already booked this key.");
        } else {
          alert(`Key is currently booked by ${keyRequest.student.name}.`);
        }
      }
    } catch (error) {
      console.error("Error fetching key request details:", error);
      alert("Failed to fetch key request details.");
    }
  };

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
        <div className="max-w-4xl mx-auto">
          {!selectedRoom ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Classroom Keys
              </h1>
              <p className="text-gray-600 mb-6">
                Select a building and floor to see available classroom keys
              </p>

              {/* Building and Floor Selection */}
              <div className="flex space-x-4 mb-8">
                <select
                  className="border p-3 rounded-lg w-1/2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={building}
                  onChange={(e) => {
                    setBuilding(e.target.value);
                    setFloor("");
                  }}
                >
                  <option value="">Select a building</option>
                  <option value="ELHC Block">ELHC Block</option>
                  <option value="A Block">A Block</option>
                  <option value="B Block">B Block</option>
                  <option value="C Block">C Block</option>
                </select>
                <select
                  className="border p-3 rounded-lg w-1/2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  disabled={!building}
                >
                  <option value="">
                    {building ? "Select a floor" : "Select a building first"}
                  </option>
                  <option value="1st Floor">1st Floor</option>
                  <option value="2nd Floor">2nd Floor</option>
                  <option value="3rd Floor">3rd Floor</option>
                  <option value="4th Floor">4th Floor</option>
                </select>
              </div>

              {/* Classroom List */}
              {!building || !floor ? (
                <div className="flex flex-col items-center text-gray-500">
                  <FaBuilding className="text-6xl mb-4" />
                  <p className="text-lg font-medium">Select a building and floor</p>
                  <p className="text-sm">
                    Choose a building and floor to see available classrooms
                  </p>
                </div>
              ) : (
                <div className="bg-white p-6 shadow-lg rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">
                    Available Classrooms - {building}, {floor}
                  </h2>
                  <ul className="space-y-3">
                    {classrooms.map((room) => (
                      <li
                        key={room.id}
                        className="p-4 flex items-center justify-between border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <span
                          className={`font-medium ${
                            room.isAvailable === 1 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          Room {room.classroomName} -{" "}
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-sm ${
                              room.isAvailable === 1
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {room.isAvailable === 1 ? "Available" : "In Use"}
                          </span>
                        </span>
                        {room.isAvailable === 1 ? (
                          <button
                            onClick={() => handleBorrowClick(room)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-colors"
                          >
                            Borrow Key <FaKey className="ml-2" />
                          </button>
                        ) : (
                          <button
                            onClick={() => fetchKeyRequestDetails(room.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors"
                          >
                            Request Key <FaLock className="ml-2" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            // Booking Form
            <div className="bg-white p-6 shadow-lg rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Book Classroom Key
              </h2>
              <div className="mb-6">
                <p className="text-lg font-medium text-gray-700">
                  {selectedRoom.building}, {selectedRoom.floor}
                </p>
                <p className="text-gray-600">Room {selectedRoom.room}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start time
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="border p-2 rounded-lg w-24"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                      <select
                        className="border p-2 rounded-lg"
                        value={startPeriod}
                        onChange={(e) => setStartPeriod(e.target.value)}
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End time
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="border p-2 rounded-lg w-24"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                      />
                      <select
                        className="border p-2 rounded-lg"
                        value={endPeriod}
                        onChange={(e) => setEndPeriod(e.target.value)}
                      >
                        <option>AM</option>
                        <option>PM</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleBookNow}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Book Now
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowKeys;