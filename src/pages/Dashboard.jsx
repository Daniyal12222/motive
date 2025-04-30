import { useEffect, useState } from 'react';
import { 
  Grid, Paper, Typography, Box, FormControl, InputLabel, Select, 
  MenuItem, Dialog, DialogTitle, DialogContent, 
  DialogActions, Button, List, ListItem, 
  ListItemText
} from '@mui/material';
import { 
  Group as GroupIcon, 
  Person as PersonIcon, 
  Event as EventIcon,
  People as PeopleIcon
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
  const { coaches, athletes, groups, events, schools, setCoaches, setAthletes, setGroups, setEvents, setSchools } = useAppContext();
  const [selectedSchool, setSelectedSchool] = useState('');

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
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Events by Day of Week' },
    },
  };

  return (
    <div>
      <div className='w-full '>

      </div>
      
      {/* School Selector - Moved to top */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="school-select-label">Select School</InputLabel>
          <Select
            labelId="school-select-label"
            id="school-select"
            value={selectedSchool}
            label="Select School"
            onChange={handleSchoolChange}
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
      
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              bgcolor: 'primary.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Coaches
              </Typography>
              <PersonIcon fontSize="large" />
            </Box>
            <Typography component="p" variant="h3">
              {coaches.length}
            </Typography>
            <Typography variant="body2">
              Total registered coaches
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              bgcolor: 'success.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Athletes
              </Typography>
              <PeopleIcon fontSize="large" />
            </Box>
            <Typography component="p" variant="h3">
              {athletes.length}
            </Typography>
            <Typography variant="body2">
              Total registered athletes
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              bgcolor: 'warning.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Groups
              </Typography>
              <GroupIcon fontSize="large" />
            </Box>
            <Typography component="p" variant="h3">
              {groups.length}
            </Typography>
            <Typography variant="body2">
              Active training groups
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              height: 140,
              bgcolor: 'error.light',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography component="h2" variant="h6">
                Events
              </Typography>
              <EventIcon fontSize="large" />
            </Box>
            <Typography component="p" variant="h3">
              {events.length}
            </Typography>
            <Typography variant="body2">
              Scheduled training events
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Chart Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Athletes by Sport
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={pieChartData} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Events by Day
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar data={barChartData} options={barChartOptions} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;