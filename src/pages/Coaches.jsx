import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  MenuItem, Select, InputLabel, FormControl, Avatar
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import basketballImg from '../assets/basketball.jpg';
import soccerImg from '../assets/soccer.jpg';
import trackImg from '../assets/track.jpg';
import swimmingImg from '../assets/swimming.png';

function Coaches() {
  const navigate = useNavigate();
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

  // Get profile image based on specialty
  const getProfileImage = (specialty) => {
    const lowerSpecialty = specialty?.toLowerCase() || '';
    if (lowerSpecialty.includes('basketball')) return basketballImg;
    if (lowerSpecialty.includes('soccer') || lowerSpecialty.includes('football')) return soccerImg;
    if (lowerSpecialty.includes('track') || lowerSpecialty.includes('running')) return trackImg;
    if (lowerSpecialty.includes('swim')) return swimmingImg;
    // Default image if no match
    return basketballImg;
  };

  // Navigate to coach detail page when clicking on a row
  const handleRowClick = (coachId) => {
    navigate(`/coach/${coachId}`);
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        
      </Box>

      {/* School Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' , justifyContent: "space-between" }}>
          <div className='flex items-center' >
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
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Coach
        </Button>
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
              <TableCell>Sport</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Profile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCoaches.map((coach) => (
              <TableRow 
                key={coach.id}
                onClick={() => handleRowClick(coach.id)}
                sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell>{coach.id}</TableCell>
                <TableCell>{coach.name}</TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.phone}</TableCell>
                <TableCell>{coach.specialty}</TableCell>
                <TableCell>{getSchoolName(coach.schoolId)}</TableCell>
                <TableCell>
                  <Avatar 
                    src={getProfileImage(coach.specialty)} 
                    alt={coach.specialty}
                    sx={{ width: 50, height: 50 }}
                  />
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
                  <Select
                    id="school-select"
                    name="schoolId"
                    value={formData.schoolId}
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