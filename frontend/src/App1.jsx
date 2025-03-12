import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login1 from "./pages/auth/Login1";
import AdminDashboard from "./pages/dashboard/Admindashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import KeyManagement1 from "./pages/KeyManagement1";
import FakeDashboard from "./FakeDashboard";
import Login from "./Login";
//import AvailableCycles from "./AvailableCycles";
import BicycleManagement from "./pages/BicycleManagement";
import AvailableKeys from "./pages/AvailableKeys";
import AllKeys from "./pages/AllKeys";
import AvailableBicycles from "./pages/AvailableBicycles";
import AllBicycles from "./pages/AllBicycles";
import AssignCR from "./pages/AssignCR";
import History from "./pages/History";
import UserManagement from "./pages/UserManagement";
import Profile from "./pages/Profile";
import Borrowkeys from "./pages/Borrowkeys";
import BorrowBicycles from "./pages/Borrowbicycle";
import Receivedrequests from "./pages/Receivedrequests";
import Sentrequests from "./pages/Sentrequests";
import Viewhistory from "./pages/Viewhistory";
import About from "./pages/About";


// import UserDetails from "./UserDetails";
const Dashboard = () => <h2 className="text-center text-3xl mt-10">Welcome to Dashboard</h2>;

const App1 = () => {
  return (
    
      <Routes>
        <Route path="/" element={<Login1 />} />
        <Route path="/log" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/Admin" element={< AdminDashboard />} />
        <Route path="/fake" element={< FakeDashboard />} />
        <Route path="/login" element={< Login />} />
        {/* <Route path="/user-details" element={< UserDetails />} /> */}
        <Route path="/dashboard/student" element={< StudentDashboard />} />
        <Route path="/key-management" element={< KeyManagement1 />} />
        <Route path="/bicycle-management" element={< BicycleManagement />} />
        <Route path="/available-keys" element={<AvailableKeys/>} />
        <Route path="/available-bicycles" element={<AvailableBicycles/>} />
        <Route path="/all-keys" element={<AllKeys/>} />
        <Route path="/all-bicycles" element={<AllBicycles/>} />
        <Route path="assign-cr" element={<AssignCR/>} />
        <Route path="user-management" element={<UserManagement/>} />
        <Route path="profile" element={<Profile/>} />
        <Route path="/borrowkeys" element={<Borrowkeys/>} />
        <Route path="/borrowbicycle" element={<BorrowBicycles/>} />
        <Route path="/receivedrequests" element={<Receivedrequests/>} />
        <Route path="/sentrequests" element={<Sentrequests/>} />
        <Route path="/viewhistory" element={<Viewhistory/>} />
        <Route path="/s-about" element={<About/>} />


        {/* <Route path="/dashboard/admin" element={<h2 className="text-center text-3xl mt-10">Welcome Admin</h2>} /> */}
        <Route path="/history" element={<History/>} />
      </Routes>
    
  );
};

export default App1;
