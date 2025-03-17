import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import axios from "axios";
import { Bike, CheckCircle2, PlusCircle, List } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import toast from "react-hot-toast";

const BicycleManagement = () => {
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [bicycles, setBicycles] = useState([]);

  // Fetch recently added bicycles
  const fetchRecentlyAddedBicycles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admin/recently-added-bicycle"
      );
      setBicycles(response.data);
    } catch (error) {
      console.error("Error fetching recently added bicycles:", error);
    }
  };

  useEffect(() => {
    fetchRecentlyAddedBicycles();
  }, []);

  // Handle adding a new bicycle
  const handleAddBicycle = async (e) => {
    e.preventDefault();

    if (!qrCode) {
      toast.error("Please enter a QR code");
      return;
    }

    try {
      await toast.promise(
        axios.post(
          "http://localhost:8080/api/admin/addbicycle",
          { qrCode, isAvailable },
          { headers: { "Content-Type": "application/json" } }
        ),
        {
          loading: "Adding bicycle...",
          success: "Bicycle added successfully!",
          error: "Failed to add bicycle. Try again!",
        }
      );

      setQrCode("");
      setIsAvailable(true);
      fetchRecentlyAddedBicycles();
    } catch (error) {
      console.error("Error adding bicycle:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <Header />

        <div className="px-6 py-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add Bicycle Form */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-white shadow-md rounded-lg">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Bike className="text-purple-600" size={20} />
                  </div>
                  <h2 className="text-xl font-semibold">Add New Bicycle</h2>
                </div>

                <form onSubmit={handleAddBicycle}>
                  <div className="mb-4">
                    <Label htmlFor="qrCode">QR Code</Label>
                    <Input
                      id="qrCode"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      placeholder="Enter QR code"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="isAvailable">Availability Status</Label>
                    <Select
                      value={isAvailable ? "true" : "false"}
                      onValueChange={(value) => setIsAvailable(value === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Available</SelectItem>
                        <SelectItem value="false">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2 py-3">
                    <PlusCircle size={16} />
                    Add Bicycle
                  </Button>
                </form>
              </div>
            </div>

            {/* Bicycle Management Options */}
            <div className="lg:col-span-2">
              <div className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-6">Bicycle Management Options</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-3 border border-gray-300 hover:border-gray-400"
                    onClick={() => navigate("/admin/available-bicycles")}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
                      <CheckCircle2 className="text-green-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium">View Available Bicycles</h3>
                      <p className="text-sm text-gray-500">
                        Check which bicycles are available
                      </p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-6 flex flex-col items-center justify-center gap-3 border border-gray-300 hover:border-gray-400"
                    onClick={() => navigate("/admin/all-bicycles")}
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                      <List className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium">View All Bicycles</h3>
                      <p className="text-sm text-gray-500">
                        See complete list of bicycles
                      </p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Recently Added Bicycles */}
              <div className="p-6 bg-white shadow-md rounded-lg mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recently Added Bicycles</h2>
                  <Button variant="outline" size="sm" onClick={() => navigate("/admin/all-bicycles")}>
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {bicycles.length > 0 ? (
                    bicycles.slice(0, 3).map((bicycle) => (
                      <div key={bicycle.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Bike size={16} className="text-purple-600" />
                          <span>{bicycle.qrCode} - {bicycle.isAvailable ? "Available" : "Not Available"}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No bicycles added recently.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default BicycleManagement;
