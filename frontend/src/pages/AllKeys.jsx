import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Key, ArrowLeft, CheckCircle, XCircle, Edit, Trash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AllKeys = () => {
  const navigate = useNavigate();
  const [keys, setKeys] = useState([]);  // 🔹 State to store keys
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch keys from API
  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/all-keys', {
          withCredentials: true, // 🔹 Ensures cookies/session are sent
        });
        setKeys(response.data);
      } catch (err) {
        console.error('Error fetching keys:', err);
        setError('Failed to load keys');
      } finally {
        setLoading(false);
      }
    };

    fetchKeys();
  }, []);

  // Table Columns
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
      cell: (key) => (
        <div className="flex items-center gap-2">
          {key.isAvailable ? (
            <span className="flex items-center gap-1 text-green-600 font-medium">
              <CheckCircle size={16} />
              Available
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-600 font-medium">
              <XCircle size={16} />
              Borrowed
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (key) => (
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" className="text-blue-600 hover:bg-blue-100">
            <Edit size={18} />
          </Button>
          <Button size="icon" variant="ghost" className="text-red-600 hover:bg-red-100">
            <Trash size={18} />
          </Button>
          <Button size="sm" variant={key.isAvailable ? "outline" : "default"}>
            {key.isAvailable ? 'Mark as Borrowed' : 'Mark as Available'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header />

        <div className="max-w-6xl mx-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/key-management')}
                className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </Button>
              <h1 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
                <Key size={24} className="text-indigo-600" />
                All Classroom Keys
              </h1>
            </div>
            <Button 
              onClick={() => navigate('/key-management')} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Key Management
            </Button>
          </div>

          {/* Table Card */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">All Keys</h2>
            <p className="text-gray-500 mb-5">
              This is a complete list of all classroom keys. You can edit, delete, or update their availability status.
            </p>

            {/* Show loading or error messages */}
            {loading ? (
              <p className="text-gray-600">Loading keys...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
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

export default AllKeys;
