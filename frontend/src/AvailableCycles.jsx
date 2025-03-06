import React, { useState, useEffect } from "react";
import axios from "axios";

const AvailableCycles = () => {
  const [availableCycles, setAvailableCycles] = useState([]);

  useEffect(() => {
    fetchAvailableCycles();
  }, []);

  const fetchAvailableCycles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/available-cycles");
      setAvailableCycles(response.data);
    } catch (error) {
      console.error("Error fetching available cycles:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Available Cycles</h1>
      
      {/* Available Cycles Section */}
      <section className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Available Cycles</h2>
        <button onClick={fetchAvailableCycles} className="mb-3 px-4 py-2 bg-blue-500 text-white rounded">Refresh</button>
        <ul>
          {availableCycles.map((cycle) => (
            <li key={cycle.id} className="p-2 border-b flex justify-between items-center">
              <span>{cycle.name}</span>
              <button className="px-3 py-1 bg-blue-500 text-white rounded">Mark as Borrowed</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AvailableCycles;
