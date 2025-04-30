import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Select, MenuItem, FormControl, InputLabel, Chip, ListItem,
  ListItemText, List, Checkbox, FormControlLabel
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
    description: ''
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
      description: ''
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
      description: group.description
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

  // Navigate to group detail page
  const handleViewGroupDetail = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Teams</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Teams
        </Button>
      </Box>

      {/* School Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>Athletes</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.id}</TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>{getCoachName(group.coachId)}</TableCell>
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
                <TableCell>{group.description}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleViewGroupDetail(group.id)}
                    title="View Group Details"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    color="secondary" 
                    onClick={() => handleEditClick(group)}
                    title="Edit Group"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(group.id)}
                    title="Delete Group"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Group Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editGroup ? 'Edit Group' : 'Add New Group'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Group Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
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
                  >
                    {coaches.map((coach) => (
                      <MenuItem key={coach.id} value={coach.id}>
                        {coach.name} ({coach.specialty})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="description"
                  label="Description"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Select Athletes
                </Typography>
                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', p: 1 }}>
                  <List dense>
                    {athletes.map((athlete) => (
                      <ListItem key={athlete.id} sx={{ py: 0 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={formData.athletes.includes(athlete.id)}
                              onChange={() => handleAthleteToggle(athlete.id)}
                            />
                          }
                          label={
                            <ListItemText 
                              primary={athlete.name} 
                              secondary={`${athlete.sport}, Age: ${athlete.age}`} 
                            />
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">{editGroup ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Groups; 