import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login1 from "./pages/auth/Login1";
import AdminDashboard from "./pages/dashboard/Admindashboard";
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import StudentHome_nonCR from "./pages/dashboard/StudentDashboard_nonCR";
import KeyManagement1 from "./pages/admin/KeyManagement1";
import FakeDashboard from "./FakeDashboard";
import Login from "./Login";
//import AvailableCycles from "./AvailableCycles";
import BicycleManagement from "./pages/admin/BicycleManagement";
import AvailableKeys from "./pages/AvailableKeys";
import AllKeys from "./pages/admin/AllKeys";
import AvailableBicycles from "./pages/AvailableBicycles";
import AllBicycles from "./pages/admin/AllBicycles";
import AssignCR from "./pages/admin/AssignCR";
import History from "./pages/admin/History";
import UserManagement from "./pages/admin/UserManagement";
import Profile from "./pages/admin/Profile";
import Borrowkeys from "./pages/student/Borrowkeys";
import BorrowBicycles from "./pages/student/Borrowbicycle";
import Receivedrequests from "./pages/student/Receivedrequests";
import Sentrequests from "./pages/student/Sentrequests";
import Viewhistory from "./pages/student/Viewhistory";
import About from "./pages/student/About_CR";



import BorrowBicycle_nonCR from "./pages/student_nonCR/BorrowBicycle_nonCR";
import ViewHistory_nonCR from "./pages/student_nonCR/Viewhistory_nonCR";
import About_nonCR from "./pages/student_nonCR/About_nonCR";

import About_admin from "./pages/admin/About_admin";


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
        <Route path="/dashboard/student" element={< StudentDashboard/>} />
        <Route path="/admin/key-management" element={< KeyManagement1 />} />
        <Route path="/admin/bicycle-management" element={< BicycleManagement />} />
        <Route path="/admin/available-keys" element={<AvailableKeys/>} />
        <Route path="/admin/available-bicycles" element={<AvailableBicycles/>} />
        <Route path="/admin/all-keys" element={<AllKeys/>} />
        <Route path="/admin/all-bicycles" element={<AllBicycles/>} />
        <Route path="/admin/assign-cr" element={<AssignCR/>} />
        <Route path="/admin/user-management" element={<UserManagement/>} />
        <Route path="/admin/profile" element={<Profile/>} />
        <Route path="/admin/about" element={<About_admin/>} />
        <Route path="/borrowkeys" element={<Borrowkeys/>} />
        <Route path="/borrowbicycle" element={<BorrowBicycles/>} />
        <Route path="/receivedrequests" element={<Receivedrequests/>} />
        <Route path="/sentrequests" element={<Sentrequests/>} />
        <Route path="/viewhistory" element={<Viewhistory/>} />
        <Route path="/s-about" element={<About/>} />
        <Route path="/dashboard/student_nonCR" element={<StudentHome_nonCR/>} />
        <Route path="/borrowbicycle_nonCR" element={<BorrowBicycle_nonCR/>} />
        <Route path="/viewhistory_nonCR" element={<ViewHistory_nonCR/>} />
        <Route path="/s-about_nonCR" element={<About_nonCR/>} />


        {/* <Route path="/dashboard/admin" element={<h2 className="text-center text-3xl mt-10">Welcome Admin</h2>} /> */}
        <Route path="/admin/history" element={<History/>} />
      </Routes>
    
  );
};

export default App1;
