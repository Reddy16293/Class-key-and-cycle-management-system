import { useState } from "react";
import { FaKey, FaBicycle, FaSignOutAlt, FaHistory, FaInfoCircle, FaEnvelope, FaHome, FaUser } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const StudentHome = () => {
  const [activeBorrows, setActiveBorrows] = useState({
    keys: [{ id: 1, name: "Room 101", since: "Jun 15, 04:00 PM" }],
    bicycles: [{ id: 2, name: "Bicycle #15", since: "Jun 14, 10:15 PM" }],
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === '/dashboard/student' 
                ? 'bg-blue-100 text-blue-600' 
                : 'hover:bg-gray-200'
            }`}
          >
            <FaHome className={`${sidebarOpen ? "mr-2" : ""} ${
              location.pathname === '/dashboard/student' ? 'text-blue-600' : ''
            }`} /> 
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
        {/* Header with Profile Button */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome Back, Student</h1>
            <p className="text-gray-600">Here's what's happening with your borrowings today.</p>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-200 rounded-full flex items-center"
          >
            <FaUser className="text-xl" />
          </button>
        </div>

        {/* Active Borrows Section */}
        {(activeBorrows.keys.length > 0 || activeBorrows.bicycles.length > 0) && (
          <div className="mt-6 bg-white p-4 shadow-md rounded">
            <h2 className="text-lg font-semibold">Active Borrows</h2>
            <p className="text-sm text-gray-500">Currently borrowed keys and bicycles</p>
            <div className="mt-4 space-y-3">
              {activeBorrows.keys.map((key) => (
                <div key={key.id} className="p-2 border rounded flex justify-between">
                  <span>{key.name} <span className="text-sm text-gray-500">(Since {key.since})</span></span>
                  <button className="text-blue-500">Submit</button>
                </div>
              ))}
              {activeBorrows.bicycles.map((bicycle) => (
                <div key={bicycle.id} className="p-2 border rounded flex justify-between">
                  <span>{bicycle.name} <span className="text-sm text-gray-500">(Since {bicycle.since})</span></span>
                  <button className="text-blue-500">Submit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="p-4 bg-white shadow-md rounded flex items-center space-x-3">
            <FaKey className="text-blue-500 text-2xl" />
            <div>
              <h3 className="text-md font-semibold">Borrow Keys</h3>
              <p className="text-sm text-gray-500">Borrow classroom keys or request from others</p>
              <button onClick={() => navigate('/borrowkeys')} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Borrow Keys</button>
            </div>
          </div>
          <div className="p-4 bg-white shadow-md rounded flex items-center space-x-3">
            <FaBicycle className="text-green-500 text-2xl" />
            <div>
              <h3 className="text-md font-semibold">Borrow Bicycles</h3>
              <p className="text-sm text-gray-500">Scan QR code to borrow campus bicycles</p>
              <button onClick={() => navigate('/borrowbicycle')} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Borrow Bicycles</button>
            </div>
          </div>
          <div className="p-4 bg-white shadow-md rounded flex items-center space-x-3">
            <FaEnvelope className="text-yellow-500 text-2xl" />
            <div>
              <h3 className="text-md font-semibold">View Received Requests</h3>
              <p className="text-sm text-gray-500">Check pending key requests from others</p>
              <button onClick={() => navigate('/receivedrequests')} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">View Received Requests</button>
            </div>
          </div>
          <div className="p-4 bg-white shadow-md rounded flex items-center space-x-3">
            <FiClock className="text-purple-500 text-2xl" />
            <div>
              <h3 className="text-md font-semibold">View Sent Requests</h3>
              <p className="text-sm text-gray-500">Track your sent key requests</p>
              <button onClick={() => navigate('/sentrequests')} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">View Sent Requests</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome;