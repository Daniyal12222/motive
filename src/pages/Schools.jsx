import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Chip, Divider, FormControl, Select, MenuItem, FormHelperText, Avatar,
  Pagination, TablePagination, useMediaQuery, useTheme, Card, CardContent
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
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import FormComponent from '../components/FormComponent';


function Schools() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { schools, setSchools, coaches, groups } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editSchool, setEditSchool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
    setPage(0); // Reset to first page when search changes
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  // Apply pagination to filtered schools
  const paginatedSchools = filteredSchools.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const handleSubmit = (values) => {
    if (editSchool) {
      // Update existing school
      const updatedSchools = schools.map(school => 
        school.id === editSchool.id 
          ? { ...school, ...values } 
          : school
      );
      setSchools(updatedSchools);
    } else {
      // Add new school
      const newSchool = {
        id: schools.length > 0 ? Math.max(...schools.map(s => s.id)) + 1 : 1,
        ...values
      };
      setSchools([...schools, newSchool]);
    }
    
    handleClose();
  };

  // Count coaches associated with a school
  const getSchoolCoachesCount = (schoolId) => {
    return coaches.filter(coach => coach.schoolId === schoolId).length;
  };
 
  const getInitialValues = () => {
    return {
      name: editSchool?.name || '',
      address: editSchool?.address || '',
      city: editSchool?.city || '',
      state: editSchool?.state || '',
      zipCode: editSchool?.zipCode || '',
      phone: editSchool?.phone || '',
      email: editSchool?.email || ''
    };
  };

  const formFields = [
    {
      name: 'name',
      label: 'School Name',
      type: 'text',
      required: true,
      width: 6
    },
    {
      name: 'address',
      label: 'Address',
      type: 'text',
      required: true,
      width: 6
    },
    {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
      width: 6
    },
    {
      name: 'state',
      label: 'State',
      type: 'text',
      required: true,
      width: 6
    },
    {
      name: 'zipCode',
      label: 'Zip Code',
      type: 'text',
      required: true,
      width: 6
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      required: true,
      width: 6
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      width: 12
    }
  ];

  // Count groups associated with a school (via coaches)
  const getSchoolGroupsCount = (schoolId) => {
    const schoolCoaches = coaches.filter(coach => coach.schoolId === schoolId);
    const coachIds = schoolCoaches.map(coach => coach.id);
    return groups.filter(group => coachIds.includes(group.coachId)).length;
  };

  // Get total athletes count for a school
  const getSchoolAthletesCount = (schoolId) => {
    const schoolCoaches = coaches.filter(coach => coach.schoolId === schoolId);
    const coachIds = schoolCoaches.map(coach => coach.id);
    const schoolGroups = groups.filter(group => coachIds.includes(group.coachId));

    let totalAthletes = 0;
    for (const group of schoolGroups) {
      totalAthletes += group.athletes?.length || 0;
    }

    return totalAthletes;
  };

  // Navigate to school detail page when clicking on a row
  const handleRowClick = (schoolId) => {
    navigate(`/school/${schoolId}`);
  };

  // Pagination Controls
  const TablePaginationActions = () => {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        bgcolor: '#f5f7fa', 
        px: isMobile ? 1 : 2, 
        py: 1, 
        borderRadius: '0 0 8px 8px',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        justifyContent: isMobile ? 'center' : 'flex-start'
      }}>
        <Typography variant="body2" sx={{ 
          mr: 2, 
          color: 'text.secondary',
          fontSize: isMobile ? '0.75rem' : '0.875rem'
        }}>
          {filteredSchools.length > 0 ? 
            `Showing ${Math.min(page * rowsPerPage + 1, filteredSchools.length)}-${Math.min((page + 1) * rowsPerPage, filteredSchools.length)} of ${filteredSchools.length}` : 
            'No results'
          }
        </Typography>
      </Box>
    );
  };

  // Render school as card for mobile view
  const renderSchoolCard = (school) => {
    return (
      <Card 
        key={school.id}
        sx={{ 
          mb: 2, 
          cursor: 'pointer',
          '&:hover': { boxShadow: 3 }
        }}
        onClick={() => handleRowClick(school.id)}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ mr: 2, bgcolor: 'rgba(28,114,147,0.2)', width: 40, height: 40 }}
            >
              <SchoolIcon sx={{ color: '#1C7293', fontSize: '1.25rem' }} />
            </Avatar>
            <Typography variant="h6" fontWeight={500}>
              {school.name}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Location:</strong> {school.city && school.state ? 
                `${school.city}, ${school.state} ${school.zipCode || ''}` : 'No location data'}
            </Typography>
          </Box>
          
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Contact:</strong> {school.phone || school.email ? 
                `${school.phone || ''} ${school.email || ''}` : 'No contact info'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            <Chip 
              icon={<PersonIcon sx={{ fontSize: '0.85rem' }} />} 
              label={`${getSchoolCoachesCount(school.id)} Coaches`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip 
              icon={<GroupIcon sx={{ fontSize: '0.85rem' }} />} 
              label={`${getSchoolGroupsCount(school.id)} Teams`}
              size="small"
              color="secondary"
              variant="outlined"
            />
            <Chip 
              icon={<PersonIcon sx={{ fontSize: '0.85rem' }} />} 
              label={`${getSchoolAthletesCount(school.id)} Athletes`}
              size="small"
              color="success"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <div>
      {/* Filter Section */}
      <Paper sx={{ p: isMobile ? 1.5 : 2, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center', 
          justifyContent: "space-between",
          gap: isMobile ? 2 : 0
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: isMobile ? '100%' : '50%' 
          }}>
            <TextField
              placeholder="Search schools..."
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
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: isMobile ? 'space-between' : 'flex-end',
            width: isMobile ? '100%' : 'auto'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
              {filteredSchools.length} {filteredSchools.length === 1 ? 'school' : 'schools'} found
            </Typography>
            <Button 
              className='!bg-[#1C7293] !text-white'
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleOpen}
              size={isMobile ? "small" : "medium"}
            >
              Add School
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Table View (for all screen sizes) */}
      <Box sx={{ width: '100%' , px: 5, py: 2 }}> 
      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          mb: 2,
        }}
      >
        <Table 
          sx={{ minWidth: isMobile ? 650 : 800 }} 
          aria-label="schools table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>School</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>Location</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>Contact</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>Coaches</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>Teams</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>Athletes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSchools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" sx={{ py: 2, color: 'text.secondary' }}>
                    No schools found. Add your first school!
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedSchools.map((school) => (
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
                  <TableCell sx={{ fontSize: '0.815rem', color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        sx={{ mr: 2, bgcolor: 'rgba(28,114,147,0.2)', width: 32, height: 32 }}
                      >
                        <SchoolIcon sx={{ color: '#1C7293', fontSize: '1rem' }} />
                      </Avatar>
                      <Typography variant="body2" fontWeight={500} sx={{ color: 'text.primary' }}>
                        {school.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.815rem', color: 'text.secondary' }}>
                    {school.city && school.state ? (
                      `${school.city}, ${school.state} ${school.zipCode || ''}`
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No location data
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.815rem', color: 'text.secondary' }}>
                    {school.phone || school.email ? (
                      <Box>
                        {school.phone && (
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {school.phone}
                          </Typography>
                        )}
                        {school.email && (
                          <Typography variant="body2" color="primary" sx={{ fontSize: '0.815rem' }}>
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
                  <TableCell sx={{ fontSize: '0.815rem', color: 'text.secondary' }}>
                    <Chip 
                      icon={<PersonIcon sx={{ fontSize: '0.85rem' }} />} 
                      label={getSchoolCoachesCount(school.id)}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: '22px', '& .MuiChip-label': { fontSize: '0.75rem', px: 1 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.815rem', color: 'text.secondary' }}>
                    <Chip 
                      icon={<GroupIcon sx={{ fontSize: '0.85rem' }} />} 
                      label={getSchoolGroupsCount(school.id)}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ height: '22px', '& .MuiChip-label': { fontSize: '0.75rem', px: 1 } }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.815rem', color: 'text.secondary' }}>
                    <Chip 
                      icon={<PersonIcon sx={{ fontSize: '0.85rem' }} />} 
                      label={getSchoolAthletesCount(school.id)}
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ height: '22px', '& .MuiChip-label': { fontSize: '0.75rem', px: 1 } }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      {/* Pagination */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        mt: 2,
        mb: 2,
        gap: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            Rows per page:
          </Typography>
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            size="small"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {[5, 10, 25].map((option) => (
              <MenuItem key={option} value={option} sx={{ fontSize: '0.875rem' }}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton 
            onClick={(e) => handleChangePage(e, page - 1)} 
            disabled={page === 0}
            size="small"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </IconButton>
          
          <Typography sx={{ mx: 2, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredSchools.length)} of ${filteredSchools.length}`}
          </Typography>
          
          <IconButton 
            onClick={(e) => handleChangeRowsPerPage(e)} 
            disabled={page >= Math.ceil(filteredSchools.length / rowsPerPage) - 1}
            size="small"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </IconButton>
        </Box>
      </Box>

      {/* Add/Edit School Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' , mb: 2, backgroundColor: '#1C7293', color: 'white' }}>
          {editSchool ? "Edit School" : "Add New School"}
        </DialogTitle>
        <DialogContent>
          
      <FormComponent
        fields={formFields}
        onSubmit={handleSubmit}
        submitButtonText={editSchool ? "Update" : "Add"}
        initialValues={getInitialValues()}
        handleClose={handleClose}
      />  
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Schools;
