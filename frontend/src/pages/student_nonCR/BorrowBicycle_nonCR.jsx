import { useState } from "react";
import { FaBicycle, FaSignOutAlt, FaHistory, FaInfoCircle, FaHome } from "react-icons/fa";
import { Camera } from "lucide-react";
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const BorrowBicycle_nonCR = () => {
  const [bicycleCount, setBicycleCount] = useState(5); // Example count of available bicycles
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            onClick={() => navigate("/dashboard/student_nonCR")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/dashboard/student_nonCR"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaHome className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Dashboard"}
          </button>

          <button
            onClick={() => navigate("/borrowbicycle_nonCR")}
            className={`w-full py-2 flex items-center ${
                sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
                location.pathname === "/borrowbicycle_nonCR" // Update this line
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
            >
            <FaBicycle className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "Borrow Bicycles"}
          </button>
          <button
            onClick={() => navigate("/viewhistory_nonCR")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/viewhistory_nonCR"
                ? "bg-blue-500 text-white"
                : "text-white hover:bg-blue-500"
            } rounded-lg transition-all`}
          >
            <FaHistory className={`${sidebarOpen ? "mr-2" : ""}`} />
            {sidebarOpen && "View History"}
          </button>
          <button
            onClick={() => navigate("/s-about_nonCR")}
            className={`w-full py-2 flex items-center ${
              sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
            } ${
              location.pathname === "/s-about_nonCR"
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
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Borrow Bicycles</h1>
        <p className="text-gray-600 mb-6">
          Scan a QR code to borrow a bicycle on campus
        </p>

        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
          <h2 className="text-xl font-semibold mb-2">Scan QR Code</h2>
          <p className="text-gray-500 mb-4">
            Scan the QR code on the bicycle to borrow it
          </p>

          {/* QR Code Scanner */}
          <div className="border-2 border-dashed border-gray-300 p-10 flex flex-col items-center justify-center rounded-lg">
            <div className="text-gray-400 text-5xl">📷</div>
            <p className="text-gray-500 mt-2">
              Position the QR code within the frame to scan
            </p>
          </div>

          {/* Scan Button */}
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center justify-center w-full hover:bg-blue-700 transition-colors">
            <Camera className="w-5 h-5 mr-2" /> Start Scanning
          </button>
        </div>
      </main>

      {/* Right Side - Bicycle Info */}
      <aside className="w-80 bg-white shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Bicycle Information</h2>

        {/* Availability */}
        <div className="bg-green-100 p-4 rounded-lg flex items-center mb-4">
          <span className="text-green-600 text-2xl">🚲</span>
          <p className="text-green-800 ml-2">
            {bicycleCount} out of 8 bicycles available
          </p>
        </div>

        {/* How to Borrow Instructions */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-gray-800 font-semibold mb-2">How to Borrow</h3>
          <ul className="list-decimal pl-5 text-gray-600 space-y-1">
            <li>Locate a bicycle at the campus station</li>
            <li>Scan the QR code on the bicycle using the scanner above</li>
            <li>Confirm the bicycle details and accept terms</li>
            <li>
              Then you can get the bicycle key at the bicycle office at the
              bicycle station
            </li>
            <li>Return the bicycle at the campus station when done</li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default BorrowBicycle_nonCR;