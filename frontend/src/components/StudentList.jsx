import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { UserCheck, UserX, Search, Loader } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/all-users', { withCredentials: true });

        // Extract roll number & filter out ADMINs
        const filteredStudents = response.data
          .filter(user => user.role === 'CR' || user.role === 'NON_CR')
          .map(user => ({
            ...user,
            rollNumber: extractRollNumber(user.email),
          }));

        setStudents(filteredStudents);
      } catch (error) {
        toast.error('Failed to fetch students');
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Function to extract roll number from email
  const extractRollNumber = (email) => {
    const match = email.match(/_(\d+)@nitc\.ac\.in/); // Extracts roll number
    return match ? match[1] : 'N/A'; // If no match, return "N/A"
  };

  // Handle Role Change (Calls Backend API)
  const handleRoleChange = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/admin/change-role/${id}`, {}, { withCredentials: true });

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === id
            ? { ...student, role: student.role === 'CR' ? 'NON_CR' : 'CR' }
            : student
        )
      );

      toast.success(response.data, {
        position: 'top-center',
      });
    } catch (error) {
      toast.error('Failed to change role');
      console.error('Error changing role:', error);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md mx-auto">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search by name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-gray-300 focus:ring-purple-500"
        />
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Roll Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  <Loader className="animate-spin inline-block" /> Loading...
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-100 transition">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">{student.rollNumber}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={`px-2 py-1 text-sm rounded-lg ${
                        student.role === 'CR' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}
                    >
                      {student.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant={student.role === 'CR' ? 'destructive' : 'default'}
                      onClick={() => handleRoleChange(student.id)}
                      className={`flex items-center gap-2 px-4 py-2`}
                    >
                      {student.role === 'CR' ? (
                        <>
                          <UserX size={16} /> Remove CR
                        </>
                      ) : (
                        <>
                          <UserCheck size={16} /> Assign CR
                        </>
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;