import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
  } from '@mui/icons-material';
import { Edit, Logout, Settings } from '@mui/icons-material';
import { deepPurple } from '@mui/material/colors';
import {  useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate();
  const [user] = useState({
    name: 'John Doe',
    email: 'admin@onemotive.com',
    phone: '+92 300 1234567',
    location: 'Lahore, Pakistan',
  });

  return (
    <Container maxWidth="md" className="min-h-screen flex flex-col items-center justify-center ">
        <Box className="w-full flex justify-start mb-4" sx={{ padding: 2 }}
        >
            
        <Button 
        className='!text-[#1C7293] !text-lg'
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
        >
        Back
      </Button>
          </Box>
      <Paper elevation={4} className="w-full rounded-xl overflow-hidden">
        {/* Header */}
        <Box className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 flex items-center justify-between text-white">
          <Box className="flex items-center gap-4">
            <Avatar
              sx={{ bgcolor: deepPurple[500], width: 80, height: 80, fontSize: 34 }}
            >
              {user.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5" className="font-bold">
                {user.name}
              </Typography>
              <Typography variant="body2" className="text-blue-100">
                {user.email}
              </Typography>
            </Box>
          </Box>
          <Box className="flex gap-2">
            <IconButton color="inherit" onClick={() => alert('Settings')}>
              <Settings />
            </IconButton>
            <IconButton color="inherit" onClick={() => alert('Logout')}>
              <Logout />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box className="p-6 bg-white">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography className="font-semibold text-gray-600 py-2">Email</Typography>
              <Typography className="text-gray-800 py-2">{user.email}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography className="font-semibold text-gray-600 py-2">Phone</Typography>
              <Typography className="text-gray-800 py-2">{user.phone}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className="font-semibold text-gray-600 py-2">Location</Typography>
              <Typography className="text-gray-800 py-2">{user.location}</Typography>
            </Grid>
          </Grid>

          <Divider className="my-6" />

          <Box className="flex justify-end py-4">
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => alert('Edit profile')}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;
