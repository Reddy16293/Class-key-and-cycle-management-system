import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const images = [
  "../images/img1.jpg",
  "/image2.jpg",
  "/image3.jpg",
  "/image4.jpg"
];

const LoginPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        key={currentImageIndex}
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      />
      
      <div className="relative bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <input type="text" placeholder="Username / Email" className="w-full p-2 mb-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Log in</button>
        <p className="mt-4 text-sm text-blue-500 cursor-pointer">Forgotten your username or password?</p>
      </div>
    </div>
  );
};

export default LoginPage;
