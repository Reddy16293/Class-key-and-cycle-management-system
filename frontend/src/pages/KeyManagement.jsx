import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Key, CheckCircle2, List, PlusCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const KeyManagement = () => {
  const navigate = useNavigate();
  const [blockName, setBlockName] = useState("");
  const [classroomName, setClassroomName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [keys, setKeys] = useState([]);
  const [availableKeys, setAvailableKeys] = useState([]);
  const [recentKeys, setRecentKeys] = useState([]);

  useEffect(() => {
    fetchAllKeys();
    fetchAvailableKeys();
    fetchRecentKeys();
  }, []);

  const fetchAllKeys = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/all-keys");
      setKeys(response.data);
    } catch (error) {
      console.error("Error fetching all keys:", error);
      toast.error("❌ Error fetching all keys");
    }
  };

  const fetchAvailableKeys = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/available-keys");
      setAvailableKeys(response.data);
    } catch (error) {
      console.error("Error fetching available keys:", error);
      toast.error("❌ Error fetching available keys");
    }
  };

  const fetchRecentKeys = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/recently-added-keys");
      setRecentKeys(response.data);
    } catch (error) {
      console.error("Error fetching recent keys:", error);
      toast.error("❌ Error fetching recent keys");
    }
  };

  const handleAddKey = async (e) => {
    e.preventDefault();
    if (!blockName || !classroomName) return toast.error("❌ All fields are required");

    const newKey = {
      blockName,
      classroomName,
      isAvailable,
    };

    try {
      await axios.post("http://localhost:8080/api/admin/addclassrooms", newKey, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("✅ Key added successfully!");
      fetchAllKeys();
      fetchAvailableKeys();
      fetchRecentKeys();
      setBlockName("");
      setClassroomName("");
      setIsAvailable(true);
    } catch (error) {
      toast.error("❌ Error adding key. Please try again!");
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="bg-indigo-700 text-white w-64 min-h-screen flex flex-col p-4 fixed">
        <h1 className="text-lg font-bold mb-6">Admin Panel</h1>
        <nav className="space-y-4">
          <button className="block text-left w-full p-2 rounded hover:bg-indigo-600">Dashboard</button>
          <button className="block text-left w-full p-2 rounded bg-indigo-600">Key Management</button>
          <button className="block text-left w-full p-2 rounded hover:bg-indigo-600">Bicycle Management</button>
          <button className="block text-left w-full p-2 rounded hover:bg-indigo-600">Feedback</button>
        </nav>
      </div>

      <div className="ml-64 flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-6">Key Management</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Key size={20} className="text-indigo-600" /> Add New Key
            </h3>
            <form onSubmit={handleAddKey} className="space-y-4">
              <input type="text" value={blockName} onChange={(e) => setBlockName(e.target.value)} placeholder="Block Name" className="w-full p-2 border rounded" required />
              <input type="text" value={classroomName} onChange={(e) => setClassroomName(e.target.value)} placeholder="Classroom Name" className="w-full p-2 border rounded" required />
              <select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value === "true")} className="w-full p-2 border rounded">
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded flex items-center justify-center gap-2">
                <PlusCircle size={16} /> Add Key
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={fetchAvailableKeys} className="p-4 bg-green-100 rounded-lg flex flex-col items-center text-center hover:bg-green-200">
                <CheckCircle2 size={24} className="text-green-600" />
                <h3 className="font-medium mt-2">View Available Keys</h3>
              </button>
              <button onClick={fetchAllKeys} className="p-4 bg-blue-100 rounded-lg flex flex-col items-center text-center hover:bg-blue-200">
                <List size={24} className="text-blue-600" />
                <h3 className="font-medium mt-2">View All Keys</h3>
              </button>
              <button onClick={fetchRecentKeys} className="p-4 bg-yellow-100 rounded-lg flex flex-col items-center text-center hover:bg-yellow-200">
                <Clock size={24} className="text-yellow-600" />
                <h3 className="font-medium mt-2">Recently Added Keys</h3>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyManagement;