import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Grid, 
  Avatar, 
  Chip, 
  Tabs, 
  Tab, 
  Card, 
  CardContent,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import { 
  Person as PersonIcon, 
  School as SchoolIcon, 
  Group as GroupIcon, 
  Sports as SportsIcon, 
  Event as EventIcon,
  ArrowBack as ArrowBackIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';

// TabPanel component for tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`school-tabpanel-${index}`}
      aria-labelledby={`school-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: { xs: 1, sm: 2 } }}>{children}</Box>}
    </div>
  );
}

// Card components for different entities
const CoachCard = ({ coach }) => (
  <Card sx={{ borderRadius: 1, '&:hover': { transform: 'translateY(-3px)', boxShadow: 3, cursor: 'pointer' } }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', py: 1.5 }}>
      <Avatar sx={{ bgcolor: '#1C7293', width: { xs: 40, sm: 45 }, height: { xs: 40, sm: 45 }, mr: 1.5 }}>
        <PersonIcon />
      </Avatar>
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">{coach.name}</Typography>
        <Typography variant="body2" color="text.secondary">{coach.title || 'Coach'}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const TeamCard = ({ group, athleteCount }) => (
  <Card sx={{ borderRadius: 1, '&:hover': { transform: 'translateY(-3px)', boxShadow: 3, cursor: 'pointer' } }}>
    <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar sx={{ bgcolor: '#1C7293', width: { xs: 35, sm: 40 }, height: { xs: 35, sm: 40 }, mr: 1.5 }}>
          <GroupIcon />
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>{group.name}</Typography>
      </Box>
      <Chip size="small" label={`${athleteCount} Athletes`} color="primary" variant="outlined" />
    </CardContent>
  </Card>
);

const EventCard = ({ event, formatDate }) => (
  <Card sx={{ borderRadius: 1, '&:hover': { transform: 'translateY(-3px)', boxShadow: 3, cursor: 'pointer' } }}>
    <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
      <Typography variant="subtitle1" fontWeight="bold" noWrap>{event.title}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <CalendarIcon sx={{ color: 'text.secondary', mr: 0.5, fontSize: 16 }} />
        <Typography variant="body2" color="text.secondary">{formatDate(event.date)}</Typography>
      </Box>
      {event.location && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
          <LocationIcon sx={{ color: 'text.secondary', mr: 0.5, fontSize: 16 }} />
          <Typography variant="body2" color="text.secondary" noWrap>{event.location}</Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const AthleteCard = ({ athlete, teamName }) => (
  <Card sx={{ borderRadius: 1, '&:hover': { transform: 'translateY(-3px)', boxShadow: 3, cursor: 'pointer' } }}>
    <CardContent sx={{ p: { xs: 1, sm: 1.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ bgcolor: '#1C7293', width: { xs: 35, sm: 40 }, height: { xs: 35, sm: 40 }, mr: 1.5 }}>
          <SportsIcon />
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>{athlete.name}</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>{teamName}</Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// EmptyState component for when no data is available
const EmptyState = ({ icon: Icon, message, buttonText }) => (
  <Paper sx={{ p: 2, borderRadius: 1, textAlign: 'center' }}>
    <Icon sx={{ fontSize: { xs: 30, sm: 40 }, color: 'text.secondary', opacity: 0.5 }} />
    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>{message}</Typography>
    {buttonText && <Button variant="contained" size="small" sx={{ mt: 1 }}>{buttonText}</Button>}
  </Paper>
);

const SchoolDetail = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  const { schools, coaches, groups, athletes, events } = useAppContext();
  const [school, setSchool] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (schools.length > 0) {
      const foundSchool = schools.find(school => school.id === parseInt(schoolId));
      setSchool(foundSchool);
    }
  }, [schoolId, schools]);

  if (!school) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="h5" color="textSecondary" gutterBottom>School Not Found</Typography>
        <Button variant="contained" onClick={() => navigate('/schools')} sx={{ mt: 2 }}>
          Back to Schools
        </Button>
      </Box>
    );
  }

  const schoolCoaches = coaches.filter(coach => coach.schoolId === school.id);
  const schoolGroups = groups.filter(group => schoolCoaches.some(coach => coach.id === group.coachId));
  const schoolAthletes = athletes.filter(athlete => schoolGroups.some(group => group.id === athlete.groupId));
  const schoolEvents = events.filter(event => event.schoolId === school.id);

  // Format date function
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ maxWidth: '1100px', margin: '0 auto', p: { xs: 1, sm: 1.5, md: 2 } }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate('/Schools')}
        sx={{ mb: { xs: 1, sm: 2 }, color: '#1C7293' }}
      >
        Back
      </Button>
      
      {/* School Info Card */}
      <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, borderRadius: 2, position: 'relative' }}>
        <Avatar 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10,
            width: { xs: 35, sm: 40 },
            height: { xs: 35, sm: 40 },
            bgcolor: '#1C7293',
            cursor: 'pointer'
          }}
          alt="User Profile"
        >
          <PersonIcon fontSize="small" />
        </Avatar>
        
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant={isSmallScreen ? "h5" : "h4"} 
            className='font-semibold' 
            gutterBottom
            sx={{ pr: { xs: 5, sm: 0 } }} // Add padding on small screens to avoid overlap with avatar
          >
            {school.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: { xs: 1.5, sm: 2 } }}>
            <LocationIcon sx={{ color: 'text.secondary', mr: 0.5, fontSize: 20, mt: 0.3 }} />
            <Typography variant="body1" color="text.secondary">
              {school.address ? `${school.address}, ${school.city}, ${school.state} ${school.zipCode}` : '/ /'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 1.5 } }}>
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
              sx={{ 
                borderRadius: 5,
                textTransform: 'none',
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                mb: { xs: 0.5, sm: 0 },
                color: '#1976d2',
                borderColor: '#1976d2'
              }}
            >
              {schoolCoaches.length} Coaches
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<GroupIcon sx={{ fontSize: 16 }} />}
              sx={{ 
                borderRadius: 5,
                textTransform: 'none',
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                mb: { xs: 0.5, sm: 0 },
                color: '#d32f2f',
                borderColor: '#d32f2f'
              }}
            >
              {schoolGroups.length} Teams
            </Button>
            
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<SportsIcon sx={{ fontSize: 16 }} />}
              sx={{ 
                borderRadius: 5,
                textTransform: 'none',
                px: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.7rem', sm: '0.8125rem' },
                mb: { xs: 0.5, sm: 0 },
                color: '#2e7d32',
                borderColor: '#2e7d32'
              }}
            >
              {schoolAthletes.length} Athletes
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tabs Navigation */}
      <Tabs 
        value={tabValue} 
        onChange={(_, newValue) => setTabValue(newValue)} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: { xs: 1, sm: 2 },
          borderBottom: 1,
          borderColor: 'divider',
          '& .Mui-selected': { color: '#1C7293' },
          '& .MuiTabs-indicator': { backgroundColor: '#1C7293' },
          '& .MuiTab-root': { 
            minWidth: { xs: 'auto', sm: 90 },
            p: { xs: '6px 10px', sm: '12px 16px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }
        }}
      >
        <Tab 
          label={isSmallScreen ? "" : "Coaches"} 
          icon={<PersonIcon fontSize="small" />} 
          iconPosition={isSmallScreen ? "top" : "start"} 
          aria-label="Coaches"
        />
        <Tab 
          label={isSmallScreen ? "" : "Athletes"} 
          icon={<SportsIcon fontSize="small" />} 
          iconPosition={isSmallScreen ? "top" : "start"} 
          aria-label="Athletes"
        />
        <Tab 
          label={isSmallScreen ? "" : "Teams"} 
          icon={<GroupIcon fontSize="small" />} 
          iconPosition={isSmallScreen ? "top" : "start"} 
          aria-label="Teams"
        />
      </Tabs>

      {/* Coaches Tab */}
      <TabPanel value={tabValue} index={0}>
        {schoolCoaches.length === 0 ? (
          <EmptyState 
            icon={PersonIcon} 
            message="No coaches available" 
            buttonText="Add Coach" 
          />
        ) : (
          <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1, fontSize: 18 }} /> Coaches
              </Typography>
              <Button
                variant="contained"
                className="!bg-[#1C7293] !text-white"
                startIcon={<PersonIcon sx={{ fontSize: 16 }} />}
                // onClick={...} // Add handler if needed
                size="small"
                sx={{ fontSize: '0.75rem', py: 0.5, textTransform: 'none' }}
              >
                <Typography component="p" sx={{ display: { xs: 'none', md: 'block', fontSize: '0.7rem' } }} className="!text-white">
                  Add Coach
                </Typography>
              </Button>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, borderRadius: '8px', overflow: 'x-auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Name</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Email</TableCell>
                    <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>Specialty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schoolCoaches.map(coach => (
                    <TableRow key={coach.id} hover>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{coach.name}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{coach.email}</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', py: 1 }}>{coach.specialty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </TabPanel>

      {/* Athletes Tab */}
      <TabPanel value={tabValue} index={1}>
        {schoolAthletes.length === 0 ? (
          <EmptyState 
            icon={SportsIcon} 
            message="No athletes available" 
            buttonText="Add Athlete" 
          />
        ) : (
          <Grid container spacing={1}>
            {schoolAthletes.map(athlete => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={athlete.id}>
                <AthleteCard 
                  athlete={athlete} 
                  teamName={groups.find(g => g.id === athlete.groupId)?.name || 'No Team'} 
                />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* Teams Tab */}
      <TabPanel value={tabValue} index={2}>
        {schoolGroups.length === 0 ? (
          <EmptyState 
            icon={GroupIcon} 
            message="No teams available" 
            buttonText="Create Team" 
          />
        ) : (
          <Grid container spacing={1.5}>
            {schoolGroups.map((group, index) => {
              const coach = coaches.find(c => c.id === group.coachId);
              const groupAthletes = athletes.filter(a => a.groupId === group.id);
              const upcomingEvents = events.filter(e => e.groupId === group.id && new Date(e.date) >= new Date());
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
                <Grid item xs={12} key={group.id} sx={{width: '100%'}}>
                  <Card elevation={1} sx={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)', width: '100%' }}>
                    <Box sx={{ p: 1.5, background: 'linear-gradient(to right, #1C7293, #065a82)' }}>
                      <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'medium', display: 'flex', alignItems: 'center' }}>
                        <GroupIcon sx={{ mr: 1, fontSize: 18 }} /> {group.name}
                      </Typography>
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Grid container spacing={1.5} alignItems="center">
                        <Grid item xs={12} sm={5} md={4}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: bgColor, 
                                width: 36, 
                                height: 36,
                                mr: 1.5,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                                fontSize: '0.875rem'
                              }}
                            >
                              {group.name.substring(0, 2).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.25, fontSize: '0.9rem' }}>
                                {group.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75 }}>
                                <Chip
                                  icon={<PersonIcon sx={{ fontSize: 14 }} />}
                                  label={`${groupAthletes.length} Members`}
                                  size="small"
                                  sx={{ bgcolor: 'rgba(0,0,0,0.02)', height: 20, '& .MuiChip-label': { fontSize: '0.7rem', px: 0.75 } }}
                                />
                                {upcomingEvents.length > 0 && (
                                  <Chip
                                    icon={<EventIcon sx={{ fontSize: 14 }} />}
                                    label={`${upcomingEvents.length} Upcoming`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ height: 20, '& .MuiChip-label': { fontSize: '0.7rem', px: 0.75 } }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={3} md={3}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', px: { xs: 0, sm: 0.75 }, py: { xs: 0.75, sm: 0 }, borderLeft: { xs: 'none', sm: '1px solid rgba(0,0,0,0.02)' }, borderRight: { xs: 'none', sm: '1px solid rgba(0,0,0,0.02)' } }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Coach
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ width: 18, height: 18, mr: 0.75, bgcolor: bgColor, fontSize: '0.65rem' }}>
                                {coach ? coach.name.charAt(0) : 'C'}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                {coach ? coach.name : 'Not Assigned'}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={4} md={5}>
                          <Button size="small" variant="outlined" onClick={() => navigate(`/teams/${group.id}`)} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.8rem' }}>View Team</Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </TabPanel>
    </Box>
  );
};

export default SchoolDetail;
