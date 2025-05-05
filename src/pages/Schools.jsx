import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Chip, Divider, FormControl, Select, MenuItem, FormHelperText, Avatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  School as SchoolIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

function Schools() {
  const navigate = useNavigate();
  const { schools, setSchools, coaches, groups } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editSchool, setEditSchool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditSchool(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter schools by search query
  const filteredSchools = schools.filter(school => {
    const query = searchQuery.toLowerCase();
    return (
      school.name?.toLowerCase().includes(query) ||
      school.city?.toLowerCase().includes(query) ||
      school.state?.toLowerCase().includes(query) ||
      school.email?.toLowerCase().includes(query) ||
      school.phone?.toLowerCase().includes(query)
    );
  });

  // Get all cities from schools
  const cities = [...new Set(schools.filter(school => school.city).map(school => school.city))];

  const handleEditClick = (school) => {
    setEditSchool(school);
    setFormData({
      name: school.name,
      address: school.address || '',
      city: school.city || '',
      state: school.state || '',
      zipCode: school.zipCode || '',
      phone: school.phone || '',
      email: school.email || ''
    });
    setOpen(true);
  };

  const handleDeleteClick = (schoolId) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      const updatedSchools = schools.filter(school => school.id !== schoolId);
      setSchools(updatedSchools);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editSchool) {
      // Update existing school
      const updatedSchools = schools.map(school => 
        school.id === editSchool.id 
          ? { ...school, ...formData } 
          : school
      );
      setSchools(updatedSchools);
    } else {
      // Add new school
      const newSchool = {
        id: schools.length > 0 ? Math.max(...schools.map(s => s.id)) + 1 : 1,
        ...formData
      };
      setSchools([...schools, newSchool]);
    }
    
    handleClose();
  };

  // Count coaches associated with a school
  const getSchoolCoachesCount = (schoolId) => {
    return coaches.filter(coach => coach.schoolId === schoolId).length;
  };

  // Count groups associated with a school (via coaches)
  const getSchoolGroupsCount = (schoolId) => {
    const schoolCoaches = coaches.filter(coach => coach.schoolId === schoolId);
    const coachIds = schoolCoaches.map(coach => coach.id);
    return groups.filter(group => coachIds.includes(group.coachId)).length;
  };

  // Navigate to school detail page when clicking on a row
  const handleRowClick = (schoolId) => {
    navigate(`/school/${schoolId}`);
  };

  return (
    <div>
      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
          <div className='flex items-center' style={{ width: '50%' }}>
            <TextField
              placeholder="Search schools by name, city, state, etc."
              variant="outlined"
              fullWidth
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                sx: { borderRadius: 2 },
                endAdornment: (
                  <>
                    {searchQuery ? (
                      <IconButton
                        size="small"
                        aria-label="clear search"
                        onClick={() => setSearchQuery('')}
                        edge="end"
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" edge="end">
                        <SearchIcon fontSize="small" color="action" />
                      </IconButton>
                    )}
                  </>
                )
              }}
            />
          </div>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'} found
            </Typography>
            <Button 
              className='!bg-[#1C7293] !text-white'
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleOpen}
            >
              Add School
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Schools Table */}
      <TableContainer 
        component={Paper}
        sx={{
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#1C7293",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#14576F",
          },
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="schools table">
          <TableHead>
            <TableRow>
              <TableCell>School</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Coaches</TableCell>
              <TableCell>Teams</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No schools found. Add your first school!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredSchools.map((school) => (
                <TableRow 
                  key={school.id}
                  onClick={() => handleRowClick(school.id)}
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(0, 0, 0, 0.04)',
                      cursor: 'pointer'
                    } 
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ mr: 2, bgcolor: 'rgba(28,114,147,0.2)' }}
                      >
                        <SchoolIcon sx={{ color: '#1C7293' }} />
                      </Avatar>
                      <Typography variant="body1" fontWeight={500}>
                        {school.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {school.city && school.state ? (
                      `${school.city}, ${school.state} ${school.zipCode || ''}`
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No location data
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {school.phone || school.email ? (
                      <Box>
                        {school.phone && (
                          <Typography variant="body2">
                            {school.phone}
                          </Typography>
                        )}
                        {school.email && (
                          <Typography variant="body2" color="primary">
                            {school.email}
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No contact info
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={<PersonIcon />} 
                      label={getSchoolCoachesCount(school.id)}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      icon={<GroupIcon />} 
                      label={getSchoolGroupsCount(school.id)}
                      size="small"
                      color="secondary"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit School Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', bgcolor: '#1C7293', color: 'white' }}>
          {editSchool ? 'Edit School' : 'Add New School'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            px: 4,
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#1C7293",
              borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "#14576F",
            },
          }}>
            <Grid container spacing={2} sx={{ maxWidth: '95%' }}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  name="name"
                  label="School Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  margin="normal"
                  variant="outlined"
                  helperText="Enter the school's name"
                  placeholder="Westview High School"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="address"
                  label="Address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText="Street address"
                  placeholder="123 Main St"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="city"
                  label="City"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText="City name"
                  placeholder="San Diego"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name="state"
                  label="State"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText="State abbreviation"
                  placeholder="CA"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name="zipCode"
                  label="Zip Code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText="5-digit zip code"
                  placeholder="92101"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="phone"
                  label="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText="Format: (123) 456-7890"
                  placeholder="(555) 123-4567"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  helperText="School contact email"
                  placeholder="info@westview.edu"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
            <Button 
              onClick={handleClose} 
              variant="outlined"
              sx={{ 
                px: 3, 
                borderRadius: 6,
                color: 'text.secondary',
                borderColor: 'text.secondary',
                '&:hover': {
                  borderColor: 'text.primary',
                  bgcolor: 'rgba(0,0,0,0.03)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              sx={{ 
                px: 4, 
                borderRadius: 6,
                bgcolor: '#1C7293',
                '&:hover': {
                  bgcolor: '#14576F'
                }
              }}
            >
              {editSchool ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Schools; 