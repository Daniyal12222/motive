import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Select, MenuItem, FormControl, InputLabel, Chip, ListItem,
  ListItemText, List, Checkbox, FormControlLabel, Avatar, FormHelperText
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
  const { groups, setGroups, coaches, athletes, schools } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
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

  return (
    <div>
      {/* School Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between" }}>
          <div className='flex items-center'>
            <FilterIcon sx={{ mr: 2, color: 'text.secondary' }} />
            <FormControl sx={{ width: 300 }}>
              <Select
                id="school-filter"
                value={selectedSchool}
                onChange={handleSchoolFilterChange}
                displayEmpty
              >
                <MenuItem value="">
                  <em>All Schools</em>
                </MenuItem>
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
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
          >
            Add Team
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Athletes</TableCell>
              <TableCell>Events</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGroups.map((group) => (
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
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ mr: 2, bgcolor: '#1C7293' }}
                    >
                      <GroupIcon />
                    </Avatar>
                    {group.name}
                  </Box>
                </TableCell>
                <TableCell>{getCoachName(group.coachId)}</TableCell>
                <TableCell>{getSchoolName(group.coachId)}</TableCell>
                <TableCell>
                  {group.athletes && group.athletes.length > 0 ? (
                    <Chip 
                      icon={<GroupIcon />} 
                      label={`${group.athletes.length} Athletes`} 
                      color="primary" 
                      variant="outlined"
                    />
                  ) : 'No athletes'}
                </TableCell>
                <TableCell>
                  {group.events && group.events.length > 0 ? (
                    <Chip 
                      label={`${group.events.length} Events`} 
                      color="secondary" 
                      variant="outlined"
                    />
                  ) : 'No events'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Group Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', bgcolor: '#1C7293', color: 'white' }}>
          {editGroup ? 'Edit Team' : 'Add New Team'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            px: 4,
            pt: 3 
          }}>
            <Grid container spacing={2} sx={{ maxWidth: '95%' }}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Team Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  helperText="Enter the team name"
                  placeholder="Varsity Basketball"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="coach-select-label">Coach</InputLabel>
                  <Select
                    labelId="coach-select-label"
                    id="coach-select"
                    name="coachId"
                    value={formData.coachId}
                    label="Coach"
                    onChange={handleChange}
                    required
                    sx={{ borderRadius: 1.5 }}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="school-select-label">School</InputLabel>
                  <Select
                    labelId="school-select-label"
                    id="school-select"
                    name="schoolId"
                    value={formData.schoolId}
                    label="School"
                    onChange={handleChange}
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {schools.map((school) => (
                      <MenuItem key={school.id} value={school.id}>
                        {school.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Assign the team to a school (optional)</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}  sx={{width: "100%"}}>
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
                  Select Athletes
                </Typography>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    maxHeight: 250, 
                    overflow: 'auto', 
                    p: 1,
                    border: '2px dashed #ccc', 
                    borderRadius: 2,
                    bgcolor: 'rgba(0,0,0,0.02)',
                    '&:hover': {
                      borderColor: '#1C7293',
                      bgcolor: 'rgba(28,114,147,0.05)'
                    },
                  }}
                >
                  <List dense>
                    {athletes.map((athlete) => (
                      <ListItem key={athlete.id} sx={{ py: 0 }}>
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
                              primary={athlete.name} 
                              secondary={`${athlete.sport}`} 
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
                <FormHelperText>Select the athletes that belong to this team</FormHelperText>
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
              type="submit" 
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
              {editGroup ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Groups; 