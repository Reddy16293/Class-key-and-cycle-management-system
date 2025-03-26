import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bike, ArrowLeft, CheckCircle, XCircle, MapPin, Filter, QrCode } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/ui/data-table';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const BicycleLocations = () => {
  const navigate = useNavigate();
  const [bicycles, setBicycles] = useState([]);
  const [allBicycles, setAllBicycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Fetch all bicycles
  useEffect(() => {
    const fetchBicycles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/bicycles/all');
        setAllBicycles(response.data);
        
        // Extract unique locations
        const uniqueLocations = [...new Set(response.data.map(bike => bike.location))];
        setLocations(uniqueLocations);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bicycles:', error);
        toast.error('Failed to load bicycles');
        setLoading(false);
      }
    };

    fetchBicycles();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    if (allBicycles.length === 0) return;

    let filtered = [...allBicycles];

    // Apply location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(bike => bike.location === selectedLocation);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      const statusBool = selectedStatus === 'available';
      filtered = filtered.filter(bike => bike.isAvailable === statusBool);
    }

    setBicycles(filtered);
  }, [allBicycles, selectedLocation, selectedStatus]);

  // Table columns
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
                <MapPin size={24} className="text-orange-600" />
                Bicycles by Location
              </h1>
            </div>
            <Button
              onClick={() => navigate('/admin/bicycle-management')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
            >
              Back to Management
            </Button>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-xl font-semibold">Filter Bicycles</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-3">
                  <Filter size={18} className="text-gray-500" />
                  <Select
                    value={selectedLocation}
                    onValueChange={setSelectedLocation}
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
                <div className="flex items-center gap-3">
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-[180px] bg-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="available">Available Only</SelectItem>
                      <SelectItem value="borrowed">Borrowed Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {selectedLocation === 'all' && selectedStatus === 'all'
                ? 'Showing all bicycles across all locations'
                : selectedLocation === 'all'
                ? `Showing ${selectedStatus === 'available' ? 'available' : 'borrowed'} bicycles across all locations`
                : selectedStatus === 'all'
                ? `Showing all bicycles at Location ${selectedLocation}`
                : `Showing ${selectedStatus === 'available' ? 'available' : 'borrowed'} bicycles at Location ${selectedLocation}`}
            </p>

            {loading ? (
              <p className="text-gray-500">Loading bicycles...</p>
            ) : bicycles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No bicycles found matching your filters
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedLocation('all');
                    setSelectedStatus('all');
                  }}
                >
                  Reset Filters
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

export default BicycleLocations;