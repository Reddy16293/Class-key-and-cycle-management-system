import { useState } from "react";
import { FaKey, FaBicycle, FaSignOutAlt, FaHistory, FaInfoCircle, FaEnvelope, FaHome } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const SentRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const requests = [
    {
      room: "Room 103",
      to: "John Doe",
      date: "Jun 16, 07:50 PM",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700",
    },
    {
      room: "Room 205",
      to: "Emily Clark",
      date: "Jun 15, 05:00 PM",
      status: "Approved",
      statusColor: "bg-green-100 text-green-700",
    },
    {
      room: "Room 304",
      to: "Michael Brown",
      date: "Jun 14, 03:15 PM",
      status: "Rejected",
      statusColor: "bg-red-100 text-red-700",
    },
  ];

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
          className={`mt-auto text-white hover:bg-blue-500 flex items-center ${
            !sidebarOpen ? "justify-center" : ""
          } py-2 px-4 rounded-lg transition-all`}
        >
          <FaSignOutAlt className={sidebarOpen ? "mr-2" : ""} />
          {sidebarOpen && "Sign Out"}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sent Requests</h1>
        <p className="text-gray-600 mb-6">Manage your sent requests</p>

        <div className="space-y-4">
          {requests.map((req, index) => (
            <div
              key={index}
              className="bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{req.room}</h2>
                  <p className="text-gray-500">To: {req.to}</p>
                  <p className="text-gray-500 flex items-center">
                    📅 Requested on {req.date}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${req.statusColor}`}
                >
                  {req.status}
                </span>
              </div>
              {req.status === "Pending" && (
                <button className="mt-4 py-2 px-4 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors">
                  ❌ Cancel Request
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentRequests;