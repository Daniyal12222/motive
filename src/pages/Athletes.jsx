import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  MenuItem, Select, InputLabel, FormControl, Avatar, FormHelperText
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import athlete1 from '../assets/athlete/athlete1.webp';
import athlete2 from '../assets/athlete/athlete2.jpg';
import athlete3 from '../assets/athlete/athlete3.jpg';
import athlete4 from '../assets/athlete/athlete4.jpg';
import athlete5 from '../assets/athlete/athlete5.jpg';
import athlete6 from '../assets/athlete/athlete6.jpg';
import athlete7 from '../assets/athlete/athlete7.jpg';
import athlete8 from '../assets/athlete/athlete8.jpg';

// Import sport icons for dropdown
import basketballIcon from '../assets/sportIcon/basketball.png';
import soccerIcon from '../assets/sportIcon/soccer.png';
import trackIcon from '../assets/sportIcon/track-and-field.png';
import swimmingIcon from '../assets/sportIcon/swimming.png';
import baseballIcon from '../assets/sportIcon/baseball.png';
import footballIcon from '../assets/sportIcon/american-football.png';
import golfIcon from '../assets/sportIcon/golf.png';
import badmintonIcon from '../assets/sportIcon/hockey.png';
import hockeyIcon from '../assets/sportIcon/badminton.png';

function Athletes() {
  const navigate = useNavigate();
  const { athletes, setAthletes, schools, coaches } = useAppContext();
  const [open, setOpen] = useState(false);
  const [editAthlete, setEditAthlete] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sport: '',
    schoolId: '',
    profileImage: null,
    phone: '',
    coachId: ''
  });

  // Sports options for the sport dropdown
  const sportOptions = [
    { name: 'Basketball', icon: basketballIcon },
    { name: 'Soccer', icon: soccerIcon },
    { name: 'Football', icon: footballIcon },
    { name: 'Track & Field', icon: trackIcon },
    { name: 'Swimming', icon: swimmingIcon },
    { name: 'Baseball', icon: baseballIcon },
    { name: 'Golf', icon: golfIcon },
    { name: 'Hockey', icon: hockeyIcon },
    { name: 'Badminton', icon: badmintonIcon }
  ];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditAthlete(null);
    setFormData({
      name: '',
      email: '',
      sport: '',
      schoolId: '',
      profileImage: null,
      phone: '',
      coachId: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profileImage: e.target.files[0]
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
      sport: athlete.sport,
      schoolId: athlete.schoolId || '',
      profileImage: athlete.profileImage || null,
      phone: athlete.phone || '',
      coachId: athlete.coachId || ''
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
      ...formData
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

  // Get coach name by ID
  const getCoachName = (coachId) => {
    if (!coachId) return 'Not Assigned';
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.name : 'Unknown Coach';
  };

  // Navigate to athlete detail page when clicking on a row
  const handleRowClick = (athleteId) => {
    navigate(`/athlete/${athleteId}`);
  };

  // Get athlete profile image
  const getAthleteImage = (id) => {
    // Use modulo to cycle through available images
    const imageIndex = (id % 8) + 1;
    switch(imageIndex) {
      case 1: return athlete1;
      case 2: return athlete2;
      case 3: return athlete3;
      case 4: return athlete4;
      case 5: return athlete5;
      case 6: return athlete6;
      case 7: return athlete7;
      case 8: return athlete8;
      default: return athlete1;
    }
  };
 
  

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        
      </Box>

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
            variant="contained" 
            className='!bg-[#1C7293] !text-white'
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Add Athlete
          </Button>
        </Box>
      </Paper>

      {/* Athletes Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="athletes table">
          <TableHead>
            <TableRow>
              <TableCell>Athlete</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAthletes.map((athlete) => (
              <TableRow 
                key={athlete.id}
                onClick={() => handleRowClick(athlete.id)}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                    cursor: 'pointer'
                  } 
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={athlete.profileImage || getAthleteImage(athlete.id)} 
                      alt={athlete.name} 
                      sx={{ mr: 2, width: 40, height: 40 }}
                    />
                    {athlete.name}
                  </Box>
                </TableCell>
                <TableCell>{athlete.sport}</TableCell>
                <TableCell>{getSchoolName(athlete.schoolId)}</TableCell>
                <TableCell>{getCoachName(athlete.coachId)}</TableCell>
                <TableCell>{athlete.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Athlete Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', bgcolor: '#1C7293', color: 'white' }}>{editAthlete ? 'Edit Athlete' : 'Add New Athlete'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            px: 4 
          }}>
            <Grid container spacing={2} sx={{ maxWidth: '95%' }}>
              <Grid item xs={12} sx={{width: '48%'}}>
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
                  helperText="Enter the athlete's full name"
                  placeholder="John Doe"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{width: '48%'}}>
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
                  helperText="Enter a valid email address"
                  placeholder="athlete@example.com"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{width: '48%'}}>
                <TextField
                  margin="dense"
                  name="phone"
                  label="Phone"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.phone}
                  onChange={handleChange}
                  helperText="Format: (123) 456-7890"
                  placeholder="(123) 456-7890"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sx={{width: '48%'}}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="sport-label">Sport</InputLabel>
                  <Select
                    labelId="sport-label"
                    id="sport-select"
                    name="sport"
                    value={formData.sport}
                    onChange={handleChange}
                    label="Sport"
                    required
                    sx={{ borderRadius: 1.5 }}
                  >
                    <MenuItem value="">
                      <em>Select a sport</em>
                    </MenuItem>
                    {sportOptions.map((sport) => (
                      <MenuItem key={sport.name} value={sport.name}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img 
                            src={sport.icon} 
                            alt={sport.name} 
                            style={{ width: 24, height: 24 }} 
                          />
                          {sport.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Select the athlete's primary sport</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{width: '100%'}}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="coach-label">Coach</InputLabel>
                  <Select
                    labelId="coach-label"
                    id="coach-select"
                    name="coachId"
                    value={formData.coachId}
                    onChange={handleChange}
                    label="Coach"
                    sx={{ borderRadius: 1.5 }}
                    
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {coaches.map((coach) => (
                      <MenuItem key={coach.id} value={coach.id}>
                        {coach.name} {coach.specialty ? `(${coach.specialty})` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Assign a coach to this athlete (optional)</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{width: '100%'}}>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="school-label">School</InputLabel>
                  <Select
                    labelId="school-label"
                    id="school-select"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleChange}
                    label="School"
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
                  <FormHelperText>Assign the athlete to a school (optional)</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ width: '100%' }}>
                <FormControl fullWidth margin="dense">
                  <Typography variant="subtitle1" gutterBottom>
                    Profile Image
                  </Typography>
                  <Box 
                    sx={{ 
                      border: '2px dashed #ccc', 
                      borderRadius: 2, 
                      p: 3, 
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      bgcolor: 'rgba(0,0,0,0.02)',
                      '&:hover': {
                        borderColor: '#1C7293',
                        bgcolor: 'rgba(28,114,147,0.05)'
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                    }}
                  >
                    {formData.profileImage ? (
                      <Box sx={{ mb: 2 }}>
                        <Avatar 
                          src={URL.createObjectURL(formData.profileImage)} 
                          alt="Preview"
                          sx={{ width: 100, height: 100, mb: 1, boxShadow: 1 }}
                        />
                        <Typography variant="body2" color="primary">
                          {formData.profileImage.name}
                        </Typography>
                        <Button 
                          size="small" 
                          sx={{ mt: 1 }}
                          onClick={() => setFormData({...formData, profileImage: null})}
                          color="error"
                        >
                          Remove
                        </Button>
                      </Box>
                    ) : (
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mb: 2, 
                          bgcolor: 'rgba(28,114,147,0.2)',
                          color: '#1C7293'
                        }}
                      >
                        <AddIcon fontSize="large" />
                      </Avatar>
                    )}
                    
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ 
                        mb: 1,
                        borderRadius: 6,
                        px: 2
                      }}
                    >
                      {formData.profileImage ? 'Change Image' : 'Choose Image'}
                      <input
                        accept="image/*"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                      />
                    </Button>
                    <FormHelperText>
                      Upload a profile image (optional) - JPEG, PNG (max 5MB)
                    </FormHelperText>
                  </Box>
                </FormControl>
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
              {editAthlete ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default Athletes; 