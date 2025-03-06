import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bike, ArrowLeft, CheckCircle, QrCode } from 'lucide-react';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import toast from 'react-hot-toast';

const AvailableBicycles = () => {
  const navigate = useNavigate();
  const [bicycles, setBicycles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available bicycles from API
  const fetchAvailableBicycles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/admin/available-bicycles');
      setBicycles(response.data);
    } catch (error) {
      console.error('Error fetching available bicycles:', error);
      toast.error('Failed to fetch available bicycles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableBicycles();
  }, []);

  const columns = [
    {
      key: 'qrCode',
      header: 'QR Code',
      cell: (bicycle) => (
        <div className="flex items-center gap-2">
          <QrCode size={16} className="text-gray-500" />
          <span className="font-mono text-sm">{bicycle.qrCode}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: () => (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle size={16} className="mr-1" />
          <span>Available</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (bicycle) => (
        <Button
          size="sm"
          variant="outline"
          className="hover:bg-green-100 hover:border-green-400 transition-colors"
        >
          Mark as Borrowed
        </Button>
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

        <div className="page-transition p-6 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/bicycle-management')}
                className="h-9 w-9 rounded-full hover:bg-gray-200"
              >
                <ArrowLeft size={20} />
              </Button>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <Bike size={24} className="text-blue-600" />
                Available Bicycles
              </h1>
            </div>
            <Button
              onClick={() => navigate('/bicycle-management')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              Bicycle Management
            </Button>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Available Bicycles</h2>
            <p className="text-gray-600 mb-4">
              These bicycles are currently available for borrowing. Click on "Mark as Borrowed" to update their status.
            </p>

            {loading ? (
              <p className="text-gray-500">Loading bicycles...</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <DataTable columns={columns} data={bicycles} searchField="qrCode" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableBicycles;