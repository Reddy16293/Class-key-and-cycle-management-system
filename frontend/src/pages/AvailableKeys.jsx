import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Key, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AvailableKeys = () => {
  const navigate = useNavigate();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available keys from the backend
  useEffect(() => {
    const fetchAvailableKeys = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/available-keys');
        setKeys(response.data);
      } catch (error) {
        console.error('Error fetching available keys:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableKeys();
  }, []);

  // Handle marking a key as borrowed
  const handleMarkAsBorrowed = async (keyId) => {
    try {
      // Call the API to mark the key as borrowed
      await axios.put(`http://localhost:8080/api/admin/mark-key-borrowed/${keyId}`);

      // Update the local state to remove the key from the list
      setKeys((prevKeys) => prevKeys.filter((key) => key.id !== keyId));

      // Show a success message
      alert('Key marked as borrowed successfully!');
    } catch (error) {
      console.error('Error marking key as borrowed:', error);
      alert('Failed to mark key as borrowed. Please try again.');
    }
  };

  // Table columns
  const columns = [
    {
      key: 'blockName',
      header: 'Block Name',
      cell: (key) => key.blockName,
    },
    {
      key: 'classroomName',
      header: 'Classroom Name',
      cell: (key) => key.classroomName,
    },
    {
      key: 'status',
      header: 'Status',
      cell: () => (
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <CheckCircle size={16} className="text-green-500" />
          Available
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (key) => (
        <Button
          size="sm"
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition"
          onClick={() => handleMarkAsBorrowed(key.id)} // Add onClick handler
        >
          Mark as Borrowed
        </Button>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        <Header />
        <div className="max-w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/admin/key-management')}
                className="h-9 w-9 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <ArrowLeft size={18} className="text-gray-700" />
              </Button>
              <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                <Key size={22} className="text-indigo-600" />
                Available Classroom Keys
              </h1>
            </div>
            <Button
              onClick={() => navigate('/admin/key-management')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Key Management
            </Button>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Available Keys</h2>
            <p className="text-gray-500 mb-5">
              These keys are currently available for borrowing. Click on "Mark as Borrowed" to update their status.
            </p>
            {loading ? (
              <p className="text-center text-gray-500">Loading available keys...</p>
            ) : (
              <DataTable
                columns={columns}
                data={keys}
                searchField="blockName"
                className="border rounded-lg shadow-md"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableKeys;