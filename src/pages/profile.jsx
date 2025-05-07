import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Stack,
  useMediaQuery,
  useTheme,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [user] = useState({
    name: 'John Doe',
    email: 'admin@onemotive.com',
    phone: '+92 300 1234567',
    location: 'Lahore, Pakistan',
    role: 'Administrator',
  });

  // Functions to provide feedback on actions
  const handleEditProfile = () => {
    alert('Edit profile functionality will be implemented soon');
  };

  const handleChangePassword = () => {
    alert('Change password functionality will be implemented soon');
  };

  const handleLogout = () => {
    alert('Logout functionality will be implemented soon');
    // navigate('/login');
  };

  const handleSettings = () => {
    alert('Settings functionality will be implemented soon');
  };

  const handleHelp = () => {
    alert('Help functionality will be implemented soon');
  };

  return (
    <Box className="min-h-screen flex flex-col pb-6">
      {/* Back button with better accessibility */}
      <Box className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 mb-3 sm:mb-4">
        <Tooltip title="Go back to previous page" arrow>
          <Button
            className="!text-[#1C7293] !font-medium !text-base sm:!text-lg"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            aria-label="Go back to previous page"
            size={isMobile ? "medium" : "large"}
          >
            Back
          </Button>
        </Tooltip>
      </Box>

      <Container maxWidth="lg" className="flex-1 w-full">
        <Grid container spacing={2.5} sx={{ width: '100%' }}>
          {/* Profile Header Card */}
          <Grid item xs={12} sx={{ width: '100%' }}>
            <Card 
              elevation={2} 
              className="rounded-xl overflow-hidden"
              sx={{ 
                background: 'linear-gradient(135deg, #1C7293, #065A82)',
                color: 'white',
                width: '100%'
              }}
            >
              <Box className="p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-center gap-4 w-full  sm:gap-6">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title="Edit profile picture">
                      <IconButton 
                        aria-label="Edit profile picture"
                        size="small"
                        sx={{ 
                          bgcolor: '#1C7293', 
                          color: 'white',
                          '&:hover': { bgcolor: '#065A82' },
                          border: '2px solid white'
                        }}
                        onClick={handleEditProfile}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Avatar
                    sx={{ 
                      width: { xs: 90, sm: 100, md: 110 }, 
                      height: { xs: 90, sm: 100, md: 110 }, 
                      fontSize: { xs: 36, sm: 40, md: 44 },
                      bgcolor: '#fff',
                      color: '#1C7293',
                      border: '4px solid rgba(255,255,255,0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  >
                    {user.name.charAt(0)}
                  </Avatar>
                </Badge>
                
                <Box className="flex-1 text-center sm:text-left">
                  <Typography 
                    variant="h4" 
                    className="font-bold mb-2" 
                    sx={{ 
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      lineHeight: 1.2
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Chip 
                    label={user.role} 
                    size="small" 
                    className="mb-2 bg-white text-[#1C7293] font-medium"
                  />
                  <Typography 
                    variant="body1" 
                    className="text-blue-100"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                
                <Stack 
                  direction={{ xs: 'row', sm: 'row' }} 
                  spacing={1}
                  sx={{ mt: { xs: 2, sm: 0 } }}
                >
                  <Tooltip title="Account settings" arrow>
                    <IconButton 
                      color="inherit" 
                      aria-label="Account settings"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
                      }}
                      onClick={handleSettings}
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Logout" arrow>
                    <IconButton 
                      color="inherit" 
                      aria-label="Logout"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
                      }}
                      onClick={handleLogout}
                    >
                      <LogoutIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Help" arrow>
                    <IconButton 
                      color="inherit" 
                      aria-label="Help"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)', 
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } 
                      }}
                      onClick={handleHelp}
                    >
                      <HelpIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Card>
          </Grid>

          {/* Profile Details and Account Settings */}
          <Grid item xs={12} container spacing={2.5}>
            {/* Profile Details Card */}
            <Grid item xs={12} md={7} className="flex">
              <Card elevation={2} className="rounded-xl w-full">
                <CardContent className="p-4 sm:p-6">
                  <Typography 
                    variant="h6" 
                    className="font-semibold mb-4 text-[#1C7293]"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Badge color="primary" variant="dot" invisible={false} />
                    Personal Information
                  </Typography>
                  
                  <Box className="space-y-4">
                    <Box className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <IconButton 
                        size="small" 
                        aria-label="Email"
                        sx={{ 
                          color: '#1C7293', 
                          bgcolor: 'rgba(28, 114, 147, 0.1)',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <EmailIcon />
                      </IconButton>
                      <Box className="flex-1 overflow-hidden">
                        <Typography className="text-sm text-gray-500 font-medium">Email</Typography>
                        <Typography className="font-medium text-ellipsis overflow-hidden">
                          {user.email}
                        </Typography>
                      </Box>
                      <Tooltip title="Edit email" arrow>
                        <IconButton 
                          size="small" 
                          edge="end" 
                          aria-label="Edit email"
                          onClick={handleEditProfile}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Divider />
                    
                    <Box className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <IconButton 
                        size="small" 
                        aria-label="Phone number"
                        sx={{ 
                          color: '#1C7293', 
                          bgcolor: 'rgba(28, 114, 147, 0.1)',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <PhoneIcon />
                      </IconButton>
                      <Box className="flex-1">
                        <Typography className="text-sm text-gray-500 font-medium">Phone</Typography>
                        <Typography className="font-medium">{user.phone}</Typography>
                      </Box>
                      <Tooltip title="Edit phone" arrow>
                        <IconButton 
                          size="small" 
                          edge="end" 
                          aria-label="Edit phone"
                          onClick={handleEditProfile}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    
                    <Divider />
                    
                    <Box className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <IconButton 
                        size="small" 
                        aria-label="Location"
                        sx={{ 
                          color: '#1C7293', 
                          bgcolor: 'rgba(28, 114, 147, 0.1)',
                          width: 40,
                          height: 40,
                        }}
                      >
                        <LocationIcon />
                      </IconButton>
                      <Box className="flex-1">
                        <Typography className="text-sm text-gray-500 font-medium">Location</Typography>
                        <Typography className="font-medium">{user.location}</Typography>
                      </Box>
                      <Tooltip title="Edit location" arrow>
                        <IconButton 
                          size="small" 
                          edge="end" 
                          aria-label="Edit location"
                          onClick={handleEditProfile}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Action Card */}
            <Grid item xs={12} md={5} className="flex">
              <Card elevation={2} className="rounded-xl w-full">
                <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                  <Typography 
                    variant="h6" 
                    className="font-semibold mb-4 text-[#1C7293]"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <Badge color="primary" variant="dot" invisible={false} />
                    Account Settings
                  </Typography>
                  
                  <Box className="space-y-3 flex-1">
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<EditIcon />}
                      onClick={handleEditProfile}
                      sx={{ 
                        py: 1.5, 
                        bgcolor: '#1C7293', 
                        '&:hover': { bgcolor: '#065A82' },
                        fontWeight: 500,
                        borderRadius: '8px',
                      }}
                      aria-label="Edit Profile"
                    >
                      Edit Profile
                    </Button>
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<LockIcon />}
                      onClick={handleChangePassword}
                      sx={{ 
                        py: 1.5, 
                        borderColor: '#1C7293', 
                        color: '#1C7293',
                        '&:hover': { borderColor: '#065A82', color: '#065A82' },
                        fontWeight: 500,
                        borderRadius: '8px',
                      }}
                      aria-label="Change Password"
                    >
                      Change Password
                    </Button>
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<NotificationsIcon />}
                      onClick={() => alert('Notification settings')}
                      sx={{ 
                        py: 1.5, 
                        borderColor: '#1C7293', 
                        color: '#1C7293',
                        '&:hover': { borderColor: '#065A82', color: '#065A82' },
                        fontWeight: 500,
                        borderRadius: '8px',
                      }}
                      aria-label="Notification Settings"
                    >
                      Notification Settings
                    </Button>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Button
                      variant="outlined"
                      fullWidth
                      color="error"
                      onClick={handleLogout}
                      sx={{ 
                        py: 1.5, 
                        fontWeight: 500,
                        borderRadius: '8px',
                      }}
                      startIcon={<LogoutIcon />}
                      aria-label="Logout"
                    >
                      Logout
                    </Button>
                  </Box>

                  <Box className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <Typography variant="body2" className="text-gray-600 text-center">
                      Need help? Contact <span className="text-[#1C7293] font-medium cursor-pointer hover:underline">support@onemotive.com</span>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Profile;
