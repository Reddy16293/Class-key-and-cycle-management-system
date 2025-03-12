import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, LogOut } from "lucide-react";

// Import images using new URL()
const nitc1 = new URL("../../images/nitc1.webp", import.meta.url).href;
const nitc2 = new URL("../../images/nitc2.webp", import.meta.url).href;
const nitc3 = new URL("../../images/nitc3.jpg", import.meta.url).href;

const backgrounds = [nitc1, nitc2, nitc3];

const Login1 = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle Google OAuth Login
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  // Fetch user data after login
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user", { withCredentials: true })
      .then((response) => {
        if (response.data && response.data.email.endsWith("@nitc.ac.in")) {
          setIsLoggedIn(true);
          navigate("/dashboard/student");
        } else {
          setError("Only students with @nitc.ac.in domain can sign in.");
        }
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/admin/login2", {
        userName: username,
        password,
      });
  
      if (response.status === 200) {
        console.log("Response:", response.data); // Debugging purpose
        if (response.data.role === "ADMIN") {
          setIsLoggedIn(true);
          navigate("/dashboard/Admin");
        } else {
          setError("Access denied: Not an admin");
        }
      }
    } catch (error) {
      setError(error.response?.data?.error || "Invalid username or password");
    }
  };
  

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/logout", {}, { withCredentials: true });
      setIsLoggedIn(false);
      navigate("/"); // Redirect to home after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center transition-all duration-1000"
      style={{ 
        backgroundImage: `url(${backgrounds[bgIndex]})`,
        transition: "background-image 1s ease-in-out"
      }}
    >
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md animate-fade-up">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500">Sign in to manage keys and cycles</p>
        </div>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
          >
            <LogOut className="mr-2" />
            Logout
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  !isAdmin ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-600"
                }`}
                onClick={() => setIsAdmin(false)}
              >
                Student
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isAdmin ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-600"
                }`}
                onClick={() => setIsAdmin(true)}
              >
                Admin
              </button>
            </div>

            {isAdmin ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-gray-500 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
                <p className="text-right text-sm text-blue-600 cursor-pointer hover:underline mt-2">
                  Forgot Password?
                </p>
              </form>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
              >
                <Mail className="mr-2" />
                Sign in with Google
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login1;
