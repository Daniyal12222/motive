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
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import basketballImg from '../assets/basketball.jpg';
import soccerImg from '../assets/soccer.jpg';
import trackImg from '../assets/track.jpg';
import swimmingImg from '../assets/swimming.png';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`coach-tabpanel-${index}`}
      aria-labelledby={`coach-tab-${index}`}
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

function CoachDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { coaches, schools, groups, athletes, events } = useAppContext();
  const [coach, setCoach] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState({});

  useEffect(() => {
    // Find the coach by ID
    const coachId = parseInt(id);
    const foundCoach = coaches.find(c => c.id === coachId);
    if (foundCoach) {
      setCoach(foundCoach);
    }
  }, [id, coaches]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGroupChange = (groupId) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
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

  const getProfileImage = (specialty) => {
    const lowerSpecialty = specialty?.toLowerCase() || '';
    if (lowerSpecialty.includes('basketball')) return basketballImg;
    if (lowerSpecialty.includes('soccer') || lowerSpecialty.includes('football')) return soccerImg;
    if (lowerSpecialty.includes('track') || lowerSpecialty.includes('running')) return trackImg;
    if (lowerSpecialty.includes('swim')) return swimmingImg;
    return basketballImg;
  };

  const getCoachGroups = () => {
    if (!coach) return [];
    return groups.filter(group => group.coachId === coach.id);
  };

  const getGroupAthletes = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group || !group.athletes) return [];
    
    return group.athletes.map(athleteId => {
      return athletes.find(a => a.id === athleteId);
    }).filter(Boolean);
  };

  const getGroupEvents = (groupId) => {
    return events.filter(event => event.groupId === groupId);
  };

  const getAttendanceCount = (event) => {
    if (!event.attendance) return 0;
    return Object.values(event.attendance).filter(attended => attended).length;
  };

  if (!coach) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h5">Coach not found</Typography>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/coaches')}
          sx={{ mt: 2 }}
        >
          Back to Coaches
        </Button>
      </Container>
    );
  }

  const coachGroups = getCoachGroups();
  const totalAthletes = coachGroups.reduce((sum, group) => {
    return sum + (group.athletes?.length || 0);
  }, 0);
  const totalEvents = coachGroups.reduce((sum, group) => {
    return sum + getGroupEvents(group.id).length;
  }, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/coaches')}
        sx={{ mb: 2 }}
      >
        Back to Coaches
      </Button>

      {/* Coach Profile Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2  , justifyContent : "space-between" , width : "69vw"}} >
                <Box>
                  <Typography variant="h4" gutterBottom>{coach.name}</Typography>
                  <Typography variant="h6" color="primary">
                    {coach.specialty} Coach
                  </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                  <Avatar 
                    src={getProfileImage(coach.specialty)}
                    alt={coach.specialty}
                    sx={{ width: 80, height: 80 }}
                  />
                </Box>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EmailIcon color="action" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">{coach.email}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhoneIcon color="action" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">{coach.phone || 'No phone number'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon color="action" sx={{ mr: 1.5 }} />
                    <Typography variant="body1">{getSchoolName(coach.schoolId)}</Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<GroupIcon />} 
                  label={`${coachGroups.length} Groups`} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<PersonIcon />} 
                  label={`${totalAthletes} Athletes`} 
                  color="secondary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<EventIcon />} 
                  label={`${totalEvents} Events`} 
                  color="info" 
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for Groups, Athletes, and Events */}
      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Groups coached by {coach.name} ({coachGroups.length})
          </Typography>
          
          {coachGroups.length > 0 ? (
            coachGroups.map(group => (
              <Accordion 
                key={group.id} 
                expanded={expandedGroup === group.id}
                onChange={() => handleGroupChange(group.id)}
                sx={{ mb: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Typography variant="h6">{group.name}</Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        size="small"
                        icon={<PersonIcon />}
                        label={`${group.athletes?.length || 0} Athletes`}
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={<EventIcon />}
                        label={`${getGroupEvents(group.id).length} Events`}
                        color="secondary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1" paragraph>
                    {group.description || 'No description available'}
                  </Typography>
                  
                  {/* Athletes Section */}
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Athletes
                  </Typography>
                  {getGroupAthletes(group.id).length > 0 ? (
                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Sport</TableCell>
                            <TableCell>Position/Events</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getGroupAthletes(group.id).map(athlete => (
                            <TableRow key={athlete.id}>
                              <TableCell>{athlete.name}</TableCell>
                              <TableCell>{athlete.email}</TableCell>
                              <TableCell>{athlete.sport}</TableCell>
                              <TableCell>
                                {athlete.position || (athlete.events && athlete.events.join(', ')) || '-'}
                              </TableCell>
                              
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                      No athletes in this group
                    </Typography>
                  )}
                  
                  {/* Events Section */}
                  <Typography variant="h6" gutterBottom>
                    Events
                  </Typography>
                  {getGroupEvents(group.id).length > 0 ? (
                    <Box>
                      {getGroupEvents(group.id)
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map(event => (
                          <Accordion 
                            key={event.id}
                            expanded={!!expandedEvents[event.id]}
                            onChange={() => handleEventClick(event.id)}
                            sx={{ mb: 1, backgroundColor: "#f9fafb", 
                                 boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                 borderRadius: 1,
                                 '&.Mui-expanded': {
                                   boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                   borderLeft: '4px solid #2563eb'
                                 }
                            }}
                          >
                            <AccordionSummary 
                              expandIcon={<ExpandMoreIcon />} 
                              sx={{
                                '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.04)' }
                              }}
                            >
                              <Grid container alignItems="center">
                                <Grid item xs={5}>
                                  <Typography variant="subtitle1" className='font-semibold !text-md'>{event.title}</Typography>
                                  <div className='w-full'>
                                    <Typography variant="subtitle1" className='!text-sm text-neutral-600'>{event.date}</Typography>
                                  </div>
                                </Grid>
                                <Grid item xs={7}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' , padding : "0px 10px"}}>
                                      <TimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                      <Typography variant="body2" color="text.secondary">
                                        {event.startTime} - {event.endTime}
                                      </Typography>
                                    </Box>
                                    {event.attendance && (
                                      <Chip 
                                        size="small"
                                        icon={<PersonIcon />}
                                        label={`${getAttendanceCount(event)}/${getGroupAthletes(group.id).length}`} 
                                        color={getAttendanceCount(event) > 0 ? "success" : "error"} 
                                        variant="outlined"
                                        sx={{ height: 24 }}
                                      />
                                    )}
                                  </Box>
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container>
                                <Grid item sx={{width:"100%", height:"auto"}}>
                                  <Paper className='!w-full' sx={{ 
                                    p: 3, 
                                    borderRadius: 1,
                                    backgroundColor: '#ffffff',
                                    backgroundImage: 'linear-gradient(rgba(37, 99, 235, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.02) 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                  }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                                      <EventIcon sx={{ color: 'primary.main', mr: 1.5 }} />
                                      <Typography variant="h6" sx={{ fontWeight: 500 }}>Event Details</Typography>
                                    </Box>
                                    <Grid container spacing={3}>
                                      <Grid item xs={12} sm={6}>
                                        <List dense className='!w-full'>
                                          <ListItem sx={{ py: 1.5, borderBottom: '1px dashed rgba(0,0,0,0.05)' }}>
                                            <ListItemText 
                                              primary="Event Name" 
                                              secondary={event.title} 
                                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }}
                                              secondaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                            />
                                          </ListItem>
                                          <ListItem sx={{ py: 1.5, borderBottom: '1px dashed rgba(0,0,0,0.05)' }}>
                                            <ListItemText 
                                              primary="Date" 
                                              secondary={event.date} 
                                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }}
                                              secondaryTypographyProps={{ variant: 'body2' }}
                                            />
                                          </ListItem>
                                          <ListItem sx={{ py: 1.5, borderBottom: '1px dashed rgba(0,0,0,0.05)' }}>
                                            <ListItemText 
                                              primary="Start Time" 
                                              secondary={event.startTime} 
                                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }}
                                              secondaryTypographyProps={{ variant: 'body2' }}
                                            />
                                          </ListItem>
                                          <ListItem sx={{ py: 1.5 }}>
                                            <ListItemText 
                                              primary="End Time" 
                                              secondary={event.endTime} 
                                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }}
                                              secondaryTypographyProps={{ variant: 'body2' }}
                                            />
                                          </ListItem>
                                        </List>
                                      </Grid>
                                      <Grid item xs={12} sm={6}>
                                        <List dense>
                                          <ListItem sx={{ py: 1.5, borderBottom: '1px dashed rgba(0,0,0,0.05)' }}>
                                            <ListItemText 
                                              primary="Location" 
                                              secondary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                  <LocationIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1rem' }} />
                                                  <Typography variant="body2">{event.location || 'No location specified'}</Typography>
                                                </Box>
                                              } 
                                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }}
                                            />
                                          </ListItem>
                                          <ListItem sx={{ py: 1.5, borderBottom: '1px dashed rgba(0,0,0,0.05)' }}>
                                            <ListItemText 
                                              primary="Attendance" 
                                              secondary={
                                                event.attendance ? (
                                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                    {getAttendanceCount(event) > 0 ? (
                                                      <CheckCircleIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main', fontSize: '1rem' }} />
                                                    ) : (
                                                      <CancelIcon fontSize="small" sx={{ mr: 0.5, color: 'error.main', fontSize: '1rem' }} />
                                                    )}
                                                    <Typography variant="body2">
                                                      {`${getAttendanceCount(event)}/${getGroupAthletes(group.id).length} athletes present`}
                                                    </Typography>
                                                  </Box>
                                                ) : 'Attendance not recorded'
                                              } 
                                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }}
                                              secondaryTypographyProps={{ variant: 'body2' }}
                                            />
                                          </ListItem>
                                          <ListItem sx={{ py: 1.5 }}>
                                            <ListItemText 
                                              primary="Note" 
                                              secondary={event.description || 'No notes available'} 
                                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontSize: '0.75rem' }}
                                              secondaryTypographyProps={{ variant: 'body2' }}
                                            />
                                          </ListItem>
                                        </List>
                                      </Grid>
                                    </Grid>
                                  </Paper>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No events scheduled for this group
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                This coach doesn't have any groups assigned yet
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default CoachDetail; 