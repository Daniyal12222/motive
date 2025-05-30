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
import FormComponent from '../components/FormComponent';

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

  const handleSubmit = (values) => {
    if (editGroup) {
      // Update existing group
      const updatedGroups = groups.map(group => 
        group.id === editGroup.id 
          ? { ...group, ...values } 
          : group
      );
      setGroups(updatedGroups);
    } else {
      // Add new group
      const newGroup = {
        id: groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1,
        ...values
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

  // Form fields for the team form
  const teamFormFields = [
    {
      name: "name",
      label: "Team Name",
      type: "text",
      required: true,
      width: 6
    },
    {
      name: "coachId",
      label: "Coach",
      type: "select",
      required: true,
      width: 6,
      options: coaches.map(coach => ({
        value: coach.id,
        label: `${coach.name} - ${coach.specialty || 'General'}`
      }))
    },
    {
      name: "athletesSelection",
      label: "Select Athletes",
      type: "custom",
      width: 12,
      render: () => (
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Select Athletes
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', p: 2 }}>
            <List dense>
              {athletes.map((athlete) => (
                <ListItem key={athlete.id} disablePadding>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.athletes.includes(athlete.id)}
                        onChange={() => handleAthleteToggle(athlete.id)}
                        size="small"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={athlete.avatar} 
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography variant="body2">
                          {athlete.name} - {athlete.sport || 'Not specified'}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
          <FormHelperText>
            Selected {formData.athletes.length} out of {athletes.length} athletes
          </FormHelperText>
        </Grid>
      )
    }
  ];

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
      <Box sx={{ width: '100%' , px: 5, py: 2 }}>
      <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}>
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
      </Box>
      {/* <TablePagination
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
      /> */}
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
            onChange={handleChangePage}
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
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredGroups.length)} of ${filteredGroups.length}`}
          </Typography>
          
          <IconButton 
            onClick={(e) => handleChangeRowsPerPage(e)} 
            disabled={page >= Math.ceil(filteredGroups.length / rowsPerPage) - 1}
            size="small"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </IconButton>
        </Box>
      </Box>

      {/* Add/Edit Group Dialog using FormComponent */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center' , mb: 2, backgroundColor: '#1C7293', color: 'white' }}>
          {editGroup ? `Edit Team: ${editGroup.name}` : 'Create New Team'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  name="name"
                  label="Team Name"
                  value={formData.name}
                  onChange={handleChange}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="coach-select-label">Coach</InputLabel>
                  <Select
                    labelId="coach-select-label"
                    id="coachId"
                    name="coachId"
                    value={formData.coachId}
                    label="Coach"
                    onChange={handleChange}
                    sx={{ minWidth: 200 }}
                  >
                    {coaches.map((coach) => (
                      <MenuItem key={coach.id} value={coach.id}>
                        {coach.name} - {coach.specialty || 'General'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} className='w-full'>
                <Typography variant="subtitle1" gutterBottom>
                  Select Athletes
                </Typography>
                <Paper variant="outlined"  sx={{ overflow: 'auto', p: 2 }}>
                  <List dense>
                    {athletes.map((athlete) => (
                      <ListItem key={athlete.id} disablePadding>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.athletes.includes(athlete.id)}
                              onChange={() => handleAthleteToggle(athlete.id)}
                              size="small"
                              sx={{
                                '&.Mui-checked': {
                                  color: '#1C7293',
                                },
                              }}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar 
                                src={athlete.avatar} 
                                sx={{ width: 24, height: 24, mr: 1 }}
                              />
                              <Typography variant="body2">
                                {athlete.name} - {athlete.sport || 'Not specified'}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                <FormHelperText>
                  Selected {formData.athletes.length} out of {athletes.length} athletes
                </FormHelperText>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose} className='border !border-[#1C7293] !text-[#1C7293]'>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            className="!bg-[#1C7293] !text-white"
            disabled={!formData.name || !formData.coachId}
          >
            {editGroup ? 'Update Team' : 'Create Team'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Groups; 