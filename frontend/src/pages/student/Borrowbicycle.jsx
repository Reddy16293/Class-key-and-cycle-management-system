import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBicycle, FaQrcode, FaMapMarkerAlt } from "react-icons/fa";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import StudentSidebar from "./StudentSidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { DataTable } from "../../components/ui/data-table";

const BorrowBicycle = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [availableBicycles, setAvailableBicycles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrInput, setQrInput] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userResponse = await axios.get("http://localhost:8080/api/user", {
          withCredentials: true,
        });
        setCurrentUser(userResponse.data);

        // Fetch all locations
        const locationsResponse = await axios.get("http://localhost:8080/api/bicycles/all");
        const uniqueLocations = [...new Set(locationsResponse.data.map(b => b.location))];
        setLocations(uniqueLocations);

        // Fetch available bicycles
        await fetchAvailableBicycles();
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAvailableBicycles = async () => {
    try {
      setLoading(true);
      let response;
      if (selectedLocation === "all") {
        response = await axios.get("http://localhost:8080/api/bicycles/available");
      } else {
        response = await axios.get(
          `http://localhost:8080/api/bicycles/available-at-location?location=${selectedLocation}`
        );
      }
      setAvailableBicycles(response.data);
    } catch (error) {
      console.error("Error fetching bicycles:", error);
      toast.error("Failed to load available bicycles");
    } finally {
      setLoading(false);
    }
  };

  const handleBookByQr = async () => {
    if (!qrInput.trim()) {
      toast.error("Please enter a QR code");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/api/bicycles/book-by-qr?qrCode=${qrInput}&userId=${currentUser.id}`
      );
      toast.success("Bicycle booked successfully!");
      setQrInput("");
      fetchAvailableBicycles();
    } catch (error) {
      console.error("Error booking bicycle:", error);
      if (error.response?.status === 400) {
        toast.error("This bicycle is not available for booking");
      } else {
        toast.error(error.response?.data || "Failed to book bicycle");
      }
    }
  };

  const handleBookById = async (bicycleId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/bicycles/book/${bicycleId}?userId=${currentUser.id}`
      );
      toast.success("Bicycle booked successfully!");
      fetchAvailableBicycles();
    } catch (error) {
      console.error("Error booking bicycle:", error);
      if (error.response?.status === 400) {
        toast.error("This bicycle is not available for booking");
      } else {
        toast.error(error.response?.data || "Failed to book bicycle");
      }
    }
  };

  const columns = [
    {
      key: "qrCode",
      header: "QR Code",
      cell: (bicycle) => (
        <div className="flex items-center gap-2">
          <FaQrcode className="text-gray-500" />
          <span className="font-mono">{bicycle.qrCode}</span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      cell: (bicycle) => (
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{bicycle.location}</span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (bicycle) => (
        <Button
          size="sm"
          onClick={() => handleBookById(bicycle.id)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          Book This Bicycle
        </Button>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <StudentSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={currentUser}
      />

      <main className="flex-1 p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Campus Bicycle Rental
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Choose your preferred booking method
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* QR Scanner Section */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaQrcode className="mr-2 text-indigo-600" />
                QR Code Booking
              </h2>
              <p className="text-gray-500">
                Scan or enter the bicycle's QR code manually
              </p>
            </div>

            {showScanner ? (
              <div className="border-2 border-dashed border-indigo-100 p-8 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50">
                <div className="text-indigo-300 text-6xl mb-4">
                  <Camera className="w-16 h-16" />
                </div>
                <p className="text-gray-500 text-center mb-4">
                  Align QR code within the camera view
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowScanner(false)}
                >
                  Cancel Scan
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    placeholder="Enter QR code manually"
                    className="flex-1 p-3 border rounded-lg"
                  />
                  <Button
                    onClick={handleBookByQr}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Book
                  </Button>
                </div>
                <div className="text-center text-gray-500">or</div>
                <Button
                  onClick={() => setShowScanner(true)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-3 rounded-xl flex items-center justify-center hover:from-indigo-700 hover:to-blue-700 transition-all transform hover:scale-[1.02]"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-indigo-600" />
                Filter by Location
              </h2>
              <p className="text-gray-500">
                Select a location to see available bicycles
              </p>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select location" />
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
              <Button onClick={fetchAvailableBicycles}>Filter</Button>
            </div>

            <div className="bg-indigo-100/80 p-4 rounded-xl">
              <div className="flex items-center">
                <FaBicycle className="text-2xl mr-3 text-indigo-600" />
                <div>
                  <p className="font-medium text-indigo-800">
                    {availableBicycles.length} Bicycles Available
                  </p>
                  <p className="text-sm text-indigo-600">
                    {selectedLocation === "all"
                      ? "Across all locations"
                      : `At Location ${selectedLocation}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Bicycles Table */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Available Bicycles
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading bicycles...</p>
          ) : availableBicycles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {selectedLocation === "all"
                  ? "No bicycles currently available"
                  : `No bicycles available at Location ${selectedLocation}`}
              </p>
              {selectedLocation !== "all" && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedLocation("all");
                    fetchAvailableBicycles();
                  }}
                >
                  View All Locations
                </Button>
              )}
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={availableBicycles}
              searchField="qrCode"
              searchPlaceholder="Search by QR code..."
            />
          )}
        </div>

        {/* Borrowing Instructions */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Borrowing Instructions
          </h2>
          <ol className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                1
              </span>
              Locate a bicycle at campus station
            </li>
            <li className="flex items-start">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                2
              </span>
              Scan QR code or select from available bicycles
            </li>
            <li className="flex items-start">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                3
              </span>
              Collect key from bicycle office after booking
            </li>
            <li className="flex items-start">
              <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                4
              </span>
              Return to any campus station when done
            </li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default BorrowBicycle;