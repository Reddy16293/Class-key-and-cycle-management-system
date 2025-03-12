import { useState } from "react";
import { FaKey, FaBicycle, FaSignOutAlt, FaHistory, FaInfoCircle, FaEnvelope, FaHome } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Receivedrequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const requests = [
    { id: 1, room: "Room 101", from: "Jane Smith", time: "Jun 15, 04:00 PM", status: "Pending" },
    { id: 2, room: "Room 202", from: "Alex Johnson", time: "Jun 14, 10:15 PM", status: "Pending" },
    { id: 3, room: "Room 305", from: "Sam Wilson", time: "Jun 13, 02:45 PM", status: "Approved" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-white shadow-md flex flex-col p-4 ${sidebarOpen ? "w-64" : "w-16"} transition-all`}>
  <button className="mb-4 p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
    <IoMenu className="text-xl" />
  </button>
  {sidebarOpen && <h2 className="text-xl font-bold mb-6">Student Portal</h2>}
  <nav className="flex-1 space-y-4">
    <button 
      onClick={() => navigate('/dashboard/student')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaHome className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Dashboard"}
    </button>
    <button 
      onClick={() => navigate('/borrowkeys')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaKey className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Borrow Keys"}
    </button>
    <button 
      onClick={() => navigate('/borrowbicycle')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaBicycle className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Borrow Bicycles"}
    </button>
    <button 
      onClick={() => navigate('/receivedrequests')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaEnvelope className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Received Requests"}
    </button>
    <button 
      onClick={() => navigate('/sentrequests')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FiClock className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "Sent Requests"}
    </button>
    <button 
      onClick={() => navigate('/viewhistory')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaHistory className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "View History"}
    </button>
    <button 
      onClick={() => navigate('/s-about')} 
      className={`w-full py-2 hover:bg-gray-200 flex items-center ${sidebarOpen ? "px-4 text-left" : "px-2 justify-center"}`}
    >
      <FaInfoCircle className={sidebarOpen ? "mr-2" : ""} /> 
      {sidebarOpen && "About"}
    </button>
  </nav>
  <button className={`mt-auto text-red-500 flex items-center ${!sidebarOpen ? "justify-center" : ""}`}>
    <FaSignOutAlt className={sidebarOpen ? "mr-2" : ""} /> 
    {sidebarOpen && "Sign Out"}
  </button>
</aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Received Requests</h1>
        <p className="text-gray-600 mb-4">Manage your received key requests</p>
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="p-4 bg-white shadow-md rounded-lg">
              <h2 className="text-lg font-bold flex items-center">
                <FaKey className="mr-2" /> {req.room}
              </h2>
              <p className="text-gray-700">From: {req.from}</p>
              <p className="text-gray-500">Requested on {req.time}</p>
              <div className="mt-4 flex justify-between items-center">
                {req.status === "Pending" ? (
                  <>
                    <button className="px-4 py-2 border rounded mr-2">Decline</button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded">Approve</button>
                  </>
                ) : (
                  <span className="text-green-600 font-bold">Approved</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Receivedrequests;
