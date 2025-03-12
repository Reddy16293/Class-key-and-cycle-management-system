import { useState } from 'react';
import { UserCheck, UserX, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { toast } from 'sonner';

// Mock student data
const initialStudents = [
  { id: '1', name: 'John Doe', rollNumber: 'CS001', role: 'Non-CR' },
  { id: '2', name: 'Jane Smith', rollNumber: 'CS002', role: 'CR' },
  { id: '3', name: 'Michael Brown', rollNumber: 'CS003', role: 'Non-CR' },
  { id: '4', name: 'Emma Wilson', rollNumber: 'CS004', role: 'Non-CR' },
  { id: '5', name: 'Robert Johnson', rollNumber: 'CS005', role: 'CR' },
];

const StudentList = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Role Change
  const handleRoleChange = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === id) {
          const newRole = student.role === 'CR' ? 'Non-CR' : 'CR';

          toast.success(
            `${student.name} is now ${newRole === 'CR' ? 'a CR' : 'no longer a CR'}`,
            {
              description: `Roll Number: ${student.rollNumber}`,
              position: 'top-center',
            }
          );

          return { ...student, role: newRole };
        }
        return student;
      })
    );
  };

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
              <th className="px-6 py-3 text-left text-sm font-semibold">Roll Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-100 transition">
                  <td className="px-6 py-4">{student.name}</td>
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
                      className={`flex items-center gap-2 px-4 py-2 ${
                        student.role === 'CR' ? 'text-black' : ''
                      }`}
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
                <td colSpan="4" className="text-center py-6 text-gray-500">
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
