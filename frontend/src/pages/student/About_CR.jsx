import { useState } from "react";
import { FaKey, FaBicycle, FaSignOutAlt, FaHistory, FaInfoCircle, FaEnvelope, FaHome } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { FiClock } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

const About = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
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
      <div className="p-6 w-full">
        <h1 className="text-2xl font-bold">About Classroom Key & Cycle Management System</h1>
        <p className="text-gray-600 mt-2">Ensuring smooth operations and efficient resource management in educational institutions.</p>

        <div className="mt-6 text-lg text-gray-700 leading-relaxed">
          <p>
            Efficient resource management is critical in educational institutions to ensure smooth operations and minimize disruptions.
            The Classroom Key and Cycle Management System is designed to streamline the process of managing physical keys and cycles on campus.
            By leveraging technology, this system addresses key challenges like accountability, transparency, and resource availability.
          </p>

          <p className="mt-4">
            With this system, Class Representatives (CRs) can seamlessly request and transfer classroom keys, while students can easily access campus cycles for short commutes.
            Each transaction is tracked and monitored in real-time to ensure complete accountability.
            Features like QR code-based tracking, automated approvals, and penalty mechanisms for overdue returns provide a modern, user-friendly experience.
          </p>

          <p className="mt-4">
            This platform is not just a tool for managing resources but also fosters better organization and security.
            Administrators have access to detailed logs and analytics, enabling them to make data-driven decisions to improve campus operations.
            The system is scalable, allowing for the addition of new resources as the institution grows.
          </p>

          <p className="mt-4">
            By automating routine processes and reducing manual intervention, the Classroom Key and Cycle Management System ensures smoother day-to-day functioning,
            saving time and effort for students and administrators alike.
          </p>

          {/* Additional Features (Optional) */}
          <h2 className="text-xl font-semibold mt-6">Key Features</h2>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Real-time tracking of borrowed keys and cycles</li>
            <li>QR code-based authentication for secure access</li>
            <li>Automated approval system for requests</li>
            <li>Penalty system for overdue returns</li>
            <li>Detailed logs and reports for administrators</li>
            <li>Scalable design to accommodate future needs</li>
          </ul>

          {/* User Manual Download */}
          <div className="mt-6 text-blue-600 font-semibold">
            <a href="/path-to-user-manual.pdf" download className="underline">Download User Manual (PDF)</a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500">
          <p>Made with ❤️ by NITC</p>
        </div>
      </div>
    </div>
  );
};

export default About;
