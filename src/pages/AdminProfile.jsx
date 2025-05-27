import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Avatar, 
  Button, 
  Card, 
  Divider, 
  IconButton, 
  Paper, 
  Tab, 
  Tabs, 
  TextField, 
  Typography 
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Settings as SettingsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  DashboardCustomize as DashboardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

const AdminProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'U',
    role: 'System Administrator',
    email: 'admin@motive.com',
    phone: '(555) 987-6543',
    location: 'New York, NY',
    joinDate: 'October 2021',
    bio: 'Platform administrator with full system access. Responsible for user management, system configuration, and platform maintenance. Experienced in sports management and technical operations.',
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSave = () => {
    // Here you would typically send the updated data to an API
    console.log('Saving profile data:', profileData);
    setEditMode(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderProfileInfo = () => {
    if (editMode) {
      return (
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              variant="outlined"
              size="small"
            />
          </div>
          <TextField
            fullWidth
            label="Role"
            name="role"
            value={profileData.role}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={profileData.location}
            onChange={handleInputChange}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            label="Bio"
            name="bio"
            value={profileData.bio}
            onChange={handleInputChange}
            variant="outlined"
            multiline
            rows={4}
          />
          <div className="flex space-x-2">
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveIcon />} 
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button 
              variant="outlined" 
              color="secondary" 
              startIcon={<CancelIcon />} 
              onClick={handleEditToggle}
            >
              Cancel
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4 mt-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <EmailIcon fontSize="small" />
          <Typography>{profileData.email}</Typography>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <PhoneIcon fontSize="small" />
          <Typography>{profileData.phone}</Typography>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <LocationIcon fontSize="small" />
          <Typography>{profileData.location}</Typography>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <CalendarIcon fontSize="small" />
          <Typography>Admin since {profileData.joinDate}</Typography>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <AdminIcon fontSize="small" />
          <Typography>Administrator Access</Typography>
        </div>
        <Divider />
        <div>
          <Typography variant="h6" className="font-medium mb-2">About</Typography>
          <Typography variant="body2" className="text-gray-600">
            {profileData.bio}
          </Typography>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Overview
        return (
          <div>
            <Card className="p-4 mb-4">
              <Typography variant="h6" className="mb-2">System Activity</Typography>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start p-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 mt-2 rounded-full !bg-[#1C7293] mr-3"></div>
                    <div>
                      <Typography variant="body2" className="font-medium">
                        {item === 1 ? 'Added 3 new coach accounts' : item === 2 ? 'Updated system settings' : 'Performed database maintenance'}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {item === 1 ? '2 hours ago' : item === 2 ? 'Yesterday' : '3 days ago'}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <Typography variant="h6" className="mb-2">Admin Controls</Typography>
                <div className="space-y-2">
                  {['User Management', 'System Configuration', 'Content Moderation'].map((control, index) => (
                    <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                      <Typography variant="body2">{control}</Typography>
                      <Button size="small" variant="outlined" className='!bg-[#1C7293] !text-white'>
                        Manage
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card className="p-4">
                <Typography variant="h6" className="mb-2">Platform Stats</Typography>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Typography variant="h5" className="!text-[#1C7293] font-bold">58</Typography>
                    <Typography variant="body2" className="text-gray-500">Athletes</Typography>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Typography variant="h5" className="!text-[#1C7293] font-bold">12</Typography>
                    <Typography variant="body2" className="text-gray-500">Coaches</Typography>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Typography variant="h5" className="!text-[#1C7293] font-bold">7</Typography>
                    <Typography variant="body2" className="text-gray-500">Schools</Typography>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Typography variant="h5" className="!text-[#1C7293] font-bold">99.8%</Typography>
                    <Typography variant="body2" className="text-gray-500">Uptime</Typography>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      case 1: // Settings
        return (
          <Card className="p-4">
            <Typography variant="h6" className="mb-4">Admin Settings</Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="subtitle2" className="mb-1">System Notifications</Typography>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <Typography variant="body2">Receive user registration alerts</Typography>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                    <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <Typography variant="body2">Receive system alert notifications</Typography>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                    <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <Typography variant="body2">Receive weekly system reports</Typography>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" name="toggle" id="toggle3" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                    <label htmlFor="toggle3" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <Typography variant="subtitle2" className="mb-1">Security</Typography>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<SecurityIcon />}
                  >
                    Change Admin Password
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<SecurityIcon />}
                  >
                    Two-Factor Authentication
                  </Button>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <Typography variant="subtitle2" className="mb-1">System Maintenance</Typography>
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<DashboardIcon />}
                    color="primary"
                  >
                    Database Backup
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    size="small"
                  >
                    Clear System Cache
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-2">
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleGoBack}
        className=" !text-[#1C7293] mb-4 "
        variant="text"
        size='large'
      >
        Back
      </Button>
      
      <Paper className="mb-6">
        {/* Cover Photo */}
        <div className="h-44 bg-gradient-to-r from-[#1C7293] to-[#1C7293]/80 relative">
          {/* Admin Badge */}
          <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full font-bold text-sm flex items-center">
            <AdminIcon fontSize="small" className="mr-1" />
            ADMIN
          </div>
          
          {/* Profile Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {!editMode && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
                className="bg-opacity-90 !bg-[#1C7293] hover:bg-white"
              >
                Edit Profile
              </Button>
            )}
            <IconButton className="bg-white bg-opacity-90 text-white hover:bg-white">
              <SettingsIcon className='!text-white' />
            </IconButton>
          </div>
        </div>
        
        {/* Profile Header */}
        <div className="px-6 pt-4 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end -mt-12 md:-mt-16">
            <Avatar 
              src="https://randomuser.me/api/portraits/men/41.jpg" 
              alt={`${profileData.firstName} ${profileData.lastName}`}
              sx={{ width: 120, height: 120, border: '4px solid white' }}
            />
            <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
              <Typography variant="h4" className="font-bold">
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" className="flex items-center">
                <AdminIcon fontSize="small" className="mr-1 text-blue-500" />
                {profileData.role}
              </Typography>
            </div>
          </div>
          
          {/* Profile Stats */}
          <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-6">
            <div className="text-center">
              <Typography variant="h5" className="font-bold">58</Typography>
              <Typography variant="body2" color="textSecondary">Athletes</Typography>
            </div>
            <div className="text-center">
              <Typography variant="h5" className="font-bold">12</Typography>
              <Typography variant="body2" color="textSecondary">Coaches</Typography>
            </div>
            <div className="text-center">
              <Typography variant="h5" className="font-bold">7</Typography>
              <Typography variant="body2" color="textSecondary">Schools</Typography>
            </div>
          </div>
          
          {/* Profile Info */}
          {renderProfileInfo()}
        </div>
      </Paper>
      
      {/* Tabs Section */}
      <Paper>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          className="border-b"
          sx={{
            "& .Mui-selected": {
              color: "#1C7293"
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1C7293"
            }
          }}
        >
          <Tab label="Admin Dashboard" />
          <Tab label="System Settings" />
        </Tabs>
        
        <div className="p-4">
          {renderTabContent()}
        </div>
      </Paper>
      
      {/* Add custom styles for toggle switch */}
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #1C7293;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #1C7293;
        }
      `}</style>
    </div>
  );
};

export default AdminProfile; 