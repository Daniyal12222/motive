import { useEffect, useState  } from 'react';
import { 
  Grid, Paper, Typography, Box, FormControl, InputLabel, Select, 
  MenuItem, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, List, ListItem, ListItemIcon,
  ListItemText, TextField, Avatar, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel
} from '@mui/material';
import { 
  Group as GroupIcon, 
  Person as PersonIcon, 
  Event as EventIcon,
  People as PeopleIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  ShowChart as ShowChartIcon,
  ReceiptLong as ReceiptLongIcon,
  Inventory2 as Inventory2Icon,
  PersonAddAlt1 as PersonAddAlt1Icon,
  FileUpload as FileUploadIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const navigate = useNavigate();
  const { coaches, athletes, groups, events, schools, setCoaches, setAthletes, setGroups, setEvents, setSchools } = useAppContext();
  const [selectedSchool, setSelectedSchool] = useState(1);
  const [openCoachDialog, setOpenCoachDialog] = useState(false);
  const [currentCoach, setCurrentCoach] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    specialty: '',
    schoolId: 1,
    bio: '',
    certifications: [],
    achievements: [],
    profileImage: ''
  });
  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  // Load mock data
  useEffect(() => {
    // Mock schools data
    const mockSchools = [
      { 
        id: 1, 
        name: 'Central University', 
        location: 'Downtown', 
        type: 'University', 
        established: '1950' 
      },
      { 
        id: 2, 
        name: 'Eastern High School', 
        location: 'East Side', 
        type: 'High School', 
        established: '1975' 
      },
      { 
        id: 3, 
        name: 'Western Academy', 
        location: 'West Side', 
        type: 'Private School', 
        established: '2000' 
      },
    ];

    // Mock coaches data with schoolId
    const mockCoaches = [
      { id: 1, name: 'Coach John Doe', email: 'john@example.com', phone: '555-123-4567', specialty: 'Basketball', schoolId: 1, bio: 'Experienced basketball coach with 10+ years coaching at university level.', certifications: ['NCAA Level 1', 'CPR Certified'], achievements: ['Championship 2019', 'Coach of the Year 2020'] },
      { id: 2, name: 'Coach Jane Smith', email: 'jane@example.com', phone: '555-765-4321', specialty: 'Swimming', schoolId: 1, bio: 'Former Olympic swimmer, coaching for 5 years.', certifications: ['USA Swimming', 'Lifeguard Certified'], achievements: ['Regional Championship 2021'] },
      { id: 3, name: 'Coach Mike Johnson', email: 'mike@example.com', phone: '555-246-8135', specialty: 'Track & Field', schoolId: 2, bio: 'Track and field specialist with focus on sprinting events.', certifications: ['USATF Level 2', 'First Aid'], achievements: ['District Champions 2018, 2019'] },
      { id: 4, name: 'Coach Sarah Williams', email: 'sarah@example.com', phone: '555-975-3164', specialty: 'Soccer', schoolId: 3, bio: 'Soccer coach with European training background.', certifications: ['UEFA B License', 'Youth Development'], achievements: ['State Finals 2022'] },
    ];
    
    // Mock athletes data with schoolId
    const mockAthletes = [
      { id: 1, name: 'Alex Johnson', email: 'alex@example.com', age: 19, sport: 'Basketball', schoolId: 1, position: 'Point Guard', stats: { ppg: 15.3, apg: 7.2, rpg: 3.1 }, awards: ['Freshman of the Year', 'All-Conference'], height: '6\'1"', weight: '185 lbs' },
      { id: 2, name: 'Taylor Swift', email: 'taylor@example.com', age: 20, sport: 'Swimming', schoolId: 1, events: ['Freestyle', '100m', '200m'], stats: { '100m': '52.3s', '200m': '1:55.4' }, awards: ['Regional Champion 50m'], height: '5\'9"', weight: '150 lbs' },
      { id: 3, name: 'Jordan Lee', email: 'jordan@example.com', age: 18, sport: 'Track & Field', schoolId: 2, events: ['100m Dash', 'Long Jump'], stats: { '100m': '10.8s', 'Long Jump': '22ft 5in' }, awards: ['MVP 2022'], height: '5\'11"', weight: '175 lbs' },
      { id: 4, name: 'Casey Adams', email: 'casey@example.com', age: 21, sport: 'Soccer', schoolId: 3, position: 'Midfielder', stats: { goals: 8, assists: 12 }, awards: ['All-State 2021'], height: '5\'10"', weight: '170 lbs' },
      { id: 5, name: 'Morgan Smith', email: 'morgan@example.com', age: 22, sport: 'Basketball', schoolId: 1, position: 'Center', stats: { ppg: 12.8, apg: 1.2, rpg: 9.4 }, awards: ['Defensive Player of the Year'], height: '6\'7"', weight: '225 lbs' },
      { id: 6, name: 'Riley Johnson', email: 'riley@example.com', age: 20, sport: 'Swimming', schoolId: 2, events: ['Butterfly', '100m', '200m'], stats: { '100m': '54.6s', '200m': '2:02.1' }, awards: ['Most Improved 2022'], height: '6\'0"', weight: '170 lbs' },
      { id: 7, name: 'Jamie Wilson', email: 'jamie@example.com', age: 19, sport: 'Track & Field', schoolId: 2, events: ['400m Hurdles', 'High Jump'], stats: { '400m Hurdles': '56.3s', 'High Jump': '6ft 2in' }, awards: ['Rookie of the Year'], height: '6\'0"', weight: '165 lbs' },
      { id: 8, name: 'Quinn Thomas', email: 'quinn@example.com', age: 18, sport: 'Soccer', schoolId: 3, position: 'Forward', stats: { goals: 15, assists: 5 }, awards: ['Top Scorer 2022'], height: '5\'9"', weight: '160 lbs' },
    ];
    
    // Mock groups data
    const mockGroups = [
      { id: 1, name: 'Varsity Basketball', coachId: 1, athletes: [1, 5], description: 'University basketball team' },
      { id: 2, name: 'Swim Team A', coachId: 2, athletes: [2, 6], description: 'Competitive swimming group' },
      { id: 3, name: 'Track Stars', coachId: 3, athletes: [3, 7], description: 'Track and field training group' },
      { id: 4, name: 'Soccer Club', coachId: 4, athletes: [4, 8], description: 'University soccer practice group' },
    ];
    
    // Mock events data
    const mockEvents = [
      { id: 1, title: 'Basketball Practice', groupId: 1, date: '2023-05-15', startTime: '16:00', endTime: '18:00', location: 'Main Gymnasium' },
      { id: 2, title: 'Swim Meet', groupId: 2, date: '2023-05-16', startTime: '14:00', endTime: '16:00', location: 'University Pool' },
      { id: 3, title: 'Track Practice', groupId: 3, date: '2023-05-17', startTime: '15:00', endTime: '17:00', location: 'Track Field' },
      { id: 4, title: 'Soccer Game', groupId: 4, date: '2023-05-18', startTime: '18:00', endTime: '20:00', location: 'Soccer Field' },
      { id: 5, title: 'Basketball Game', groupId: 1, date: '2023-05-20', startTime: '19:00', endTime: '21:00', location: 'Main Gymnasium' },
      { id: 6, title: 'Swim Training', groupId: 2, date: '2023-05-22', startTime: '17:00', endTime: '19:00', location: 'University Pool' },
    ];
    
    setSchools(mockSchools);
    setCoaches(mockCoaches);
    setAthletes(mockAthletes);
    setGroups(mockGroups);
    setEvents(mockEvents);
  }, [setCoaches, setAthletes, setGroups, setEvents, setSchools]);

  // Handle school selection change
  const handleSchoolChange = (event) => {
    setSelectedSchool(event.target.value);
  };

  // Count athletes by sport for pie chart
  const sportCounts = athletes.reduce((acc, athlete) => {
    acc[athlete.sport] = (acc[athlete.sport] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for charts
  const pieChartData = {
    labels: Object.keys(sportCounts),
    datasets: [
      {
        label: 'Athletes by Sport',
        data: Object.values(sportCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Group events by day for the bar chart
  const eventsByDay = events.reduce((acc, event) => {
    const day = new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const barChartData = {
    labels: Object.keys(eventsByDay),
    datasets: [
      {
        label: 'Events by Day',
        data: Object.values(eventsByDay),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 10 } } },
      title: { display: true, text: 'Events by Day of Week', font: { size: 12 } },
    },
    scales: {
      x: { ticks: { font: { size: 10 } } },
      y: { ticks: { font: { size: 10 } } }
    }
  };

  // Handle coach dialog open
  const handleOpenCoachDialog = (coach = null) => {
    if (coach) {
      setCurrentCoach(coach);
    } else {
      setCurrentCoach({
        id: null,
        name: '',
        email: '',
        phone: '',
        specialty: '',
        schoolId: selectedSchool,
        bio: '',
        certifications: [],
        achievements: [],
        profileImage: ''
      });
    }
    setOpenCoachDialog(true);
  };

  // Handle coach dialog close
  const handleCloseCoachDialog = () => {
    setOpenCoachDialog(false);
  };

  // Handle coach form submission
  const handleCoachSubmit = () => {
    if (currentCoach.id) {
      // Update existing coach
      const updatedCoaches = coaches.map(coach => 
        coach.id === currentCoach.id ? currentCoach : coach
      );
      setCoaches(updatedCoaches);
    } else {
      // Add new coach with a new ID
      const newCoach = {
        ...currentCoach,
        id: Math.max(0, ...coaches.map(c => c.id)) + 1
      };
      setCoaches([...coaches, newCoach]);
    }
    handleCloseCoachDialog();
  };

  // Handle coach form field changes
  const handleCoachChange = (e) => {
    const { name, value } = e.target;
    setCurrentCoach({
      ...currentCoach,
      [name]: value
    });
  };

  // Handle adding certifications
  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setCurrentCoach({
        ...currentCoach,
        certifications: [...currentCoach.certifications, newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  // Handle adding achievements
  const handleAddAchievement = () => {
    if (newAchievement.trim()) {
      setCurrentCoach({
        ...currentCoach,
        achievements: [...currentCoach.achievements, newAchievement.trim()]
      });
      setNewAchievement('');
    }
  };

  const getSchoolNameById = (schoolId) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'N/A';
  };

  const getCoachNameById = (coachId) => {
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.name : 'N/A';
  };

  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Show next 5 upcoming events

  return (
    <div>
      {/* School Selector - Moved to top */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="school-select-label">Select School</InputLabel>
          <Select
            labelId="school-select-label"
            id="school-select"
            value={selectedSchool}
            label="Select School"
            onChange={handleSchoolChange}
            size="small"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {schools.map((school) => (
              <MenuItem key={school.id} value={school.id}>
                {school.name} - {school.location}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
      
      {/* Summary Cards - Updated UI */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography  component="h4" fontSize={18} fontWeight="bold">
              Today's Stats
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2,
                display: 'flex', 
                flexDirection: 'column', 
                height: 150, // Adjusted height
                bgcolor: '#FFF1F0', // Light pink
                borderRadius: '10px',
                justifyContent: 'space-between'
              }}
            >
              <Avatar sx={{ bgcolor: '#FF6B6B', color: 'white', mb: 1 }}> {/* Reddish pink icon bg */}
                <ShowChartIcon fontSize="small"/>
              </Avatar>
              <Typography component="p" variant="h5" fontWeight="bold">
                {coaches.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Coaches
              </Typography>
              <Typography variant="caption" color="#FF6B6B">
                +2% from yesterday
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2,
                display: 'flex', 
                flexDirection: 'column', 
                height: 150, // Adjusted height
                bgcolor: '#FFF8E1', // Light yellow
                borderRadius: '10px',
                justifyContent: 'space-between'
              }}
            >
              <Avatar sx={{ bgcolor: '#FFD166', color: 'white', mb: 1 }}> {/* Orangey yellow icon bg */}
                <PeopleIcon fontSize="small"/>
              </Avatar>
              <Typography component="p" variant="h5" fontWeight="bold">
                {athletes.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Athletes
              </Typography>
              <Typography variant="caption" color="#FFD166">
                +5% from yesterday
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2,
                display: 'flex', 
                flexDirection: 'column', 
                height: 150, // Adjusted height
                bgcolor: '#E6FFFA', // Light green/cyan
                borderRadius: '10px',
                justifyContent: 'space-between'
              }}
            >
              <Avatar sx={{ bgcolor: '#06D6A0', color: 'white', mb: 1 }}> {/* Green icon bg */}
                <GroupIcon fontSize="small"/>
              </Avatar>
              <Typography component="p" variant="h5" fontWeight="bold">
                {groups.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Teams
              </Typography>
              <Typography variant="caption" color="#06D6A0">
                +1.2% from yesterday
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2,
                display: 'flex', 
                flexDirection: 'column', 
                height: 150, // Adjusted height
                bgcolor: '#F3E8FF', // Light purple
                borderRadius: '10px',
                justifyContent: 'space-between'
              }}
            >
              <Avatar sx={{ bgcolor: '#8338EC', color: 'white', mb: 1 }}> {/* Purple icon bg */}
                <EventIcon fontSize="small"/>
              </Avatar>
              <Typography component="p" variant="h5" fontWeight="bold">
                {events.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled Events
              </Typography>
              <Typography variant="caption" color="#8338EC">
                +0.5% from yesterday
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Chart Section */}
      <Grid container spacing={2} sx={{mb: 3, width: '100%', justifyContent: "space-evenly"}} >
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Athletes by Sport
            </Typography>
            <Box sx={{ height: 220, width: '100%' }}>
              <Pie data={pieChartData} options={{ 
                responsive: true,
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'right', 
                    labels: { font: { size: 11 } } 
                  } 
                } 
              }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Events by Day
            </Typography>
            <Box sx={{ height: 220, width: '100%' }}>
              <Bar data={barChartData} options={barChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Coaches List Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Coaches Overview</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#1C7293', color: 'white' }}>
              <TableRow >
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Specialty</TableCell>
                <TableCell sx={{ color: 'white' }}>School</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coaches.slice(0,5) .map((coach) => (
                <TableRow key={coach.id} hover>
                  <TableCell>{coach.name}</TableCell>
                  <TableCell>{coach.email}</TableCell>
                  <TableCell>{coach.specialty}</TableCell>
                  <TableCell>{getSchoolNameById(coach.schoolId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/coaches')} className='!text-[#1C7293]' size="small" variant="text" startIcon={<VisibilityIcon />}>View All Coaches</Button> {/* TODO: Implement routing/modal */} 
          </Box>
      </Paper>

      {/* Athletes List Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Athletes Overview</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#1C7293', color: 'white'  }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Sport</TableCell>
                <TableCell sx={{ color: 'white' }}>School</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {athletes.slice(0,5).map((athlete) => (
                <TableRow key={athlete.id} hover>
                  <TableCell>{athlete.name}</TableCell>
                  <TableCell>{athlete.email}</TableCell>
                  <TableCell>{athlete.sport}</TableCell>
                  <TableCell>{getSchoolNameById(athlete.schoolId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/athletes')} className='!text-[#1C7293]' size="small" variant="text" startIcon={<VisibilityIcon />}>View All Athletes</Button> {/* TODO: Implement routing/modal */} 
          </Box>
      </Paper>

      {/* Teams/Groups List Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Teams/Groups Overview</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#1C7293', color: 'white' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Team Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Coach</TableCell>
                <TableCell sx={{ color: 'white' }}>No. of Athletes</TableCell>
                <TableCell sx={{ color: 'white' }}>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groups.slice(0,5).map((group) => (
                <TableRow key={group.id} hover>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{getCoachNameById(group.coachId)}</TableCell>
                  <TableCell>{group.athletes.length}</TableCell>
                  <TableCell>{group.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate('/groups')} className='!text-[#1C7293]' size="small" variant="text" startIcon={<VisibilityIcon />}>View All Teams</Button> {/* TODO: Implement routing/modal */} 
          </Box>
      </Paper>

      {/* Upcoming Events Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
        {upcomingEvents.length > 0 ? (
          <List dense>
            {upcomingEvents.map((event) => (
              <ListItem key={event.id} disablePadding sx={{ '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1, mb: 0.5, p: 0.5 }}>
                <ListItemIcon sx={{minWidth: 'auto', mr: 1}}>
                  <EventIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={event.title} 
                  secondary={`${new Date(event.date).toLocaleDateString()} ${event.startTime} - ${event.endTime} @ ${event.location}`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">No upcoming events.</Typography>
        )}
      </Paper>

      {/* Coach Dialog */}
      <Dialog open={openCoachDialog} onClose={handleCloseCoachDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ py: 1, fontSize: '1rem' }}>{currentCoach.id ? 'Edit Coach Profile' : 'Add New Coach'}</DialogTitle>
        <DialogContent sx={{ py: 1 }}>
          <Grid container spacing={2}>
            {/* Profile Image Section */}
            <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
              <Avatar 
                src={currentCoach.profileImage || '/placeholder-avatar.png'} 
                sx={{ width: 100, height: 100, mb: 1 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCameraIcon />}
                  color={currentCoach.profileImage ? "success" : "primary"}
                  size="small"
                >
                  {currentCoach.profileImage ? "Change" : "Upload"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setCurrentCoach({
                            ...currentCoach,
                            profileImage: event.target.result
                          });
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
                {currentCoach.profileImage && (
                  <IconButton 
                    color="error" 
                    onClick={() => setCurrentCoach({...currentCoach, profileImage: ''})}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              {currentCoach.profileImage && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <CheckIcon color="success" sx={{ fontSize: '0.8rem' }} />
                  <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                    Photo selected
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Basic Info Section */}
            <Grid item xs={12} sm={8}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={currentCoach.name}
                    onChange={handleCoachChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={currentCoach.email}
                    onChange={handleCoachChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={currentCoach.phone}
                    onChange={handleCoachChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Specialty"
                    name="specialty"
                    value={currentCoach.specialty}
                    onChange={handleCoachChange}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>School</InputLabel>
                    <Select
                      name="schoolId"
                      value={currentCoach.schoolId}
                      label="School"
                      onChange={handleCoachChange}
                    >
                      {schools.map((school) => (
                        <MenuItem key={school.id} value={school.id}>
                          {school.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Bio Section */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Biography"
                name="bio"
                multiline
                rows={3}
                value={currentCoach.bio}
                onChange={handleCoachChange}
                size="small"
              />
            </Grid>

            {/* Certifications Section */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>Certifications</Typography>
              <Box sx={{ display: 'flex', mb: 0.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  placeholder="Add certification"
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddCertification}
                  sx={{ ml: 0.5 }}
                  size="small"
                >
                  Add
                </Button>
              </Box>
              <List dense sx={{ maxHeight: '120px', overflow: 'auto' }}>
                {currentCoach.certifications.map((cert, index) => (
                  <ListItem key={index} dense>
                    <ListItemText primary={cert} primaryTypographyProps={{ variant: 'caption' }} />
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setCurrentCoach({
                          ...currentCoach,
                          certifications: currentCoach.certifications.filter((_, i) => i !== index)
                        });
                      }}
                      size="small"
                    >
                      <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Achievements Section */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>Achievements</Typography>
              <Box sx={{ display: 'flex', mb: 0.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  placeholder="Add achievement"
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddAchievement}
                  sx={{ ml: 0.5 }}
                  size="small"
                >
                  Add
                </Button>
              </Box>
              <List dense sx={{ maxHeight: '120px', overflow: 'auto' }}>
                {currentCoach.achievements.map((achievement, index) => (
                  <ListItem key={index} dense>
                    <ListItemText primary={achievement} primaryTypographyProps={{ variant: 'caption' }} />
                    <IconButton
                      edge="end"
                      onClick={() => {
                        setCurrentCoach({
                          ...currentCoach,
                          achievements: currentCoach.achievements.filter((_, i) => i !== index)
                        });
                      }}
                      size="small"
                    >
                      <DeleteIcon color="error" fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ py: 1 }}>
          <Button onClick={handleCloseCoachDialog} size="small">Cancel</Button>
          <Button onClick={handleCoachSubmit} variant="contained" color="primary" size="small">
            {currentCoach.id ? 'Update' : 'Add'} Coach
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;