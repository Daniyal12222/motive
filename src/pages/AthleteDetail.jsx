import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Grid, Paper, Typography, Avatar, Button, Chip,
  Divider, List, ListItem, ListItemText, Card, CardContent,
  CardHeader, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Tabs, Tab, Accordion, AccordionSummary,
  AccordionDetails
} from '@mui/material';

import {
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Event as EventIcon,
  Group as GroupIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  SportsSoccer as SportsIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

// Import athlete images
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

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`athlete-tabpanel-${index}`}
      aria-labelledby={`athlete-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function AthleteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { athletes, schools, groups, coaches, events } = useAppContext();
  const [athlete, setAthlete] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [expandedEvents, setExpandedEvents] = useState({});

  useEffect(() => {
    // Find the athlete by ID
    const athleteId = parseInt(id);
    const foundAthlete = athletes.find(a => a.id === athleteId);
    if (foundAthlete) {
      setAthlete(foundAthlete);
    }
  }, [id, athletes]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEventClick = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  // Helper functions
  const getSchoolName = (schoolId) => {
    if (!schoolId) return 'Not Assigned';
    const school = schools.find(s => s.id === schoolId);
    return school ? school.name : 'Unknown School';
  };

  const getCoachName = (coachId) => {
    if (!coachId) return 'Not Assigned';
    const coach = coaches.find(c => c.id === coachId);
    return coach ? coach.name : 'Unknown Coach';
  };

  const getAthleteGroups = () => {
    if (!athlete) return [];
    return groups.filter(group => group.athletes && group.athletes.includes(athlete.id));
  };

  const getGroupEvents = (groupId) => {
    return events.filter(event => event.groupId === groupId);
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

  // Get sport icon based on sport name
  const getSportIcon = (sportName) => {
    if (!sportName) return basketballIcon;
    
    const sportLower = sportName.toLowerCase();
    if (sportLower.includes('basketball')) return basketballIcon;
    if (sportLower.includes('soccer')) return soccerIcon;
    if (sportLower.includes('track') || sportLower.includes('field')) return trackIcon;
    if (sportLower.includes('swimming')) return swimmingIcon;
    if (sportLower.includes('baseball')) return baseballIcon;
    if (sportLower.includes('football')) return footballIcon;
    if (sportLower.includes('golf')) return golfIcon;
    if (sportLower.includes('hockey')) return hockeyIcon;
    if (sportLower.includes('badminton')) return badmintonIcon;
    
    return basketballIcon; // Default fallback
  };

  if (!athlete) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5">Athlete not found</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/athletes')}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Container>
    );
  }

  const athleteGroups = getAthleteGroups();
  const athleteEvents = athleteGroups.flatMap(group => getGroupEvents(group.id));
  const attendedEvents = athleteEvents.filter(event => 
    event.attendance && event.attendance[athlete.id] === true
  ).length;
  const missedEvents = athleteEvents.filter(event => 
    event.attendance && event.attendance[athlete.id] === false
  ).length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Button 
        className='!text-[#1C7293] !text-lg'
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/athletes')}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      {/* Athlete Profile Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container>
            <Grid item xs={12} md={8} sx={{width : "100%"}}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: "space-between", width: "100%" }}>
                <Box>
                  <Typography variant="h4" gutterBottom>{athlete.name}</Typography>
                  <Typography variant="h6" color="primary">
                    {athlete.sport} Athlete
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Avatar 
                    src={getAthleteImage(athlete.id)}
                    alt={athlete.name}
                    sx={{ width: 80, height: 80 }}
                  />
                </Box>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }} >
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon color="action" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">{athlete.email}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon color="action" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">{athlete.phone || 'No phone number'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon color="action" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">{getSchoolName(athlete.schoolId)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon color="action" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">Coach: {getCoachName(athlete.coachId)}</Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<GroupIcon />} 
                  label={`${athleteGroups.length} Teams`} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<EventIcon />} 
                  label={`${athleteEvents.length} Events`} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<SportsIcon />} 
                  label={athlete.sport} 
                  color="secondary" 
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="athlete tabs">
          <Tab label="Overview" id="athlete-tab-0" />
          <Tab label="Teams" id="athlete-tab-1" />
          <Tab label="Events" id="athlete-tab-2" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3} sx={{width : "100%", display: "flex", justifyContent: "space-between" }}>
          <Grid item xs={12} md={7} sx={{ width : "55%" }}>
            <Card elevation={3} sx={{ borderRadius: '12px', height: '100%' }}>
              <Box sx={{ p: 3, background: 'linear-gradient(to right, #1C7293, #065a82)'  }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>Athlete Details</Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', p: 3, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <Avatar 
                    src={getAthleteImage(athlete.id)}
                    alt={athlete.name}
                    sx={{ width: 80, height: 80, mr: 3 }}
                  />
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>{athlete.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={getSportIcon(athlete.sport)}
                        alt={athlete.sport}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography variant="h6" color="primary">{athlete.sport}</Typography>
                    </Box>
                  </Box>
                </Box>
                
                <List>
                  <ListItem sx={{ py: 2 }}>
                    <SchoolIcon color="action" sx={{ mr: 2 }} />
                    <ListItemText 
                      primary="School" 
                      secondary={getSchoolName(athlete.schoolId)} 
                      primaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                      secondaryTypographyProps={{ fontWeight: 'bold', color: 'text.primary', fontSize: '1rem' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" sx={{ ml: 6 }} />
                  
                  <ListItem sx={{ py: 2 }}>
                    <PersonIcon color="action" sx={{ mr: 2 }} />
                    <ListItemText 
                      primary="Coach" 
                      secondary={getCoachName(athlete.coachId)} 
                      primaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                      secondaryTypographyProps={{ fontWeight: 'bold', color: 'text.primary', fontSize: '1rem' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" sx={{ ml: 6 }} />
                  
                  <ListItem sx={{ py: 2 }}>
                    <EmailIcon color="action" sx={{ mr: 2 }} />
                    <ListItemText 
                      primary="Email" 
                      secondary={athlete.email} 
                      primaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                      secondaryTypographyProps={{ fontWeight: 'bold', color: 'text.primary', fontSize: '1rem' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" sx={{ ml: 6 }} />
                  
                  <ListItem sx={{ py: 2 }}>
                    <PhoneIcon color="action" sx={{ mr: 2 }} />
                    <ListItemText 
                      primary="Phone" 
                      secondary={athlete.phone || 'No phone number'} 
                      primaryTypographyProps={{ fontWeight: 'medium', color: 'text.secondary' }}
                      secondaryTypographyProps={{ fontWeight: 'bold', color: 'text.primary', fontSize: '1rem' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={5} >
            <Card elevation={3} sx={{ mb: 3, borderRadius: '12px', overflow: 'hidden' }}>
              <Box sx={{ p: 3, background: 'linear-gradient(to right, #1C7293, #065a82)' }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>Performance Summary</Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      borderRadius: '8px', 
                      bgcolor: 'rgba(28, 114, 147, 0.1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="h4" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>{athleteGroups.length}</Typography>
                      <Typography variant="body1" color="text.secondary">Teams</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      borderRadius: '8px', 
                      bgcolor: 'rgba(28, 114, 147, 0.1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="h4" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>{athleteEvents.length}</Typography>
                      <Typography variant="body1" color="text.secondary">Events</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      borderRadius: '8px', 
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="h4" color="success.main" sx={{ mb: 1, fontWeight: 'bold' }}>{attendedEvents}</Typography>
                      <Typography variant="body1" color="text.secondary">Attended</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} >
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 2, 
                      borderRadius: '8px', 
                      bgcolor: 'rgba(244, 67, 54, 0.1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <Typography variant="h4" color="error.main" sx={{ mb: 1, fontWeight: 'bold' }}>{missedEvents}</Typography>
                      <Typography variant="body1" color="text.secondary">Missed</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card elevation={3} sx={{ borderRadius: '12px' }}>
              <Box sx={{ p: 3, background: 'linear-gradient(to right, #1C7293, #065a82)' }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>Attendance Rate</Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      position: 'relative',
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      border: '10px solid',
                      borderColor: 'rgba(0, 0, 0, 0.08)',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -10,
                        left: -10,
                        width: 140,
                        height: 140,
                        borderRadius: '50%',
                        border: '10px solid',
                        borderColor: attendedEvents > 0 ? 'success.main' : 'grey.300',
                        borderRightColor: 'transparent',
                        borderBottomColor: 'transparent',
                        transform: `rotate(${athleteEvents.length > 0 ? 
                          (Math.round((attendedEvents / athleteEvents.length) * 100) * 3.6) : 0}deg)`,
                        transition: 'transform 1s ease-out'
                      }
                    }}
                  >
                    <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                      {athleteEvents.length > 0 
                        ? Math.round((attendedEvents / athleteEvents.length) * 100) 
                        : 0}<Typography component="span" variant="h6">%</Typography>
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                    {attendedEvents} out of {athleteEvents.length} events attended
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                    {missedEvents} events missed
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip 
                      icon={<CheckCircleIcon />} 
                      label="Attended" 
                      color="success" 
                      size="small"
                      variant="outlined"
                    />
                    <Chip 
                      icon={<CancelIcon />} 
                      label="Missed" 
                      color="error" 
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
        </Grid>
      </TabPanel>

      {/* Teams Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{  width: "100%" }}>
            <Card elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden'  }}>
              <Box sx={{ p: 3, background: 'linear-gradient(to right, #1C7293, #065a82)' }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <GroupIcon sx={{ mr: 1 }} /> Teams ({athleteGroups.length})
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {athleteGroups.length > 0 ? (
                  <Box>
                    {athleteGroups.map((group, index) => {
                      const groupCoach = coaches.find(c => c.id === group.coachId);
                      const upcomingEvents = getGroupEvents(group.id).filter(
                        e => new Date(e.date) >= new Date()
                      );
                      const totalEvents = getGroupEvents(group.id).length;
                      const attendedGroupEvents = getGroupEvents(group.id).filter(
                        e => e.attendance && e.attendance[athlete.id] === true
                      ).length;
                      
                      // Generate a consistent color based on group id
                      const colorIndex = group.id % 5;
                      const backgroundColors = [
                        'rgba(28, 114, 147, 0.8)',  // Blue
                        'rgba(76, 175, 80, 0.8)',   // Green
                        'rgba(156, 39, 176, 0.8)',  // Purple
                        'rgba(255, 152, 0, 0.8)',   // Orange
                        'rgba(233, 30, 99, 0.8)'    // Pink
                      ];
                      const bgColor = backgroundColors[colorIndex];
                      
                      return (
                        <Box 
                          key={group.id} 
                          sx={{ 
                            p: 3, 
                            borderRadius: index === athleteGroups.length - 1 ? '0 0 12px 12px' : 0,
                            borderBottom: index !== athleteGroups.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            '&:hover': {
                              bgcolor: 'rgba(28, 114, 147, 0.05)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                            }
                          }}
                        >
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={5} md={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  sx={{ 
                                    bgcolor: bgColor, 
                                    width: 60, 
                                    height: 60,
                                    mr: 2,
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  {group.name.substring(0, 2).toUpperCase()}
                                </Avatar>
                                <Box>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {group.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                                    <Chip
                                      icon={<PersonIcon />}
                                      label={`${group.athletes ? group.athletes.length : 0} Members`}
                                      size="small"
                                      sx={{ bgcolor: 'rgba(0,0,0,0.05)' }}
                                    />
                                    {upcomingEvents.length > 0 && (
                                      <Chip
                                        icon={<EventIcon />}
                                        label={`${upcomingEvents.length} Upcoming`}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={3} md={3}>
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                height: '100%', 
                                justifyContent: 'center',
                                px: { xs: 0, sm: 2 },
                                py: { xs: 2, sm: 0 },
                                borderLeft: { xs: 'none', sm: '1px solid rgba(0,0,0,0.05)' },
                                borderRight: { xs: 'none', sm: '1px solid rgba(0,0,0,0.05)' }
                              }}>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Coach
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: bgColor, fontSize: '0.8rem' }}>
                                    {groupCoach ? groupCoach.name.charAt(0) : 'C'}
                                  </Avatar>
                                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {groupCoach ? groupCoach.name : 'Not Assigned'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} sm={4} md={5}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Box sx={{ 
                                    bgcolor: 'rgba(28, 114, 147, 0.1)', 
                                    borderRadius: '12px',
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                      {upcomingEvents.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                                      Upcoming Events
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={6}>
                                  <Box sx={{ 
                                    borderRadius: '12px',
                                    p: 2,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    bgcolor: 'rgba(0,0,0,0.02)',
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      width: '100%',
                                      height: `${totalEvents > 0 ? (attendedGroupEvents / totalEvents) * 100 : 0}%`,
                                      bgcolor: totalEvents > 0 
                                        ? (attendedGroupEvents / totalEvents) > 0.7 
                                          ? 'rgba(76, 175, 80, 0.2)' 
                                          : 'rgba(255, 152, 0, 0.2)'
                                        : 'transparent',
                                      transition: 'height 1s ease-out'
                                    }
                                  }}>
                                    <Typography variant="h4" color={
                                      totalEvents > 0 
                                        ? (attendedGroupEvents / totalEvents) > 0.7 
                                          ? 'success.main' 
                                          : 'warning.main'
                                        : 'text.secondary'
                                    } sx={{ fontWeight: 'bold', mb: 0.5, position: 'relative', zIndex: 1 }}>
                                      {totalEvents > 0 
                                        ? Math.round((attendedGroupEvents / totalEvents) * 100) 
                                        : 0}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                      Attendance Rate
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box sx={{ p: 5, textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(28, 114, 147, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <GroupIcon sx={{ color: '#1C7293', fontSize: 40 }} />
                    </Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Teams Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
                      This athlete is not part of any team yet. Teams allow you to group athletes together for practices, matches, and other events.
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      startIcon={<GroupIcon />}
                      onClick={() => navigate('/groups')}
                    >
                      View All Teams
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Events Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3} sx={{width: "100%", display: "flex", justifyContent: "space-between"}}>
          <Grid item xs={12} sx={{  width: "100%" }}>
            <Card elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
              <Box sx={{ p: 3, background: 'linear-gradient(to right, #1C7293, #065a82)' }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ mr: 1 }} /> Events ({athleteEvents.length})
                </Typography>
              </Box>
              <CardContent sx={{ p: 0 }}>
                {athleteEvents.length > 0 ? (
                  <Box>
                    {athleteEvents.map((event, index) => {
                      const attended = event.attendance && event.attendance[athlete.id];
                      const eventDate = new Date(event.date);
                      const isPast = eventDate < new Date();
                      const group = groups.find(g => g.id === event.groupId);
                      
                      // Status colors
                      const getStatusColor = () => {
                        if (!isPast) return 'info';
                        return attended ? 'success' : 'error';
                      };
                      
                      const statusColor = getStatusColor();
                      const formattedDate = eventDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: eventDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                      });
                      
                      return (
                        <Box 
                          key={event.id}
                          sx={{ 
                            p: 0,
                            borderBottom: index !== athleteEvents.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                              bgcolor: 'rgba(28, 114, 147, 0.03)'
                            }
                          }}
                        >
                          <Box sx={{ 
                            width: 4, 
                            height: '100%', 
                            position: 'absolute', 
                            left: 0, 
                            top: 0,
                            bgcolor: `${statusColor}.main`
                          }} />
                          
                          <Accordion 
                            elevation={0}
                            sx={{ 
                              '&:before': { display: 'none' },
                              bgcolor: 'transparent'
                            }}
                          >
                            <AccordionSummary 
                              expandIcon={<ExpandMoreIcon />}
                              sx={{ px: 3, py: 2, ml: 1 }}
                            >
                              <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} md={5}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar 
                                      sx={{ 
                                        bgcolor: `${statusColor}.light`, 
                                        color: `${statusColor}.dark`,
                                        width: 48, 
                                        height: 48,
                                        mr: 2
                                      }}
                                    >
                                      {isPast ? (
                                        attended ? <CheckCircleIcon /> : <CancelIcon />
                                      ) : (
                                        <EventIcon />
                                      )}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                                        {event.title}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {formattedDate}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={6} md={3}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <GroupIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {group ? group.name : 'Unknown Team'}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={6} md={2}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <TimeIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {event.startTime} - {event.endTime}
                                    </Typography>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Chip 
                                      icon={
                                        !isPast ? <EventIcon /> : 
                                        attended ? <CheckCircleIcon /> : 
                                        <CancelIcon />
                                      }
                                      label={
                                        !isPast ? "Upcoming" : 
                                        attended ? "Attended" : 
                                        "Missed"
                                      }
                                      color={statusColor}
                                      size="small"
                                      variant={isPast ? "filled" : "outlined"}
                                    />
                                  </Box>
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            
                            <AccordionDetails sx={{ px: 3, py: 2, bgcolor: 'rgba(0,0,0,0.02)', borderTop: '1px dashed rgba(0,0,0,0.1)', ml: 1 }}>
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Description
                                  </Typography>
                                  <Typography variant="body2" paragraph>
                                    {event.description || 'No description provided.'}
                                  </Typography>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                  <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                      Date & Time
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <EventIcon color="action" sx={{ mr: 1 }} />
                                      <Typography variant="body2">
                                        {eventDate.toLocaleDateString('en-US', {
                                          weekday: 'long',
                                          year: 'numeric',
                                          month: 'long',
                                          day: 'numeric'
                                        })}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                      <TimeIcon color="action" sx={{ mr: 1 }} />
                                      <Typography variant="body2">
                                        {event.startTime} - {event.endTime}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Team
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <GroupIcon color="action" sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                      {group ? group.name : 'Unknown Team'}
                                    </Typography>
                                  </Box>
                                  
                                  {isPast && (
                                    <Box sx={{ mt: 2 }}>
                                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Attendance
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {attended ? (
                                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                        ) : (
                                          <CancelIcon color="error" sx={{ mr: 1 }} />
                                        )}
                                        <Typography variant="body2" color={attended ? 'success.main' : 'error.main'}>
                                          {attended ? 'You attended this event' : 'You missed this event'}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  )}
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box sx={{ p: 5, textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        borderRadius: '50%', 
                        bgcolor: 'rgba(28, 114, 147, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <EventIcon sx={{ color: '#1C7293', fontSize: 40 }} />
                    </Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Events Found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
                      There are no events scheduled for this athlete yet.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
}

export default AthleteDetail; 