import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaKey, FaBuilding, FaLock, FaSearch, FaUser, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import RequestModal from "./RequestModal";
import ClassroomBookingModal from "./ClassroomBookingModal";

const BorrowKeys = () => {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [keyStatuses, setKeyStatuses] = useState({});
  const [showRequestModal, setShowRequestModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const processBlockName = (blockName) => {
    return blockName.replace(" Block", "").trim();
  };

  const processFloor = (floor) => {
    return floor.replace(/\D/g, "");
  };

  const fetchAvailableRooms = async (blockName, floor) => {
    setLoading(true);
    try {
      const processedBlockName = processBlockName(blockName);
      const processedFloor = processFloor(floor);

      const response = await axios.get(
        `http://localhost:8080/api/student/all-keys/${processedBlockName}/${processedFloor}`,
        { headers: { "Accept": "application/json" } }
      );

      if (Array.isArray(response.data)) {
        setClassrooms(response.data);
        
        const statuses = {};
        for (const room of response.data) {
          if (room.isAvailable === 0) {
            try {
              const statusResponse = await axios.get(
                `http://localhost:8080/api/key-requests/request-details/${room.id}`,
                { withCredentials: true }
              );
              statuses[room.id] = statusResponse.data;
            } catch (error) {
              console.error(`Error fetching status for room ${room.id}:`, error);
              statuses[room.id] = { 
                keyStatus: "Unavailable",
                error: "Could not fetch details" 
              };
            }
          }
        }
        setKeyStatuses(statuses);
      } else {
        throw new Error("Invalid response format: Expected an array");
      }
    } catch (error) {
      console.error("Error fetching available rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (building && floor) {
      fetchAvailableRooms(building, floor);
    }
  }, [building, floor]);

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
            userId: currentUser.id,
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

  const userHasKey = (keyId) => {
    if (!currentUser) return false;
    const status = keyStatuses[keyId];
    return status?.currentHolder?.id === currentUser.id;
  };

  const handleRequestAccess = (room) => {
    setSelectedRoom({
      building,
      floor,
      room: room.classroomName,
      keyId: room.id,
    });
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (requestData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/key-requests/request",
        null,
        {
          params: {
            studentId: currentUser.id,
            classroomKeyId: selectedRoom.keyId,
            startTime: requestData.startTime,
            endTime: requestData.endTime,
            purpose: requestData.purpose
          },
          withCredentials: true,
        }
      );

      alert(response.data);
      fetchAvailableRooms(building, floor);
      setShowRequestModal(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error("Error requesting access:", error);
      alert("Failed to request access. Please try again.");
    }
  };

  const filteredClassrooms = classrooms.filter((room) =>
    room.classroomName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {!selectedRoom && !showRequestModal ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Classroom Keys
                </h1>
                <p className="text-gray-600">
                  Select a building and floor to see available classroom keys
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor
                    </label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                </div>

                {building && floor && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search classrooms..."
                      className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {!building || !floor ? (
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                  <div className="max-w-md mx-auto">
                    <FaBuilding className="text-6xl text-indigo-200 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                      Select a building and floor
                    </h3>
                    <p className="text-gray-500">
                      Choose a building and floor to see available classrooms
                    </p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Available Classrooms - {building}, {floor}
                    </h2>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {filteredClassrooms.length > 0 ? (
                      filteredClassrooms.map((room) => {
                        const hasKey = userHasKey(room.id);
                        const status = keyStatuses[room.id] || {};
                        const currentHolder = status?.currentHolder;
                        const requester = status?.requester;
                        
                        return (
                          <li key={room.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className={`font-medium ${
                                  room.isAvailable === 1 ? "text-indigo-600" : "text-gray-600"
                                }`}>
                                  Room {room.classroomName}
                                </span>
                                <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full ${
                                  room.isAvailable === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}>
                                  {room.isAvailable === 1 ? "Available" : "In Use"}
                                </span>
                                {hasKey && (
                                  <span className="ml-2 inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                    You have this key
                                  </span>
                                )}
                              </div>
                              {room.isAvailable === 1 ? (
                                <button
                                  onClick={() => handleBorrowClick(room)}
                                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-colors flex items-center"
                                >
                                  <FaKey className="mr-2" />
                                  Borrow Key
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRequestAccess(room)}
                                  disabled={hasKey}
                                  className={`px-4 py-2 rounded-lg flex items-center ${
                                    hasKey
                                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-colors"
                                  }`}
                                >
                                  <FaLock className="mr-2" />
                                  {hasKey ? "You have this key" : "Request Access"}
                                </button>
                              )}
                            </div>
                            
                            {room.isAvailable === 0 && currentHolder && (
                              <div className="mt-2 text-sm text-gray-500 flex items-center">
                                <FaUser className="mr-2 text-gray-400" />
                                <span>
                                  Currently held by: {currentHolder.name}
                                  {currentHolder.email && ` (${currentHolder.email})`}
                                </span>
                              </div>
                            )}
                            
                            {room.isAvailable === 0 && requester && !hasKey && (
                              <div className="mt-1 text-sm text-gray-500 flex items-center">
                                <FaInfoCircle className="mr-2 text-gray-400" />
                                <span>
                                  Requested by: {requester.name}
                                  {requester.email && ` (${requester.email})`}
                                </span>
                              </div>
                            )}
                            
                            {room.isAvailable === 0 && !currentHolder && !requester && (
                              <div className="mt-1 text-sm text-gray-500 flex items-center">
                                <FaInfoCircle className="mr-2 text-gray-400" />
                                <span>Key is currently unavailable</span>
                              </div>
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <li className="p-8 text-center text-gray-500">
                        No classrooms found matching your search
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </>
          ) : showRequestModal ? (
            <RequestModal
              selectedRoom={selectedRoom}
              handleSubmit={handleSubmitRequest}
              handleCancel={() => {
                setShowRequestModal(false);
                setSelectedRoom(null);
              }}
              userId={currentUser?.id}
            />
          ) : (
            <ClassroomBookingModal
              selectedRoom={selectedRoom}
              handleBookNow={handleBookNow}
              handleCancel={handleCancel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowKeys;