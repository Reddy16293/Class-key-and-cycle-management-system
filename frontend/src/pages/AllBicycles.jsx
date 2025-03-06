import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bike, ArrowLeft, CheckCircle, XCircle, Edit, Trash, QrCode } from 'lucide-react';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AllBicycles = () => {
  const navigate = useNavigate();
  const [bicycles, setBicycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/all-bicycles')
      .then(response => {
        setBicycles(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bicycles:', error);
        setError('Failed to load bicycles. Please try again.');
        setLoading(false);
      });
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
      cell: (bicycle) => (
        <div className="flex items-center gap-2">
          {bicycle.isAvailable ? (
            <div className="text-green-500">
              <CheckCircle size={12} className="mr-1 inline" />
              Available
            </div>
          ) : (
            <div className="text-red-500">
              <XCircle size={12} className="mr-1 inline" />
              Borrowed
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (bicycle) => (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600">
            <Edit size={16} />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
            <Trash size={16} />
          </Button>
          <Button size="sm" variant="outline">
            {bicycle.isAvailable ? 'Mark as Borrowed' : 'Mark as Available'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        <Header />
        <div className="max-w-6xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate('/bicycle-management')} className="h-8 w-8">
                <ArrowLeft size={16} />
              </Button>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Bike size={24} className="text-admin-purple" />
                All Bicycles
              </h1>
            </div>
            <Button onClick={() => navigate('/bicycle-management')} className="bg-admin-purple text-white">
              Bicycle Management
            </Button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">All Bicycles</h2>
            <p className="text-gray-600 mb-6">
              Complete list of all bicycles in the system. You can filter, edit, or update their status.
            </p>
            {loading ? (
              <p className="text-gray-600">Loading bicycles...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="overflow-x-auto">
                <DataTable columns={columns} data={bicycles} searchField="qrCode" className="w-full min-w-[640px]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllBicycles;