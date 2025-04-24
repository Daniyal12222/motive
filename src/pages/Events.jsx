import { useState, useEffect } from 'react';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Select, MenuItem, FormControl, InputLabel, Chip, Badge,
  List, ListItem, ListItemText, Checkbox, FormControlLabel,
  Accordion, AccordionSummary, AccordionDetails, Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Event as EventIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon, 
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

function Events() {
  const { events, setEvents, groups, athletes, coaches, schools } = useAppContext();
  const [open, setOpen] = useState(false);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupsBySchool, setGroupsBySchool] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    groupId: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    attendance: {}
  });

  // Map groups to their associated schools based on coach's school
  useEffect(() => {
    const coachSchoolMap = {};
    coaches.forEach(coach => {
      if (coach.schoolId) {
        coachSchoolMap[coach.id] = coach.schoolId;
      }
    });

    const schoolGroups = {};
    groups.forEach(group => {
      const coachId = group.coachId;
      const schoolId = coachSchoolMap[coachId];
      
      if (schoolId) {
        if (!schoolGroups[schoolId]) {
          schoolGroups[schoolId] = [];
        }
        schoolGroups[schoolId].push(group);
      }
    });
    
    setGroupsBySchool(schoolGroups);
  }, [groups, coaches]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditEvent(null);
    setFormData({
      title: '',
      groupId: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      attendance: {}
    });
  };

  const handleSchoolFilterChange = (e) => {
    const schoolId = e.target.value;
    setSelectedSchool(schoolId);
    setSelectedGroup(''); // Reset group selection when school changes
  };

  const handleGroupFilterChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  // Get filtered groups based on selected school
  const filteredGroups = selectedSchool && groupsBySchool[selectedSchool] 
    ? groupsBySchool[selectedSchool] 
    : groups;

  // Filter events based on school and/or group
  const filteredEvents = events.filter(event => {
    if (selectedGroup) {
      return event.groupId === selectedGroup;
    }
    
    if (selectedSchool) {
      // Check if the event's group belongs to the selected school
      const group = groups.find(g => g.id === event.groupId);
      if (!group) return false;
      
      const coach = coaches.find(c => c.id === group.coachId);
      if (!coach) return false;
      
      return coach.schoolId === selectedSchool;
    }
    
    return true; // Show all events if no filter is applied
  });

  const handleAttendanceOpen = (event) => {
    setCurrentEvent(event);
    // Initialize attendance data from event or create new
    const initialAttendance = event.attendance || {};
    
    // Get athletes for the selected group
    const group = groups.find(g => g.id === event.groupId);
    if (group && group.athletes) {
      group.athletes.forEach(athleteId => {
        if (!initialAttendance[athleteId]) {
          initialAttendance[athleteId] = false;
        }
      });
    }
    
    setAttendanceData(initialAttendance);
    setAttendanceOpen(true);
  };

  const handleAttendanceClose = () => {
    setAttendanceOpen(false);
    setCurrentEvent(null);
    setAttendanceData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAttendanceChange = (athleteId) => {
    setAttendanceData({
      ...attendanceData,
      [athleteId]: !attendanceData[athleteId]
    });
  };

  const handleSaveAttendance = () => {
    // Save attendance data to the event
    const updatedEvents = events.map(event => 
      event.id === currentEvent.id 
        ? { ...event, attendance: attendanceData } 
        : event
    );
    setEvents(updatedEvents);
    handleAttendanceClose();
  };

  const handleEditClick = (event) => {
    setEditEvent(event);
    setFormData({
      title: event.title,
      groupId: event.groupId,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      attendance: event.attendance || {}
    });
    setOpen(true);
  };

  const handleDeleteClick = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === editEvent.id 
          ? { ...event, ...formData } 
          : event
      );
      setEvents(updatedEvents);
    } else {
      // Add new event
      const newEvent = {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        ...formData
      };
      setEvents([...events, newEvent]);
    }
    
    handleClose();
  };

  // Get group name from group ID
  const getGroupName = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : 'Unknown Group';
  };

  // Count attendance for an event
  const getAttendanceCount = (event) => {
    if (!event.attendance) return 0;
    
    return Object.values(event.attendance).filter(attended => attended).length;
  };

  // Get athletes for a group
  const getGroupAthletes = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group || !group.athletes) return [];
    
    return group.athletes.map(athleteId => {
      return athletes.find(a => a.id === athleteId);
    }).filter(Boolean);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Events</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Event
        </Button>
      </Box>

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} /> Filter Events
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Select
                id="school-filter"
                value={selectedSchool}
                onChange={handleSchoolFilterChange}
                displayEmpty
                startAdornment={selectedSchool && <SchoolIcon sx={{ ml: 1, mr: 0.5 }} fontSize="small" />}
                placeholder="Select School"
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select School</em>;
                  }
                  const school = schools.find(s => s.id === selected);
                  return school ? school.name : '';
                }}
              >
                {schools.map((school) => (
                  <MenuItem key={school.id} value={school.id}>
                    {school.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <Select
                id="group-filter"
                value={selectedGroup}
                onChange={handleGroupFilterChange}
                displayEmpty
                startAdornment={selectedGroup && <EventIcon sx={{ ml: 1, mr: 0.5 }} fontSize="small" />}
                placeholder="Select Group"
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select Group</em>;
                  }
                  const group = groups.find(g => g.id === selected);
                  return group ? group.name : '';
                }}
              >
                {filteredGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {(selectedSchool || selectedGroup) && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                  size="small" 
                  onClick={() => {
                    setSelectedSchool('');
                    setSelectedGroup('');
                  }}
                  startIcon={<CancelIcon />}
                >
                  Reset Filters
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <Accordion key={event.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`event-${event.id}-content`}
              id={`event-${event.id}-header`}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Badge 
                    color="primary" 
                    badgeContent={getAttendanceCount(event)} 
                    max={99}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                  >
                    <EventIcon color="primary" />
                  </Badge>
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1">{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getGroupName(event.groupId)} - {event.date}
                  </Typography>
                </Grid>
                <Grid item>
                  <Box sx={{ display: 'flex' }}>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAttendanceOpen(event);
                      }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(event);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(event.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">{event.location}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Group: {getGroupName(event.groupId)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {event.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time: {event.startTime} - {event.endTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attendance: {getAttendanceCount(event)} / {getGroupAthletes(event.groupId).length} athletes
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Attendance Summary
                  </Typography>
                  <Box sx={{ maxHeight: 150, overflow: 'auto' }}>
                    <List dense>
                      {getGroupAthletes(event.groupId).map(athlete => (
                        <ListItem key={athlete.id} sx={{ py: 0 }}>
                          <ListItemText 
                            primary={athlete.name} 
                            secondary={athlete.sport}
                          />
                          {event.attendance && event.attendance[athlete.id] ? 
                            <CheckCircleIcon color="success" /> : 
                            <CancelIcon color="error" />
                          }
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No events found with the selected filters.
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Event Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="title"
                  label="Event Title"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="dense">
                  <Select
                    id="group-select"
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleChange}
                    required
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <em>Select Group</em>;
                      }
                      const group = groups.find(g => g.id === selected);
                      return group ? group.name : '';
                    }}
                  >
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="location"
                  label="Location"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="dense"
                  name="date"
                  label="Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="dense"
                  name="startTime"
                  label="Start Time"
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.startTime}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  margin="dense"
                  name="endTime"
                  label="End Time"
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.endTime}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">{editEvent ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={attendanceOpen} onClose={handleAttendanceClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Mark Attendance
          <Typography variant="subtitle1" color="text.secondary">
            {currentEvent?.title} | {currentEvent?.date}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Divider sx={{ mb: 2 }} />
          <List>
            {currentEvent && getGroupAthletes(currentEvent.groupId).map(athlete => (
              <ListItem key={athlete.id} sx={{ py: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!attendanceData[athlete.id]}
                      onChange={() => handleAttendanceChange(athlete.id)}
                    />
                  }
                  label={
                    <ListItemText 
                      primary={athlete.name} 
                      secondary={athlete.sport}
                    />
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAttendanceClose}>Cancel</Button>
          <Button onClick={handleSaveAttendance} variant="contained">Save Attendance</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Events; 