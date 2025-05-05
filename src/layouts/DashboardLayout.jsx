import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Typography, Avatar, Menu, MenuItem, Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Event as EventIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import { useAppContext } from '../context/AppContext';

function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current route is a detail page
  const isDetailPage = location.pathname.startsWith('/coach/') || location.pathname.startsWith('/athlete/');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/dashboard' 
    },
    { 
      text: 'Coaches', 
      icon: <PersonIcon />, 
      path: '/coaches' 
    },
    { 
      text: 'Athletes', 
      icon: <PeopleIcon />, 
      path: '/athletes' 
    },
    { 
      text: 'Teams', 
      icon: <Diversity3Icon />, 
      path: '/groups' 
    },
    { 
      text: 'Schools', 
      icon: <SchoolIcon />, 
      path: '/schools' 
    },
  ];

  // Find active page name
  const activeMenuItem = menuItems.find(item => item.path === location.pathname);
  const activePageName = activeMenuItem ? activeMenuItem.text : 'Motive';

  const drawer = (
    <div className="h-full bg-[#1C7293] text-white">
      <Toolbar className="">
        <Typography variant="h6" noWrap component="div" className="flex-grow font-medium">
          Motive
        </Typography>
      </Toolbar>
      <List className="py-2">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding className="px-2">
            <ListItemButton 
              component={Link} 
              to={item.path}
              selected={location.pathname === item.path}
              className={`rounded-lg transition-colors ${location.pathname === item.path ? '!bg-[#065A82] !rounded text-white' : 'hover:bg-[#1A6480] text-white'}`}
            >
              <ListItemIcon className="!text-white">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                className="text-white"
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box className="flex h-screen   dark:bg-gray-900">
      <CssBaseline />
      {!isDetailPage && (
        <Box 
          component="nav"
          className="fixed z-30 h-full"
          sx={{ width: { xs: 0, sm: 240 } }}
          aria-label="dashboard navigation"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 240,
                borderColor: 'divider'
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 240,
                borderColor: 'divider',
                boxShadow: 1
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      )}
      <Box 
        component="main" 
        className="flex-1 flex flex-col overflow-hidden "
        sx={{ ml: isDetailPage ? 0 : { sm: '240px' } }}
      >
        <AppBar
          position="sticky"
          color="inherit"
          className="z-40 !bg-[#1C7293] shadow-sm text-white"
          elevation={0}
        >
          <Toolbar className="px-4 flex justify-between">
            <Box component="div" className=' flex justify-center items-center'>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className="mr-4 text-white sm:hidden"
            >
              <MenuIcon className='md:!hidden' />
            </IconButton>
            <Typography variant="h6" noWrap component="div" className="font-medium text-center text-white">
              {activePageName}
            </Typography>
            </Box>
            <Box className="flex items-center">
              <Tooltip title="Open user menu">
                <IconButton onClick={handleOpenUserMenu} className="p-1 text-white">
                  <Avatar 
                    alt={user?.name || 'User'} 
                    src="/static/images/avatar/1.jpg" 
                    className="h-8 w-8 text-sm"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                className="mt-2"
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu} className="min-w-[180px]">
                  <Typography className="text-gray-700">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout} className="min-w-[180px]">
                  <ListItemIcon className="text-gray-600">
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography className="text-gray-700">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Box className="flex-1 overflow-y-auto p-6 bg-[#9EB3C2]">
          <div className="max-w-7xl py-3 mx-auto bg-white rounded">
            <Outlet />
          </div>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout; 