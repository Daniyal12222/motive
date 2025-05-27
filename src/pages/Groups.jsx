import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Select, MenuItem, FormControl, InputLabel, Chip, ListItem,
  ListItemText, List, Checkbox, FormControlLabel, Avatar, FormHelperText,
  TablePagination, useTheme, useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Group as GroupIcon, 
  FilterList as FilterIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

function Groups() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { groups, setGroups, coaches, athletes, schools } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    name: '',
    coachId: '',
    athletes: [],
    schoolId: ''
  });

  // Map to hold coach to school relationships
  const [coachSchoolMap, setCoachSchoolMap] = useState({});

  // Create a map of coach ID to school ID
  useEffect(() => {
    const map = {};
    coaches.forEach(coach => {
      if (coach.schoolId) {
        map[coach.id] = coach.schoolId;
      }
    });
    setCoachSchoolMap(map);
  }, [coaches]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditGroup(null);
    setFormData({
      name: '',
      coachId: '',
      athletes: [],
      schoolId: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSchoolFilterChange = (e) => {
    setSelectedSchool(e.target.value);
  };

  // Filter groups by coach's school
  const filteredGroups = selectedSchool 
    ? groups.filter(group => coachSchoolMap[group.coachId] === selectedSchool)
    : groups;
    
  // Get current page data
  const paginatedGroups = filteredGroups.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleAthleteToggle = (athleteId) => {
    const currentAthletes = [...formData.athletes];
    const athleteIndex = currentAthletes.indexOf(athleteId);
    
    if (athleteIndex === -1) {
      currentAthletes.push(athleteId);
    } else {
      currentAthletes.splice(athleteIndex, 1);
    }
    
    setFormData({
      ...formData,
      athletes: currentAthletes
    });
  };

  const handleEditClick = (group) => {
    setEditGroup(group);
    setFormData({
      name: group.name,
      coachId: group.coachId,
      athletes: group.athletes || [],
      schoolId: group.schoolId || ''
    });
    setOpen(true);
  };

  const handleDeleteClick = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      const updatedGroups = groups.filter(group => group.id !== groupId);
      setGroups(updatedGroups);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editGroup) {
      // Update existing group
      const updatedGroups = groups.map(group => 
        group.id === editGroup.id 
          ? { ...group, ...formData } 
          : group
      );
      setGroups(updatedGroups);
    } else {
      // Add new group
      const newGroup = {
        id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
        ...formData
      };
      setGroups([...groups, newGroup]);
    }
    
    handleClose();
  };

  // Get coach name from coach ID
  const getCoachName = (coachId) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.name : 'Unknown Coach';
  };

  // Get coach specialty from coach ID
  const getCoachSpecialty = (coachId) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.specialty : '';
  };

  // Navigate to group detail page
  const handleViewGroupDetail = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  // Get school name by ID
  const getSchoolName = (coachId) => {
    if (!coachId) return 'Not Assigned';
    const coach = coaches.find(c => c.id === coachId);
    if (!coach || !coach.schoolId) return 'Not Assigned';
    
    const school = schools.find(s => s.id === coach.schoolId);
    return school ? school.name : 'Unknown School';
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

  return (
    <div>
      {/* School Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          alignItems: { xs: 'stretch', sm: 'center' }, 
          justifyContent: "space-between",
          gap: 2
        }}>
          <div className='flex items-center'>
            <FormControl sx={{ width: { xs: '100%', sm: 250, md: 300 } }} size="small">
              <Select
                id="school-filter"
                value={selectedSchool}
                onChange={handleSchoolFilterChange}
                displayEmpty
                sx={{ fontSize: '0.875rem' }}
              >
                <MenuItem value="" sx={{ fontSize: '0.875rem' }}>
                  <Typography>All Schools</Typography>
                </MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id} sx={{ fontSize: '0.875rem' }}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <Button 
            className='!bg-[#1C7293] !text-white'
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            Add Team
          </Button>
        </Box>
      </Paper>

      {/* Team Table List (restored) */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '0.8rem' }}>Team</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Coach</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>School</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Athletes</TableCell>
              <TableCell sx={{ fontSize: '0.8rem' }}>Events</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedGroups.map((group) => (
              <TableRow 
                key={group.id}
                onClick={() => handleViewGroupDetail(group.id)}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer'
                  } 
                }}
              >
                <TableCell sx={{ fontSize: '0.8rem' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ mr: 2, bgcolor: '#1C7293' }}
                    >
                      <GroupIcon />
                    </Avatar>
                    {group.name}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem'}}>{getCoachName(group.coachId)}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem'}}>{getSchoolName(group.coachId)}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem'}}>
                  {group.athletes && group.athletes.length > 0 ? (
                    <Chip 
                      icon={<GroupIcon />} 
                      label={`${group.athletes.length} Athletes`} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                    />
                  ) : 'No athletes'}
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>
                  {group.events && group.events.length > 0 ? (
                    <Chip 
                      label={`${group.events.length} Events`} 
                      color="secondary" 
                      variant="outlined"
                      size="small"
                    />
                  ) : 'No events'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredGroups.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ 
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontSize: '0.8rem'
          }
        }}
      />

      {/* Add/Edit Group Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: 8,
            bgcolor: '#fafdff',
            borderLeft: '8px solid #1C7293',
            p: 0,
            overflow: 'visible',
          }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: -3, position: 'relative', zIndex: 2 }}>
          <Avatar sx={{ bgcolor: '#1C7293', width: 64, height: 64, boxShadow: 3, mb: 1 }}>
            <GroupIcon sx={{ fontSize: 36, color: 'white' }} />
          </Avatar>
        </Box>
        <DialogTitle sx={{ 
          textAlign: 'center', 
          bgcolor: 'transparent', 
          color: '#1C7293',
          fontWeight: 700,
          fontSize: isMobile ? '1.25rem' : '1.5rem',
          letterSpacing: 1,
          py: isMobile ? 1.5 : 2,
          mb: 0
        }}>
          {editGroup ? 'Edit Team' : 'Add New Team'}
        </DialogTitle>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <DialogContent sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'flex-start',
            px: isMobile ? 2 : 6,
            pt: 2,
            pb: isMobile ? 2 : 4,
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
            bgcolor: 'transparent',
            borderRadius: 3,
            boxShadow: 'none',
            gap: 2,
            flex: 1,
            maxHeight: { xs: 'calc(100dvh - 180px)', sm: 'calc(100vh - 220px)' },
            overflowY: 'auto',
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
            <Grid container spacing={isMobile ? 2 : 3} sx={{ maxWidth: '100%', position: 'relative', zIndex: 1 }}>
              <Box sx={{ width: '100%' }} className='flex  gap-2'>
                <TextField
                  autoFocus
                  name="name"
                  label="Team Name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="outlined"
                  helperText="Enter the team's name"
                  placeholder="Varsity Basketball"
                  InputProps={{
                    sx: { 
                      borderRadius: 2, 
                      bgcolor: 'white', 
                      fontWeight: 400, 
                      fontSize: '1rem', 
                      boxShadow: 1,
                      position: 'relative',
                      zIndex: 1
                    }
                  }}
                  InputLabelProps={{ 
                    shrink: true, 
                    sx: { 
                      ml: 0, 
                      fontWeight: 600, 
                      color: '#1C7293',
                      position: 'relative',
                      zIndex: 1
                    } 
                  }}
                />
                <FormControl fullWidth>
                  <InputLabel 
                    id="coach-select-label"
                    shrink
                    sx={{ 
                      ml: 0, 
                      fontWeight: 600, 
                      color: '#1C7293',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    Coach
                  </InputLabel>
                  <Select
                    labelId="coach-select-label"
                    id="coach-select"
                    name="coachId"
                    value={formData.coachId}
                    onChange={handleChange}
                    required
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: 'white',
                      boxShadow: 1,
                      width: '100%',
                      '& .MuiSelect-select': {
                        fontSize: '1rem',
                      },
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {coaches.map((coach) => (
                      <MenuItem key={coach.id} value={coach.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {coach.name} ({coach.specialty})
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select a coach for this team</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ width: '100%' }}>
                <FormControl fullWidth>
                  <InputLabel 
                    id="school-select-label"
                    shrink
                    sx={{ 
                      ml: 0, 
                      fontWeight: 600, 
                      color: '#1C7293',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    School
                  </InputLabel>
                  <Select
                    labelId="school-select-label"
                    id="school-select"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: 'white',
                      width: '100%',
                      boxShadow: 1,
                      '& .MuiSelect-select': {
                        fontSize: '1rem',
                      },
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Assign the team to a school (optional)</FormHelperText>
                </FormControl>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600,
                  color: '#1C7293',
                  mb: 1
                }}>
                  Select Athletes
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    maxHeight: 250, 
                    overflow: 'auto', 
                    p: 2,
                    border: '2px dashed #ccc', 
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: 1,
                    '&:hover': {
                      borderColor: '#1C7293',
                      bgcolor: 'rgba(28,114,147,0.02)'
                    },
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
                  <List dense>
                    {athletes.map((athlete) => (
                      <ListItem key={athlete.id} sx={{ py: 0.5 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.athletes.includes(athlete.id)}
                              onChange={() => handleAthleteToggle(athlete.id)}
                              sx={{
                                color: '#1C7293',
                                '&.Mui-checked': {
                                  color: '#1C7293',
                                },
                              }}
                            />
                          }
                          label={
                            <ListItemText 
                              primary={
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                  {athlete.name}
                                </Typography>
                              }
                              secondary={athlete.sport}
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                <FormHelperText>Select the athletes that belong to this team</FormHelperText>
              </Box>
            </Grid>
            
          </DialogContent>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 0 }}>
            <DialogActions sx={{ 
              bgcolor: 'transparent', 
              display: 'flex', 
              justifyContent: 'center', 
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 1 : 2,
              px: isMobile ? 2 : 3,
              borderTop: '1px solid #e3e8ee',
              width: '100%',
              position: 'relative',
              bottom: 0,
              zIndex: 2
            }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              sx={{
                minWidth: 100,
                borderRadius: 2,
                fontWeight: 600,
                color: '#1C7293',
                borderColor: '#1C7293',
                '&:hover': { 
                  bgcolor: '#e3f2fd',
                  borderColor: '#14576F',
                  color: '#14576F'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                minWidth: 100,
                borderRadius: 2,
                fontWeight: 700,
                bgcolor: '#1C7293',
                color: 'white',
                '&:hover': { bgcolor: '#14576F' }
              }}
            >
              {editGroup ? 'Save Changes' : 'Add Team'}
            </Button>
          </DialogActions>
          </Box>
        </form>
      </Dialog>
    </div>
  );
}

export default Groups; 