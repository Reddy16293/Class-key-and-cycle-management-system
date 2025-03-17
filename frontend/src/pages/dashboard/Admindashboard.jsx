import { useNavigate } from "react-router-dom";
import { Key, Bike, MessageSquare } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const Admindashboard = () => {
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
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mb-8 mt-2 text-center">
            <div className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full animate-fade-in">
              Admin Dashboard
            </div>
            <h1 className="text-4xl font-bold mt-4 mb-2 text-gray-800 animate-fade-up">
              Welcome Admin
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto animate-fade-up">
              Manage keys, bicycles, and view feedback all in one place
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 mt-8">
            {[
              { title: "Key Management", icon: <Key size={40} />, path: "/admin/key-management" },
              { title: "Bicycle Management", icon: <Bike size={40} />, path: "/admin/bicycle-management" },
              { title: "View Feedback", icon: <MessageSquare size={40} />, path: "/admin/feedback" }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer transition transform hover:scale-105 hover:shadow-lg"
                onClick={() => navigate(item.path)}
              >
                <div className="flex justify-center items-center bg-purple-200 text-purple-800 rounded-full p-3 w-16 h-16 mx-auto mb-4">
                  {item.icon}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                <p className="text-gray-500 text-sm">Manage and monitor {item.title.toLowerCase()}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[
              { title: "View Key Status & Borrowings", icon: <Key size={20} />, path: "/admin/key-management" },
              { title: "View Bicycle Status & Borrowings", icon: <Bike size={20} />, path: "/admin/bicycle-management" },
              { title: "View Feedbacks", icon: <MessageSquare size={20} />, path: "/admin/feedback", span: true }
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-purple-600 text-white font-semibold flex items-center justify-center px-6 py-4 rounded-lg cursor-pointer transition hover:bg-purple-700 ${
                  item.span ? "col-span-1 md:col-span-2" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admindashboard;
