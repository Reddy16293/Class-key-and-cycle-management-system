import { useEffect, useState } from "react";
import { Users, Search, UserMinus, UserPlus, LogOut } from "lucide-react";
import { DataTable } from "../components/ui/data-table";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { toast } from "sonner";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// API Endpoint
const API_URL = "http://localhost:8080/api/admin/all-users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch users");
        let data = await response.json();
  
        // Filter out ADMIN users
        data = data.filter(user => user.role === "CR" || user.role === "NON_CR");
  
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete confirmation
  const handleDeleteUser = (user) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <span>Are you sure you want to delete {user.name}?</span>
          <div className="flex gap-3">
            <Button variant="destructive" size="sm" onClick={() => confirmDeletePrompt(user, t)}>
              Yes, Delete
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </Button>
          </div>
        </div>
      ),
      { duration: 5000, position: "top-center" }
    );
  };

  // Open final confirmation dialog
  const confirmDeletePrompt = (user, toastId) => {
    toast.dismiss(toastId);
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  // Final delete action (only updates UI for now)
  const confirmDelete = () => {
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setShowDeleteDialog(false);
    toast.success("User deleted successfully", {
      description: `${userToDelete.name} has been removed.`,
      position: "top-center",
    });
    setUserToDelete(null);
  };

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
            variant={row.status === "Active" ? "outline" : "default"}
            onClick={() => {
              setUsers(
                users.map((user) =>
                  user.id === row.id
                    ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
                    : user
                )
              );
              toast.success("User status updated", {
                description: `${row.name} is now ${
                  row.status === "Active" ? "Inactive" : "Active"
                }`,
                position: "top-center",
              });
            }}
          >
            {row.status === "Active" ? <>Deactivate</> : <>Activate</>}
          </Button>
  
          {/* Delete button with icon */}
          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(row)} className="flex items-center gap-1">
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
                  placeholder="Search by name, email or role..."
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-base mt-4">
              Are you sure you want to permanently delete {userToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="flex-1">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
