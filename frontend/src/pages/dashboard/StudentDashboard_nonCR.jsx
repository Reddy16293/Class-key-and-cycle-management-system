import { useState } from "react";
import { FaBicycle, FaSignOutAlt, FaHistory, FaInfoCircle, FaHome, FaUser } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

const StudentHome_nonCR = () => {
  const [activeBorrows, setActiveBorrows] = useState({
    bicycles: [{ id: 2, name: "Bicycle #15", since: "Jun 14, 10:15 PM" }],
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // User data - replace with your actual data source
  const [user] = useState({
    name: "MERAGALA SUJANESH NANDAN",
    email: "meragala_b220389cs@nitc.ac.in",
    role: "nonCR"
  });

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
              location.pathname === "/borrowbicycle_nonCR"
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
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header with Profile Button */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Student</h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your borrowings today.
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfileSidebar(!showProfileSidebar)}
              className="p-2 hover:bg-gray-200 rounded-full flex items-center transition-colors"
            >
              <FaUser className="text-xl text-gray-700" />
            </button>

            {/* Profile Sidebar */}
            {showProfileSidebar && (
              <div className="absolute right-0 top-12 bg-white shadow-xl rounded-lg p-5 min-w-[260px] z-50 border border-gray-100">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 break-words">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600 break-words leading-tight">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Borrows Section */}
        {activeBorrows.bicycles.length > 0 && (
          <div className="mt-6 bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">Active Borrows</h2>
            <p className="text-sm text-gray-500 mt-1">
              Currently borrowed bicycles
            </p>
            <div className="mt-4 space-y-3">
              {activeBorrows.bicycles.map((bicycle) => (
                <div
                  key={bicycle.id}
                  className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <span className="text-gray-700">
                    {bicycle.name}{" "}
                    <span className="text-sm text-gray-500">(Since {bicycle.since})</span>
                  </span>
                  <button className="text-blue-500 hover:text-blue-600 transition-colors">
                    Submit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 shadow-lg rounded-lg flex flex-col items-center text-white hover:shadow-xl transition-shadow">
            <FaBicycle className="text-3xl mb-4" />
            <h3 className="text-lg font-semibold">Borrow Bicycles</h3>
            <p className="text-sm text-green-100 text-center mt-2">
              Scan QR code to borrow campus bicycles
            </p>
            <button
              onClick={() => navigate("/borrowbicycle_nonCR")}
              className="mt-4 bg-white text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-colors"
            >
              Borrow Bicycles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHome_nonCR; 