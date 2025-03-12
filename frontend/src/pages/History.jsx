import { useState } from "react";
import { History as HistoryIcon, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { DataTable } from "../components/ui/data-table";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar
import Header from "../components/Header"; // ✅ Import Header

// Mock Data
const keyHistory = [
  { id: 1, keyId: "K001", roomNumber: "101", borrowedBy: "John Doe", borrowedDate: "2023-07-10 09:30", returnedDate: "2023-07-10 16:45", status: "Returned" },
  { id: 2, keyId: "K002", roomNumber: "102", borrowedBy: "Jane Smith", borrowedDate: "2023-07-11 08:15", returnedDate: null, status: "Borrowed" },
];

const bicycleHistory = [
  { id: 1, bicycleId: "B001", model: "Mountain Bike", borrowedBy: "John Doe", borrowedDate: "2023-07-05 10:00", returnedDate: "2023-07-05 18:00", status: "Returned" },
  { id: 2, bicycleId: "B002", model: "City Bike", borrowedBy: "Jane Smith", borrowedDate: "2023-07-06 09:15", returnedDate: null, status: "Borrowed" },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const keyColumns = [
    { key: "keyId", header: "Key ID", cell: (row) => <div className="font-semibold text-gray-700">{row.keyId}</div> },
    { key: "roomNumber", header: "Room", cell: (row) => <div className="text-gray-600">{row.roomNumber}</div> },
    { key: "borrowedBy", header: "Borrower", cell: (row) => <div className="text-gray-700">{row.borrowedBy}</div> },
    { key: "borrowedDate", header: "Borrowed", cell: (row) => <div className="text-gray-500">{row.borrowedDate}</div> },
    { key: "returnedDate", header: "Returned", cell: (row) => <div className="text-gray-500">{row.returnedDate || "-"}</div> },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge className={`px-3 py-1 text-xs font-semibold rounded-md ${row.status === "Returned" ? "bg-green-600 text-white" : "bg-orange-500 text-white"}`}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const bicycleColumns = [
    { key: "bicycleId", header: "Bicycle ID", cell: (row) => <div className="font-semibold text-gray-700">{row.bicycleId}</div> },
    { key: "model", header: "Model", cell: (row) => <div className="text-gray-600">{row.model}</div> },
    { key: "borrowedBy", header: "Borrower", cell: (row) => <div className="text-gray-700">{row.borrowedBy}</div> },
    { key: "borrowedDate", header: "Borrowed", cell: (row) => <div className="text-gray-500">{row.borrowedDate}</div> },
    { key: "returnedDate", header: "Returned", cell: (row) => <div className="text-gray-500">{row.returnedDate || "-"}</div> },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge className={`px-3 py-1 text-xs font-semibold rounded-md ${row.status === "Returned" ? "bg-green-600 text-white" : "bg-orange-500 text-white"}`}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const filterData = (data) => {
    let filteredData = data;
    if (filterStatus !== "all") filteredData = filteredData.filter((item) => item.status === filterStatus);
    if (searchQuery)
      filteredData = filteredData.filter(
        (item) =>
          item.borrowedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.keyId && item.keyId.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.bicycleId && item.bicycleId.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.roomNumber && item.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.model && item.model.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return filteredData;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header />

        <div className="container mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="text-center">
            <div className="flex justify-center items-center w-20 h-20 bg-purple-200 rounded-full mx-auto mb-4 shadow-md">
              <HistoryIcon className="text-purple-700" size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Borrowing History</h1>
            <p className="text-gray-500 max-w-lg mx-auto mt-2">Track past and ongoing key & bicycle borrowings.</p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by ID, room, or user..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 border-gray-300" />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select className="border border-gray-300 rounded-md px-3 py-2 bg-white text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabs for History */}
          <div className="bg-white shadow-lg rounded-lg mt-6 p-6">
            <Tabs defaultValue="keys">
              <TabsList className="flex space-x-4 border-b pb-2">
                <TabsTrigger value="keys" className="px-4 py-2 font-medium rounded-md hover:bg-gray-100 transition">Key History</TabsTrigger>
                <TabsTrigger value="bicycles" className="px-4 py-2 font-medium rounded-md hover:bg-gray-100 transition">Bicycle History</TabsTrigger>
              </TabsList>

              <TabsContent value="keys">
                <DataTable columns={keyColumns} data={filterData(keyHistory)} idField="id" />
              </TabsContent>

              <TabsContent value="bicycles">
                <DataTable columns={bicycleColumns} data={filterData(bicycleHistory)} idField="id" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
