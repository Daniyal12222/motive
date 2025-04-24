import { useState } from 'react';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

function Coaches() {
  const { coaches, setCoaches, schools } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editCoach, setEditCoach] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    schoolId: ''
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCoach(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
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

  // Filter coaches by selected school
  const filteredCoaches = selectedSchool 
    ? coaches.filter(coach => coach.schoolId === selectedSchool)
    : coaches;

  const handleEditClick = (coach) => {
    setEditCoach(coach);
    setFormData({
      name: coach.name,
      email: coach.email,
      phone: coach.phone,
      specialty: coach.specialty,
      schoolId: coach.schoolId || ''
    });
    setOpen(true);
  };

  const handleDeleteClick = (coachId) => {
    if (window.confirm('Are you sure you want to delete this coach?')) {
      const updatedCoaches = coaches.filter(coach => coach.id !== coachId);
      setCoaches(updatedCoaches);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editCoach) {
      // Update existing coach
      const updatedCoaches = coaches.map(coach => 
        coach.id === editCoach.id 
          ? { ...coach, ...formData } 
          : coach
      );
      setCoaches(updatedCoaches);
    } else {
      // Add new coach
      const newCoach = {
        id: coaches.length > 0 ? Math.max(...coaches.map(c => c.id)) + 1 : 1,
        ...formData
      };
      setCoaches([...coaches, newCoach]);
    }
    
    handleClose();
  };

  // Get school name by ID
  const getSchoolName = (schoolId) => {
    if (!schoolId) return 'Not Assigned';
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Unknown School';
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Coaches</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Coach
        </Button>
      </Box>

      {/* School Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 2, color: 'text.secondary' }} />
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="school-filter-label">Filter by School</InputLabel>
            <Select
              labelId="school-filter-label"
              id="school-filter"
              value={selectedSchool}
              label="Filter by School"
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
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCoaches.map((coach) => (
              <TableRow key={coach.id}>
                <TableCell>{coach.id}</TableCell>
                <TableCell>{coach.name}</TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.phone}</TableCell>
                <TableCell>{coach.specialty}</TableCell>
                <TableCell>{getSchoolName(coach.schoolId)}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditClick(coach)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(coach.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Coach Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editCoach ? 'Edit Coach' : 'Add New Coach'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="name"
                  label="Full Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  name="email"
                  label="Email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="phone"
                  label="Phone"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="specialty"
                  label="Specialty"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.specialty}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="school-select-label">School</InputLabel>
                  <Select
                    labelId="school-select-label"
                    id="school-select"
                    name="schoolId"
                    value={formData.schoolId}
                    label="School"
                    onChange={handleChange}
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
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">{editCoach ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Coaches; 