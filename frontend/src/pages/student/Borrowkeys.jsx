import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaKey, 
  FaBuilding, 
  FaLock, 
  FaSearch, 
  FaUser, 
  FaInfoCircle, 
  FaArrowRight 
} from "react-icons/fa";
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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-3">
                  Classroom Key Management
                </h1>
                <p className="text-lg text-gray-600 font-medium">
                  Discover and manage classroom keys with ease
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FaBuilding className="mr-2 text-indigo-500" />
                      Select Building
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50"
                      value={building}
                      onChange={(e) => {
                        setBuilding(e.target.value);
                        setFloor("");
                      }}
                    >
                      <option value="">Choose a building</option>
                      <option value="ELHC Block">ELHC Block</option>
                      <option value="A Block">A Block</option>
                      <option value="B Block">B Block</option>
                      <option value="C Block">C Block</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <FaKey className="mr-2 text-indigo-500" />
                      Select Floor
                    </label>
                    <select
                      className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50"
                      value={floor}
                      onChange={(e) => setFloor(e.target.value)}
                      disabled={!building}
                    >
                      <option value="">
                        {building ? "Choose floor" : "Select building first"}
                      </option>
                      <option value="1st Floor">1st Floor</option>
                      <option value="2nd Floor">2nd Floor</option>
                      <option value="3rd Floor">3rd Floor</option>
                      <option value="4th Floor">4th Floor</option>
                    </select>
                  </div>
                </div>

                {building && floor && (
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search classrooms..."
                      className="pl-12 w-full px-4 py-3 border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white/50"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {!building || !floor ? (
                <div className="bg-white/80 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-white/20 text-center">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="inline-flex p-4 bg-indigo-100 rounded-2xl">
                      <FaBuilding className="text-5xl text-indigo-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      Let's Find Your Classroom
                    </h3>
                    <p className="text-gray-500 text-lg">
                      Start by selecting a building and floor to view available keys
                    </p>
                  </div>
                </div>
              ) : loading ? (
                <div className="flex justify-center items-center h-64 space-x-4">
                  <div className="animate-pulse bg-indigo-100 w-12 h-12 rounded-full"></div>
                  <div className="animate-pulse bg-indigo-100 w-12 h-12 rounded-full delay-100"></div>
                  <div className="animate-pulse bg-indigo-100 w-12 h-12 rounded-full delay-200"></div>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600">
                    <h2 className="text-xl font-semibold text-white">
                      {building} • {floor}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredClassrooms.length > 0 ? (
                      filteredClassrooms.map((room) => {
                        const hasKey = userHasKey(room.id);
                        const status = keyStatuses[room.id] || {};
                        const currentHolder = status?.currentHolder;
                        const requester = status?.requester;
                        
                        return (
                          <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100/50">
                            <div className="flex flex-col space-y-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className={`text-xl font-semibold ${
                                    room.isAvailable === 1 ? "text-indigo-600" : "text-gray-600"
                                  }`}>
                                    {room.classroomName}
                                  </h3>
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                    room.isAvailable === 1 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-rose-100 text-rose-800"
                                  }`}>
                                    {room.isAvailable === 1 ? (
                                      <><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>Available</>
                                    ) : (
                                      <><span className="w-2 h-2 bg-rose-500 rounded-full mr-2"></span>In Use</>
                                    )}
                                  </span>
                                </div>
                                <div className="text-2xl text-indigo-100 bg-indigo-600 p-2 rounded-lg">
                                  <FaKey />
                                </div>
                              </div>

                              {room.isAvailable === 1 ? (
                                <button
                                  onClick={() => handleBorrowClick(room)}
                                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                                >
                                  <FaKey className="text-lg" />
                                  <span>Borrow Key</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRequestAccess(room)}
                                  disabled={hasKey}
                                  className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                                    hasKey
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-[1.02]"
                                  }`}
                                >
                                  <FaLock className="text-lg" />
                                  <span>{hasKey ? "Key in Possession" : "Request Access"}</span>
                                </button>
                              )}

                              {room.isAvailable === 0 && currentHolder && (
                                <div className="mt-2 text-sm text-gray-500 flex items-center">
                                  <FaUser className="mr-2 text-gray-400" />
                                  <span>
                                    Currently held by: {currentHolder.name}
                                    {currentHolder.email && ` (${currentHolder.email})`}
                                  </span>
                                </div>
                              )}
                              

                              {/* if room available */}
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
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center p-8 space-y-4">
                        <div className="text-6xl text-gray-300 mx-auto">
                          <FaSearch />
                        </div>
                        <p className="text-xl text-gray-500 font-medium">
                          No matching classrooms found
                        </p>
                      </div>
                    )}
                  </div>
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