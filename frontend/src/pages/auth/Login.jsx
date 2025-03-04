import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail } from "lucide-react";

const backgrounds = [
  "url('https://tse3.mm.bing.net/th?id=OIP.HzGwGuEGVuQcjAYvJpi13wHaEK&pid=Api&P=0&h=180')",
  "url('https://tse3.mm.bing.net/th?id=OIP.Bmo1Zl8H5ZrCR16Fz8QaLAHaCe&pid=Api&P=0&h=180')",
  "url('https://tse3.mm.bing.net/th?id=OIP.YLOnTTu4W-vZEV89euok3QHaEK&pid=Api&P=0&h=180')"
];

const Login = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = () => {
    // Simulate Google OAuth2 login and domain verification
    const userEmail = "student@nitc.ac.in"; // Replace with real authentication logic
    if (userEmail.endsWith("@nitc.ac.in")) {
      navigate("/dashboard/student");
    } else {
      setError("Only students with @nitc.ac.in domain can sign in.");
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/admins/login", {
        username,
        password
      });
      if (response.status === 200) {
        navigate("/dashboard/admin");
      }
    } catch (error) {
      setError("Invalid username or password");
    }
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
          <div className="flex justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition ${!isAdmin ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-600"}`}
              onClick={() => setIsAdmin(false)}
            >
              Student
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition ${isAdmin ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-600"}`}
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
      </div>
    </div>
  );
};

export default Login;