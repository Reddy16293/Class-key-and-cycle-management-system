import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bike, ArrowLeft, CheckCircle, XCircle, Edit, Trash, QrCode, MapPin, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DataTable } from '../../components/ui/data-table';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

const AllBicycles = () => {
  const navigate = useNavigate();
  const [bicycles, setBicycles] = useState([]);
  const [allBicycles, setAllBicycles] = useState([]); // Store all bicycles for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bicycleToDelete, setBicycleToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loadingLocations, setLoadingLocations] = useState(false);

  // Fetch all bicycles and locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingLocations(true);
        
        const response = await axios.get('http://localhost:8080/api/bicycles/all');
        setAllBicycles(response.data);
        setBicycles(response.data);
        
        // Extract unique locations
        const uniqueLocations = [...new Set(response.data.map(bike => bike.location))];
        setLocations(uniqueLocations);
        
        setLoading(false);
        setLoadingLocations(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load bicycles. Please try again.');
        setLoading(false);
        setLoadingLocations(false);
      }
    };

    fetchData();
  }, []);

  // Filter bicycles by location
  useEffect(() => {
    if (selectedLocation === 'all') {
      setBicycles(allBicycles);
    } else {
      const filtered = allBicycles.filter(bike => bike.location === selectedLocation);
      setBicycles(filtered);
    }
  }, [selectedLocation, allBicycles]);

  // Handle marking a bicycle as borrowed/available
  const handleToggleAvailability = async (bicycleId, isAvailable) => {
    try {
      await axios.put(
        `http://localhost:8080/api/bicycles/${bicycleId}/availability`,
        null,
        { params: { available: !isAvailable } }
      );
      toast.success(`Bicycle marked as ${!isAvailable ? 'available' : 'borrowed'} successfully`);
      
      // Update both allBicycles and bicycles state
      setAllBicycles(prev => prev.map(bike => 
        bike.id === bicycleId ? { ...bike, isAvailable: !isAvailable } : bike
      ));
      setBicycles(prev => prev.map(bike => 
        bike.id === bicycleId ? { ...bike, isAvailable: !isAvailable } : bike
      ));
    } catch (error) {
      console.error('Error toggling bicycle availability:', error);
      toast.error('Failed to update bicycle status');
    }
  };

  // Handle deleting a bicycle
  const handleDeleteBicycle = async () => {
    if (!bicycleToDelete) return;

    try {
        setLoading(true);
        await axios.delete(
            `http://localhost:8080/api/admin/delete-bicycle/${bicycleToDelete.id}`,
            {
                withCredentials: true // If you need authentication
            }
        );
        
        toast.success('Bicycle deleted successfully');
        
        // Update state to remove the deleted bicycle
        setAllBicycles(prev => prev.filter(bike => bike.id !== bicycleToDelete.id));
        setBicycles(prev => prev.filter(bike => bike.id !== bicycleToDelete.id));
        
        setShowDeleteDialog(false);
        setBicycleToDelete(null);
    } catch (error) {
        console.error('Error deleting bicycle:', error);
        
        if (error.response) {
            // Handle different error statuses
            switch (error.response.status) {
                case 401:
                    toast.error('Unauthorized - Please login as admin');
                    break;
                case 403:
                    toast.error('Forbidden - Admin access required');
                    break;
                case 404:
                    toast.error('Bicycle not found');
                    break;
                case 500:
                    toast.error(error.response.data || 'Server error occurred');
                    break;
                default:
                    toast.error('Failed to delete bicycle');
            }
        } else {
            toast.error('Network error - Could not connect to server');
        }
    } finally {
        setLoading(false);
    }
}; // Table columns
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
    {
      key: 'actions',
      header: 'Actions',
      cell: (bicycle) => (
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-blue-600"
            onClick={() => navigate(`/admin/edit-bicycle/${bicycle.id}`)}
          >
            <Edit size={16} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-red-600"
            onClick={() => {
              setBicycleToDelete(bicycle);
              setShowDeleteDialog(true);
            }}
          >
            <Trash size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleToggleAvailability(bicycle.id, bicycle.isAvailable)}
          >
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
              <Button variant="ghost" size="icon" onClick={() => navigate('/admin/bicycle-management')} className="h-8 w-8">
                <ArrowLeft size={16} />
              </Button>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Bike size={24} className="text-admin-purple" />
                All Bicycles
              </h1>
            </div>
            <Button onClick={() => navigate('/admin/bicycle-management')} className="bg-admin-purple text-white">
              Bicycle Management
            </Button>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-lg font-medium">All Bicycles</h2>
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
            <p className="text-gray-600 mb-6">
              {selectedLocation === 'all' 
                ? 'Complete list of all bicycles in the system.'
                : `Showing bicycles at Location ${selectedLocation}.`}
            </p>

            {loading ? (
              <p className="text-gray-600">Loading bicycles...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : bicycles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {selectedLocation === 'all'
                    ? 'No bicycles found'
                    : `No bicycles found at Location ${selectedLocation}`}
                </p>
                {selectedLocation !== 'all' && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedLocation('all')}
                  >
                    View All Locations
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <DataTable 
                  columns={columns} 
                  data={bicycles} 
                  searchField="qrCode" 
                  searchPlaceholder="Search by QR code..."
                  className="w-full min-w-[640px]" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-base mt-4">
              Are you sure you want to delete the bicycle with QR Code <strong>{bicycleToDelete?.qrCode}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBicycle} className="flex-1 bg-red-600">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllBicycles;