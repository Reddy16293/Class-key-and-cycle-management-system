import { useState } from "react";
import { 
  FaKey, 
  FaBicycle, 
  FaSignOutAlt, 
  FaHistory, 
  FaInfoCircle, 
  FaEnvelope, 
  FaHome,
  FaQrcode
} from "react-icons/fa";
import { Camera } from "lucide-react";
import { FiClock } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const BorrowBicycle = () => {
  const [bicycleCount, setBicycleCount] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Updated Sidebar to match BorrowKeys */}
      <aside
        className={`bg-gradient-to-b from-indigo-800 to-blue-900 shadow-xl flex flex-col p-4 ${
          sidebarOpen ? "w-64" : "w-16"
        } transition-all duration-300`}
      >
        <button
          className="mb-4 p-2 text-white hover:bg-indigo-700 rounded-full transition-colors self-start"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <IoMenu className="text-xl" />
        </button>
        {sidebarOpen && (
          <h2 className="text-xl font-bold mb-6 text-white px-2">Student Portal</h2>
        )}
        <nav className="flex-1 space-y-1">
          {[
            { path: "/dashboard/student", icon: FaHome, label: "Dashboard" },
            { path: "/borrowkeys", icon: FaKey, label: "Borrow Keys" },
            { path: "/borrowbicycle", icon: FaBicycle, label: "Borrow Bicycles" },
            { path: "/receivedrequests", icon: FaEnvelope, label: "Received Requests" },
            { path: "/sentrequests", icon: FiClock, label: "Sent Requests" },
            { path: "/viewhistory", icon: FaHistory, label: "View History" },
            { path: "/s-about", icon: FaInfoCircle, label: "About" },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full py-3 flex items-center ${
                sidebarOpen ? "px-4 text-left" : "px-2 justify-center"
              } ${
                location.pathname === item.path
                  ? "bg-indigo-700 text-white"
                  : "text-white/90 hover:bg-indigo-700/50"
              } rounded-xl transition-all`}
            >
              <item.icon className={`${sidebarOpen ? "mr-3" : ""} flex-shrink-0`} />
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>
        <button
          onClick={() => navigate("/")}
          className={`w-full py-3 flex items-center ${
            sidebarOpen ? "px-4" : "px-2 justify-center"
          } text-white/90 hover:bg-indigo-700/50 rounded-xl transition-all mt-auto`}
        >
          <FaSignOutAlt className={`${sidebarOpen ? "mr-3" : ""}`} />
          {sidebarOpen && "Sign Out"}
        </button>
      </aside>

      {/* Main Content - No changes needed */}
      <main className="flex-1 p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Campus Bicycle Rental
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Scan QR code to unlock your ride
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Scanner Section */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaQrcode className="mr-2 text-indigo-600" />
                QR Code Scanner
              </h2>
              <p className="text-gray-500">
                Position the bicycle's QR code within the frame below
              </p>
            </div>

            <div className="border-2 border-dashed border-indigo-100 p-8 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50">
              <div className="text-indigo-300 text-6xl mb-4">
                <Camera className="w-16 h-16" />
              </div>
              <p className="text-gray-500 text-center">
                Align QR code within the camera view
              </p>
            </div>

            <button className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl flex items-center justify-center w-full hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-[1.02]">
              <Camera className="w-5 h-5 mr-2" />
              Start Scanning
            </button>
          </div>

          {/* Bicycle Information */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 h-fit">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Bicycle Status
              </h2>
              <div className="bg-green-100/80 p-4 rounded-xl flex items-center">
                <span className="text-2xl mr-3">🚲</span>
                <div>
                  <p className="font-medium text-green-800">
                    {bicycleCount} Bicycles Available
                  </p>
                  <p className="text-sm text-green-600">
                    Out of 8 total in system
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-100/80 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                How to Borrow
              </h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    1
                  </span>
                  Locate a bicycle at campus station
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    2
                  </span>
                  Scan QR code using the scanner
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    3
                  </span>
                  Confirm details & accept terms
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    4
                  </span>
                  Collect key from bicycle office
                </li>
                <li className="flex items-start">
                  <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    5
                  </span>
                  Return to any campus station
                </li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BorrowBicycle;