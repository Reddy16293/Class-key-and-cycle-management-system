import { useState } from "react";
import { FaKey, FaBicycle, FaSignOutAlt, FaHistory, FaInfoCircle, FaEnvelope, FaHome } from "react-icons/fa";
import { Camera } from "lucide-react";
import { FiClock } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const BorrowBicycles = () =>{
  const [bicycleCount, setBicycleCount] = useState(5); // Example count of available bicycles
const [sidebarOpen, setSidebarOpen] = useState(true);
const navigate = useNavigate();
const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-100">
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
          className={`w-full py-2 flex items-center ${
            sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
          } ${
            location.pathname === '/borrowbicycle' 
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-gray-200'
          }`}
        >
          <FaBicycle className={`${sidebarOpen ? "mr-2" : ""} ${
            location.pathname === '/borrowbicycle' ? 'text-blue-600' : ''
          }`} /> 
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
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Borrow Bicycles</h1>
        <p className="text-gray-600 mb-6">Scan a QR code to borrow a bicycle on campus</p>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
          <h2 className="text-lg font-semibold mb-2">Scan QR Code</h2>
          <p className="text-gray-500 mb-4">Scan the QR code on the bicycle to borrow it</p>

          {/* QR Code Scanner */}
          <div className="border border-gray-300 p-10 flex flex-col items-center justify-center rounded-md">
            <div className="text-gray-400 text-5xl">📷</div>
            <p className="text-gray-500 mt-2">Position the QR code within the frame to scan</p>
          </div>

          {/* Scan Button */}
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center w-full">
            <Camera className="w-5 h-5 mr-2" /> Start Scanning
          </button>
        </div>
      </main>

      {/* Right Side - Bicycle Info */}
      <aside className="w-80 bg-white shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Bicycle Information</h2>

        {/* Availability */}
        <div className="bg-green-100 p-3 rounded-lg flex items-center mb-4">
          <span className="text-green-600 text-xl">🚲</span>
          <p className="text-green-800 ml-2">{bicycleCount} out of 8 bicycles available</p>
        </div>

        {/* How to Borrow Instructions */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-gray-800 font-semibold mb-2">How to Borrow</h3>
          <ul className="list-decimal pl-5 text-gray-600 space-y-1">
            <li>Locate a bicycle at the campus station</li>
            <li>Scan the QR code on the bicycle using the scanner above</li>
            <li>Confirm the bicycle details and accept terms</li>
            <li>Then you can get the bicycle key at the bicycle office at the bicycle station</li>
            <li>Return the bicycle at the campus station when done</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};


export default BorrowBicycles;
