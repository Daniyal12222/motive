import { useState } from 'react';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

function Athletes() {
  const { athletes, setAthletes, schools } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editAthlete, setEditAthlete] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    sport: '',
    schoolId: ''
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditAthlete(null);
    setFormData({
      name: '',
      email: '',
      age: '',
      sport: '',
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

  // Filter athletes by selected school
  const filteredAthletes = selectedSchool 
    ? athletes.filter(athlete => athlete.schoolId === selectedSchool)
    : athletes;

  const handleEditClick = (athlete) => {
    setEditAthlete(athlete);
    setFormData({
      name: athlete.name,
      email: athlete.email,
      age: athlete.age,
      sport: athlete.sport,
      schoolId: athlete.schoolId || ''
    });
    setOpen(true);
  };

  const handleDeleteClick = (athleteId) => {
    if (window.confirm('Are you sure you want to delete this athlete?')) {
      const updatedAthletes = athletes.filter(athlete => athlete.id !== athleteId);
      setAthletes(updatedAthletes);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const athleteData = {
      ...formData,
      age: parseInt(formData.age, 10) || 0
    };
    
    if (editAthlete) {
      // Update existing athlete
      const updatedAthletes = athletes.map(athlete => 
        athlete.id === editAthlete.id 
          ? { ...athlete, ...athleteData } 
          : athlete
      );
      setAthletes(updatedAthletes);
    } else {
      // Add new athlete
      const newAthlete = {
        id: athletes.length > 0 ? Math.max(...athletes.map(a => a.id)) + 1 : 1,
        ...athleteData
      };
      setAthletes([...athletes, newAthlete]);
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
        <Typography variant="h4">Athletes</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Athlete
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
              <TableCell>Age</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAthletes.map((athlete) => (
              <TableRow key={athlete.id}>
                <TableCell>{athlete.id}</TableCell>
                <TableCell>{athlete.name}</TableCell>
                <TableCell>{athlete.email}</TableCell>
                <TableCell>{athlete.age}</TableCell>
                <TableCell>{athlete.sport}</TableCell>
                <TableCell>{getSchoolName(athlete.schoolId)}</TableCell>
                <TableCell>
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditClick(athlete)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(athlete.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Athlete Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editAthlete ? 'Edit Athlete' : 'Add New Athlete'}</DialogTitle>
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
                  name="age"
                  label="Age"
                  type="number"
                  fullWidth
                  variant="outlined"
                  value={formData.age}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="dense"
                  name="sport"
                  label="Sport"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.sport}
                  onChange={handleChange}
                  required
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
            <Button type="submit" variant="contained">{editAthlete ? 'Update' : 'Add'}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Athletes; 