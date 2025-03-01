import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import {} from "../../images/img1.jpg"
const backgrounds = [
  "url('../../images/img1.jpg')",
  "url('/images/bg2.jpg')",
  "url('/images/bg3.jpg')",
  "url('/images/bg4.jpg')"
];

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStudentLogin = () => {
    navigate("/dashboard/student");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard/admin");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ backgroundImage: backgrounds[bgIndex] }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md animate-fade-up">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500">Sign in to manage keys and cycles</p>
        </div>

        <div className="space-y-4">
          {/* Toggle Buttons */}
          <div className="flex justify-center gap-4">
            <button
              role="button"
              aria-label="Login as Student"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !isAdmin
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-600"
              }`}
              onClick={() => setIsAdmin(false)}
            >
              Student
            </button>
            <button
              role="button"
              aria-label="Login as Admin"
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isAdmin
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-600"
              }`}
              onClick={() => setIsAdmin(true)}
            >
              Admin
            </button>
          </div>

          {/* Login Forms */}
          {isAdmin ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <input
                  role="textbox"
                  aria-label="Admin Username"
                  type="text"
                  placeholder="Username"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  role="textbox"
                  aria-label="Admin Password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                role="button"
                aria-label="Admin Sign In"
                type="submit"
                className="w-full bg-gray-500 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Sign In
              </button>
            </form>
          ) : (
            <button
              role="button"
              aria-label="Sign in with Google as Student"
              onClick={handleStudentLogin}
              className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
            >
              <Mail className="mr-2" />
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
