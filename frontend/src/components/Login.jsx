import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GoogleLogin } from "react-google-login";

const images = [
  "../images/img1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg"
];

const LoginPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [role, setRole] = useState("student"); // Default role is student

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLoginSuccess = (response) => {
    const email = response.profileObj.email;
    if (email.endsWith("@nitc.ac.in")) {
      console.log("Student logged in with: ", email); 
      // Proceed with login
    } else {
      alert("Only NITC students can log in with Google!");
    }
  };

  const handleGoogleLoginFailure = () => {
    alert("Google login failed. Try again.");
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        key={currentImageIndex}
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      />
      
      <div className="relative bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <div className="mb-4">
          <label className="mr-2">Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded">
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {role === "admin" ? (
          <>
            <input type="text" placeholder="Username" className="w-full p-2 mb-2 border rounded" />
            <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" />
            <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Log in</button>
            <p className="mt-2 text-sm text-blue-500 cursor-pointer">Forgotten your password?</p>
          </>
        ) : (
          <GoogleLogin
            clientId="YOUR_GOOGLE_CLIENT_ID"
            buttonText="Login with Google"
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            cookiePolicy={'single_host_origin'}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
