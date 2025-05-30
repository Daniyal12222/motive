import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Button, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  MenuItem, Select, InputLabel, FormControl, Avatar, FormHelperText,
  TablePagination, TableFooter
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    sport: '',
    schoolId: '',
    profileImage: null,
    phone: '',
    coachId: '',
    bio: ''
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
      firstName: '',
      lastName: '',
      email: '',
      sport: '',
      schoolId: '',
      profileImage: null,
      phone: '',
      coachId: '',
      bio: ''
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

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter athletes by selected school
  const filteredAthletes = selectedSchool 
    ? athletes.filter(athlete => athlete.schoolId === selectedSchool)
    : athletes;
    
  // Get current page data
  const currentPageAthletes = filteredAthletes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleEditClick = (athlete) => {
    setEditAthlete(athlete);
    // Split name into firstName and lastName if it exists
    let firstName = '', lastName = '';
    if (athlete.name) {
      const nameParts = athlete.name.split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }
    
    setFormData({
      firstName,
      lastName,
      email: athlete.email,
      sport: athlete.sport,
      schoolId: athlete.schoolId || '',
      profileImage: athlete.profileImage || null,
      phone: athlete.phone || '',
      coachId: athlete.coachId || '',
      bio: athlete.bio || ''
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
      name: `${formData.firstName} ${formData.lastName}`.trim()
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
      {/* School Filter */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", flexWrap: 'wrap', gap: 2 }}>
          <div className='flex items-center flex-grow'>
            <FormControl sx={{ width: { xs: '100%', sm: 250, md: 300 }, maxWidth: '100%' }} size="small">
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
            variant="contained" 
            className='!bg-[#1C7293] !text-white'
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Add Athlete
          </Button>
        </Box>
      </Paper>

      {/* Athletes Table */}
      <Box sx={{ width: '100%' , px: 5, py: 2 }}> 
      <TableContainer component={Paper} sx={{ borderRadius: '10px', border: '1px solid #e0e0e0' }}>
        <Table sx={{ minWidth: 650 }} aria-label="athletes table">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f0f0f0' }}>
              <TableCell>Profile</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>School</TableCell>
              <TableCell>Coach</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageAthletes.map((athlete) => (
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
                <TableCell>
                  <Avatar 
                    src={athlete.profileImage || getAthleteImage(athlete.id)} 
                    alt={athlete.name} 
                    sx={{ width: 40, height: 40 }}
                  />
                </TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>{athlete.name}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>{athlete.sport}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>{getSchoolName(athlete.schoolId)}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>{getCoachName(athlete.coachId)}</TableCell>
                <TableCell sx={{ fontSize: '0.8rem' }}>{athlete.email}</TableCell>
              </TableRow>
            ))}
            {currentPageAthletes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No athletes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

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
            {`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, filteredAthletes.length)} of ${filteredAthletes.length}`}
          </Typography>
          
          <IconButton 
            onClick={(e) => handleChangePage(e, page + 1)} 
            disabled={page >= Math.ceil(filteredAthletes.length / rowsPerPage) - 1}
            size="small"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </IconButton>
        </Box>
      </Box>

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
              <Grid item xs={12} sx={{ width: "100%" }}>
                <FormControl fullWidth margin="dense">
                  <Box 
                    sx={{ 
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {formData.profileImage ? (
                      <>
                        <Avatar 
                          src={URL.createObjectURL(formData.profileImage)} 
                          alt="Preview"
                          sx={{ width: 100, height: 100, mb: 1, boxShadow: 1 }}
                        />
                        <Typography variant="body2" color="primary">
                          {formData.profileImage.name}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                          <Button 
                            size="small" 
                            variant="outlined"
                            onClick={() => setFormData({...formData, profileImage: null})}
                            color="error"
                          >
                            Remove
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            component="label"
                          >
                            Change Image
                            <input
                              accept="image/*"
                              type="file"
                              hidden
                              onChange={handleFileChange}
                            />
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar 
                            sx={{ 
                              width: 80, 
                              height: 80, 
                              mb: 2, 
                              bgcolor: "rgba(28,114,147,0.2)",
                              color: "#1C7293"
                            }}
                          >
                          </Avatar>
                          <Button
                            className="!bg-[#daf1f9] border border-white !text-[#1C7293]"
                            component="label"
                            sx={{ 
                              position: 'absolute',
                              bottom: 12,
                              right: -2,
                              borderRadius: '50%', 
                              minWidth: 'auto',
                              padding: '4px',
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <AddIcon fontSize="small" />
                            <input
                              accept="image/*"
                              type="file"
                              hidden
                              onChange={handleFileChange}
                            />
                          </Button>
                        </Box>
                      </>
                    )}
                  </Box>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{width: '48%'}}>
                <TextField
                  autoFocus
                  margin="dense"
                  name="firstName"
                  label="First Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{width: '48%'}}>
                <TextField
                  margin="dense"
                  name="lastName"
                  label="Last Name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Doe"
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
                  placeholder="(123) 456-7890"
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{width: '48%'}}>
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
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} sx={{width: '48%'}}>
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
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{width: '100%'}}>
                <TextField
                  margin="dense"
                  name="bio"
                  label="Bio"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Brief description of athlete's background, achievements, and goals..."
                  InputProps={{
                    sx: { borderRadius: 1.5 }
                  }}
                />
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