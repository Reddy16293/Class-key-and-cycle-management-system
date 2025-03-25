import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

const About = () => {
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

      {/* Main Content - Enhanced UI */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">About Our Management System</h1>
            <p className="text-xl opacity-90">
              Revolutionizing resource management for educational institutions
            </p>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Introduction Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Our Platform</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Our Classroom Key and Cycle Management System transforms how educational institutions handle
                their physical resources. Designed with efficiency and accountability in mind, this platform
                eliminates the headaches of manual tracking while providing real-time visibility into resource
                utilization.
              </p>
              <p className="leading-relaxed">
                Whether you're a student needing quick access to bicycles or a class representative managing
                classroom keys, our system simplifies these processes through intuitive digital workflows.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "⏱️",
                  title: "Real-time Tracking",
                  description: "Monitor all borrowed items with live updates and status indicators"
                },
                {
                  icon: "🔐",
                  title: "Secure Access",
                  description: "QR code authentication ensures only authorized users can check out items"
                },
                {
                  icon: "🤖",
                  title: "Automated Workflows",
                  description: "Streamlined approval processes reduce administrative overhead"
                },
                {
                  icon: "⏰",
                  title: "Overdue Alerts",
                  description: "Automatic notifications for pending returns and late items"
                },
                {
                  icon: "📊",
                  title: "Analytics Dashboard",
                  description: "Comprehensive reporting for better resource planning"
                },
                {
                  icon: "🔄",
                  title: "Scalable Architecture",
                  description: "Easily expandable to manage additional campus resources"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-blue-50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Our System?</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Increased Efficiency</h3>
                  <p className="text-gray-700 mt-1">
                    Reduce time spent on manual tracking by up to 80% with our automated processes
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Enhanced Security</h3>
                  <p className="text-gray-700 mt-1">
                    Detailed audit trails and authentication protocols ensure complete accountability
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">User-Friendly Interface</h3>
                  <p className="text-gray-700 mt-1">
                    Intuitive design requires minimal training for both students and administrators
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to get started?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join the growing number of institutions transforming their resource management with our platform
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => navigate("/dashboard/student")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore Dashboard
              </button>
              <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 text-white py-6">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="mb-2">Made with ❤️ by NITC</p>
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} Classroom Resource Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;