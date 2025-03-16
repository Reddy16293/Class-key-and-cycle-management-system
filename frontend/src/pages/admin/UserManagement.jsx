import { useEffect, useState } from "react";
import { Users, Search, UserMinus, UserPlus } from "lucide-react";
import { DataTable } from "../../components/ui/data-table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { toast } from "sonner";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

// API Endpoint
const API_URL = "http://localhost:8080/api/admin/all-users";
const DELETE_USER_URL = "http://localhost:8080/api/admin/delete-user";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch users");
        let data = await response.json();

        // Filter out ADMIN users and add rollNumber field
        data = data
          .filter((user) => user.role === "CR" || user.role === "NON_CR")
          .map((user) => ({
            ...user,
            rollNumber: extractRollNumber(user.email), // Extract roll number from email
          }));

        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Function to extract roll number from email
  const extractRollNumber = (email) => {
    const match = email.match(/_(b\d+[a-zA-Z]*)@nitc\.ac\.in/); // Extracts roll number
    return match ? match[1] : "N/A"; // If no match, return "N/A"
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) // Include roll number in search
  );

  // Handle delete confirmation
  const handleDeleteUser = (user) => {
    setUserToDelete(user); // Set the user to delete
    setShowDeleteDialog(true); // Show the confirmation dialog
  };

  // Final delete action
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`${DELETE_USER_URL}/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      // Update the UI by removing the deleted user
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setShowDeleteDialog(false); // Close the dialog
      toast.success("User deleted successfully", {
        description: `${userToDelete.name} has been removed.`,
        position: "top-center",
      });
      setUserToDelete(null); // Reset the user to delete
    } catch (err) {
      toast.error("Error deleting user", {
        description: err.message,
        position: "top-center",
      });
    }
  };

  // Table columns
  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (row) => <div className="font-medium">{row.name}</div>,
    },
    {
      key: "email",
      header: "Email",
      cell: (row) => <div>{row.email}</div>,
    },
    {
      key: "rollNumber",
      header: "Roll Number",
      cell: (row) => <div>{row.rollNumber}</div>,
    },
    {
      key: "role",
      header: "Role",
      cell: (row) => (
        <Badge
          className={`px-3 py-1 text-xs font-semibold rounded-md ${
            row.role === "CR" ? "bg-blue-500 text-white" : "bg-gray-600 text-white"
          }`}
        >
          {row.role}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Badge className={row.status === "Active" ? "bg-green-500" : "bg-gray-500"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteUser(row)}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
          >
            <UserMinus size={18} className="mr-1" /> Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header title="User Management" />

        {/* Main Content */}
        <div className="p-6 max-w-6xl flex-grow">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, roll number, or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="whitespace-nowrap">
                <UserPlus size={16} className="mr-2" /> Add New User
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-500">Loading users...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">Error: {error}</div>
            ) : (
              <DataTable columns={columns} data={filteredUsers} searchField={null} idField="id" />
            )}
          </div>
        </div>
      </div>

      {/* Final Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-red-100">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-700">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-base mt-4 text-red-600">
              Are you sure you want to permanently delete {userToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="flex-1 bg-amber-900">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;