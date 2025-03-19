import { useNavigate } from "react-router-dom";
import { Key, Bike, MessageSquare } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const About_admin = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
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
    </div>
  );
};

export default About_admin;
