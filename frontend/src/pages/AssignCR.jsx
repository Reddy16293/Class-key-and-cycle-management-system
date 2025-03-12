import { UserCheck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StudentList from '../components/StudentList';

const AssignCR = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        {/* Header */}
        <Header />

        <div className="p-6 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <UserCheck className="text-purple-600" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Assign Class Representative
              </h1>
              <p className="text-gray-500 max-w-xl">
                Manage student roles by assigning or removing CR status. Use the search feature to find students by name or roll number.
              </p>
            </div>
          </div>

          {/* Student List Section */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <StudentList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignCR;