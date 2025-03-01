import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";

const Dashboard = () => <h2 className="text-center text-3xl mt-10">Welcome to Dashboard</h2>;

const App = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/student" element={<h2 className="text-center text-3xl mt-10">Welcome Student</h2>} />
        <Route path="/dashboard/admin" element={<h2 className="text-center text-3xl mt-10">Welcome Admin</h2>} />
      </Routes>
    
  );
};

export default App;
