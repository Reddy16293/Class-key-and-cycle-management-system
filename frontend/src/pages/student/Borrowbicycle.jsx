import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBicycle, FaQrcode } from "react-icons/fa";
import { Camera } from "lucide-react";
import StudentSidebar from "./StudentSidebar";

const BorrowBicycle = () => {
  const [bicycleCount, setBicycleCount] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
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

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

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