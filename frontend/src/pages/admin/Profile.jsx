import { useState } from 'react';
import { User, Save, Mail, Phone, School, MapPin, Pencil } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { toast } from 'sonner';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@university.edu',
    phone: '+1 (123) 456-7890',
    department: 'Information Technology',
    address: '123 University Ave, College Town',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditing(false);

    toast.success('Profile updated successfully', {
      position: 'top-center',
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="p-6">
          {/* Profile Card */}
          <div className="max-w-3xl mx-auto bg-gray-400 rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Cover Image & Avatar */}
            <div className="relative bg-gradient-to-r from-admin-purple to-indigo-600 h-36">
              <div className="absolute -bottom-14 left-6">
                <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                  <AvatarFallback className="bg-admin-purple text-white text-3xl">
                    {profile.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div className="p-6 mt-12">
              {/* Edit Button */}
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => {
                    if (isEditing) {
                      setFormData({ ...profile });
                    }
                    setIsEditing(!isEditing);
                  }}
                  variant={isEditing ? 'outline' : 'default'}
                  className="flex items-center gap-2"
                >
                  <Pencil size={16} />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </Button>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <User size={18} className="text-gray-500" />
                        <span>{profile.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <Mail size={18} className="text-gray-500" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <Phone size={18} className="text-gray-500" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <School size={18} className="text-gray-500" />
                        <span>{profile.department}</span>
                      </div>
                    )}
                  </div>

                  {/* Address (Full Width) */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <MapPin size={18} className="text-gray-500" />
                        <span>{profile.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Changes Button */}
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-admin-purple hover:bg-indigo-700 transition duration-300 flex items-center gap-2"
                    >
                      <Save size={16} />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
