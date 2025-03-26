import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bike, ArrowLeft, CheckCircle, QrCode, MapPin, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { DataTable } from '../components/ui/data-table';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const AvailableBicycles = () => {
  const navigate = useNavigate();
  const [bicycles, setBicycles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Fetch unique locations from API
  const fetchLocations = async () => {
    setLoadingLocations(true);
    try {
      const response = await axios.get('http://localhost:8080/api/bicycles/all');
      const uniqueLocations = [...new Set(response.data.map(bike => bike.location))];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to fetch locations');
    } finally {
      setLoadingLocations(false);
    }
  };

  // Fetch available bicycles from API
  const fetchAvailableBicycles = async () => {
    setLoading(true);
    try {
      let response;
      if (selectedLocation === 'all') {
        response = await axios.get('http://localhost:8080/api/bicycles/available');
      } else {
        response = await axios.get(`http://localhost:8080/api/bicycles/available-at-location?location=${selectedLocation}`);
      }
      setBicycles(response.data);
    } catch (error) {
      console.error('Error fetching available bicycles:', error);
      toast.error('Failed to fetch available bicycles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    fetchAvailableBicycles();
  }, [selectedLocation]);

  // Handle marking a bicycle as borrowed
  const handleMarkAsBorrowed = async (bicycleId) => {
    try {
      await axios.put(`http://localhost:8080/api/bicycles/${bicycleId}/availability?available=false`);
      toast.success('Bicycle marked as borrowed successfully');
      fetchAvailableBicycles(); // Refresh the list
    } catch (error) {
      console.error('Error marking bicycle as borrowed:', error);
      toast.error('Failed to mark bicycle as borrowed');
    }
  };

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
      key: 'location',
      header: 'Location',
      cell: (bicycle) => (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <span>{bicycle.location}</span>
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
          onClick={() => handleMarkAsBorrowed(bicycle.id)}
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
                onClick={() => navigate('/admin/bicycle-management')}
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
              onClick={() => navigate('/admin/bicycle-management')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              Bicycle Management
            </Button>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Available Bicycles</h2>
              <div className="flex items-center gap-3">
                <Filter size={18} className="text-gray-500" />
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                  disabled={loadingLocations}
                >
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        Location {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              {selectedLocation === 'all' 
                ? 'These bicycles are currently available for borrowing across all locations.'
                : `Showing available bicycles at Location ${selectedLocation}.`}
            </p>

            {loading ? (
              <p className="text-gray-500">Loading bicycles...</p>
            ) : bicycles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {selectedLocation === 'all'
                    ? 'No bicycles currently available'
                    : `No bicycles available at Location ${selectedLocation}`}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSelectedLocation('all')}
                >
                  View All Locations
                </Button>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <DataTable 
                  columns={columns} 
                  data={bicycles} 
                  searchField="qrCode" 
                  searchPlaceholder="Search by QR code..."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableBicycles;