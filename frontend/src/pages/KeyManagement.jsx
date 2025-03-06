import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Key, CheckCircle2, PlusCircle, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'react-hot-toast';

const KeyManagement = () => {
  const navigate = useNavigate();
  const [blockName, setBlockName] = useState('');
  const [classroomName, setClassroomName] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [keys, setKeys] = useState([
    { id: '1', blockName: 'Block A', classroomName: 'Room 101', isAvailable: true },
    { id: '2', blockName: 'Block B', classroomName: 'Room 202', isAvailable: false },
    { id: '3', blockName: 'Block C', classroomName: 'Room 303', isAvailable: true },
  ]);
  
  const handleAddKey = async (e) => {
    e.preventDefault();
    
    if (!blockName || !classroomName) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const newKey = {
      blockName,
      classroomName,
      isAvailable: isAvailable ? 1 : 0
    };
    
    try {
        const response = await axios.post('http://localhost:8080/api/admin/addclassrooms', newKey);
        
        setKeys([...keys, { id: Date.now().toString(), ...response.data }]);
        setBlockName('');
        setClassroomName('');
        setIsAvailable(true);
        
        toast.success('Key added successfully');
      } catch (error) {
        if (error.response && error.response.status === 409) {
          toast.error(error.response.data.message || 'Classroom already exists');
        } else {
          toast.error('Failed to add key');
        }
        console.error('Error adding key:', error);
      }
      
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-16 md:ml-64 transition-all duration-300">
        <Header />
        <div className="p-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <Key className="text-purple-600" size={24} /> Add New Key
              </h2>
              <form onSubmit={handleAddKey} className="space-y-4">
                <div>
                  <Label>Block Name</Label>
                  <Input
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    placeholder="Enter block name"
                    required
                  />
                </div>
                <div>
                  <Label>Classroom Name</Label>
                  <Input
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                    placeholder="Enter classroom name"
                    required
                  />
                </div>
                <div className="mt-4">
                  <Label>Availability Status</Label>
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
                <Button type="submit" className="w-full bg-purple-600 text-white hover:bg-purple-700 mt-4">
                  <PlusCircle size={18} className="mr-2" /> Add Key
                </Button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Key Management Options</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button onClick={() => navigate('/available-keys')} className="w-full p-4 bg-green-100 hover:bg-green-200">
                    <CheckCircle2 className="text-green-600 mr-2" size={24} /> View Available Keys
                  </Button>
                  <Button onClick={() => navigate('/all-keys')} className="w-full p-4 bg-blue-100 hover:bg-blue-200">
                    <List className="text-blue-600 mr-2" size={24} /> View All Keys
                  </Button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Recently Added Keys</h2>
                <div className="space-y-3">
                  {keys.slice(-3).reverse().map((key) => (
                    <div key={key.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{key.blockName} - {key.classroomName}</h3>
                        <span className={`px-2 py-1 text-sm rounded-lg ${key.isAvailable ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
                          {key.isAvailable ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <Key size={24} className="text-purple-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default KeyManagement;
